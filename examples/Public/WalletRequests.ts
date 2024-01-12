import {ClientProvider} from "../ClientProvider";

class WalletRequests {
  public getSupportedWallets(): void {
    const client = ClientProvider.create();

    const supportedWallets = client.getSupportedWallets();
  }
}