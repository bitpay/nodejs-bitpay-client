import { ec } from 'elliptic';
import { BitPayExceptions as Exceptions, Env, Facade, KeyUtils } from './index';
import {
  BillInterface,
  InvoiceInterface,
  LedgerEntryInterface,
  LedgerInterface,
  PayoutInterface,
  PayoutRecipientInterface,
  PayoutRecipients,
  RateInterface,
  Rates
} from './Model';
import { BitPayClient } from './Client/BitPayClient';
import { TokenContainer } from './TokenContainer';
import { Environment } from './Environment';
import BitPayException from './Exceptions/BitPayException';
import { GuidGenerator } from './util/GuidGenerator';
import { RateClient } from './Client/RateClient';
import { CurrencyClient } from './Client/CurrencyClient';
import { InvoiceClient } from './Client/InvoiceClient';
import { InvoiceEventTokenInterface } from './Model/Invoice/InvoiceEventToken';
import { RefundInterface } from './Model/Invoice/Refund';
import { RefundClient } from './Client/RefundClient';
import { PayoutRecipientClient } from './Client/PayoutRecipientClient';
import { PayoutClient } from './Client/PayoutClient';
import { LedgerClient } from './Client/LedgerClient';
import { ParamsRemover } from './util/ParamsRemover';
import { BillClient } from './Client/BillClient';
import { WalletInterface } from './Model/Wallet/Wallet';
import { WalletClient } from './Client/WalletClient';
import { SettlementInterface } from './Model/Settlement/Settlement';
import { SettlementClient } from './Client/SettlementClient';
import { PosToken } from './PosToken';
import { PrivateKey } from './PrivateKey';
import { CurrencyInterface } from './Model/Currency/Currency';

import * as fs from 'fs';

export class Client {
  private bitPayClient: BitPayClient;
  private keyUtils = new KeyUtils();
  private guidGenerator: GuidGenerator;
  private tokenContainer: TokenContainer;

  constructor(
    configFilePath: string | null,
    privateKey: PrivateKey | null,
    tokenContainer: TokenContainer | null,
    identity: string | null,
    posToken: PosToken | null,
    environment?: Environment,
    bitPayClient?: BitPayClient, // using for tests
    guidGenerator?: GuidGenerator // using for tests
  ) {
    if (configFilePath !== null) {
      this.initByConfigFilePath(configFilePath);
      return;
    }

    if (bitPayClient !== undefined && bitPayClient !== null) {
      // using for tests
      this.initForTests(bitPayClient, guidGenerator, tokenContainer);
      return;
    }

    if (tokenContainer === null) {
      tokenContainer = new TokenContainer();
    }

    if (environment === undefined) {
      environment = Environment.Prod;
    }

    if (privateKey !== null) {
      const ecKey = this.getEcKeyByPrivateKey(privateKey);
      this.guidGenerator = new GuidGenerator();
      this.tokenContainer = tokenContainer;
      this.bitPayClient = new BitPayClient(Client.getBaseUrl(environment), ecKey, this.getIdentity(ecKey));
      return;
    }

    this.tokenContainer = tokenContainer;
    this.guidGenerator = new GuidGenerator();
    this.bitPayClient = new BitPayClient(Client.getBaseUrl(environment), null, null);

    if (posToken !== null) {
      this.tokenContainer.addPos(posToken.getValue());
      return;
    }
  }

  /**
   * Client factory for POS
   * @param posToken
   * @param environment
   */
  public static createPosClient(posToken: string, environment?: Environment): Client {
    return new Client(null, null, null, null, new PosToken(posToken), environment);
  }

  /**
   * Client factory based on config file
   *
   * @param configFilePath
   */
  public static createClientByConfig(configFilePath: string): Client {
    return new Client(configFilePath, null, null, null, null, null);
  }

  /**
   * Client factory based on private key and tokens
   * @param privateKey
   * @param tokenContainer
   * @param environment
   */
  public static createClientByPrivateKey(
    privateKey: string,
    tokenContainer: TokenContainer,
    environment?: Environment
  ) {
    return new Client(null, new PrivateKey(privateKey), tokenContainer, null, null, environment);
  }

