import { Client } from '../src';
import { Buyer } from '../src/Model/Invoice/Buyer';
import {
  Bill,
  PayoutRecipient,
  Payout,
  Invoice,
  InvoiceInterface,
  PayoutRecipientInterface,
  PayoutInterface,
  LedgerInterface,
  LedgerEntryInterface,
  BillInterface,
  PayoutRecipients,
  PayoutGroupInterface
} from '../src/Model';
import * as fs from 'fs';
import * as path from 'path';
import { InvoiceEventTokenInterface } from '../src/Model/Invoice/InvoiceEventToken';
import { Refund, RefundInterface } from '../src/Model/Invoice/Refund';
import { Item } from '../src/Model/Bill/Item';
import { WalletInterface } from '../src/Model/Wallet/Wallet';
import { CurrencyInterface } from '../src/Model/Currency/Currency';
import * as BitPaySDK from '../src/index';
import {rateInterfaceSchema} from "../src/Model/Rates/Rate.zod";
import {currencyInterfaceSchema} from "../src/Model/Currency/Currency.zod";
import {invoiceSchema} from "../src/Model/Invoice/Invoice.zod";
import {invoiceEventTokenInterfaceSchema} from "../src/Model/Invoice/InvoiceEventToken.zod";
import {refundInterfaceSchema} from "../src/Model/Invoice/Refund.zod";
import {payoutRecipientInterfaceSchema} from "../src/Model/Payout/PayoutRecipient.zod";
import {payoutInterfaceSchema} from "../src/Model/Payout/Payout.zod";
import {payoutGroupInterfaceSchema} from "../src/Model/Payout/PayoutGroup.zod";
import {ledgerInterfaceSchema} from "../src/Model/Ledger/Ledger.zod";
import {ledgerEntryInterfaceSchema} from "../src/Model/Ledger/LedgerEntry.zod";
import {billInterfaceSchema} from "../src/Model/Bill/Bill.zod";
import {walletInterfaceSchema} from "../src/Model/Wallet/Wallet.zod";
const Currencies = BitPaySDK.Currency;
const PayoutStatus = BitPaySDK.PayoutStatus;

let client;
let oneMonthAgo;
let tomorrow;

const exampleInvoice = function () {
  const invoice = new Invoice(10.0, 'USD');
  expect(invoice).toBeInstanceOf(Invoice);
  invoice.fullNotifications = true;
  invoice.extendedNotifications = true;
  invoice.transactionSpeed = 'medium';
  invoice.notificationURL = 'https://notification.url/aaa';
  invoice.notificationEmail = getEmail();
  invoice.itemDesc = 'Created by Nodejs integration tests';
  invoice.autoRedirect = true;
  invoice.forcedBuyerSelectedWallet = 'bitpay';

  const buyer = new Buyer();
  buyer.name = 'Marcin';
  buyer.address1 = 'SomeStreet';
  buyer.address2 = '911';
  buyer.locality = 'Washington';
  buyer.region = 'District of Columbia';
  buyer.postalCode = '20000';
  buyer.country = 'USA';
  buyer.email = 'buyer@buyeremaildomain.com';
  buyer.notify = true;

  invoice.buyer = buyer;

  return invoice;
};

const getEmail = function () {
  return fs.readFileSync(__dirname + path.sep + 'email.txt', 'utf8');
};

