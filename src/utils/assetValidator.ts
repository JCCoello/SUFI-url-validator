import pLimit from 'p-limit';
import type { ValidationResult, ValidatorConfig } from '../types';

// ============================================================
// Retry helper
// ============================================================

/**
 * Executes `fn` up to `maxRetries + 1` times with exponential backoff.
 * Only retries on network errors or HTTP 429 (rate limit) and 5xx responses.
 * Does NOT retry on 404 — that is a definitive FAIL.
 */
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number,
  baseDelayMs: number,
  targetUrl: string
): Promise<{ result: T; retryCount: number }> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await fn();

      if (result instanceof Response) {
        // 404 is terminal and non-retryable by design.
        if (result.status === 404) {
          return { result, retryCount: attempt };
        }

        // Retry only on rate limiting and server-side failures.
        const shouldRetryResponse = result.status === 429 || result.status >= 500;
        if (shouldRetryResponse && attempt < maxRetries) {
          const delay = baseDelayMs * Math.pow(2, attempt);
          await sleep(delay);
          continue;
        }
      }

      return { result, retryCount: attempt };
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));

      // Network/runtime errors are retryable.
      if (attempt === maxRetries) break;

      // Exponential backoff: 1s, 2s, 4s, ...
      const delay = baseDelayMs * Math.pow(2, attempt);
      await sleep(delay);
    }
  }

  throw lastError ?? new Error(`Unknown error for URL ${targetUrl}`);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ============================================================
// Core validation logic
// ============================================================

/**
 * Validates a single URL with redirect following.
 * Status is OK only when the final response is HTTP 200.
 */
async function validateUrl(
  url: string,
  config: ValidatorConfig
): Promise<ValidationResult> {
  const startTime = Date.now();

  const result: ValidationResult = {
    url,
    status: 'FAIL',
    httpStatus: null,
    finalUrl: null,
    redirected: false,
    error: null,
    durationMs: 0,
    timestamp: new Date().toISOString(),
    retryCount: 0,
  };

  try {
    const { result: response, retryCount } = await withRetry(
      () =>
        fetch(url, {
          method: 'GET',
          redirect: 'follow',
        }),
      config.maxRetries,
      config.retryDelayMs,
      url
    );

    result.httpStatus = response.status;
    result.finalUrl = response.url || url;
    result.redirected = response.redirected || response.url !== url;
    result.retryCount = retryCount;

    if (response.status === 200) {
      result.status = 'OK';
    } else {
      result.error = `HTTP ${response.status}`;
    }
  } catch (err) {
    result.error =
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
 * Validates all URLs in `urls` with controlled concurrency.
 * Uses p-limit to enforce the concurrency cap.
 *
 * @param urls      Ordered list of URLs to validate
 * @param config    Fully loaded validator config
 * @param options   Optional callbacks for streaming progress to the console
 */
export async function runValidation(
  urls: string[],
  config: ValidatorConfig,
  options: RunOptions = {}
): Promise<ValidationResult[]> {
  // p-limit enforces that at most `concurrency` promises are in-flight at once.
  const limit = pLimit(config.concurrency);

  const total = urls.length;
  let completed = 0;

  const tasks = urls.map((url, index) =>
    limit(async () => {
      const result = await validateUrl(url, config);
      completed++;

      options.onResult?.(result, index, total);
      options.onProgress?.(completed, total);

      return result;
    })
  );

  return Promise.all(tasks);
}