  public getToken(facade: Facade) {
    return this.tokenContainer.getToken(facade);
  }

  /**
   * Retrieve the rates for a cryptocurrency / fiat pair. See https://bitpay.com/bitcoin-exchange-rates.
   *
   * @param baseCurrency the cryptocurrency for which you want to fetch the rates.
   *                     Current supported values are BTC and BCH.
   * @param currency the fiat currency for which you want to fetch the baseCurrency rates
   * @return A Rate object populated with the BitPay exchange rate table.
   */
  public async getRate(baseCurrency: string, currency: string): Promise<RateInterface> {
    return this.createRateClient().getRate(baseCurrency, currency);
  }

  /**
   * Retrieve the exchange rate table maintained by BitPay.  See https://bitpay.com/bitcoin-exchange-rates.
   * @param currency the cryptocurrency for which you want to fetch the rates.
   *                     Current supported values are BTC and BCH.
   * @return A Rates object populated with the BitPay exchange rate table.
   */
  public async getRates(currency: string = null): Promise<Rates> {
    return this.createRateClient().getRates(currency);
  }

  /**
   * Create a BitPay invoice using the Merchant facade.
   *
   * @param invoice An Invoice object with request parameters defined.
   * @param facade Facade for request.
   * @param signRequest Signed request.
   */
  public async createInvoice(
    invoice: InvoiceInterface,
    facade?: Facade,
    signRequest?: boolean
  ): Promise<InvoiceInterface> {
    if (facade === undefined) {
      facade = this.getFacadeBasedOnTokenContainer();
    }

    if (signRequest === undefined) {
      signRequest = Client.isSignRequest(facade);
    }

    invoice.token = invoice.token ? invoice.token : this.guidGenerator.execute();

    return this.createInvoiceClient().create(invoice, facade, signRequest);
  }

  /**
   * Retrieve a BitPay invoice by invoice id using the public facade.
   *
   * @param invoiceId The id of the invoice to retrieve.
   * @param facade Facade for request.
   * @param signRequest Signed request.
   */
  public async getInvoice(invoiceId: string, facade?: Facade, signRequest?: boolean): Promise<InvoiceInterface> {
    if (facade === undefined) {
      facade = this.getFacadeBasedOnTokenContainer();
    }

    if (signRequest === undefined) {
      signRequest = Client.isSignRequest(facade);
    }

    return this.createInvoiceClient().get(invoiceId, facade, signRequest);
  }

  /**
   * Retrieve a BitPay invoice by guid using the specified facade.
   * The client must have been previously authorized for the specified facade.
   *
   * @param guid The guid of the invoice to retrieve.
   * @param facade Facade for request.
   * @param signRequest Signed request.
   */
  public async getInvoiceByGuid(guid: string, facade?: Facade, signRequest?: boolean): Promise<InvoiceInterface> {
    if (facade === undefined) {
      facade = this.getFacadeBasedOnTokenContainer();
    }

    if (signRequest === undefined) {
      signRequest = Client.isSignRequest(facade);
    }

    return this.createInvoiceClient().getByGuid(guid, facade, signRequest);
  }

  /**
   * Retrieve a collection of BitPay invoices.
   *
   * @param params Available params:
   * dateStart The first date for the query filter.
   * dateEnd   The last date for the query filter.
   * status    The invoice status you want to query on.
   * orderId   The optional order id specified at time of invoice creation.
   * limit     Maximum results that the query will return (useful for paging results).
   * offset    Number of results to offset (ex. skip 10 will give you results starting with the 11th.
   */
  public async getInvoices(params: {
    dateStart: string | null;
    dateEnd: string | null;
    status: string | null;
    orderId: string | null;
    limit: number | null;
    offset: number | null;
  }): Promise<InvoiceInterface[]> {
    return this.createInvoiceClient().getInvoices(params);
  }

