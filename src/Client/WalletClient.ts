import { BitPayClient } from './BitPayClient';
import { WalletInterface } from '../Model/Wallet/Wallet';
import { BitPayExceptionProvider } from '../Exceptions/BitPayExceptionProvider';

export class WalletClient {
  private bitPayClient: BitPayClient;

  constructor(bitPayClient: BitPayClient) {
    this.bitPayClient = bitPayClient;
  }

  /**
   * Retrieve all supported wallets.
   *
   * @returns Wallet[]
   * @throws WalletQueryException
   */
  public async getSupportedWallets(): Promise<WalletInterface[]> {
    const result = await this.bitPayClient.get('supportedwallets', null, false);

    try {
      return <WalletInterface[]>JSON.parse(result);
    } catch (e) {
      BitPayExceptionProvider.throwDeserializeResourceException('Wallet', e.message);
    }
  }
}
