import * as fs from 'fs';
import * as path from 'path';

/**
 * Result of checking a local image file.
 */
export interface LocalAssetCheck {
  assetId: string;
  exists: boolean;
  filePath: string | null;
  fileSizeBytes: number | null;
  isZeroBytes: boolean;
  isValidJpegHeader: boolean | null;  // null if file doesn't exist
}

// JPEG magic bytes: FF D8 FF
const JPEG_MAGIC = Buffer.from([0xff, 0xd8, 0xff]);

/**
 * Checks that a local image file exists, is non-empty, and has a valid JPEG header.
 * The file is expected to be named `{assetId}.jpg` in the provided directory.
 *
 * @param assetId   Contentful asset ID (becomes the filename without extension)
 * @param imageDir  Directory containing the local image files
 */
export function checkLocalAsset(assetId: string, imageDir: string): LocalAssetCheck {
  const filePath = path.join(imageDir, `${assetId}.jpg`);

  if (!fs.existsSync(filePath)) {
    return {
      assetId,
      exists: false,
      filePath: null,
      fileSizeBytes: null,
      isZeroBytes: false,
      isValidJpegHeader: null,
    };
  }

  const stat = fs.statSync(filePath);
  const sizeBytes = stat.size;

  if (sizeBytes === 0) {
    return {
      assetId,
      exists: true,
      filePath,
      fileSizeBytes: 0,
      isZeroBytes: true,
      isValidJpegHeader: null,
    };
  }

  // Read only the first 3 bytes to check the JPEG magic number — cheap and fast
  const fd = fs.openSync(filePath, 'r');
  const header = Buffer.alloc(3);
  fs.readSync(fd, header, 0, 3, 0);
  fs.closeSync(fd);

  const isValidJpegHeader = header.equals(JPEG_MAGIC);

  return {
    assetId,
    exists: true,
    filePath,
    fileSizeBytes: sizeBytes,
    isZeroBytes: false,
    isValidJpegHeader,
  };
}

/**
 * Cross-references the CSV ID list with the local image directory.
 * Returns:
 *  - `missing`: IDs in the CSV that have no corresponding local file
 *  - `corrupt`: IDs where the local file exists but fails JPEG header check
 *  - `extra`:   Files in the directory that are NOT in the CSV (unexpected assets)
 */
export function crossReferenceLocalAssets(
  csvIds: string[],
  imageDir: string
): {
  missing: string[];
  corrupt: string[];
  extra: string[];
  checks: LocalAssetCheck[];
} {
  const checks = csvIds.map((id) => checkLocalAsset(id, imageDir));

  const missing = checks.filter((c) => !c.exists).map((c) => c.assetId);
  const corrupt = checks
    .filter((c) => c.exists && (c.isZeroBytes || c.isValidJpegHeader === false))
    .map((c) => c.assetId);

  // Find files in the directory not referenced in the CSV
  const csvIdSet = new Set(csvIds);
  const dirFiles = fs.readdirSync(imageDir).filter((f) => f.endsWith('.jpg'));
  const extra = dirFiles
    .map((f) => f.replace(/\.jpg$/i, ''))
    .filter((id) => !csvIdSet.has(id));

  return { missing, corrupt, extra, checks };
}
