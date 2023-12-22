import {ClientProvider} from "../ClientProvider";
import {Settlement} from "../../src/Model/Settlement/Settlement";

class SettlementRequests {
  public getSettlement(): void {
    const client = ClientProvider.create();

    const settlement = client.getSettlement('someSettlementId');

    const params = {
      startDate: '2021-05-10',
      endDate: '2021-05-12',
      status: 'processing',
      limit: 100,
      offset: 0
    };
    const settlements = client.getSettlements(params)
  }

  public fetchReconciliationReport(): void {
    const client = ClientProvider.create();

    const settlement = new Settlement();

    const result = client.getSettlementReconciliationReport('settlementId', 'settlementToken');
  }
}