  /**
   * Retrieves a bus token which can be used to subscribe to invoice events.
   *
   * @param invoiceId the id of the invoice for which you want to fetch an event token.
   */
  public async getInvoiceEventToken(invoiceId: string): Promise<InvoiceEventTokenInterface> {
    return this.createInvoiceClient().getInvoiceEventToken(invoiceId);
  }

  /**
   * Pay a BitPay invoice with a mock transaction. Available only on test env.
   *
   * @param invoiceId The id of the invoice to updated.
   * @param status    The status of the invoice to be updated, can be "confirmed" or "complete".
   * @return A BitPay generated Invoice object.
   */
  public async payInvoice(invoiceId: string, status: string): Promise<InvoiceInterface> {
    return this.createInvoiceClient().pay(invoiceId, status);
  }

  /**
   * Update a BitPay invoice with communication method.
   * @param invoiceId  The id of the invoice to updated.
   * @param params Available parameters:
   * buyerSms   The buyer's cell number.
   * smsCode    The buyer's received verification code.
   * buyerEmail The buyer's email address.
   * autoVerify Skip the user verification on sandbox ONLY.
   * @return A BitPay generated Invoice object.
   */
  public async updateInvoice(invoiceId: string, params: []): Promise<InvoiceInterface> {
    return this.createInvoiceClient().update(invoiceId, params);
  }

  /**
   * Delete a previously created BitPay invoice.
   *
   * @param invoiceId The Id of the BitPay invoice to be canceled.
   * @param forceCancel Force cancel.
   * @return A BitPay generated Invoice object.
   */
  public async cancelInvoice(invoiceId: string, forceCancel = true): Promise<InvoiceInterface> {
    return this.createInvoiceClient().cancel(invoiceId, forceCancel);
  }

  /**
   * Cancellation will require EITHER an SMS or E-mail to have already been set if the invoice has proceeded to
   * the point where it may have been paid, unless using forceCancel parameter.
   * @param guid GUID A passthru variable provided by the merchant and designed to be used by the merchant to
   *             correlate the invoice with an order ID in their system, which can be used as a lookup variable
   *             in Retrieve Invoice by GUID.
   * @param forceCancel If 'true' it will cancel the invoice even if no contact information is present.
   * @return Invoice Invoice
   */
  public async cancelInvoiceByGuid(guid: string, forceCancel = true): Promise<InvoiceInterface> {
    return this.createInvoiceClient().cancelByGuid(guid, forceCancel);
  }

  /**
   * The intent of this call is to address issues when BitPay sends a webhook but the client doesn't receive it,
   * so the client can request that BitPay resend it.
   * @param invoiceId The id of the invoice for which you want the last webhook to be resent.
   * @return Boolean status of request
   */
  public async requestInvoiceWebhookToBeResent(invoiceId: string): Promise<boolean> {
    return this.createInvoiceClient().requestInvoiceWebhookToBeResent(invoiceId);
  }

  /**
   * Create a refund for a BitPay invoice.
   * @param refund. Parameters from Refund object used in request:
   * invoiceId          The BitPay invoice Id having the associated refund to be created.
   * amount             Amount to be refunded in the currency indicated.
   * preview            Whether to create the refund request as a preview (which will not be acted on until status is updated)
   * immediate          Whether funds should be removed from merchant ledger immediately on submission or at time of processing
   * buyerPaysRefundFee Whether the buyer should pay the refund fee (default is merchant)
   * reference          Present only if specified. Used as reference label for the refund. Max str length = 100
   * guid               Variable provided by the merchant and designed to be used by the merchant to correlate the refund with a refund ID in their system
   * @return An updated Refund Object
   */
  public async createRefund(refund: RefundInterface): Promise<RefundInterface> {
    return this.createRefundClient().create(refund);
  }

  /**
   * Retrieve a previously made refund request on a BitPay invoice.
   *
   * @param refundId The BitPay refund ID.
   * @return A BitPay Refund object with the associated Refund object.
   */
  public async getRefund(refundId: string): Promise<RefundInterface> {
    return this.createRefundClient().get(refundId);
  }

