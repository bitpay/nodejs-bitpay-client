import { BitPayClient } from './BitPayClient';
import { TokenContainer } from '../TokenContainer';
import { GuidGenerator } from '../util/GuidGenerator';
import { BitPayExceptions as Exceptions, Facade } from '../index';
import { RefundInterface } from '../Model/Invoice/Refund';
import { ParamsRemover } from '../util/ParamsRemover';
import { BitPayResponseParser } from '../util/BitPayResponseParser';

export class RefundClient {
  private bitPayClient: BitPayClient;
  private tokenContainer: TokenContainer;
  private guidGenerator: GuidGenerator;

  constructor(bitPayClient: BitPayClient, tokenContainer: TokenContainer, guidGenerator: GuidGenerator) {
    this.bitPayClient = bitPayClient;
    this.tokenContainer = tokenContainer;
    this.guidGenerator = guidGenerator;
  }

  /**
   * Create a refund for a BitPay invoice.
   *
   * @param refund RefundInterface
   * @returns Refund An updated Refund Object
   * @throws RefundCreationException
   */
  public async create(refund: RefundInterface): Promise<RefundInterface> {
    const params = {
      token: this.tokenContainer.getToken(Facade.Merchant),
      invoiceId: refund.invoice,
      amount: refund.amount,
      currency: refund.currency,
      preview: refund.preview,
      immediate: refund.immediate,
      buyerPaysRefundFee: refund.buyerPaysRefundFee
    };
    params['guid'] = refund.guid ? refund.guid : this.guidGenerator.execute();

    ParamsRemover.removeNullValuesFromObject(params);

    try {
      const result = await this.bitPayClient.post('refunds', params, true);
      return <RefundInterface>JSON.parse(result);
    } catch (e) {
      throw new Exceptions.RefundCreation(
        'failed to deserialize BitPay server response (Refund) : ' + e.message,
        e.apiCode
      );
    }
  }

  /**
   * Retrieve a previously made refund request on a BitPay invoice.
   *
   * @param refundId The BitPay refund ID.
   * @returns Refund BitPay Refund object with the associated Refund object.
   * @throws RefundQueryException
   */
  public async get(refundId: string): Promise<RefundInterface> {
    const params = { token: this.tokenContainer.getToken(Facade.Merchant) };

    try {
      const result = await this.bitPayClient.get('refunds/' + refundId, params, true);
      return <RefundInterface>JSON.parse(result);
    } catch (e) {
      throw new Exceptions.RefundQuery(
        'failed to deserialize BitPay server response (Refund) : ' + e.message,
        e.apiCode
      );
    }
  }

  public async getByGuid(guid: string): Promise<RefundInterface> {
    const params = { token: this.tokenContainer.getToken(Facade.Merchant) };

    try {
      const result = await this.bitPayClient.get('refunds/guid/' + guid, params, true);
      return <RefundInterface>JSON.parse(result);
    } catch (e) {
      throw new Exceptions.RefundQuery(
        'failed to deserialize BitPay server response (Refund) : ' + e.message,
        e.apiCode
      );
    }
  }

  /**
   * Retrieve a previously made refund request on a BitPay invoice by guid.
   *
   * @param invoiceId The BitPay refund Guid.
   * @returns Refund BitPay Refund object with the associated Refund object.
   * @throws RefundQueryException
   */
  public async getRefunds(invoiceId: string): Promise<RefundInterface[]> {
    const params = {
      token: this.tokenContainer.getToken(Facade.Merchant),
      invoiceId: invoiceId
    };

    try {
      const result = await this.bitPayClient.get('refunds', params, true);
      return <RefundInterface[]>JSON.parse(result);
    } catch (e) {
      throw new Exceptions.RefundQuery(
        'failed to deserialize BitPay server response (Refund) : ' + e.message,
        e.apiCode
      );
    }
  }

  /**
   * Send a refund notification.
   *
   * @param refundId A BitPay refund ID.
   * @returns boolean An updated Refund Object
   * @throws RefundException
   */
  public async sendRefundNotification(refundId: string): Promise<boolean> {
    const params = { token: this.tokenContainer.getToken(Facade.Merchant) };

    try {
      const result = await this.bitPayClient.post('refunds/' + refundId + '/notifications', params, true);
      return BitPayResponseParser.jsonToBoolean(result);
    } catch (e) {
      throw new Exceptions.RefundGeneric(
        'failed to deserialize BitPay server response (Refund) : ' + e.message,
        e.apiCode
      );
    }
  }

  /**
   * Update the status of a BitPay invoice.
   *
   * @param refundId BitPay refund ID.
   * @param status The new status for the refund to be updated.
   * @returns Refund A BitPay generated Refund object.
   * @throws RefundException
   */
  public async update(refundId: string, status: string): Promise<RefundInterface> {
    const params = {
      token: this.tokenContainer.getToken(Facade.Merchant),
      status: status
    };

    try {
      const result = await this.bitPayClient.put('refunds/' + refundId, params, true);
      return <RefundInterface>JSON.parse(result);
    } catch (e) {
      throw new Exceptions.RefundGeneric(
        'failed to deserialize BitPay server response (Refund) : ' + e.message,
        e.apiCode
      );
    }
  }

  /**
   * Update the status of a BitPay invoice.
   *
   * @param guid BitPay refund Guid.
   * @param status The new status for the refund to be updated.
   * @returns  Refund A BitPay generated Refund object.
   * @throws RefundException
   */
  public async updateByGuid(guid: string, status: string): Promise<RefundInterface> {
    const params = {
      token: this.tokenContainer.getToken(Facade.Merchant),
      status: status
    };

    try {
      const result = await this.bitPayClient.put('refunds/guid/' + guid, params, true);
      return <RefundInterface>JSON.parse(result);
    } catch (e) {
      throw new Exceptions.RefundGeneric(
        'failed to deserialize BitPay server response (Refund) : ' + e.message,
        e.apiCode
      );
    }
  }

  /**
   * Cancel a previously submitted refund request on a BitPay invoice.
   *
   * @param refundId The refund Id for the refund to be canceled.
   * @returns Cancelled refund Object.
   * @throws RefundCreationException
   */
  public async cancel(refundId: string): Promise<RefundInterface> {
    const params = { token: this.tokenContainer.getToken(Facade.Merchant) };

    try {
      const result = await this.bitPayClient.delete('refunds/' + refundId, params, true);
      return <RefundInterface>JSON.parse(result);
    } catch (e) {
      throw new Exceptions.RefundCancellation(
        'failed to deserialize BitPay server response (Refund) : ' + e.message,
        e.apiCode
      );
    }
  }

  /**
   * Cancel a previously submitted refund request on a BitPay invoice
   *
   * @param guid The refund Guid for the refund to be canceled.
   * @returns Cancelled refund Object.
   * @throws RefundCreationException
   */
  public async cancelByGuid(guid: string): Promise<RefundInterface> {
    const params = { token: this.tokenContainer.getToken(Facade.Merchant) };

    try {
      const result = await this.bitPayClient.delete('refunds/guid/' + guid, params, true);
      return <RefundInterface>JSON.parse(result);
    } catch (e) {
      throw new Exceptions.RefundCancellation(
        'failed to deserialize BitPay server response (Refund) : ' + e.message,
        e.apiCode
      );
    }
  }
}
