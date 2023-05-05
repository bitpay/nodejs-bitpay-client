import { BitPayClient } from './BitPayClient';
import { Invoice, InvoiceInterface } from '../Model';
import { BitPayExceptions as Exceptions, Facade } from '../index';
import { TokenContainer } from '../TokenContainer';
import { GuidGenerator } from '../util/GuidGenerator';
import { InvoiceEventTokenInterface } from '../Model/Invoice/InvoiceEventToken';
import { BitPayResponseParser } from '../util/BitPayResponseParser';

export class InvoiceClient {
  private bitPayClient: BitPayClient;
  private tokenContainer: TokenContainer;
  private guidGenerator: GuidGenerator;

  constructor(bitPayClient: BitPayClient, tokenContainer: TokenContainer, guidGenerator: GuidGenerator) {
    this.bitPayClient = bitPayClient;
    this.tokenContainer = tokenContainer;
    this.guidGenerator = guidGenerator;
  }

  public async create(invoice: Invoice, facade: Facade, signRequest: boolean): Promise<InvoiceInterface> {
    invoice.guid = invoice.guid ? invoice.guid : this.guidGenerator.execute();
    invoice.token = this.tokenContainer.getToken(facade);

    try {
      const result = await this.bitPayClient.post('invoices', invoice, signRequest);
      return <InvoiceInterface>JSON.parse(result);
    } catch (e) {
      throw new Exceptions.InvoiceCreation(
        'failed to deserialize BitPay server response (Invoice) : ' + e.message,
        e.apiCode
      );
    }
  }

  public async get(invoiceId: string, facade: Facade, signRequest: boolean): Promise<InvoiceInterface> {
    const params = { token: this.tokenContainer.getToken(facade) };

    try {
      const result = await this.bitPayClient.get('invoices/' + invoiceId, params, signRequest);
      return <InvoiceInterface>JSON.parse(result);
    } catch (e) {
      throw new Exceptions.InvoiceQuery(
        'failed to deserialize BitPay server response (Invoice) : ' + e.message,
        e.apiCode
      );
    }
  }

  public async getByGuid(guid: string, facade: Facade, signRequest: boolean): Promise<InvoiceInterface> {
    const params = { token: this.tokenContainer.getToken(facade) };

    try {
      const result = await this.bitPayClient.get('invoices/guid/' + guid, params, signRequest);
      return <InvoiceInterface>JSON.parse(result);
    } catch (e) {
      throw new Exceptions.InvoiceQuery(
        'failed to deserialize BitPay server response (Invoice) : ' + e.message,
        e.apiCode
      );
    }
  }

  public async getInvoices(params: object): Promise<InvoiceInterface[]> {
    params['token'] = this.tokenContainer.getToken(Facade.Merchant);

    try {
      const result = await this.bitPayClient.get('invoices', params, true);
      return <InvoiceInterface[]>JSON.parse(result);
    } catch (e) {
      throw new Exceptions.InvoiceQuery(
        'failed to deserialize BitPay server response (Invoice) : ' + e.message,
        e.apiCode
      );
    }
  }

  public async getInvoiceEventToken(invoiceId: string): Promise<InvoiceEventTokenInterface> {
    const params = {};
    params['token'] = this.tokenContainer.getToken(Facade.Merchant);

    try {
      const result = await this.bitPayClient.get('invoices/' + invoiceId + '/events', params, true);
      return <InvoiceEventTokenInterface>JSON.parse(result);
    } catch (e) {
      throw new Exceptions.InvoiceQuery(
        'failed to deserialize BitPay server response (Invoice) : ' + e.message,
        e.apiCode
      );
    }
  }

  public async update(invoiceId: string, params: []): Promise<InvoiceInterface> {
    params['token'] = this.tokenContainer.getToken(Facade.Merchant);

    try {
      const result = await this.bitPayClient.put('invoices/' + invoiceId, params);
      return <InvoiceInterface>JSON.parse(result);
    } catch (e) {
      throw new Exceptions.InvoiceUpdate(
        'failed to deserialize BitPay server response (Invoice) : ' + e.message,
        e.apiCode
      );
    }
  }

  public async pay(invoiceId: string, status: string): Promise<InvoiceInterface> {
    const params = {
      token: this.tokenContainer.getToken(Facade.Merchant),
      status: status
    };

    try {
      const result = await this.bitPayClient.put('invoices/pay/' + invoiceId, params);
      return <InvoiceInterface>JSON.parse(result);
    } catch (e) {
      throw new Exceptions.InvoiceGeneric(
        'failed to deserialize BitPay server response (Invoice) : ' + e.message,
        e.apiCode
      );
    }
  }

  public async cancel(invoiceId: string, forceCancel: boolean): Promise<InvoiceInterface> {
    const params = {
      token: this.tokenContainer.getToken(Facade.Merchant),
      forceCancel: forceCancel
    };

    try {
      const result = await this.bitPayClient.delete('invoices/' + invoiceId, params);
      return <InvoiceInterface>JSON.parse(result);
    } catch (e) {
      throw new Exceptions.InvoiceGeneric(
        'failed to deserialize BitPay server response (Invoice) : ' + e.message,
        e.apiCode
      );
    }
  }

  public async cancelByGuid(guid: string, forceCancel: boolean): Promise<InvoiceInterface> {
    const params = {
      token: this.tokenContainer.getToken(Facade.Merchant),
      forceCancel: forceCancel
    };

    try {
      const result = await this.bitPayClient.delete('invoices/guid/' + guid, params);
      return <InvoiceInterface>JSON.parse(result);
    } catch (e) {
      throw new Exceptions.InvoiceGeneric(
        'failed to deserialize BitPay server response (Invoice) : ' + e.message,
        e.apiCode
      );
    }
  }

  public async requestInvoiceWebhookToBeResent(invoiceId: string): Promise<boolean> {
    const params = { token: this.tokenContainer.getToken(Facade.Merchant) };

    try {
      const result = await this.bitPayClient.post('invoices/' + invoiceId + '/notifications', params);
      return BitPayResponseParser.jsonToBoolean(result);
    } catch (e) {
      throw new Exceptions.InvoiceGeneric(
        'failed to deserialize BitPay server response (Invoice) : ' + e.message,
        e.apiCode
      );
    }
  }
}