  /**
   * Retrieve a previously made refund request on a BitPay invoice.
   *
   * @param guid The BitPay refund GUID.
   * @return A BitPay Refund object with the associated Refund object.
   */
  public async getRefundByGuid(guid: string): Promise<RefundInterface> {
    return this.createRefundClient().getByGuid(guid);
  }

  /**
   * Retrieve all refund requests on a BitPay invoice.
   *
   * @param invoiceId The BitPay invoice object having the associated refunds.
   * @return A list of BitPay Refund objects with the associated Refund objects.
   */
  public async getRefunds(invoiceId: string): Promise<RefundInterface[]> {
    return this.createRefundClient().getRefunds(invoiceId);
  }

  /**
   * Update the status of a BitPay invoice.
   *
   * @param refundId A BitPay refund ID.
   * @param status   The new status for the refund to be updated.
   * @return A BitPay generated Refund object.
   */
  public async updateRefund(refundId: string, status: string): Promise<RefundInterface> {
    return this.createRefundClient().update(refundId, status);
  }

  /**
   * Update the status of a BitPay invoice.
   *
   * @param guid A BitPay refund Guid.
   * @param status   The new status for the refund to be updated.
   * @return A BitPay generated Refund object.
   */
  public async updateRefundByGuid(guid: string, status: string): Promise<RefundInterface> {
    return this.createRefundClient().updateByGuid(guid, status);
  }

  /**
   * Send a refund notification.
   *
   * @param refundId A BitPay refund ID.
   * @return An updated Refund Object
   */
  public async sendRefundNotification(refundId: string): Promise<boolean> {
    return this.createRefundClient().sendRefundNotification(refundId);
  }

  /**
   * Cancel a previously submitted refund request on a BitPay invoice.
   *
   * @param refundId The refund Id for the refund to be canceled.
   * @return An updated Refund Object.
   */
  public async cancelRefund(refundId: string): Promise<RefundInterface> {
    return this.createRefundClient().cancel(refundId);
  }

  /**
   * Cancel a previously submitted refund request on a BitPay invoice.
   *
   * @param guid The refund Guid for the refund to be canceled.
   * @return An updated Refund Object.
   */
  public async cancelRefundByGuid(guid: string): Promise<RefundInterface> {
    return this.createRefundClient().cancelByGuid(guid);
  }

  /**
   * Submit BitPay Payout Recipients.
   *
   * @param recipients PayoutRecipients A PayoutRecipients object with request parameters defined.
   * @return array A list of BitPay PayoutRecipients objects.
   */
  public async submitPayoutRecipients(recipients: PayoutRecipients): Promise<PayoutRecipientInterface[]> {
    return this.createPayoutRecipientClient().submit(recipients);
  }

  /**
   * Retrieve a collection of BitPay Payout Recipients.
   * @param params Available parameters:
   * status String|null The recipient status you want to query on.
   * limit  int Maximum results that the query will return (useful for
   *               paging results). result).
   * offset int Offset for paging.
   * @return array A list of BitPayRecipient objects.
   */
  public async getPayoutRecipients(params = {}): Promise<PayoutRecipientInterface[]> {
    return this.createPayoutRecipientClient().getByFilters(params);
  }

  /**
   * Retrieve a BitPay payout recipient by batch id using.  The client must have been previously authorized for the
   * payout facade.
   *
   * @param recipientId String The id of the recipient to retrieve.
   * @return PayoutRecipient A BitPay PayoutRecipient object.
   */
  public async getPayoutRecipient(recipientId: string): Promise<PayoutRecipientInterface> {
    return this.createPayoutRecipientClient().get(recipientId);
  }

  /**
   * Update a Payout Recipient.
   *
   * @param recipientId String The recipient id for the recipient to be updated.
   * @param recipient   PayoutRecipients A PayoutRecipient object with updated
   *                    parameters defined.
   * @return PayoutRecipientInterface The updated recipient object.
   */
  public async updatePayoutRecipient(
    recipientId: string,
    recipient: PayoutRecipientInterface
  ): Promise<PayoutRecipientInterface> {
    return this.createPayoutRecipientClient().update(recipientId, recipient);
  }

