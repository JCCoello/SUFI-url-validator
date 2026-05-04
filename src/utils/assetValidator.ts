import pLimit from 'p-limit';
import { ContentfulClient, ContentfulApiError } from './contentfulClient';
import type { ValidationResult, ValidatorConfig } from '../types';

// ============================================================
// Retry helper
// ============================================================

/**
 * Executes `fn` up to `maxRetries + 1` times with exponential backoff.
 * Only retries on network errors or HTTP 429 (rate limit) and 5xx responses.
 * Does NOT retry on 404 (asset not found) — that is a definitive FAIL.
 */
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number,
  baseDelayMs: number,
  assetId: string
): Promise<{ result: T; retryCount: number }> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await fn();
      return { result, retryCount: attempt };
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));

      // Determine if we should retry based on the error type
      const shouldRetry = (() => {
        if (err instanceof ContentfulApiError) {
          // 404 = asset genuinely does not exist — no point retrying
          if (err.httpStatus === 404) return false;
          // 401/403 = auth/permissions issue — retrying won't help
          if (err.httpStatus === 401 || err.httpStatus === 403) return false;
          // 429 = rate limited, 5xx = server error — both are retryable
          return err.httpStatus === 429 || err.httpStatus >= 500;
        }
        // Network errors (ECONNRESET, ETIMEDOUT, etc.) are retryable
        return true;
      })();

      if (!shouldRetry || attempt === maxRetries) break;

      // Exponential backoff: 1s, 2s, 4s, ...
      const delay = baseDelayMs * Math.pow(2, attempt);
      await sleep(delay);
    }
  }

  throw lastError ?? new Error(`Unknown error for asset ${assetId}`);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ============================================================
// Core validation logic
// ============================================================

/**
 * Validates a single asset:
 *  1. Fetches asset metadata from the Contentful CDA.
 *  2. Extracts the image URL from the asset fields.
 *  3. Issues a HEAD request to the image CDN URL.
 *  4. Records the result with full diagnostics.
 */
async function validateAsset(
  assetId: string,
  client: ContentfulClient,
  config: ValidatorConfig
): Promise<ValidationResult> {
  const startTime = Date.now();

  const result: ValidationResult = {
    assetId,
    status: 'FAIL',
    cdaStatus: null,
    cdaError: null,
    imageUrl: null,
    imageStatus: null,
    imageError: null,
    fileName: null,
    contentType: null,
    fileSizeBytes: null,
    durationMs: 0,
    timestamp: new Date().toISOString(),
    retryCount: 0,
  };

  // ---- Phase 1: CDA metadata fetch ----
  let asset;
  try {
    const { result: fetchedAsset, retryCount } = await withRetry(
      () => client.fetchAsset(assetId),
      config.maxRetries,
      config.retryDelayMs,
      assetId
    );
    asset = fetchedAsset;
    result.cdaStatus = 200;
    result.retryCount = retryCount;

    // Populate metadata from the response
    const fileLocales = Object.keys(asset.fields.file ?? {});
    const primaryLocale = fileLocales[0];
    if (primaryLocale) {
      const fileField = asset.fields.file[primaryLocale];
      result.fileName = fileField?.fileName ?? null;
      result.contentType = fileField?.contentType ?? null;
      result.fileSizeBytes = fileField?.details?.size ?? null;
    }
  } catch (err) {
    result.cdaStatus = err instanceof ContentfulApiError ? err.httpStatus : null;
    result.cdaError =
      err instanceof Error ? err.message : `Unexpected error: ${String(err)}`;
    result.durationMs = Date.now() - startTime;
    return result; // Can't proceed without the asset metadata
  }

  // ---- Phase 2: Construct and validate image URL ----
  const imageUrl = client.extractImageUrl(asset);

  if (!imageUrl) {
    result.cdaError = 'Asset exists in CDA but has no file URL (not an image asset?)';
    result.durationMs = Date.now() - startTime;
    return result;
  }

  result.imageUrl = imageUrl;

  // HEAD request — we only care about the response status, not the body.
  // This is cheaper than GET on large image files.
  try {
    const { result: imageResponse, retryCount: imgRetry } = await withRetry(
      () =>
        fetch(imageUrl, {
          method: 'HEAD',
          headers: { 'User-Agent': 'contentful-asset-validator/1.0' },
        }),
      config.maxRetries,
      config.retryDelayMs,
      assetId
    );

    result.imageStatus = imageResponse.status;
    result.retryCount += imgRetry;

    if (imageResponse.ok) {
      result.status = 'OK';
    } else {
      result.imageError = `Image CDN returned HTTP ${imageResponse.status}`;
    }
  } catch (err) {
    result.imageError =
      err instanceof Error ? err.message : `Unexpected error: ${String(err)}`;
  }

  result.durationMs = Date.now() - startTime;
  return result;
}

// ============================================================
// Batch orchestrator
// ============================================================

export interface RunOptions {
  onResult?: (result: ValidationResult, index: number, total: number) => void;
  onProgress?: (current: number, total: number) => void;
}

/**
 * Validates all assets in `assetIds` with controlled concurrency.
 * Uses p-limit to enforce the concurrency cap, which is the correct
 * mechanism for Contentful's rate limits (unlike a simple Promise.all).
 *
 * @param assetIds  Ordered list of asset IDs to validate
 * @param config    Fully loaded validator config
 * @param options   Optional callbacks for streaming progress to the console
 */
export async function runValidation(
  assetIds: string[],
  config: ValidatorConfig,
  options: RunOptions = {}
): Promise<ValidationResult[]> {
  const client = new ContentfulClient({
    spaceId: config.spaceId,
    accessToken: config.accessToken,
    environment: config.environment,
    cdaBaseUrl: config.cdaBaseUrl,
  });

  // p-limit enforces that at most `concurrency` promises are in-flight at once.
  // This is critical for respecting Contentful's 7 req/s limit on free tiers.
  const limit = pLimit(config.concurrency);

  const total = assetIds.length;
  let completed = 0;

  const tasks = assetIds.map((assetId, index) =>
    limit(async () => {
      const result = await validateAsset(assetId, client, config);
      completed++;

      options.onResult?.(result, index, total);
      options.onProgress?.(completed, total);

      return result;
    })
  );

  return Promise.all(tasks);
}
