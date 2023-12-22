import {ClientProvider} from "../ClientProvider";

class LedgerRequests {
  public getLedgers(): void {
    const client = ClientProvider.create();

    const ledgers = client.getLedgers()
  }

  public getLedgerEntries(): void {
    const client = ClientProvider.create();

    const oneMonthAgo = new Date();
    oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const ledgerEntries = client.getLedgerEntries('USD', oneMonthAgo, tomorrow)
  }
}