  /**
   * Cancel a BitPay Payout recipient.
   *
   * @param recipientId String The id of the recipient to cancel.
   * @return Boolean True if the delete operation was successful, false otherwise.
   */
  public async deletePayoutRecipient(recipientId: string): Promise<boolean> {
    return this.createPayoutRecipientClient().delete(recipientId);
  }

  /**
   * Request a payout recipient notification
   *
   * @param recipientId String A BitPay recipient ID.
   * @return Boolean True if the notification was successfully sent, false otherwise.
   */
  public async requestPayoutRecipientNotification(recipientId: string): Promise<boolean> {
    return this.createPayoutRecipientClient().requestNotification(recipientId);
  }

  /**
   * Submit a BitPay Payout.
   *
   * @param payout Payout A Payout object with request parameters defined.
   * @return PayoutInterface A BitPay generated Payout object.
   */
  public async submitPayout(payout: PayoutInterface): Promise<PayoutInterface> {
    return this.createPayoutClient().submit(payout);
  }

  /**
   * Retrieve a BitPay payout by payout id using. The client must have been
   * previously authorized for the payout facade.
   *
   * @param payoutId String The id of the payout to retrieve.
   * @return PayoutInterface BitPay Payout object.
   */
  public async getPayout(payoutId: string): Promise<PayoutInterface> {
    return this.createPayoutClient().get(payoutId);
  }

  /**
   * Retrieve a collection of BitPay payouts.
   *
   * @param params Available parameters:
   * startDate String The start date for the query.
   * endDate   String The end date for the query.
   * status    String The status to filter(optional).
   * reference String The optional reference specified at payout request creation.
   * limit     int Maximum results that the query will return (useful for
   *                  paging results).
   * offset    int Offset for paging.
   * @return A list of BitPay Payout objects.
   * @param params
   */
  public async getPayouts(params = {}): Promise<PayoutInterface[]> {
    return this.createPayoutClient().getPayouts(params);
  }

  /**
   * Request a payout notification
   *
   * @param payoutId String The id of the payout to notify..
   * @return Boolean True if the notification was successfully sent, false otherwise.
   */
  public async requestPayoutNotification(payoutId: string): Promise<boolean> {
    return this.createPayoutClient().requestNotification(payoutId);
  }

  /**
   * Cancel a BitPay Payout.
   *
   * @param payoutId String The id of the payout to cancel.
   * @return Boolean True if the refund was successfully canceled, false otherwise.
   */
  public async cancelPayout(payoutId: string): Promise<boolean> {
    return this.createPayoutClient().cancel(payoutId);
  }

  /**
   * Retrieve a list of ledgers using the merchant facade.
   *
   * @return array A list of Ledger objects populated with the currency and current balance of each one.
   */
  public async getLedgers(): Promise<LedgerInterface[]> {
    return this.createLedgerClient().getLedgers();
  }

  /**
   * Retrieve a list of ledgers entries by currency and date range using the merchant facade.
   *
   * @param currency  The three digit currency string for the ledger to retrieve.
   * @param dateStart The first date for the query filter.
   * @param dateEnd   The last date for the query filter.
   * @return array Ledger entries list.
   */
  public async getLedgerEntries(
    currency: string,
    dateStart: Date | null,
    dateEnd: Date | null
  ): Promise<LedgerEntryInterface[]> {
    const params = ParamsRemover.removeNullValuesFromObject({
      startDate: Client.getDateAsString(dateStart),
      endDate: Client.getDateAsString(dateEnd)
    });

    return this.createLedgerClient().getEntries(currency, params);
  }

