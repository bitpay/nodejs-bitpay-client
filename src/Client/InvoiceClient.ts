import { BitPayClient } from './BitPayClient';
import { Invoice, InvoiceInterface } from '../Model';
import { TokenContainer } from '../TokenContainer';
import { GuidGenerator } from '../util/GuidGenerator';
import { InvoiceEventTokenInterface } from '../Model/Invoice/InvoiceEventToken';
import { BitPayResponseParser } from '../util/BitPayResponseParser';
import { BitPayExceptionProvider } from '../Exceptions/BitPayExceptionProvider';
import { Facade } from '../Facade';

export class InvoiceClient {
  private bitPayClient: BitPayClient;
  private tokenContainer: TokenContainer;
  private guidGenerator: GuidGenerator;

  constructor(bitPayClient: BitPayClient, tokenContainer: TokenContainer, guidGenerator: GuidGenerator) {
    this.bitPayClient = bitPayClient;
    this.tokenContainer = tokenContainer;
    this.guidGenerator = guidGenerator;
  }

  /**
   * Create a BitPay invoice.
   *
   * @param invoice An Invoice object with request parameters defined
   * @param facade The facade used to create it.
   * @param signRequest Signed request.
   * @returns Invoice
   * @throws BitPayApiException BitPayApiException class
   * @throws BitPayGenericException BitPayGenericException class
   */
  public async create(invoice: Invoice, facade: Facade, signRequest: boolean): Promise<InvoiceInterface> {
    invoice.guid = invoice.guid ? invoice.guid : this.guidGenerator.execute();
    invoice.token = this.tokenContainer.getToken(facade);

    const result = await this.bitPayClient.post('invoices', invoice, signRequest);

    try {
      return <InvoiceInterface>JSON.parse(result);
    } catch (e: any) {
      BitPayExceptionProvider.throwDeserializeResourceException('Invoice', e.message);
      throw new Error();
    }
  }

  /**
   * Retrieve a BitPay invoice by invoice id using the specified facade. The client must have been previously
   * authorized for the specified facade (the public facade requires no authorization).
   *
   * @param invoiceId The id of the invoice to retrieve.
   * @param facade The facade used to create it.
   * @param signRequest Signed request.
   * @returns Invoice
   * @throws BitPayApiException BitPayApiException class
   * @throws BitPayGenericException BitPayGenericException class
   */
  public async get(invoiceId: string, facade: Facade, signRequest: boolean): Promise<InvoiceInterface> {
    const params = { token: this.tokenContainer.getToken(facade) };

    const result = await this.bitPayClient.get('invoices/' + invoiceId, params, signRequest);

    try {
      return <InvoiceInterface>JSON.parse(result);
    } catch (e: any) {
      BitPayExceptionProvider.throwDeserializeResourceException('Invoice', e.message);
      throw new Error();
    }
  }

  /**
   * @param guid
   * @param facade
   * @param signRequest
   * @returns Invoice
   * @throws BitPayApiException BitPayApiException class
   * @throws BitPayGenericException BitPayGenericException class
   */
  public async getByGuid(guid: string, facade: Facade, signRequest: boolean): Promise<InvoiceInterface> {
    const params = { token: this.tokenContainer.getToken(facade) };

    const result = await this.bitPayClient.get('invoices/guid/' + guid, params, signRequest);

    try {
      return <InvoiceInterface>JSON.parse(result);
    } catch (e: any) {
      BitPayExceptionProvider.throwDeserializeResourceException('Invoice', e.message);
      throw new Error();
    }
  }

  /**
   * Retrieve a collection of BitPay invoices.
   *
   * @param params
   * @returns Invoice[]
   * @throws BitPayApiException BitPayApiException class
   * @throws BitPayGenericException BitPayGenericException class
   */
  public async getInvoices(params: object): Promise<InvoiceInterface[]> {
    params['token'] = this.tokenContainer.getToken(Facade.Merchant);

    const result = await this.bitPayClient.get('invoices', params, true);

    try {
      return <InvoiceInterface[]>JSON.parse(result);
    } catch (e: any) {
      BitPayExceptionProvider.throwDeserializeResourceException('Invoice', e.message);
      throw new Error();
    }
  }

