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

  constructor(
    bitPayClient: BitPayClient,
    tokenContainer: TokenContainer,
    guidGenerator: GuidGenerator,
  ) {
    this.bitPayClient = bitPayClient;
    this.tokenContainer = tokenContainer;
    this.guidGenerator = guidGenerator;
  }

  public async create(refund: RefundInterface): Promise<RefundInterface> {
    let params = {
      token: this.tokenContainer.getToken(Facade.Merchant),
      invoiceId: refund.invoice,
      amount: refund.amount,
      currency: refund.currency,
      preview: refund.preview,
      immediate: refund.immediate,
      buyerPaysRefundFee: refund.buyerPaysRefundFee,
    };
    params['guid'] = refund.guid ? refund.guid : this.guidGenerator.execute();

    ParamsRemover.removeNullValuesFromObject(params);

    try {
      const result = await this.bitPayClient.post('refunds', params, true);
      return <RefundInterface>JSON.parse(result);
    } catch (e) {
      throw new Exceptions.RefundCreation(
        'failed to deserialize BitPay server response (Refund) : ' + e.message,
        e.apiCode,
      );
    }
  }

  public async get(refundId: string): Promise<RefundInterface> {
    const params = { token: this.tokenContainer.getToken(Facade.Merchant) };

    try {
      const result = await this.bitPayClient.get(
        'refunds/' + refundId,
        params,
        true,
      );
      return <RefundInterface>JSON.parse(result);
    } catch (e) {
      throw new Exceptions.RefundQuery(
        'failed to deserialize BitPay server response (Refund) : ' + e.message,
        e.apiCode,
      );
    }
  }

  public async getByGuid(guid: string): Promise<RefundInterface> {
    const params = { token: this.tokenContainer.getToken(Facade.Merchant) };

    try {
      const result = await this.bitPayClient.get(
        'refunds/guid/' + guid,
        params,
        true,
      );
      return <RefundInterface>JSON.parse(result);
    } catch (e) {
      throw new Exceptions.RefundQuery(
        'failed to deserialize BitPay server response (Refund) : ' + e.message,
        e.apiCode,
      );
    }
  }

  public async getRefunds(invoiceId: string): Promise<RefundInterface[]> {
    const params = {
      token: this.tokenContainer.getToken(Facade.Merchant),
      invoiceId: invoiceId,
    };

    try {
      const result = await this.bitPayClient.get('refunds', params, true);
      return <RefundInterface[]>JSON.parse(result);
    } catch (e) {
      throw new Exceptions.RefundQuery(
        'failed to deserialize BitPay server response (Refund) : ' + e.message,
        e.apiCode,
      );
    }
  }

  public async sendRefundNotification(refundId: string): Promise<Boolean> {
    const params = { token: this.tokenContainer.getToken(Facade.Merchant) };

    try {
      const result = await this.bitPayClient.post(
        'refunds/' + refundId + '/notifications',
        params,
        true,
      );
      return BitPayResponseParser.jsonToBoolean(result);
    } catch (e) {
      throw new Exceptions.RefundGeneric(
        'failed to deserialize BitPay server response (Refund) : ' + e.message,
        e.apiCode,
      );
    }
  }

  public async update(
    refundId: string,
    status: string,
  ): Promise<RefundInterface> {
    const params = {
      token: this.tokenContainer.getToken(Facade.Merchant),
      status: status,
    };

    try {
      const result = await this.bitPayClient.put(
        'refunds/' + refundId,
        params,
        true,
      );
      return <RefundInterface>JSON.parse(result);
    } catch (e) {
      throw new Exceptions.RefundGeneric(
        'failed to deserialize BitPay server response (Refund) : ' + e.message,
        e.apiCode,
      );
    }
  }

  public async updateByGuid(
    guid: string,
    status: string,
  ): Promise<RefundInterface> {
    const params = {
      token: this.tokenContainer.getToken(Facade.Merchant),
      status: status,
    };

    try {
      const result = await this.bitPayClient.put(
        'refunds/guid/' + guid,
        params,
        true,
      );
      return <RefundInterface>JSON.parse(result);
    } catch (e) {
      throw new Exceptions.RefundGeneric(
        'failed to deserialize BitPay server response (Refund) : ' + e.message,
        e.apiCode,
      );
    }
  }

  public async cancel(refundId: string): Promise<RefundInterface> {
    const params = { token: this.tokenContainer.getToken(Facade.Merchant) };

    try {
      const result = await this.bitPayClient.delete(
        'refunds/' + refundId,
        params,
        true,
      );
      return <RefundInterface>JSON.parse(result);
    } catch (e) {
      throw new Exceptions.RefundCancellation(
        'failed to deserialize BitPay server response (Refund) : ' + e.message,
        e.apiCode,
      );
    }
  }

  public async cancelByGuid(guid: string): Promise<RefundInterface> {
    const params = { token: this.tokenContainer.getToken(Facade.Merchant) };

    try {
      const result = await this.bitPayClient.delete(
        'refunds/guid/' + guid,
        params,
        true,
      );
      return <RefundInterface>JSON.parse(result);
    } catch (e) {
      throw new Exceptions.RefundCancellation(
        'failed to deserialize BitPay server response (Refund) : ' + e.message,
        e.apiCode,
      );
    }
  }
}