  /**
   * Create a BitPay Bill.
   *
   * @param bill        A Bill object with request parameters defined.
   * @param facade      The facade used to create it.
   * @param signRequest Signed request.
   * @return BillInterface A BitPay generated Bill object.
   */
  public async createBill(bill: BillInterface, facade?: Facade, signRequest?: boolean): Promise<BillInterface> {
    if (facade === undefined) {
      facade = this.getFacadeBasedOnTokenContainer();
    }

    if (signRequest === undefined) {
      signRequest = Client.isSignRequest(facade);
    }

    return this.createBillClient().create(bill, facade, signRequest);
  }

  /**
   * Retrieve a BitPay bill by bill id using the specified facade.
   *
   * @param billId      The id of the bill to retrieve.
   * @param facade      The facade used to retrieve it.
   * @param signRequest Signed request.
   * @return BillInterface A BitPay Bill object.
   */
  public async getBill(billId: string, facade?: Facade, signRequest?: boolean): Promise<BillInterface> {
    if (facade === undefined) {
      facade = this.getFacadeBasedOnTokenContainer();
    }

    if (signRequest === undefined) {
      signRequest = Client.isSignRequest(facade);
    }

    return this.createBillClient().get(billId, facade, signRequest);
  }

  /**
   * Retrieve a collection of BitPay bills.
   *
   * @param status The status to filter the bills.
   * @return BillInterface A list of BitPay Bill objects.
   */
  public async getBills(status: string | null): Promise<BillInterface> {
    return this.createBillClient().getBills(status);
  }

  /**
   * Update a BitPay Bill.
   *
   * @param bill   A Bill object with the parameters to update defined.
   * @param billId The Id of the Bill to udpate.
   * @return BillInterface An updated Bill object.
   */
  public async updateBill(bill: BillInterface, billId: string): Promise<BillInterface> {
    return this.createBillClient().update(bill, billId);
  }

  /**
   * Deliver a BitPay Bill.
   *
   * @param billId    The id of the requested bill.
   * @param billToken The token of the requested bill.
   * @return Boolean A response status returned from the API.
   */
  public async deliverBill(billId: string, billToken: string): Promise<boolean> {
    const facade = this.getFacadeBasedOnTokenContainer();
    const signRequest = Client.isSignRequest(facade);

    return this.createBillClient().deliver(billId, billToken, signRequest);
  }

  /**
   * Retrieve all supported wallets.
   *
   * @return array A list of wallet objets.
   */
  public async getSupportedWallets(): Promise<WalletInterface[]> {
    return this.createWalletClient().getSupportedWallets();
  }

  /**
   * Retrieves a summary of the specified settlement.
   *
   * @param settlementId Settlement Id.
   * @return SettlementInterface A BitPay Settlement object.
   */
  public async getSettlement(settlementId: string): Promise<SettlementInterface> {
    return this.createSettlementClient().get(settlementId);
  }

  /**
   * Retrieves settlement reports for the calling merchant filtered by query.
   * The `limit` and `offset` parameters
   * specify pages for large query sets.
   * @params params Available params:
   * currency  The three digit currency string for the ledger to retrieve.
   * dateStart The start date for the query.
   * dateEnd   The end date for the query.
   * status    Can be `processing`, `completed`, or `failed`.
   * limit     Maximum number of settlements to retrieve.
   * offset    Offset for paging.
   * @return array A list of BitPay Settlement objects.
   */
  public async getSettlements(params = {}): Promise<SettlementInterface[]> {
    return this.createSettlementClient().getSettlements(params);
  }

  /**
   * Gets a detailed reconciliation report of the activity within the settlement period.
   * Required id and settlement token.
   *
   * @param settlementId Settlement ID.
   * @param token Settlement token.
   * @return SettlementInterface A detailed BitPay Settlement object.
   */
  public async getSettlementReconciliationReport(settlementId: string, token: string): Promise<SettlementInterface> {
    return this.createSettlementClient().getReconciliationReport(settlementId, token);
  }

  /**
   * Gets info for specific currency.
   *
   * @param currencyCode String Currency code for which the info will be retrieved.
   * @return CurrencyInterface Currency info.
   */
  public async getCurrencyInfo(currencyCode: string): Promise<CurrencyInterface> {
    return this.getCurrencyClient().getCurrencyInfo(currencyCode);
  }