  /**
   *
   * @param invoiceId
   * @returns
   */
  public async getInvoiceEventToken(invoiceId: string): Promise<InvoiceEventTokenInterface> {
    const params = {};
    params['token'] = this.tokenContainer.getToken(Facade.Merchant);

    const result = await this.bitPayClient.get('invoices/' + invoiceId + '/events', params, true);

    try {
      return <InvoiceEventTokenInterface>JSON.parse(result);
    } catch (e: any) {
      BitPayExceptionProvider.throwDeserializeResourceException('Invoice', e.message);
      throw new Error();
    }
  }

  /**
   * Update a BitPay invoice.
   *
   * @param invoiceId The id of the invoice to updated.
   * @param params
   * @returns Invoice
   * @throws BitPayApiException BitPayApiException class
   * @throws BitPayGenericException BitPayGenericException class
   */
  public async update(invoiceId: string, params: []): Promise<InvoiceInterface> {
    params['token'] = this.tokenContainer.getToken(Facade.Merchant);

    const result = await this.bitPayClient.put('invoices/' + invoiceId, params);

    try {
      return <InvoiceInterface>JSON.parse(result);
    } catch (e: any) {
      BitPayExceptionProvider.throwDeserializeResourceException('Invoice', e.message);
      throw new Error();
    }
  }

  /**
   * Pay an invoice with a mock transaction
   *
   * @param invoiceId The id of the invoice.
   * @param status  Status the invoice will become. Acceptable values are confirmed (default) and complete.
   * @returns Invoice Invoice object.
   * @throws BitPayApiException BitPayApiException class
   * @throws BitPayGenericException BitPayGenericException class
   */
  public async pay(invoiceId: string, status: string): Promise<InvoiceInterface> {
    const params = {
      token: this.tokenContainer.getToken(Facade.Merchant),
      status: status
    };
    const result = await this.bitPayClient.put('invoices/pay/' + invoiceId, params);

    try {
      return <InvoiceInterface>JSON.parse(result);
    } catch (e: any) {
      BitPayExceptionProvider.throwDeserializeResourceException('Invoice', e.message);
      throw new Error();
    }
  }

  /**
   * Cancel a BitPay invoice.
   *
   * @param invoiceId The id of the invoice to updated.
   * @param forceCancel
   * @returns Invoice  Cancelled invoice object.
   * @throws BitPayApiException BitPayApiException class
   * @throws BitPayGenericException BitPayGenericException class
   */
  public async cancel(invoiceId: string, forceCancel: boolean): Promise<InvoiceInterface> {
    const params = {
      token: this.tokenContainer.getToken(Facade.Merchant),
      forceCancel: forceCancel
    };
    const result = await this.bitPayClient.delete('invoices/' + invoiceId, params);

    try {
      return <InvoiceInterface>JSON.parse(result);
    } catch (e: any) {
      BitPayExceptionProvider.throwDeserializeResourceException('Invoice', e.message);
      throw new Error();
    }
  }

  /**
   * Cancel a BitPay invoice.
   *
   * @param guid The guid of the invoice to cancel.
   * @param forceCancel
   * @returns Invoice Cancelled invoice object.
   * @throws BitPayApiException BitPayApiException class
   * @throws BitPayGenericException BitPayGenericException class
   */
  public async cancelByGuid(guid: string, forceCancel: boolean): Promise<InvoiceInterface> {
    const params = {
      token: this.tokenContainer.getToken(Facade.Merchant),
      forceCancel: forceCancel
    };
    const result = await this.bitPayClient.delete('invoices/guid/' + guid, params);

    try {
      return <InvoiceInterface>JSON.parse(result);
    } catch (e: any) {
      BitPayExceptionProvider.throwDeserializeResourceException('Invoice', e.message);
      throw new Error();
    }
  }

  /**
   * Request a BitPay Invoice Webhook.
   *
   * @param invoiceId A BitPay invoice ID.
   * @returns boolean
   * @throws BitPayApiException BitPayApiException class
   * @throws BitPayGenericException BitPayGenericException class
   */
  public async requestInvoiceWebhookToBeResent(invoiceId: string): Promise<boolean> {
    const params = { token: this.tokenContainer.getToken(Facade.Merchant) };
    const result = await this.bitPayClient.post('invoices/' + invoiceId + '/notifications', params);

    try {
      return BitPayResponseParser.jsonToBoolean(result);
    } catch (e: any) {
      BitPayExceptionProvider.throwDeserializeResourceException('Invoice', e.message);
      throw new Error();
    }
  }
}
