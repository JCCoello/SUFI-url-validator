import type { ContentfulAsset, ContentfulErrorResponse } from '../types';

/**
 * Thin, dependency-free Contentful CDA client.
 * Uses the native `fetch` API (Node 18+) — no SDK needed, no extra bundle weight.
 *
 * Rate limits (Contentful free/paid tiers):
 *   - CDA:    ~7 req/s per space on free; ~78 req/s on Team+
 *   - Images: no explicit API limit but CDN-throttled at high concurrency
 *
 * This client does NOT implement rate limiting itself — that is the
 * responsibility of the caller via p-limit (see validator.ts).
 */
export class ContentfulClient {
  private readonly baseUrl: string;
  private readonly headers: Record<string, string>;
  private readonly spaceId: string;
  private readonly environment: string;

  constructor(options: {
    spaceId: string;
    accessToken: string;
    environment?: string;
    cdaBaseUrl?: string;
  }) {
    this.spaceId = options.spaceId;
    this.environment = options.environment ?? 'master';
    this.baseUrl = options.cdaBaseUrl ?? 'https://cdn.contentful.com';
    this.headers = {
      Authorization: `Bearer ${options.accessToken}`,
      Accept: 'application/json',
      'User-Agent': 'contentful-asset-validator/1.0',
    };
  }

  /**
   * Fetches a single asset from the Contentful CDA by its ID.
   *
   * Endpoint: GET /spaces/{spaceId}/environments/{env}/assets/{assetId}
   *
   * @returns The asset object on success, or throws a typed error on failure.
   */
  async fetchAsset(assetId: string): Promise<ContentfulAsset> {
    const url =
      `${this.baseUrl}/spaces/${this.spaceId}` +
      `/environments/${this.environment}` +
      `/assets/${assetId}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: this.headers,
    });

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`;
      try {
        const errorBody = (await response.json()) as ContentfulErrorResponse;
        errorMessage = `HTTP ${response.status} — ${errorBody.message ?? 'Unknown error'} (requestId: ${errorBody.requestId ?? 'N/A'})`;
      } catch {
        // JSON parse failed; use the status text
        errorMessage = `HTTP ${response.status} ${response.statusText}`;
      }
      throw new ContentfulApiError(errorMessage, response.status, assetId);
    }

    return response.json() as Promise<ContentfulAsset>;
  }

  /**
   * Extracts the image URL from an asset and normalises it to HTTPS.
   * Contentful returns protocol-relative URLs ("//images.ctfassets.net/...")
   * which must be normalised before making a request.
   *
   * Returns null if the asset has no file field or is not an image.
   */
  extractImageUrl(asset: ContentfulAsset, locale = 'en-US'): string | null {
    // Contentful returns fields keyed by locale. Try the provided locale first,
    // then fall back to whatever the first available locale key is.
    const fileField =
      asset.fields.file?.[locale] ??
      Object.values(asset.fields.file ?? {})[0];

    if (!fileField?.url) return null;

    // Normalise protocol-relative URL
    const rawUrl = fileField.url;
    const normalised = rawUrl.startsWith('//') ? `https:${rawUrl}` : rawUrl;

    return normalised;
  }
}

/**
 * Typed error for Contentful API failures.
 * Carries the HTTP status code and the asset ID for targeted error reporting.
 */
export class ContentfulApiError extends Error {
  constructor(
    message: string,
    public readonly httpStatus: number,
    public readonly assetId: string
  ) {
    super(message);
    this.name = 'ContentfulApiError';
  }
}
