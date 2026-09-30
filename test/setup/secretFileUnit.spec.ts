import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { writeSecretFile } from '../../src/setup/SecretFile';

// POSIX permissions do not apply on Windows.
const describePosix = process.platform === 'win32' ? describe.skip : describe;

describePosix('writeSecretFile', () => {
  let dir: string;

  beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), 'bitpay-secret-'));
  });

  afterEach(() => {
    fs.rmSync(dir, { recursive: true, force: true });
  });

  it('creates the file readable only by its owner (0600)', () => {
    const file = path.join(dir, 'private_key_test.key');
    writeSecretFile(file, 'abc');

    expect(fs.statSync(file).mode & 0o777).toBe(0o600);
    expect(fs.readFileSync(file, 'utf8')).toBe('abc');
  });

  it('tightens an existing file created with wider permissions', () => {
    const file = path.join(dir, 'BitPay.config.json');
    fs.writeFileSync(file, 'old', { mode: 0o755 });
    fs.chmodSync(file, 0o755);

    writeSecretFile(file, 'new');

    expect(fs.statSync(file).mode & 0o777).toBe(0o600);
    expect(fs.readFileSync(file, 'utf8')).toBe('new');
  });
});