  private getEcKeyByPrivateKey(privateKey: PrivateKey) {
    const value = privateKey.getValue();
    if (fs.existsSync(value)) {
      return this.keyUtils.load_keypair(fs.readFileSync(value).toString());
    }

    return this.keyUtils.load_keypair(Buffer.from(value).toString().trim());
  }

  private getEcKeyByConfig(envConfig: object) {
    const privateKeyPath = envConfig['PrivateKeyPath'].toString().replace('"', '');
    const keyHex = envConfig['PrivateKey'].toString().replace('"', '');

    if (fs.existsSync(privateKeyPath)) {
      return this.keyUtils.load_keypair(fs.readFileSync(privateKeyPath).toString());
    }

    if (keyHex) {
      return this.keyUtils.load_keypair(Buffer.from(keyHex).toString().trim());
    }

    throw new BitPayException(null, 'Missing ECKey');
  }

  private static getBaseUrl(environment: string) {
    return environment.toUpperCase() == Env.Test ? Env.TestUrl : Env.ProdUrl;
  }

  private getIdentity(ecKey: ec.KeyPair) {
    return this.keyUtils.getPublicKeyFromPrivateKey(ecKey);
  }

  private createRateClient() {
    return new RateClient(this.bitPayClient);
  }

  private getCurrencyClient() {
    return new CurrencyClient(this.bitPayClient);
  }

  private createInvoiceClient() {
    return new InvoiceClient(this.bitPayClient, this.tokenContainer, this.guidGenerator);
  }

  private createRefundClient() {
    return new RefundClient(this.bitPayClient, this.tokenContainer, this.guidGenerator);
  }

  private createPayoutRecipientClient() {
    return new PayoutRecipientClient(this.bitPayClient, this.tokenContainer, this.guidGenerator);
  }

  private createPayoutClient() {
    return new PayoutClient(this.bitPayClient, this.tokenContainer, this.guidGenerator);
  }

  private createLedgerClient() {
    return new LedgerClient(this.bitPayClient, this.tokenContainer);
  }

  private createBillClient() {
    return new BillClient(this.bitPayClient, this.tokenContainer);
  }

  private createWalletClient() {
    return new WalletClient(this.bitPayClient);
  }

  private createSettlementClient() {
    return new SettlementClient(this.bitPayClient, this.tokenContainer);
  }

  private getFacadeBasedOnTokenContainer(): Facade {
    if (this.tokenContainer.isTokenExist(Facade.Merchant)) {
      return Facade.Merchant;
    }

    return Facade.Pos;
  }

  private static isSignRequest(facade: Facade.Merchant | Facade.Payout | Facade.Pos): boolean {
    return facade !== Facade.Pos;
  }

  private static getDateAsString(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  private initByConfigFilePath(configFilePath: string): void {
    if (!fs.existsSync(configFilePath)) {
      throw new Exceptions.Generic(null, 'Configuration file not found');
    }

    try {
      const configObj = JSON.parse(fs.readFileSync(configFilePath, 'utf-8'))['BitPayConfiguration'];
      const environment = configObj['Environment'];
      const envConfig = configObj['EnvConfig'][environment];
      const tokens = envConfig['ApiTokens'];
      this.tokenContainer = new TokenContainer(tokens);
      const ecKey = this.getEcKeyByConfig(envConfig);
      this.bitPayClient = new BitPayClient(Client.getBaseUrl(environment), ecKey, this.getIdentity(ecKey));
      this.guidGenerator = new GuidGenerator();
    } catch (e) {
      throw new Exceptions.Generic(null, 'Error when reading configuration file', null, e.apiCode);
    }
  }

  private initForTests(bitPayClient: BitPayClient, guidGenerator: GuidGenerator, tokenContainer: TokenContainer) {
    this.bitPayClient = bitPayClient;
    this.guidGenerator = guidGenerator;
    this.tokenContainer = tokenContainer;
  }
}