describe('BitPaySDK.Client', () => {
  beforeAll(() => {
    jest.setTimeout(20000); // browser takes a while
    const configFilePath = __dirname + '/BitPay.config.json';

    client = Client.createClientByConfig(configFilePath);
    oneMonthAgo = new Date();
    oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);

    tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
  });

  /**
   *     Tested wallet requests:
   *
   *     - GetSupportedWallets()
   */
  describe('Wallet', () => {
    it('should retrieve supported wallets', async () => {
      const result: WalletInterface[] = await client.getSupportedWallets();

      walletInterfaceSchema.parse(result[0]);
      expect(result.length).toBeGreaterThan(0);
    });
  });

  /**
   * Tested rates requests:
   * - GetRate(string baseCurrency, string currency)
   * - GetRates()
   * - GetRates(string currency)
   */
  describe('Rates', () => {
    it('should get rate', async () => {
      const result = await client.getRate('BCH', 'USD');
      expect(result.rate).toBeGreaterThan(0);
    });
    it('should get rates', async () => {
      const result = await client.getRates();

      rateInterfaceSchema.parse(result.getRates()[0]);
      expect(result.getRates()[0].rate).toBeGreaterThan(0);
    });
    it('should get BTC rates', async () => {
      const rates = await client.getRates(Currencies.BTC);

      rateInterfaceSchema.parse(rates.getRates()[0]);
      expect(rates.getRates().length).toBeGreaterThan(0);
    });
  });

  /**
   * Tested currency requests:
   * - GetCurrencyInfo(string currencyCode)
   */
  describe('Currency', () => {
    it('should get currency info', async () => {
      const result: CurrencyInterface = await client.getCurrencyInfo('BTC');

      currencyInterfaceSchema.parse(result);
      expect(result.name).toBe('Bitcoin');
    });
  });

  /**
   * Tested invoice requests:
   * - CreateInvoice
   * - GetInvoice
   * - GetInvoiceByGuid
   * - GetInvoices
   * - UpdateInvoice
   * - CancelInvoice
   * - GetInvoiceEventToken
   * <p>
   * Not tested requests:
   * - RequestInvoiceWebhookToBeResent
   */
  describe('Invoices', () => {
    let invoiceId;
    let invoiceToken;
    let invoiceGuid;

    it('should create invoice', async () => {
      const invoice: InvoiceInterface = await client.createInvoice(exampleInvoice());
      invoiceId = invoice.id;
      invoiceToken = invoice.token;
      invoiceGuid = invoice.guid;

      invoiceSchema.parse(invoice);
      expect(invoice.id).not.toBeNull();
      expect(invoice.token).not.toBeNull();
      expect(invoice.guid).not.toBeNull();
    });
    it('should get invoice by id', async () => {
      const invoice: InvoiceInterface = await client.getInvoice(invoiceId);

      invoiceSchema.parse(invoice);
      expect(invoice.id).toBe(invoiceId);
      expect(invoice.token).toBe(invoiceToken);
    });
    it('should get invoice by guid', async () => {
      const invoice: InvoiceInterface = await client.getInvoiceByGuid(invoiceGuid);

      invoiceSchema.parse(invoice);
      expect(invoice.id).toBe(invoiceId);
      expect(invoice.token).toBe(invoiceToken);
    });
    it('should get invoices', async () => {
      const params = {
        dateStart: oneMonthAgo.toISOString().split('T')[0],
        dateEnd: tomorrow.toISOString().split('T')[0]
      };
      const invoices: InvoiceInterface[] = await client.getInvoices(params);

      invoiceSchema.parse(invoices[0]);
      expect(invoices.length).toBeGreaterThan(0);
    });
    it('should get invoice event token', async () => {
      const invoiceEventToken: InvoiceEventTokenInterface = await client.getInvoiceEventToken(invoiceId);

      invoiceEventTokenInterfaceSchema.parse(invoiceEventToken);
      expect(invoiceEventToken.token).not.toBeNull();
    });
    it('should update invoice', async () => {
      const updatedEmail = 'updated@email.com';
      const params = { buyerEmail: updatedEmail };
      const updatedInvoice: InvoiceInterface = await client.updateInvoice(invoiceId, params);

      invoiceSchema.parse(updatedInvoice);
      expect(updatedInvoice.buyerProvidedEmail).toBe(updatedEmail);

      const getInvoiceAfterUpdate: InvoiceInterface = await client.getInvoice(invoiceId);

      invoiceSchema.parse(getInvoiceAfterUpdate);
      expect(getInvoiceAfterUpdate.buyerProvidedEmail).toBe(updatedEmail);
    });
    it('should cancel invoice', async () => {
      const cancelInvoice: InvoiceInterface = await client.cancelInvoice(invoiceId);
      expect(cancelInvoice.isCancelled).toBe(true);
    });
    it('should cancel invoice by guid', async () => {
      const invoice: InvoiceInterface = await client.createInvoice(exampleInvoice());
      const cancelInvoiceByGuid: InvoiceInterface = await client.cancelInvoiceByGuid(invoice.guid);
      expect(cancelInvoiceByGuid.isCancelled).toBe(true);
    });
  });

  /**
   * Tested refund requests:
   * <p>
   * - CreateRefund(Refund refundToCreate)
   * - GetRefund(string refundId)
   * - GetRefundByGuid(string guid)
   * - GetRefunds(string invoiceId)
   * - SendRefundNotification(string refundId)
   * - CancelRefund(string refundId)
   * - CancelRefundByGuid(string guid)
   * <p>
   * Not tested refund requests:
   * - UpdateRefund(string refundId, string status) / preview status limitation
   * - UpdateRefundByGuid(string guid, string status) / preview status limitation
   */
  describe('Refunds', () => {
    let invoiceId: string;
    let refundId: string;
    let refundGuid: string;

    it('should create refunds', async () => {
      const invoice: InvoiceInterface = await client.createInvoice(exampleInvoice());
      invoiceId = invoice.id as string;
      await client.payInvoice(invoiceId, 'complete');

      const refundToCreateRequest: RefundInterface = new Refund(10.0, invoiceId, 'token');
      const refund: RefundInterface = await client.createRefund(refundToCreateRequest);
      refundId = refund.id;
      refundGuid = refund.guid ?? "invalidGuid";

      refundInterfaceSchema.parse(refund);
      expect(refund.id).not.toBeNull();
    });

    it('should retrieve refund', async () => {
      const retrieveRefund: RefundInterface = await client.getRefund(refundId);

      refundInterfaceSchema.parse(retrieveRefund);
      expect(retrieveRefund.id).not.toBeNull();
      expect(retrieveRefund.invoice).not.toBeNull();
    });

    it('should retrieve refund by guid ', async () => {
      const retrieveRefund: RefundInterface = await client.getRefundByGuid(refundGuid);

      refundInterfaceSchema.parse(retrieveRefund);
      expect(retrieveRefund.id).not.toBeNull();
      expect(retrieveRefund.invoice).not.toBeNull();
    });

    it('should retrieve refunds', async () => {
      const result: RefundInterface[] = await client.getRefunds(invoiceId);

      refundInterfaceSchema.parse(result[0]);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should send refund notification', async () => {
      const result: boolean = await client.sendRefundNotification(refundId);
      expect(result).toBe(true);
    });

    it('should cancel refund', async () => {
      const result: RefundInterface = await client.cancelRefund(refundId);
      refundInterfaceSchema.parse(result);
      expect(result.status).toBe('canceled');

      const refundAfterCanceled: RefundInterface = await client.getRefund(refundId);
      refundInterfaceSchema.parse(refundAfterCanceled);
      expect(refundAfterCanceled.status).toBe('canceled');
    });

    it('should cancel refund by guid', async () => {
      const refundToCreateRequest: RefundInterface = new Refund(10.0, invoiceId, 'token');
      const refund: RefundInterface = await client.createRefund(refundToCreateRequest);

      const result: RefundInterface = await client.cancelRefundByGuid(refund.guid);
      expect(result.status).toBe('canceled');
      refundInterfaceSchema.parse(result);

      const refundAfterCanceled: RefundInterface = await client.getRefundByGuid(refund.guid);
      expect(refundAfterCanceled.status).toBe('canceled');
      refundInterfaceSchema.parse(refundAfterCanceled);
    });
  });

  /**
   * Tested recipient requests:
   * - SubmitPayoutRecipients(PayoutRecipients recipients)
   * - GetPayoutRecipient(string recipientId)
   * - GetPayoutRecipients(string status, int limit, int offset)
   * - UpdatePayoutRecipient(string recipientId, PayoutRecipient recipient)
   * - DeletePayoutRecipient(string recipientId)
   * - RequestPayoutRecipientNotification(string recipientId)
   */
  describe('Recipients', () => {
    const email = 'bob@email.com';
    let recipientId: string;

    it('should create recipient', async () => {
      const recipientsList: PayoutRecipient[] = [];
      const requestedRecipient: PayoutRecipient = new PayoutRecipient(email, 'Bob', null);
      recipientsList.push(requestedRecipient);

      const result: PayoutRecipientInterface[] = await client.submitPayoutRecipients(
        new PayoutRecipients(recipientsList)
      );
      recipientId = result[0].id as string;

      payoutRecipientInterfaceSchema.parse(result[0]);
      expect(recipientId).not.toBeNull();
    });

    it('should retrieve recipient', async () => {
      const result: PayoutRecipientInterface = await client.getPayoutRecipient(recipientId);

      payoutRecipientInterfaceSchema.parse(result)
      expect(result.email).toBe(email);
    });

    it('should retrieve recipients by status', async () => {
      const result: PayoutRecipientInterface[] = await client.getPayoutRecipients({
        status: 'invited',
        limit: 1,
        offset: 0
      });

      payoutRecipientInterfaceSchema.parse(result[0]);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should update recipient', async () => {
      const updatedLabel = 'updatedLabel';
      const updateRecipientRequest = new PayoutRecipient(null, null, null);
      updateRecipientRequest.label = updatedLabel;
      const result: PayoutRecipientInterface = await client.updatePayoutRecipient(recipientId, updateRecipientRequest);

      payoutRecipientInterfaceSchema.parse(result);
      expect(result.label).toBe(updatedLabel);
    });

    it('should request recipient notification', async () => {
      const result: boolean = await client.requestPayoutRecipientNotification(recipientId);

      expect(result).toBe(true);
    });

    it('should delete recipient', async () => {
      const result: boolean = await client.deletePayoutRecipient(recipientId);

      expect(result).toBe(true);
    });
  });

  describe('Payout', () => {
    let payoutId: string;
    let payoutGroupId: string | null;

    it('should submit payout', async () => {
      const recipientsList: PayoutRecipient[] = [];
      const payoutEmail = getEmail();
      const requestedRecipient: PayoutRecipient = new PayoutRecipient(payoutEmail, 'Bob', null);
      recipientsList.push(requestedRecipient);

      const recipients: PayoutRecipientInterface[] = await client.submitPayoutRecipients(
        new PayoutRecipients(recipientsList)
      );
      const payoutRecipientId = recipients[0].id;

      const payout = new Payout(10.0, 'USD', 'USD');
      payout.recipientId = payoutRecipientId;
      payout.notificationEmail = payoutEmail;
      payout.reference = 'Nodejs Integration Test';
      payout.notificationURL = 'https://somenotiticationURL.com';

      const result: PayoutInterface = await client.submitPayout(payout);
      payoutId = result.id as string;

      payoutInterfaceSchema.parse(result);
      expect(result.id).not.toBeNull();
    });

    it('should retrieve payout', async () => {
      const result: PayoutInterface = await client.getPayout(payoutId);

      payoutInterfaceSchema.parse(result);
      expect(result.email).toBe(getEmail());
    });

    it('should retrieve payouts', async () => {
      const params = { status: PayoutStatus.New };
      const result: PayoutInterface[] = await client.getPayouts(params);

      payoutInterfaceSchema.parse(result[0]);
      expect(result[0].email).toBe(getEmail());
    });

    it('should send request payout notification', async () => {
      const result: boolean = await client.requestPayoutNotification(payoutId);
      expect(result).toBe(true);
    });

    it('should cancel payout', async () => {
      const result: boolean = await client.cancelPayout(payoutId);
      expect(result).toBe(true);
    });

    it('should create payout groups', async () => {
      // given
      const recipientsList: PayoutRecipient[] = [];
      const payoutEmail = getEmail();
      const requestedRecipient: PayoutRecipient = new PayoutRecipient(payoutEmail, 'Bob', null);
      recipientsList.push(requestedRecipient);

      const recipients: PayoutRecipientInterface[] = await client.submitPayoutRecipients(
        new PayoutRecipients(recipientsList)
      );
      const payoutRecipientId = recipients[0].id;
      const notificationURL = 'https://somenotiticationURL.com';
      const reference = 'Nodejs Integration Test';

      const payout = new Payout(10.0, 'USD', 'USD');
      payout.recipientId = payoutRecipientId;
      payout.notificationEmail = payoutEmail;
      payout.reference = reference;
      payout.notificationURL = notificationURL;

      // when
      const result: PayoutGroupInterface = await client.submitPayouts([payout]);
      const firstPayout = result.payouts[0];
      payoutGroupId = firstPayout.groupId ?? null;

      // then
      payoutGroupInterfaceSchema.parse(result);
      payoutInterfaceSchema.parse(firstPayout);
      expect(result.payouts.length).toBe(1);
      expect(firstPayout.notificationURL).toBe(notificationURL);
      expect(firstPayout.reference).toBe(reference);
    });

    it('should cancel payout groups', async () => {
      // when
      const result: PayoutGroupInterface = await client.cancelPayouts(payoutGroupId);
      // then
      payoutGroupInterfaceSchema.parse(result);
      expect(result.payouts.length).toBe(1);
      expect(result.payouts[0].status).toBe('cancelled');
    });
  });

  /**
   * Create payments before start it.
   * <p>
   * Tested ledgers requests:
   * - GetLedgers()
   * - GetLedgerEntries(string currency)
   */
  describe('Ledgers', () => {
    it('should get ledgers', async () => {
      const result: LedgerInterface[] = await client.getLedgers();

      ledgerInterfaceSchema.parse(result[0]);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should get ledger entries', async () => {
      const result: LedgerEntryInterface[] = await client.getLedgerEntries('USD', oneMonthAgo, tomorrow);

      ledgerEntryInterfaceSchema.parse(result[0]);
      expect(result.length).toBeGreaterThan(0);
    });
  });

  /**
   *     Tested bills requests:
   *     - CreateBill(Bill bill)
   *     - GetBill(string billId)
   *     - GetBills(string status)
   *     - UpdateBill(Bill bill, string billId)
   *     - DeliverBill(string billId, string billToken)
   */
  describe('Bill', () => {
    let billId: string;
    let billToken: string;

    it('should create bill', async () => {
      const item1 = new Item();
      item1.quantity = 1;
      item1.description = 'Test Item 1';
      item1.price = 10.0;
      const requestedBill: BillInterface = new Bill('bill1234-ABCD', 'USD', 'john@doe.com', [item1]);
      requestedBill.name = 'John Doe';
      requestedBill.address1 = '2630 Hegal Place';
      requestedBill.address2 = 'Apt 42';
      requestedBill.city = 'Alexandria';
      requestedBill.state = 'VA';
      requestedBill.zip = '23242';
      requestedBill.country = 'US';
      requestedBill.phone = '555-123-456';
      requestedBill.dueDate = '2021-5-31';
      requestedBill.passProcessingFee = true;
      requestedBill.items = [item1];

      const result: BillInterface = await client.createBill(requestedBill);

      billInterfaceSchema.parse(result);
      expect(result.id).not.toBeNull();
      billId = result.id as string;
      billToken = result.token as string;
    });

    it('should retrieve bill', async () => {
      const result: BillInterface = await client.getBill(billId);

      billInterfaceSchema.parse(result);
      expect(result.name).toBe('John Doe');
    });

    it('should retrieve bills', async () => {
      const result: BillInterface[] = await client.getBills(null);

      billInterfaceSchema.parse(result[0]);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should updated bill', async () => {
      const itemUpdated = new Item();
      itemUpdated.description = 'Test Item Updated';
      itemUpdated.price = 9.0;
      itemUpdated.quantity = 1;

      const updatedBillRequest = new Bill('bill1234-ABCD', 'USD', 'john@doe.com', [itemUpdated]);
      updatedBillRequest.token = billToken;

      const result: BillInterface = await client.updateBill(updatedBillRequest, billId);

      billInterfaceSchema.parse(result);
      expect(result.items[0].price).toBe(9.0);
    });

    it('should deliver bill', async () => {
      const result: string = await client.deliverBill(billId, billToken);
      expect(result).toBe(true);
    });
  });
});
