import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get current file directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function getPackageVersion(): string {
  try {
    const packagePath = join(__dirname, '../../package.json');
    const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'));
    return packageJson.version || '1.0.0';
  } catch (error) {
    console.warn('Could not read package.json version, using default 1.0.0');
    return '1.0.0';
  }
}

export function validateSemanticVersion(version: string): `${number}.${number}.${number}` {
  // Check if version is already in semantic version format
  const semverRegex = /^\d+\.\d+\.\d+$/;
  if (semverRegex.test(version)) {
    return version as `${number}.${number}.${number}`;
  }
  
  // If not, default to 1.0.0
  console.warn(`Invalid semantic version '${version}', using '1.0.0' instead`);
  return '1.0.0';
}
