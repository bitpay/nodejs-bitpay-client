import * as BN from 'bn.js';
import * as crypto from 'crypto';
import { KeyPair, KeyUtils } from '../src/util/KeyUtils';

// Expected values were generated with elliptic 6.6.1, the library this SDK used before 8.1.0.
// They check that keys saved with older versions still load as the same key and SIN.
const keyUtils = new KeyUtils();

const HEX = '2f72ed3291b536aa43d750829875f5a742a0f1095b8ad529944cbc0bd498693f';
const PUB_COMPRESSED = '0312cd27740676028cebe2238fb797c3957ba5e94b1f2a8567a44982c502769ae5';
const PUB_UNCOMPRESSED =
  '0412cd27740676028cebe2238fb797c3957ba5e94b1f2a8567a44982c502769ae5' +
  '58e0ce03cc0f05d0953d7199b2434d33d7bdc85437a8aea5f74e7b9953938595';
const SIN = 'TfBqeTz1xKY35nMq7PdGdahsfdCcgDsgQmF';

describe('KeyUtils', () => {
  describe('load_keypair reads keys like elliptic did', () => {
    const cases: Array<[string, string | Buffer, string, string]> = [
      ['hex', HEX, HEX, PUB_COMPRESSED],
      ['upper case hex', HEX.toUpperCase(), HEX, PUB_COMPRESSED],
      ['hex with trailing newline (key file)', HEX + '\n', HEX, PUB_COMPRESSED],
      ['32 byte Buffer', Buffer.from(HEX, 'hex'), HEX, PUB_COMPRESSED],
      [
        'hex shorter than 64 chars (leading zero byte)',
        '39ac75f6acc2fcbed3316a8b51c5e767dbb0d1c03c14507e1a3ae9d0513618',
        '0039ac75f6acc2fcbed3316a8b51c5e767dbb0d1c03c14507e1a3ae9d0513618',
        '02e20056f497dbef39f1ee60d34cc23498efa1e98052dadf1f03190e72c6de0155'
      ],
      [
        'hex with an invalid char',
        '2f72ed3291b536aa43d750829875f5a742a0f1095b8ad529944cbc0bd498693g',
        '2f72ed3291b536aa43d750829875f5a742a0f1095b8ad529944cbc0bd4986937',
        '02cfc16f49e449c825721e1684b356fdfd42a1a6600df6c687200de2e54369806c'
      ],
      [
        'Buffer with the hex as ASCII bytes',
        Buffer.from('81cc183fe31e318337f885f0d7058a615855f5e930f25dc1510c4283a52a823f'),
        '66f0b35dd55a6dd3d4262db5d47dd89c572f6e84e0aabeca1a2e8680fe667b09',
        '02ada2095c23b2a9e9dace39a18ace691c3e4b2cc8356554d6e2077d6f19070191'
      ]
    ];

    it.each(cases)('%s', (_name, input, expectedPrivate, expectedPublic) => {
      const kp = keyUtils.load_keypair(input);
      expect(kp.getPrivate('hex')).toBe(expectedPrivate);
      expect(keyUtils.getPublicKeyFromPrivateKey(kp)).toBe(expectedPublic);
    });

    it('returns the same KeyPair when given a KeyPair', () => {
      const kp = keyUtils.load_keypair(HEX);
      expect(keyUtils.load_keypair(kp)).toBe(kp);
    });

    it('accepts a BN and any object with getPrivate() (e.g. an elliptic KeyPair)', () => {
      const fromBN = keyUtils.load_keypair(new BN(HEX, 16));
      const fromLike = keyUtils.load_keypair({ getPrivate: () => new BN(HEX, 16) });
      expect(fromBN.getPrivate('hex')).toBe(HEX);
      expect(fromLike.getPrivate('hex')).toBe(HEX);
    });

    it('rejects a zero key', () => {
      expect(() => keyUtils.load_keypair('00')).toThrow('Invalid private key');
    });
  });

  describe('KeyPair', () => {
    const kp = keyUtils.load_keypair(HEX);

    it('getPrivate() returns a BN that loads the same key', () => {
      const priv = kp.getPrivate();
      expect(BN.isBN(priv)).toBe(true);
      expect(keyUtils.getPublicKeyFromPrivateKey(priv)).toBe(PUB_COMPRESSED);
    });

    it('getPrivate("hex") is always 64 chars', () => {
      const shortKey = keyUtils.load_keypair('39ac75f6acc2fcbed3316a8b51c5e767dbb0d1c03c14507e1a3ae9d0513618');
      expect(shortKey.getPrivate('hex')).toHaveLength(64);
    });

    it('getPublic("hex") is uncompressed, like elliptic', () => {
      expect(kp.getPublic('hex')).toBe(PUB_UNCOMPRESSED);
      expect(kp.getPublic(true, 'hex')).toBe(PUB_COMPRESSED);
      expect(kp.getPublic(false, 'hex')).toBe(PUB_UNCOMPRESSED);
      expect(kp.getPublic().encodeCompressed('hex')).toBe(PUB_COMPRESSED);
      expect(kp.getPublic().encode('hex')).toBe(PUB_UNCOMPRESSED);
    });

    it('get_sin_from_key returns the same SIN as before', () => {
      expect(keyUtils.get_sin_from_key(kp)).toBe(SIN);
    });

    it('generate_keypair returns a usable KeyPair', () => {
      const generated = keyUtils.generate_keypair();
      expect(generated).toBeInstanceOf(KeyPair);
      expect(generated.getPrivate('hex')).toMatch(/^[0-9a-f]{64}$/);
    });
  });

  describe('sign', () => {
    const kp = keyUtils.load_keypair(HEX);

    it('matches elliptic canonical signature (deterministic, RFC 6979)', () => {
      expect(keyUtils.sign('https://test.bitpay.com/invoices/1234', kp)).toBe(
        '3045022100ab41b28d196b0efcf059991ff90b1106e93e69032e3a45de2038c456ade793b9' +
          '02200c1221d95af72cd8a5e2470126ea767cc5a3fa1523d41b3921a5b39cd847d61b'
      );
    });

    it('returns low-S where elliptic default returned high-S, and both verify', () => {
      const data = 'https://test.bitpay.com/invoices/0';
      const ellipticHighS =
        '3046022100df88ce90fc8034234fd1e875e073ac9fc84c204dfbf1a5f45da1b34114d610f0' +
        '022100ea159c56154208cbae5e8570d6dc9175a37b604a496c8c4f8ef8b937954a094e';
      const lowS =
        '3045022100df88ce90fc8034234fd1e875e073ac9fc84c204dfbf1a5f45da1b34114d610f0' +
        '022015ea63a9eabdf73451a17a8f29236e8917337c9c65dc13ec30d9a5553aec37f3';

      expect(keyUtils.sign(data, kp)).toBe(lowS);

      const hash = crypto.createHash('sha256').update(data, 'utf-8').digest();
      expect(kp.verify(hash, lowS)).toBe(true);
      expect(kp.verify(hash, ellipticHighS)).toBe(true);
    });

    it('signOrig returns DER bytes', () => {
      const der = keyUtils.signOrig('https://test.bitpay.com/invoices/1234', kp);
      expect(der.toString('hex').startsWith('30')).toBe(true);
    });
  });
});
