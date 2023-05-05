import { BitPayClient } from './BitPayClient';
import { BitPayExceptions as Exceptions } from '../index';
import { WalletInterface } from '../Model/Wallet/Wallet';

export class WalletClient {
  private bitPayClient: BitPayClient;

  constructor(bitPayClient: BitPayClient) {
    this.bitPayClient = bitPayClient;
  }

  public async getSupportedWallets(): Promise<WalletInterface[]> {
    try {
      const result = await this.bitPayClient.get('supportedwallets', null, false);
      return <WalletInterface[]>JSON.parse(result);
    } catch (e) {
      throw new Exceptions.WalletQuery(
        'failed to deserialize BitPay server response (Wallet) : ' + e.message,
        e.apiCode
      );
    }
  }
}
