import { Refund } from '../../src/Model/Invoice/Refund';
import { ClientProvider } from '../ClientProvider';

export class RefundRequests {
  public async createRefund() {
    const client = ClientProvider.create();

    const refund = new Refund(12, 'someInvoiceId', 'someToken');

    return await client.createRefund(refund);
  }

  public async updateRefund() {
    const client = ClientProvider.create();

    return await client.updateRefund('myRefundId', 'created');
  }

  public async updateRefundByGuid() {
    const client = ClientProvider.create();

    return await client.updateRefundByGuid('myRefundGuid', 'created');
  }

  public async getRefund() {
    const client = ClientProvider.create();

    return await client.getRefund('someRefundId');
  }

  public async getRefundByGuid() {
    const client = ClientProvider.create();

    await client.getRefundByGuid('someGuid');
  }

  public async cancelRefund() {
    const client = ClientProvider.create();

    return await client.cancelRefund('myRefundId');
  }

  public async cancleRefundByGuid() {
    const client = ClientProvider.create();

    return await client.cancelRefundByGuid('someGuid');
  }

  public async requestRefundNotificationToBeResent() {
    const client = ClientProvider.create();

    const refundId = 'someRefundId';
    const refund = await client.getRefund(refundId);
    if (!refund.token) {
      throw new Error('Refund token is required to request a refund notification to be resent.');
    }

    return await client.sendRefundNotification(refundId, refund.token);
  }
}
