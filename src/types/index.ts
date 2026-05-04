// ============================================================
// Contentful CDA Response Types
// ============================================================

export interface ContentfulImageFile {
  url: string;           // "//images.ctfassets.net/spaceId/assetId/hash/filename.jpg"
  details: {
    size: number;
    image?: {
      width: number;
      height: number;
    };
  };
  fileName: string;
  contentType: string;   // "image/jpeg", "image/png", "image/webp", etc.
}

export interface ContentfulAssetFields {
  title?: { [locale: string]: string };
  description?: { [locale: string]: string };
  file: { [locale: string]: ContentfulImageFile };
}

export interface ContentfulAsset {
  sys: {
    id: string;
    type: 'Asset';
    createdAt: string;
    updatedAt: string;
    locale?: string;
    space: { sys: { id: string } };
    environment: { sys: { id: string } };
    revision: number;
  };
  fields: ContentfulAssetFields;
  metadata?: {
    tags: Array<{ sys: { id: string; type: string; linkType: string } }>;
  };
}

export interface ContentfulErrorResponse {
  sys: { type: 'Error'; id: string };
  message: string;
  details?: Record<string, unknown>;
  requestId?: string;
}

// ============================================================
// Validation Result Types
// ============================================================

export type ValidationStatus = 'OK' | 'FAIL' | 'SKIP';

export interface ValidationResult {
  assetId: string;
  status: ValidationStatus;
  // CDA lookup phase
  cdaStatus: number | null;           // HTTP status from CDA fetch
  cdaError: string | null;            // Error message if CDA call failed
  // Image URL validation phase
  imageUrl: string | null;            // Constructed full image URL
  imageStatus: number | null;         // HTTP status from image HEAD request
  imageError: string | null;          // Error message if image request failed
  // Metadata
  fileName: string | null;
  contentType: string | null;
  fileSizeBytes: number | null;
  // Timing
  durationMs: number;
  timestamp: string;
  // Retry info
  retryCount: number;
}

// ============================================================
// Configuration Types
// ============================================================

export interface ValidatorConfig {
  spaceId: string;
  accessToken: string;
  environment: string;
  csvPath: string;
  concurrency: number;
  maxRetries: number;
  retryDelayMs: number;
  releaseNumber: number | null;
  totalReleases: number;
  reportDir: string;
  reportFormat: 'json' | 'csv' | 'both';
  cdaBaseUrl: string;
  imagesBaseUrl: string;
}

// ============================================================
// Batch / Release Types
// ============================================================

export interface ReleaseBatch {
  releaseNumber: number;
  totalReleases: number;
  startIndex: number;
  endIndex: number;
  ids: string[];
  totalIds: number;
}

// ============================================================
// Report Summary Types
// ============================================================

export interface ValidationSummary {
  releaseNumber: number | null;
  totalIds: number;
  passed: number;
  failed: number;
  skipped: number;
  passRate: string;
  startTime: string;
  endTime: string;
  durationSeconds: number;
  failures: ValidationResult[];
}
