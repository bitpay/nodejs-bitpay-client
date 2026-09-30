import * as fs from 'fs';

/**
 * Writes a file that holds secrets (private key, API tokens) so only the owner can read and write it.
 *
 * The mode given to writeFileSync only applies when the file is created. If the file already
 * exists, for example from an older setup run, its permissions are tightened before and after
 * writing. On Windows, chmod only controls the read-only flag, so this has no effect there.
 */
export function writeSecretFile(path: string, content: string): void {
  if (fs.existsSync(path)) {
    fs.chmodSync(path, 0o600);
  }
  fs.writeFileSync(path, content, { mode: 0o600 });
  fs.chmodSync(path, 0o600);
}
