import { BitPayClient } from './BitPayClient';
import { TokenContainer } from '../TokenContainer';
import { GuidGenerator } from '../util/GuidGenerator';
import { Facade } from '../index';
import { RefundInterface } from '../Model/Invoice/Refund';
import { ParamsRemover } from '../util/ParamsRemover';
import { BitPayResponseParser } from '../util/BitPayResponseParser';
import { BitPayExceptionProvider } from '../Exceptions/BitPayExceptionProvider';

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

    const result = await this.bitPayClient.post('refunds', params, true);

    try {
      return <RefundInterface>JSON.parse(result);
    } catch (e: any) {
      BitPayExceptionProvider.throwDeserializeResourceException('Refund', e.message);
      throw new Error();
    }
  }

  /**
   * Retrieve a previously made refund request on a BitPay invoice.
   *
   * @param refundId The BitPay refund ID.
   * @returns Refund BitPay Refund object with the associated Refund object.
   * @throws BitPayApiException BitPayApiException class
   * @throws BitPayGenericException BitPayGenericException class
   */
  public async get(refundId: string): Promise<RefundInterface> {
    const params = { token: this.tokenContainer.getToken(Facade.Merchant) };
    const result = await this.bitPayClient.get('refunds/' + refundId, params, true);

    try {
      return <RefundInterface>JSON.parse(result);
    } catch (e: any) {
      BitPayExceptionProvider.throwDeserializeResourceException('Refund', e.message);
      throw new Error();
    }
  }

  /**
   * Retrieve a previously made refund request on a BitPay invoice by Guid.
   *
   * @param guid The BitPay GUID.
   * @returns Refund BitPay Refund object with the associated Refund object.
   * @throws BitPayApiException BitPayApiException class
   * @throws BitPayGenericException BitPayGenericException class
   */
  public async getByGuid(guid: string): Promise<RefundInterface> {
    const params = { token: this.tokenContainer.getToken(Facade.Merchant) };
    const result = await this.bitPayClient.get('refunds/guid/' + guid, params, true);

    try {
      return <RefundInterface>JSON.parse(result);
    } catch (e: any) {
      BitPayExceptionProvider.throwDeserializeResourceException('Refund', e.message);
      throw new Error();
    }
  }

  /**
   * Retrieve a previously made refund request on a BitPay invoice by guid.
   *
   * @param invoiceId The BitPay refund Guid.
   * @returns Refund BitPay Refund object with the associated Refund object.
   * @throws BitPayApiException BitPayApiException class
   * @throws BitPayGenericException BitPayGenericException class
   */
  public async getRefunds(invoiceId: string): Promise<RefundInterface[]> {
    const params = {
      token: this.tokenContainer.getToken(Facade.Merchant),
      invoiceId: invoiceId
    };
    const result = await this.bitPayClient.get('refunds', params, true);

    try {
      return <RefundInterface[]>JSON.parse(result);
    } catch (e: any) {
      BitPayExceptionProvider.throwDeserializeResourceException('Refund', e.message);
      throw new Error();
    }
  }

  /**
   * Send a refund notification.
   *
   * @param refundId A BitPay refund ID.
   * @returns boolean An updated Refund Object
   * @throws BitPayApiException BitPayApiException class
   * @throws BitPayGenericException BitPayGenericException class
   */
  public async sendRefundNotification(refundId: string): Promise<boolean> {
    const params = { token: this.tokenContainer.getToken(Facade.Merchant) };
    const result = await this.bitPayClient.post('refunds/' + refundId + '/notifications', params, true);

    try {
      return BitPayResponseParser.jsonToBoolean(result);
    } catch (e: any) {
      BitPayExceptionProvider.throwDeserializeResourceException('Refund', e.message);
      throw new Error();
    }
  }

  /**
   * Update the status of a BitPay invoice.
   *
   * @param refundId BitPay refund ID.
   * @param status The new status for the refund to be updated.
   * @returns Refund A BitPay generated Refund object.
   * @throws BitPayApiException BitPayApiException class
   * @throws BitPayGenericException BitPayGenericException class
   */
  public async update(refundId: string, status: string): Promise<RefundInterface> {
    const params = {
      token: this.tokenContainer.getToken(Facade.Merchant),
      status: status
    };
    const result = await this.bitPayClient.put('refunds/' + refundId, params, true);

    try {
      return <RefundInterface>JSON.parse(result);
    } catch (e: any) {
      BitPayExceptionProvider.throwDeserializeResourceException('Refund', e.message);
      throw new Error();
    }
  }

  /**
   * Update the status of a BitPay invoice.
   *
   * @param guid BitPay refund Guid.
   * @param status The new status for the refund to be updated.
   * @returns  Refund A BitPay generated Refund object.
   * @throws BitPayApiException BitPayApiException class
   * @throws BitPayGenericException BitPayGenericException class
   */
  public async updateByGuid(guid: string, status: string): Promise<RefundInterface> {
    const params = {
      token: this.tokenContainer.getToken(Facade.Merchant),
      status: status
    };
    const result = await this.bitPayClient.put('refunds/guid/' + guid, params, true);

    try {
      return <RefundInterface>JSON.parse(result);
    } catch (e: any) {
      BitPayExceptionProvider.throwDeserializeResourceException('Refund', e.message);
      throw new Error();
    }
  }

  /**
   * Cancel a previously submitted refund request on a BitPay invoice.
   *
   * @param refundId The refund Id for the refund to be canceled.
   * @returns Cancelled refund Object.
   * @throws BitPayApiException BitPayApiException class
   * @throws BitPayGenericException BitPayGenericException class
   */
  public async cancel(refundId: string): Promise<RefundInterface> {
    const params = { token: this.tokenContainer.getToken(Facade.Merchant) };
    const result = await this.bitPayClient.delete('refunds/' + refundId, params, true);

    try {
      return <RefundInterface>JSON.parse(result);
    } catch (e: any) {
      BitPayExceptionProvider.throwDeserializeResourceException('Refund', e.message);
      throw new Error();
    }
  }

  /**
   * Cancel a previously submitted refund request on a BitPay invoice
   *
   * @param guid The refund Guid for the refund to be canceled.
   * @returns Cancelled refund Object.
   * @throws BitPayApiException BitPayApiException class
   * @throws BitPayGenericException BitPayGenericException class
   */
  public async cancelByGuid(guid: string): Promise<RefundInterface> {
    const params = { token: this.tokenContainer.getToken(Facade.Merchant) };
    const result = await this.bitPayClient.delete('refunds/guid/' + guid, params, true);

    try {
      return <RefundInterface>JSON.parse(result);
    } catch (e: any) {
      BitPayExceptionProvider.throwDeserializeResourceException('Refund', e.message);
      throw new Error();
    }
  }
}
