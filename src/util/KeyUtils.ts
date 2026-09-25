import * as BN from 'bn.js';
import bs58 from 'bs58';
import * as crypto from 'crypto';
import * as secp from '@noble/secp256k1';

// noble 1.7.x needs a sync HMAC to create deterministic (RFC 6979) signatures without async.
secp.utils.hmacSha256Sync = (key: Uint8Array, ...messages: Uint8Array[]): Uint8Array => {
  const hmac = crypto.createHmac('sha256', key);
  messages.forEach((message) => hmac.update(message));
  return new Uint8Array(hmac.digest());
};

const CURVE_N = new BN(secp.CURVE.n.toString(16), 16);

/**
 * Anything with a getPrivate() that returns a BN, for example a KeyPair created with elliptic.
 */
export interface KeyPairLike {
  getPrivate(): BN;
}

export type KeyInput = Buffer | Uint8Array | string | BN | KeyPairLike;

export class PublicKey {
  public constructor(
    private readonly compressed: Uint8Array,
    private readonly uncompressed: Uint8Array
  ) {}

  public encode(): number[];
  public encode(enc: 'hex', compact?: boolean): string;
  public encode(enc?: 'hex', compact?: boolean): number[] | string {
    const bytes = compact ? this.compressed : this.uncompressed;
    return enc === 'hex' ? Buffer.from(bytes).toString('hex') : Array.from(bytes);
  }

  public encodeCompressed(): number[];
  public encodeCompressed(enc: 'hex'): string;
  public encodeCompressed(enc?: 'hex'): number[] | string {
    return enc === 'hex' ? Buffer.from(this.compressed).toString('hex') : Array.from(this.compressed);
  }
}

export class Signature {
  public constructor(private readonly der: Uint8Array) {}

  public toDER(): number[];
  public toDER(enc: 'hex'): string;
  public toDER(enc?: 'hex'): number[] | string {
    return enc === 'hex' ? Buffer.from(this.der).toString('hex') : Array.from(this.der);
  }
}

/**
 * secp256k1 key pair. Keeps the methods of the elliptic KeyPair that the SDK and its users rely on.
 */
export class KeyPair implements KeyPairLike {
  private readonly priv: BN;
  private readonly privBytes: Uint8Array;

  public constructor(priv: BN) {
    if (priv.isZero()) {
      throw new Error('Invalid private key');
    }
    this.priv = priv;
    this.privBytes = new Uint8Array(priv.toArray('be', 32));
  }

  public getPrivate(): BN;
  public getPrivate(enc: 'hex'): string;
  public getPrivate(enc?: 'hex'): BN | string {
    // Always 64 hex chars. elliptic dropped leading zeros, which gave shorter keys about 1 time in 256.
    return enc === 'hex' ? this.priv.toString(16, 64) : this.priv.clone();
  }

  public getPublic(): PublicKey;
  public getPublic(enc: 'hex'): string;
  public getPublic(compact: boolean, enc: 'hex'): string;
  public getPublic(compactOrEnc?: boolean | 'hex', enc?: 'hex'): PublicKey | string {
    const publicKey = new PublicKey(secp.getPublicKey(this.privBytes, true), secp.getPublicKey(this.privBytes, false));

    if (typeof compactOrEnc === 'boolean') {
      return enc === 'hex' ? publicKey.encode('hex', compactOrEnc) : publicKey;
    }

    return compactOrEnc === 'hex' ? publicKey.encode('hex', false) : publicKey;
  }

  /**
   * Signs a message hash. Signatures are always low-S (canonical).
   */
  public sign(msgHash: Buffer | Uint8Array | number[] | string): Signature {
    return new Signature(secp.signSync(KeyPair.toBytes(msgHash), this.privBytes, { der: true, canonical: true }));
  }

  /**
   * Verifies a DER signature for a message hash. Accepts high-S signatures, like elliptic.
   */
  public verify(
    msgHash: Buffer | Uint8Array | number[] | string,
    signature: Buffer | Uint8Array | number[] | string
  ): boolean {
    const publicKey = secp.getPublicKey(this.privBytes, true);
    return secp.verify(KeyPair.toBytes(signature), KeyPair.toBytes(msgHash), publicKey, { strict: false });
  }

  private static toBytes(value: Buffer | Uint8Array | number[] | string): Uint8Array {
    return typeof value === 'string' ? new Uint8Array(Buffer.from(value, 'hex')) : Uint8Array.from(value);
  }
}

export class KeyUtils {
  public generate_keypair(): KeyPair {
    return new KeyPair(new BN(secp.utils.randomPrivateKey()));
  }

  /**
   * Reads a private key the same way elliptic's keyFromPrivate() did, so existing keys keep
   * the same public key and SIN: hex strings of any length, Buffers, BN, or a key pair.
   */
  public load_keypair(key: KeyInput): KeyPair {
    if (key instanceof KeyPair) {
      return key;
    }

    return new KeyPair(KeyUtils.toPrivateBN(key));
  }

  public get_sin_from_key(kp: KeyInput): string {
    const pk: Buffer = Buffer.from(this.load_keypair(kp).getPublic().encodeCompressed());
    const version: Buffer = this.get_version_from_compressed_key(pk);
    const checksum: Buffer = this.get_checksum_from_version(version);
    return bs58.encode(Buffer.concat([version, checksum]));
  }

  public signOrig(data: string, kp: KeyInput): Buffer {
    const digest = crypto.createHash('sha256').update(data).digest();
    return Buffer.from(this.load_keypair(kp).sign(digest).toDER());
  }

  public sign(data: string, privkey: KeyInput): string {
    const dataBuffer = Buffer.from(data, 'utf-8');
    const hashBuffer = crypto.createHash('sha256').update(dataBuffer).digest();

    return this.load_keypair(privkey).sign(hashBuffer).toDER('hex');
  }

  public getPublicKeyFromPrivateKey(privkey: KeyInput): string {
    return this.load_keypair(privkey).getPublic().encodeCompressed('hex');
  }

  private static toPrivateBN(key: KeyInput): BN {
    if (BN.isBN(key)) {
      return (key as BN).umod(CURVE_N);
    }

    if (typeof key === 'string') {
      // Same parsing as elliptic: bn.js 4.x, base 16.
      return new BN(key, 16).umod(CURVE_N);
    }

    if (key instanceof Uint8Array) {
      return new BN(key).umod(CURVE_N);
    }

    if (key && typeof (key as KeyPairLike).getPrivate === 'function') {
      return KeyUtils.toPrivateBN((key as KeyPairLike).getPrivate());
    }

    throw new Error('Unsupported private key format');
  }

  private get_version_from_compressed_key(pk: Buffer): Buffer {
    const sh2 = crypto.createHash('sha256').update(pk).digest();
    const rp = crypto.createHash('ripemd160').update(sh2).digest();

    return Buffer.concat([Buffer.from('0F', 'hex'), Buffer.from('02', 'hex'), rp]);
  }

  private get_checksum_from_version(version: Buffer): Buffer {
    const h1 = crypto.createHash('sha256').update(version).digest();
    const h2 = crypto.createHash('sha256').update(h1).digest();

    return h2.slice(0, 4);
  }
}
