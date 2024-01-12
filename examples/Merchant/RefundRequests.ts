import {ClientProvider} from "../ClientProvider";
import {Refund} from "../../src/Model/Invoice/Refund";

class RefundRequests {
  public createRefund(): void {
    const client = ClientProvider.create();

    const refund = new Refund(12, "someInvoiceId", "someToken");

    const result = client.createRefund(refund);
  }

  public updateRefund(): void {
    const client = ClientProvider.create();

    const updateRefund = client.updateRefund('myRefundId','created');
    const updatedRefundByGuid = client.updateRefundByGuid('myRefundId','created');
  }

  public getRefund(): void {
    const client = ClientProvider.create();

    const refund = client.getRefund('someRefundId');
    const refundByGuid = client.getRefundByGuid('someGuid');
  }

  public cancelRefund(): void {
    const client = ClientProvider.create();

    const cancelRefund = client.cancelRefund('myRefundId');
    const cancelRefundByGuid = client.cancelRefundByGuid('someGuid');
  }

  public requestRefundNotificationToBeResent(): void {
    const client = ClientProvider.create();

    const result = client.sendRefundNotification('someRefundId');
  }
}