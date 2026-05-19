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
  isValidImageHeader: boolean | null;  // null if file doesn't exist or extension unsupported
}

// Supported image extensions (lower-case). Order matters for findAssetFile.
const SUPPORTED_EXTENSIONS = ['.jpg', '.jpeg', '.png'] as const;
type SupportedExt = typeof SUPPORTED_EXTENSIONS[number];

// Magic bytes per format
const MAGIC_BYTES: Record<SupportedExt, Buffer> = {
  '.jpg': Buffer.from([0xff, 0xd8, 0xff]),
  '.jpeg': Buffer.from([0xff, 0xd8, 0xff]),
  '.png': Buffer.from([0x89, 0x50, 0x4e, 0x47]),
};

/**
 * Returns the absolute path of `{assetId}.<ext>` for the first supported
 * extension that exists in `imageDir`. Returns null if no matching file is found.
 */
export function findAssetFile(assetId: string, imageDir: string): string | null {
  for (const ext of SUPPORTED_EXTENSIONS) {
    const p = path.join(imageDir, `${assetId}${ext}`);
    if (fs.existsSync(p)) return p;
  }
  return null;
}

/**
 * Checks that a local image file exists, is non-empty, and has a valid header
 * matching its extension (JPEG: FF D8 FF, PNG: 89 50 4E 47).
 *
 * Looks for `{assetId}.jpg`, `{assetId}.jpeg`, then `{assetId}.png` in `imageDir`.
 */
export function checkLocalAsset(assetId: string, imageDir: string): LocalAssetCheck {
  const filePath = findAssetFile(assetId, imageDir);

  if (!filePath) {
    return {
      assetId,
      exists: false,
      filePath: null,
      fileSizeBytes: null,
      isZeroBytes: false,
      isValidImageHeader: null,
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
      isValidImageHeader: null,
    };
  }

  const ext = path.extname(filePath).toLowerCase() as SupportedExt;
  const magic = MAGIC_BYTES[ext];

  // Unknown extension fell through findAssetFile — treat as invalid header
  if (!magic) {
    return {
      assetId,
      exists: true,
      filePath,
      fileSizeBytes: sizeBytes,
      isZeroBytes: false,
      isValidImageHeader: false,
    };
  }

  // Read only the magic byte length from the start of the file
  const fd = fs.openSync(filePath, 'r');
  const header = Buffer.alloc(magic.length);
  fs.readSync(fd, header, 0, magic.length, 0);
  fs.closeSync(fd);

  return {
    assetId,
    exists: true,
    filePath,
    fileSizeBytes: sizeBytes,
    isZeroBytes: false,
    isValidImageHeader: header.equals(magic),
  };
}

/**
 * A duplicate entry — same asset ID present in the directory with
 * more than one supported extension (e.g. `{id}.jpg` AND `{id}.png`).
 */
export interface DuplicateAsset {
  assetId: string;
  extensions: string[];
}

/**
 * Cross-references the CSV ID list with the local image directory.
 * Returns:
 *  - `missing`:    IDs in the CSV that have no corresponding local file
 *  - `corrupt`:    IDs where the local file exists but fails the format header check
 *  - `extra`:      Files in the directory that are NOT in the CSV (unexpected assets)
 *  - `duplicates`: IDs that appear in the directory with multiple supported extensions
 *                  (e.g. the same ID with both .jpg AND .png)
 */
export function crossReferenceLocalAssets(
  csvIds: string[],
  imageDir: string
): {
  missing: string[];
  corrupt: string[];
  extra: string[];
  duplicates: DuplicateAsset[];
  checks: LocalAssetCheck[];
} {
  const checks = csvIds.map((id) => checkLocalAsset(id, imageDir));

  const missing = checks.filter((c) => !c.exists).map((c) => c.assetId);
  const corrupt = checks
    .filter((c) => c.exists && (c.isZeroBytes || c.isValidImageHeader === false))
    .map((c) => c.assetId);

  // Build a map: baseName → list of extensions present in the directory
  const byBaseName = new Map<string, string[]>();
  const dirFiles = fs
    .readdirSync(imageDir)
    .filter((f) => SUPPORTED_EXTENSIONS.some((ext) => f.toLowerCase().endsWith(ext)));

  for (const file of dirFiles) {
    const ext = path.extname(file).toLowerCase();
    const baseName = file.slice(0, -ext.length);
    const list = byBaseName.get(baseName);
    if (list) list.push(ext);
    else byBaseName.set(baseName, [ext]);
  }

  // Duplicates: same ID with 2+ extensions
  const duplicates: DuplicateAsset[] = [];
  for (const [assetId, extensions] of byBaseName) {
    if (extensions.length > 1) {
      duplicates.push({ assetId, extensions: extensions.sort() });
    }
  }
  duplicates.sort((a, b) => a.assetId.localeCompare(b.assetId));

  // Extra: IDs in directory but not in CSV
  const csvIdSet = new Set(csvIds);
  const extra = Array.from(byBaseName.keys()).filter((id) => !csvIdSet.has(id));

  return { missing, corrupt, extra, duplicates, checks };
}
