// ============================================================
// Validation Result Types
// ============================================================

export type ValidationStatus = 'OK' | 'FAIL' | 'SKIP';

export interface ValidationResult {
  url: string;
  status: ValidationStatus;
  httpStatus: number | null;
  finalUrl: string | null;
  redirected: boolean;
  error: string | null;
  durationMs: number;
  timestamp: string;
  retryCount: number;
}

// ============================================================
// Configuration Types
// ============================================================

export interface ValidatorConfig {
  csvPath: string;
  concurrency: number;
  maxRetries: number;
  retryDelayMs: number;
  releaseNumber: number | null;
  totalReleases: number;
  reportDir: string;
  reportFormat: 'json' | 'csv' | 'both';
  vercelBypassToken: string | null;
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
