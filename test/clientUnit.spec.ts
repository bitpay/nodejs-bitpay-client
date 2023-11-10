import { Client, Facade } from '../src';
import { Buyer } from '../src/Model/Invoice/Buyer';
import {
  Bill,
  BillInterface,
  Invoice,
  Payout,
  PayoutGroupInterface,
  PayoutRecipient,
  PayoutRecipients,
  RateInterface,
  Rates
} from '../src/Model';
import { Refund } from '../src/Model/Invoice/Refund';
import { Item } from '../src/Model/Bill/Item';
import { BitPayClient } from '../src/Client/BitPayClient';
import { DefaultBodyType, PathParams, rest, RestRequest } from 'msw';
import { setupServer } from 'msw/node';
import { TokenContainer } from '../src/TokenContainer';
import { GuidGenerator } from '../src/util/GuidGenerator';
import { InvoiceBuyerProvidedInfo } from '../src/Model/Invoice/InvoiceBuyerProvidedInfo';
import * as createBillRequestMock from './json/createBillRequest.json';
import * as createBillResponseMock from './json/createBillResponse.json';
import * as getBillsResponseMock from './json/getBillsResponse.json';
import * as updateBillRequestMock from './json/updateBillRequest.json';
import * as updateBillResponseMock from './json/updateBillResponse.json';
import * as deliverBillRequestMock from './json/deliverBillRequest.json';
import * as deliverBillResponseMock from './json/deliverBillResponse.json';
import * as errorResponse from './json/errorResponse.json';
import * as getCurrenciesResponseMock from './json/getCurrenciesResponse.json';
import * as createInvoiceRequestMock from './json/createInvoiceRequest.json';
import * as createInvoiceResponseMcok from './json/createInvoiceResponse.json';
import * as getInvoiceResponseMock from './json/getInvoiceResponse.json';
import * as getInvoicesResponseMock from './json/getInvoicesResponse.json';
import * as payInvoiceRequestMock from './json/payInvoiceRequest.json';
import * as payInvoiceResponseMock from './json/payInvoiceResponse.json';
import * as cancelInvoiceSuccessResponseMock from './json/cancelInvoiceSuccessResponse.json';
import * as invoiceWebhookResponseMock from './json/invoiceWebhookResponse.json';
import * as getInvoiceEventTokenMock from './json/getInvoiceEventToken.json';
import * as getLedgerEntriesResponseMock from './json/getLedgerEntriesResponse.json';
import * as getLedgersResponseMock from './json/getLedgersResponse.json';
import * as createPayoutRequestMock from './json/createPayoutRequest.json';
import * as createPayoutResponseMock from './json/createPayoutResponse.json';
import * as createPayoutGroupRequestMock from './json/createPayoutGroupRequest.json';
import * as createPayoutGroupResponseMock from './json/createPayoutGroupResponse.json';
import * as getPayoutResponseMock from './json/getPayoutResponse.json';
import * as getPayoutsResponseMock from './json/getPayoutsResponse.json';
import * as cancelPayoutResponseMock from './json/cancelPayoutResponse.json';
import * as cancelPayoutGroupResponseMock from './json/cancelPayoutGroupResponse.json';
import * as sendPayoutNotificationRequestMock from './json/sendPayoutNotificationRequest.json';
import * as sendPayoutNotificationResponseMock from './json/sendPayoutNotificationResponse.json';
import * as submitPayoutRecipientsRequestMock from './json/submitPayoutRecipientsRequest.json';
import * as submitPayoutRecipientsResponseMock from './json/submitPayoutRecipientsResponse.json';
import * as getPayoutRecipientsResponseMock from './json/getPayoutRecipientsResponse.json';
import * as getPayoutRecipientResponseMock from './json/getPayoutRecipientResponse.json';
import * as updatePayoutRecipientResponseMock from './json/updatePayoutRecipientResponse.json';
import * as deletePayoutRecipientResponseMock from './json/deletePayoutRecipientResponse.json';
import * as getRateResponseMock from './json/getRateResponse.json';
import * as getRatesResponseMock from './json/getRatesResponse.json';
import * as createRefundResponseMock from './json/createRefundResponse.json';
import * as updateRefundRequestMock from './json/updateRefundRequest.json';
import * as updateRefundResponseMock from './json/updateRefundResponse.json';
import * as sendRefundNotificationRequestMock from './json/sendRefundNotificationRequest.json';
import * as sendRefundNotificationResponseMock from './json/sendRefundNotificationResponse.json';
import * as cancelRefundResponseMock from './json/cancelRefundResponse.json';
import * as getSettlementsResponseMock from './json/getSettlementsResponse.json';
import * as getSettlementResponseMock from './json/getSettlementResponse.json';
import * as getSettlementReconciliationReportResponseMock from './json/getSettlementReconciliationReportResponse.json';
import * as getSupportedWalletsMock from './json/getSupportedWallets.json';
import * as invalidSignature from './json/invalidSignature.json';

import { isEqual } from 'lodash';
import * as BitPaySDK from '../src/index';
import BitPayApiException from '../src/Exceptions/BitPayApiException';

let client;
let oneMonthAgo;
let tomorrow;

const keyUtils = new BitPaySDK.KeyUtils();
const host = 'http://localhost';
const server = setupServer();
const merchantToken = 'someMerchantToken';
const payoutToken = 'somePayoutToken';
const exampleUuid = 'ee26b5e0-9185-493e-bc12-e846d5fcf07c';

function validateSignatureRequest(req: RestRequest<DefaultBodyType, PathParams<string>>) {
  if (req.headers.get('x-identity') !== 'someIdentity') {
    throw new Error('Wrong identity');
  }

  if (!req.headers.has('x-signature')) {
    throw new Error('Missing signature');
  }
}

describe('BitPaySDK.Client', () => {
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  beforeAll(() => {
    server.listen();

    const hexPrivate = '2f72ed3291b536aa43d750829875f5a742a0f1095b8ad529944cbc0bd498693f';
    const ecKey = keyUtils.load_keypair(hexPrivate);
    const bpc = new BitPayClient(host + '/', ecKey, 'someIdentity');
    const tokenContainer = new TokenContainer();
    tokenContainer.addMerchant(merchantToken);
    tokenContainer.addPayout(payoutToken);

    const guidGenerator = new GuidGenerator();
    jest.spyOn(GuidGenerator.prototype, 'execute').mockImplementation(() => {
      return exampleUuid;
    });

    client = new Client(null, null, tokenContainer, null, null, undefined, bpc, guidGenerator);
    oneMonthAgo = new Date();
    oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);

    tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
  });

  function validateRequest(jsonRequest: string, requestExpectedBody) {
    if (!isEqual(requestExpectedBody, jsonRequest)) {
      throw new Error('Incorrect request body.');
    }
  }

  function validateMerchantTokenInUrl(req: RestRequest) {
    const token = req.url.searchParams.get('token');
    if (token !== merchantToken) {
      throw new Error('Missing/wrong token');
    }
  }

  function validatePayoutTokenInUrl(req: RestRequest) {
    const token = req.url.searchParams.get('token');
    if (token !== payoutToken) {
      throw new Error('Missing/wrong token');
    }
  }

  function validateMerchantTokenInFormData(requestObject) {
    const token = requestObject.token;
    if (token !== merchantToken) {
      throw new Error('Missing/wrong token');
    }
  }

  function validatePayoutTokenInFormData(requestObject) {
    const token = requestObject.token;
    if (token !== payoutToken) {
      throw new Error('Missing/wrong token');
    }
  }

  describe('Init application', () => {
    it('should create POS client', async () => {
      const posTokenValue = 'posToken';
      const client = Client.createPosClient(posTokenValue);

      expect(client.getToken(Facade.Pos)).toBe(posTokenValue);
    });

    it('should create client by private key', async () => {
      const tokenContainer = new TokenContainer();
      const token = 'anotherMerchantToken';
      tokenContainer.addMerchant(token);

      const client = Client.createClientByPrivateKey(
        '9ee267c293e74c12bf4035746834ad4f5690d546d7d10e15c92fc83043552186',
        tokenContainer
      );

      expect(client.getToken(Facade.Merchant)).toBe(token);
    });

    it('should create client by config file', async () => {
      const client = Client.createClientByConfig(__dirname + '/BitPayUnit.config.json');
      expect(client.getToken(Facade.Pos)).toBe('somePosToken');
    });
  });

  describe('Exceptions', () => {
    const hexPrivate = '2f72ed3291b536aa43d750829875f5a742a0f1095b8ad529944cbc0bd498693g';
    const ecKey = keyUtils.load_keypair(hexPrivate);
    const tokenContainer = new TokenContainer();
    tokenContainer.addMerchant(merchantToken);
    tokenContainer.addPayout(payoutToken);

    const client = new Client(
      null,
      null,
      tokenContainer,
      null,
      null,
      undefined,
      new BitPayClient(host + '/', ecKey, 'someIdentity'),
      null
    );

    it('should throws BitPayException for invalid signature', async () => {
      server.use(
        rest.get(host + '/invoices/1234', async (req, res, ctx) => {
          validateSignatureRequest(req);
          validateMerchantTokenInUrl(req);

          return res(ctx.status(200), ctx.json(invalidSignature));
        })
      );

      await expect(client.getInvoice('1234')).rejects.toBeInstanceOf(BitPayApiException);
      await expect(client.getInvoice('1234')).rejects.toEqual({
        code: '000000',
        message: 'Invalid signature',
        name: 'BITPAY-EXCEPTION'
      });
    });
    it('should throws BitPayException for error response', async () => {
      server.use(
        rest.post(host + '/payouts', async (req, res, ctx) => {
          return res(ctx.status(200), ctx.json(errorResponse));
        })
      );

      const payout: Payout = new Payout(10.0, 'USD', 'USD');
      await expect(client.submitPayout(payout)).rejects.toBeInstanceOf(BitPayApiException);
      await expect(client.submitPayout(payout)).rejects.toEqual({
        code: '0000',
        message: '["Currency disabled for user location."]',
        name: 'BITPAY-EXCEPTION'
      });
    });
  });

  describe('Bill', () => {
    function getBill() {
      const item1 = new Item();
      const item2 = new Item();
      item1.description = 'Test Item 1';
      item1.price = 6.0;
      item1.quantity = 1;
      item2.description = 'Test Item 2';
      item2.price = 4.0;
      item2.quantity = 1;

      const bill: BillInterface = new Bill('bill1234-ABCD', 'USD', 'john@doe.com', [item1]);
      bill.name = 'John Doe';
      bill.address1 = '2630 Hegal Place';
      bill.address2 = 'Apt 42';
      bill.city = 'Alexandria';
      bill.state = 'VA';
      bill.zip = '23242';
      bill.country = 'US';
      bill.phone = '555-123-456';
      bill.dueDate = '2021-5-31';
      bill.passProcessingFee = true;
      bill.items = [item1, item2];
      bill.token = merchantToken;
      bill.cc = ['jane@doe.com'];

      return bill;
    }

    it('should create Bill', async () => {
      server.use(
        rest.post(host + '/bills', async (req, res, ctx) => {
          validateSignatureRequest(req);
          const request = await req.json();
          validateRequest(request, createBillRequestMock);

          return res(ctx.status(200), ctx.json(createBillResponseMock));
        })
      );

      const result = await client.createBill(getBill(), Facade.Merchant, true);
      expect(result.token).toBe('6EBQR37MgDJPfEiLY3jtRq7eTP2aodR5V5wmXyyZhru5FM5yF4RCGKYQtnT7nhwHjA');
      expect(result.items[0].id).toBe('NV35GRWtrdB2cmGEjY4LKY');
    });

    it('should return Bill', async () => {
      server.use(
        rest.get(host + '/bills/3Zpmji8bRKxWJo2NJbWX5H', async (req, res, ctx) => {
          validateMerchantTokenInUrl(req);
          validateSignatureRequest(req);

          return res(ctx.status(200), ctx.json(createBillResponseMock));
        })
      );

      const result = await client.getBill('3Zpmji8bRKxWJo2NJbWX5H', Facade.Merchant, true);
      expect(result.id).toBe('3Zpmji8bRKxWJo2NJbWX5H');
      expect(result.token).toBe('6EBQR37MgDJPfEiLY3jtRq7eTP2aodR5V5wmXyyZhru5FM5yF4RCGKYQtnT7nhwHjA');
      expect(result.merchant).toBe('7HyKWn3d4xdhAMQYAEVxVq');
      expect(result.items[0].id).toBe('NV35GRWtrdB2cmGEjY4LKY');
    });

    it('should return Bills', async () => {
      server.use(
        rest.get(host + '/bills', async (req, res, ctx) => {
          validateMerchantTokenInUrl(req);
          validateSignatureRequest(req);

          return res(ctx.status(200), ctx.json(getBillsResponseMock));
        })
      );

      const result = await client.getBills();

      expect(result[0].id).toBe('X6KJbe9RxAGWNReCwd1xRw');
      expect(result[0].token).toBe('6EBQR37MgDJPfEiLY3jtRqBMYLg8XSDqhp2kp7VSDqCMHGHnsw4bqnnwQmtehzCvSo');
      expect(result.length).toBe(2);
    });

    it('should return Bills by status', async () => {
      server.use(
        rest.get(host + '/bills', async (req, res, ctx) => {
          validateMerchantTokenInUrl(req);
          validateSignatureRequest(req);

          const token = req.url.searchParams.get('status');
          if (token !== 'draft') {
            throw new Error('Wrong parameter');
          }

          return res(ctx.status(200), ctx.json(getBillsResponseMock));
        })
      );

      const result = await client.getBills('draft');

      expect(result[0].id).toBe('X6KJbe9RxAGWNReCwd1xRw');
      expect(result[0].token).toBe('6EBQR37MgDJPfEiLY3jtRqBMYLg8XSDqhp2kp7VSDqCMHGHnsw4bqnnwQmtehzCvSo');
      expect(result.length).toBe(2);
    });

    it('should update Bill', async () => {
      server.use(
        rest.put(host + '/bills/3Zpmji8bRKxWJo2NJbWX5H', async (req, res, ctx) => {
          const request = await req.json();
          validateSignatureRequest(req);
          validateMerchantTokenInFormData(request);
          validateRequest(request, updateBillRequestMock);

          return res(ctx.status(200), ctx.json(updateBillResponseMock));
        })
      );

      const bill = getBill();
      bill.status = 'draft';
      const item = new Item();
      item.description = 'Test Item 3';
      item.price = 5.0;
      item.quantity = 1;
      const items: Array<Item> = bill.items;
      items.push(item);

      const result = await client.updateBill(bill, '3Zpmji8bRKxWJo2NJbWX5H');

      expect(result.status).toBe('draft');
      expect(result.items.length).toBe(3);
      expect(result.items[2].price).toBe(5);
    });

    it('should deliver Bill', async () => {
      const token = '6EBQR37MgDJPfEiLY3jtRq7eTP2aodR5V5wmXyyZhru5FM5yF4RCGKYQtnT7nhwHjA';

      server.use(
        rest.post(host + '/bills/3Zpmji8bRKxWJo2NJbWX5H/deliveries', async (req, res, ctx) => {
          const request = await req.json();

          if (request.token !== token) {
            throw new Error('Wrong token');
          }

          validateSignatureRequest(req);
          validateRequest(request, deliverBillRequestMock);

          return res(ctx.status(200), ctx.json(deliverBillResponseMock));
        })
      );

      const result = await client.deliverBill('3Zpmji8bRKxWJo2NJbWX5H', token);

      expect(result).toBe(true);
    });
  });

  describe('Currency', () => {
    it('should get currency info', async () => {
      server.use(
        rest.get(host + '/currencies', (_req, res, ctx) => {
          return res(ctx.status(200), ctx.json(getCurrenciesResponseMock));
        })
      );

      const results = await client.getCurrencyInfo('USD');
      expect(results.code).toBe('USD');
      expect(results.symbol).toBe('$');
      expect(results.name).toBe('US Dollar');
      expect(results.minimum).toBe(0.01);
    });
  });

  describe('Invoice', () => {
    function getInvoiceExample() {
      const invoice = new Invoice(10, 'USD');
      invoice.orderId = exampleUuid;
      invoice.fullNotifications = true;
      invoice.extendedNotifications = true;
      invoice.transactionSpeed = 'medium';
      invoice.notificationURL = 'https://notification.url/aaa';
      invoice.itemDesc = 'Example';
      invoice.notificationEmail = 'notification@email.com';
      invoice.autoRedirect = true;
      invoice.forcedBuyerSelectedWallet = 'bitpay';
      invoice.forcedBuyerSelectedTransactionCurrency = null;
      const buyerData = new Buyer();
      buyerData.name = 'Marcin';
      buyerData.address1 = 'SomeStreet';
      buyerData.address2 = '911';
      buyerData.locality = 'Washington';
      buyerData.region = 'District of Columbia';
      buyerData.postalCode = '20000';
      buyerData.country = 'USA';
      buyerData.email = 'buyer@buyeremaildomain.com';
      buyerData.notify = true;
      invoice.buyer = buyerData;
      invoice.buyerProvidedInfo = <InvoiceBuyerProvidedInfo>{
        emailAddress: 'john@doe.com',
        selectedWallet: 'bitpay',
        selectedTransactionCurrency: 'BTC'
      };

      return invoice;
    }

    it('should create invoice', async () => {
      server.use(
        rest.post(host + '/invoices', async (req, res, ctx) => {
          const request = await req.json();

          validateSignatureRequest(req);
          validateMerchantTokenInFormData(request);
          validateRequest(request, createInvoiceRequestMock);

          return res(ctx.status(200), ctx.json(createInvoiceResponseMcok));
        })
      );

      const result = await client.createInvoice(getInvoiceExample(), Facade.Merchant, true);
      expect(result.id).toBe('G3viJEJgE8Jk2oekSdgT2A');
      expect(result.url).toBe('https://bitpay.com/invoice?id=G3viJEJgE8Jk2oekSdgT2A');
      expect(result.buyerProvidedInfo.emailAddress).toBe('john@doe.com');
      expect(result.universalCodes.paymentString).toBe('https://link.bitpay.com/i/G3viJEJgE8Jk2oekSdgT2A');
    });

    it('should get invoice', async () => {
      server.use(
        rest.get(host + '/invoices/G3viJEJgE8Jk2oekSdgT2A', async (req, res, ctx) => {
          validateSignatureRequest(req);
          validateMerchantTokenInUrl(req);

          return res(ctx.status(200), ctx.json(getInvoiceResponseMock));
        })
      );

      const results = await client.getInvoice('G3viJEJgE8Jk2oekSdgT2A');

      expect(results.id).toBe('G3viJEJgE8Jk2oekSdgT2A');
      expect(results.url).toBe('https://bitpay.com/invoice?id=G3viJEJgE8Jk2oekSdgT2A');
    });

    it('should get invoice by guid', async () => {
      server.use(
        rest.get(host + '/invoices/guid/payment1234', async (req, res, ctx) => {
          validateSignatureRequest(req);
          validateMerchantTokenInUrl(req);

          return res(ctx.status(200), ctx.json(getInvoiceResponseMock));
        })
      );

      const results = await client.getInvoiceByGuid('payment1234');
      expect(results.id).toBe('G3viJEJgE8Jk2oekSdgT2A');
    });

    it('should get invoices', async () => {
      server.use(
        rest.get(host + '/invoices', async (req, res, ctx) => {
          validateSignatureRequest(req);
          validateMerchantTokenInUrl(req);

          const dateStart = req.url.searchParams.get('dateStart');
          const dateEnd = req.url.searchParams.get('dateEnd');
          const status = req.url.searchParams.get('status');

          if (dateStart !== '2021-05-10' || dateEnd !== '2021-05-12' || status !== 'complete') {
            throw new Error('Wrong parameters');
          }

          return res(ctx.status(200), ctx.json(getInvoicesResponseMock));
        })
      );

      const params = {
        dateStart: '2021-05-10',
        dateEnd: '2021-05-12',
        status: 'complete'
      };

      const results = await client.getInvoices(params);
      expect(results.length).toBe(2);
    });

    it('should pay invoice', async () => {
      server.use(
        rest.put(host + '/invoices/pay/G3viJEJgE8Jk2oekSdgT2A', async (req, res, ctx) => {
          validateSignatureRequest(req);
          const requestJson = await req.json();
          validateMerchantTokenInFormData(requestJson);
          validateRequest(requestJson, payInvoiceRequestMock);

          return res(ctx.status(200), ctx.json(payInvoiceResponseMock));
        })
      );

      const result = await client.payInvoice('G3viJEJgE8Jk2oekSdgT2A', 'complete');
      expect(result.token).toBe('AShhrUJ2sEJ4stEzkt5AywcrDDE5A3SpeXsXdbU1TMVo');
    });

    it('should cancel invoice', async () => {
      server.use(
        rest.delete(host + '/invoices/Hpqc63wvE1ZjzeeH4kEycF', async (req, res, ctx) => {
          validateSignatureRequest(req);
          validateMerchantTokenInUrl(req);

          return res(ctx.status(200), ctx.json(cancelInvoiceSuccessResponseMock));
        })
      );

      const result = await client.cancelInvoice('Hpqc63wvE1ZjzeeH4kEycF');
      expect(result.orderId).toBe('20210511_fghij');
    });

    it('should cancel invoice by guid', async () => {
      server.use(
        rest.delete(host + '/invoices/guid/payment1234', async (req, res, ctx) => {
          validateSignatureRequest(req);
          validateMerchantTokenInUrl(req);

          return res(ctx.status(200), ctx.json(cancelInvoiceSuccessResponseMock));
        })
      );

      const result = await client.cancelInvoiceByGuid('payment1234');
      expect(result.orderId).toBe('20210511_fghij');
    });

    it('should send invoice webhook to be resent', async () => {
      server.use(
        rest.post(host + '/invoices/Hpqc63wvE1ZjzeeH4kEycF/notifications', async (req, res, ctx) => {
          const response = await req.json();
          validateMerchantTokenInFormData(response);
          validateSignatureRequest(req);

          return res(ctx.status(200), ctx.json(invoiceWebhookResponseMock));
        })
      );

      const result = await client.requestInvoiceWebhookToBeResent('Hpqc63wvE1ZjzeeH4kEycF');
      expect(result).toBe(true);
    });

    it('should retrieve an invoice event token', async () => {
      server.use(
        rest.get(host + '/invoices/GZRP3zgNHTDf8F5BmdChKz/events', async (req, res, ctx) => {
          validateSignatureRequest(req);
          validateMerchantTokenInUrl(req);

          return res(ctx.status(200), ctx.json(getInvoiceEventTokenMock));
        })
      );

      const results = await client.getInvoiceEventToken('GZRP3zgNHTDf8F5BmdChKz');
      expect(results.token).toBe('4MuqDPt93i9Xbf8SnAPniwbGeNLW8A3ScgAmukFMgFUFRqTLuuhVdAFfePPysVqL2P');
    });
  });

  describe('Ledgers', () => {
    it('should get ledger entries', async () => {
      server.use(
        rest.get(host + '/ledgers/USD', async (req, res, ctx) => {
          validateSignatureRequest(req);
          validateMerchantTokenInUrl(req);

          const dateStart = req.url.searchParams.get('startDate');
          const dateEnd = req.url.searchParams.get('endDate');

          if (dateStart !== '2021-05-10' || dateEnd !== '2021-05-31') {
            throw new Error('Wrong parameters');
          }

          return res(ctx.status(200), ctx.json(getLedgerEntriesResponseMock));
        })
      );

      const results = await client.getLedgerEntries(
        'USD',
        new Date('2021-05-10T03:24:00'),
        new Date('2021-05-31T03:24:00')
      );

      expect(results.length).toBe(3);
      expect(results[1].code).toBe(1023);
      expect(results[1].invoiceId).toBe('Hpqc63wvE1ZjzeeH4kEycF');
    });

    it('should get ledgers', async () => {
      server.use(
        rest.get(host + '/ledgers', async (req, res, ctx) => {
          validateSignatureRequest(req);
          validateMerchantTokenInUrl(req);

          return res(ctx.status(200), ctx.json(getLedgersResponseMock));
        })
      );

      const results = await client.getLedgers();

      expect(results.length).toBe(3);
      expect(results[0].currency).toBe('EUR');
      expect(results[1].currency).toBe('USD');
      expect(results[2].currency).toBe('BTC');
      expect(results[1].balance).toBe(2389.82);
    });
  });

  describe('Payout', () => {
    it('should submit payout', async () => {
      server.use(
        rest.post(host + '/payouts', async (req, res, ctx) => {
          validateSignatureRequest(req);

          const response = await req.json();
          validateRequest(response, createPayoutRequestMock);

          return res(ctx.status(200), ctx.json(createPayoutResponseMock));
        })
      );

      const payout = new Payout(10, 'USD', 'GBP');
      payout.token = payoutToken;
      payout.reference = 'payout_20210527';
      payout.notificationEmail = 'merchant@email.com';
      payout.notificationURL = 'https://yournotiticationURL.com/wed3sa0wx1rz5bg0bv97851eqx';
      payout.email = 'john@doe.com';
      payout.label = 'John Doe';

      const results = await client.submitPayout(payout);

      expect(results.status).toBe('new');
      expect(results.token).toBe('6RZSTPtnzEaroAe2X4YijenRiqteRDNvzbT8NjtcHjUVd9FUFwa7dsX8RFgRDDC5SL');
      expect(results.email).toBe('john@doe.com');
    });

    it('should get payout', async () => {
      server.use(
        rest.get(host + '/payouts/JMwv8wQCXANoU2ZZQ9a9GH', async (req, res, ctx) => {
          validateSignatureRequest(req);
          validatePayoutTokenInUrl(req);

          return res(ctx.status(200), ctx.json(getPayoutResponseMock));
        })
      );

      const results = await client.getPayout('JMwv8wQCXANoU2ZZQ9a9GH');

      expect(results.status).toBe('complete');
      expect(results.token).toBe('6RZSTPtnzEaroAe2X4YijenRiqteRDNvzbT8NjtcHjUVd9FUFwa7dsX8RFgRDDC5SL');
      expect(results.email).toBe('john@doe.com');
    });

    it('should get payouts', async () => {
      server.use(
        rest.get(host + '/payouts', async (req, res, ctx) => {
          validateSignatureRequest(req);
          validatePayoutTokenInUrl(req);

          const dateStart = req.url.searchParams.get('startDate');
          const dateEnd = req.url.searchParams.get('endDate');

          if (dateStart !== '2021-05-27' || dateEnd !== '2021-05-31') {
            throw new Error('Wrong parameters');
          }

          return res(ctx.status(200), ctx.json(getPayoutsResponseMock));
        })
      );

      const params = {
        startDate: '2021-05-27',
        endDate: '2021-05-31'
      };

      const results = await client.getPayouts(params);

      expect(results[0].id).toBe('JMwv8wQCXANoU2ZZQ9a9GH');
      expect(results[0].email).toBe('john@doe.com');
      expect(results[1].id).toBe('KMXZeQigXG6T5abzCJmTcH');
    });

    it('should cancel payout', async () => {
      server.use(
        rest.delete(host + '/payouts/KMXZeQigXG6T5abzCJmTcH', async (req, res, ctx) => {
          validateSignatureRequest(req);
          validatePayoutTokenInUrl(req);

          return res(ctx.status(200), ctx.json(cancelPayoutResponseMock));
        })
      );

      const results = await client.cancelPayout('KMXZeQigXG6T5abzCJmTcH');

      expect(results).toBe(true);
    });

    it('should submit payouts', async () => {
      server.use(
        rest.post(host + '/payouts/group', async (req, res, ctx) => {
          validateSignatureRequest(req);

          const response = await req.json();
          validateRequest(response, createPayoutGroupRequestMock);

          return res(ctx.status(200), ctx.json(createPayoutGroupResponseMock));
        })
      );

      const notificationURL = 'https://yournotiticationURL.com/wed3sa0wx1rz5bg0bv97851eqx';
      const shopperId = '7qohDf2zZnQK5Qanj8oyC2';

      const payout = new Payout(10, 'USD', 'USD');
      payout.reference = 'payout_20210527';
      payout.notificationEmail = 'merchant@email.com';
      payout.notificationURL = notificationURL;
      payout.email = 'john@doe.com';
      payout.recipientId = 'LDxRZCGq174SF8AnQpdBPB';
      payout.shopperId = shopperId;

      const result: PayoutGroupInterface = await client.submitPayouts([payout]);
      const firstPayout = result.payouts[0];
      const firstFailed = result.failed[0];

      expect(result.payouts.length).toBe(1);
      expect(firstPayout.notificationURL).toBe(notificationURL);
      expect(firstPayout.shopperId).toBe(shopperId);
      expect(firstFailed.errMessage).toBe('Ledger currency is required');
      expect(firstFailed.payee).toBe('john@doe.com');
    });

    it('should cancel payouts', async () => {
      const groupId = '12345';

      server.use(
        rest.delete(host + '/payouts/group/' + groupId, async (req, res, ctx) => {
          validateSignatureRequest(req);
          return res(ctx.status(200), ctx.json(cancelPayoutGroupResponseMock));
        })
      );

      const result: PayoutGroupInterface = await client.cancelPayouts(groupId);
      const firstPayout = result.payouts[0];
      const firstFailed = result.failed[0];

      expect(result.payouts.length).toBe(2);
      expect(firstPayout.notificationURL).toBe('https://yournotiticationURL.com/wed3sa0wx1rz5bg0bv97851eqx');
      expect(firstPayout.shopperId).toBe('7qohDf2zZnQK5Qanj8oyC2');
      expect(firstFailed.errMessage).toBe('PayoutId is missing or invalid');
      expect(firstFailed.payoutId).toBe('D8tgWzn1psUua4NYWW1vYo');
    });

    it('should send request payout notification', async () => {
      server.use(
        rest.post(host + '/payouts/JMwv8wQCXANoU2ZZQ9a9GH/notifications', async (req, res, ctx) => {
          const request = await req.json();

          validateSignatureRequest(req);
          validatePayoutTokenInFormData(request);
          validateRequest(request, sendPayoutNotificationRequestMock);

          return res(ctx.status(200), ctx.json(sendPayoutNotificationResponseMock));
        })
      );

      const results = await client.requestPayoutNotification('JMwv8wQCXANoU2ZZQ9a9GH');

      expect(results).toBe(true);
    });
  });

  describe('Payout Recipient', () => {
    it('should submit payout recipients', async () => {
      server.use(
        rest.post(host + '/recipients', async (req, res, ctx) => {
          validateSignatureRequest(req);

          const response = await req.json();
          validateRequest(response, submitPayoutRecipientsRequestMock);

          return res(ctx.status(200), ctx.json(submitPayoutRecipientsResponseMock));
        })
      );

      const payoutRecipient1 = new PayoutRecipient('alice@email.com', 'Alice', 'https://someurl.com');
      const payoutRecipient2 = new PayoutRecipient('bob@email.com', 'Bob', 'https://someurl.com');
      const payoutRecipients = new PayoutRecipients([payoutRecipient1, payoutRecipient2]);

      const results = await client.submitPayoutRecipients(payoutRecipients);

      expect(results.length).toBe(2);
      expect(results[0].id).toBe('JA4cEtmBxCp5cybtnh1rds');
      expect(results[1].id).toBe('X3icwc4tE8KJ5hEPNPpDXW');
      expect(results[1].email).toBe('bob@email.com');
    });

    it('should get payout recipients by status', async () => {
      server.use(
        rest.get(host + '/recipients', async (req, res, ctx) => {
          validateSignatureRequest(req);
          validatePayoutTokenInUrl(req);

          const status = req.url.searchParams.get('status');
          if (status !== 'invited') {
            throw new Error('Wrong parameters');
          }

          return res(ctx.status(200), ctx.json(getPayoutRecipientsResponseMock));
        })
      );

      const params = {
        status: 'invited'
      };

      const results = await client.getPayoutRecipients(params);

      expect(results.length).toBe(2);
      expect(results[0].id).toBe('JA4cEtmBxCp5cybtnh1rds');
      expect(results[1].id).toBe('X3icwc4tE8KJ5hEPNPpDXW');
      expect(results[1].email).toBe('bob@email.com');
    });

    it('should get payout recipient', async () => {
      server.use(
        rest.get(host + '/recipients/JA4cEtmBxCp5cybtnh1rds', async (req, res, ctx) => {
          validateSignatureRequest(req);
          validatePayoutTokenInUrl(req);

          return res(ctx.status(200), ctx.json(getPayoutRecipientResponseMock));
        })
      );

      const result = await client.getPayoutRecipient('JA4cEtmBxCp5cybtnh1rds');

      expect(result.email).toBe('john.smith@email.com');
      expect(result.label).toBe('John Smith');
      expect(result.id).toBe('JA4cEtmBxCp5cybtnh1rds');
      expect(result.status).toBe('invited');
    });

    it('should update payout recipient', async () => {
      server.use(
        rest.put(host + '/recipients/X3icwc4tE8KJ5hEPNPpDXW', async (req, res, ctx) => {
          const request = await req.json();

          validateSignatureRequest(req);
          validatePayoutTokenInFormData(request);
          validateRequest(request, {
            email: 'bob@email.com',
            label: 'Bob123',
            notificationURL: 'https://someurl.com',
            token: 'somePayoutToken',
            guid: 'ee26b5e0-9185-493e-bc12-e846d5fcf07c'
          });

          return res(ctx.status(200), ctx.json(updatePayoutRecipientResponseMock));
        })
      );

      const payoutRecipient = new PayoutRecipient('bob@email.com', 'Bob123', 'https://someurl.com');

      const result = await client.updatePayoutRecipient('X3icwc4tE8KJ5hEPNPpDXW', payoutRecipient);
      expect(result.label).toBe('Bob123');
    });

    it('should delete payout recipient', async () => {
      server.use(
        rest.delete(host + '/recipients/X3icwc4tE8KJ5hEPNPpDXW', async (req, res, ctx) => {
          validateSignatureRequest(req);
          validatePayoutTokenInUrl(req);

          return res(ctx.status(200), ctx.json(deletePayoutRecipientResponseMock));
        })
      );

      const result = await client.deletePayoutRecipient('X3icwc4tE8KJ5hEPNPpDXW');
      expect(result).toBe(true);
    });
  });

  describe('Rates', () => {
    it('should get rate', async () => {
      server.use(
        rest.get(host + '/rates/BCH/USD', (req, res, ctx) => {
          return res(ctx.status(200), ctx.json(getRateResponseMock));
        })
      );

      const results: RateInterface = await client.getRate('BCH', 'USD');
      expect(results.rate).toBe(100.99);
    });

    it('should get rates', async () => {
      server.use(
        rest.get(host + '/rates', (req, res, ctx) => {
          return res(ctx.status(200), ctx.json(getRatesResponseMock));
        })
      );

      const results: Rates = await client.getRates();
      expect(results.getRates().length).toBe(183);
    });

    it('should get rates by base currency', async () => {
      server.use(
        rest.get(host + '/rates/BTC', (req, res, ctx) => {
          return res(ctx.status(200), ctx.json(getRatesResponseMock));
        })
      );

      const results: Rates = await client.getRates('BTC');
      expect(results.getRates().length).toBe(183);
    });
  });

  describe('Refund', () => {
    it('should create refund', async () => {
      server.use(
        rest.post(host + '/refunds', async (req, res, ctx) => {
          const request = await req.json();

          validateSignatureRequest(req);
          validateRequest(request, {
            token: 'someMerchantToken',
            invoiceId: 'Hpqc63wvE1ZjzeeH4kEycF',
            amount: 10,
            guid: 'ee26b5e0-9185-493e-bc12-e846d5fcf07c'
          });

          return res(ctx.status(200), ctx.json(createRefundResponseMock));
        })
      );

      const refund = new Refund(10.0, 'Hpqc63wvE1ZjzeeH4kEycF', 'token');

      const result = await client.createRefund(refund);
      expect(result.guid).toBe('ee26b5e0-9185-493e-bc12-e846d5fcf07c');
      expect(result.amount).toBe(10);
      expect(result.invoice).toBe('Hpqc63wvE1ZjzeeH4kEycF');
    });

    it('should get refund', async () => {
      server.use(
        rest.get(host + '/refunds/WoE46gSLkJQS48RJEiNw3L', async (req, res, ctx) => {
          validateMerchantTokenInUrl(req);
          validateSignatureRequest(req);

          return res(ctx.status(200), ctx.json(createRefundResponseMock));
        })
      );

      const result = await client.getRefund('WoE46gSLkJQS48RJEiNw3L');
      expect(result.guid).toBe('ee26b5e0-9185-493e-bc12-e846d5fcf07c');
      expect(result.amount).toBe(10);
      expect(result.invoice).toBe('Hpqc63wvE1ZjzeeH4kEycF');
    });

    it('should get refund by guid', async () => {
      server.use(
        rest.get(host + '/refunds/guid/ee26b5e0-9185-493e-bc12-e846d5fcf07c', async (req, res, ctx) => {
          validateMerchantTokenInUrl(req);
          validateSignatureRequest(req);

          return res(ctx.status(200), ctx.json(createRefundResponseMock));
        })
      );

      const result = await client.getRefundByGuid('ee26b5e0-9185-493e-bc12-e846d5fcf07c');
      expect(result.id).toBe('WoE46gSLkJQS48RJEiNw3L');
      expect(result.amount).toBe(10);
      expect(result.invoice).toBe('Hpqc63wvE1ZjzeeH4kEycF');
    });

    it('should get refunds by invoice id', async () => {
      server.use(
        rest.get(host + '/refunds', async (req, res, ctx) => {
          validateMerchantTokenInUrl(req);
          validateSignatureRequest(req);

          if (req.url.searchParams.get('invoiceId') !== 'Hpqc63wvE1ZjzeeH4kEycF') {
            throw new Error('Missing invoiceId');
          }

          return res(ctx.status(200), ctx.json(createRefundResponseMock));
        })
      );

      const result = await client.getRefunds('Hpqc63wvE1ZjzeeH4kEycF');
      expect(result.id).toBe('WoE46gSLkJQS48RJEiNw3L');
      expect(result.amount).toBe(10);
      expect(result.invoice).toBe('Hpqc63wvE1ZjzeeH4kEycF');
    });

    it('should update refund', async () => {
      server.use(
        rest.put(host + '/refunds/WoE46gSLkJQS48RJEiNw3L', async (req, res, ctx) => {
          const request = await req.json();

          validateSignatureRequest(req);
          validateMerchantTokenInFormData(request);
          validateRequest(request, updateRefundRequestMock);

          return res(ctx.status(200), ctx.json(updateRefundResponseMock));
        })
      );

      const result = await client.updateRefund('WoE46gSLkJQS48RJEiNw3L', 'created');
      expect(result.id).toBe('WoE46gSLkJQS48RJEiNw3L');
      expect(result.status).toBe('created');
      expect(result.invoice).toBe('Hpqc63wvE1ZjzeeH4kEycF');
    });

    it('should update refund by guid', async () => {
      server.use(
        rest.put(host + '/refunds/guid/ee26b5e0-9185-493e-bc12-e846d5fcf07c', async (req, res, ctx) => {
          const request = await req.json();

          validateSignatureRequest(req);
          validateMerchantTokenInFormData(request);
          validateRequest(request, updateRefundRequestMock);

          return res(ctx.status(200), ctx.json(updateRefundResponseMock));
        })
      );

      const result = await client.updateRefundByGuid('ee26b5e0-9185-493e-bc12-e846d5fcf07c', 'created');
      expect(result.id).toBe('WoE46gSLkJQS48RJEiNw3L');
      expect(result.status).toBe('created');
      expect(result.invoice).toBe('Hpqc63wvE1ZjzeeH4kEycF');
    });

    it('should send refund notification', async () => {
      server.use(
        rest.post(host + '/refunds/WoE46gSLkJQS48RJEiNw3L/notifications', async (req, res, ctx) => {
          const request = await req.json();

          validateSignatureRequest(req);
          validateMerchantTokenInFormData(request);
          validateRequest(request, sendRefundNotificationRequestMock);

          return res(ctx.status(200), ctx.json(sendRefundNotificationResponseMock));
        })
      );

      const result = await client.sendRefundNotification('WoE46gSLkJQS48RJEiNw3L', 'created');
      expect(result).toBe(true);
    });

    it('should cancel refund', async () => {
      server.use(
        rest.delete(host + '/refunds/WoE46gSLkJQS48RJEiNw3L', async (req, res, ctx) => {
          validateSignatureRequest(req);
          validateMerchantTokenInUrl(req);

          return res(ctx.status(200), ctx.json(cancelRefundResponseMock));
        })
      );

      const result = await client.cancelRefund('WoE46gSLkJQS48RJEiNw3L');
      expect(result.invoice).toBe('Hpqc63wvE1ZjzeeH4kEycF');
      expect(result.reference).toBe('Test refund');
    });

    it('should cancel refund by guid', async () => {
      server.use(
        rest.delete(host + '/refunds/guid/WoE46gSLkJQS48RJEiNw3L', async (req, res, ctx) => {
          validateSignatureRequest(req);
          validateMerchantTokenInUrl(req);

          return res(ctx.status(200), ctx.json(cancelRefundResponseMock));
        })
      );

      const result = await client.cancelRefundByGuid('WoE46gSLkJQS48RJEiNw3L');
      expect(result.invoice).toBe('Hpqc63wvE1ZjzeeH4kEycF');
      expect(result.reference).toBe('Test refund');
    });
  });

  describe('Settlement', () => {
    it('should get settlements', async () => {
      server.use(
        rest.get(host + '/settlements', async (req, res, ctx) => {
          if (
            req.url.searchParams.get('startDate') !== '2021-05-10' ||
            req.url.searchParams.get('endDate') !== '2021-05-12' ||
            req.url.searchParams.get('status') !== 'processing' ||
            req.url.searchParams.get('limit') !== '100' ||
            req.url.searchParams.get('offset') !== '0'
          ) {
            throw new Error('Wrong request parameters');
          }

          validateMerchantTokenInUrl(req);
          validateSignatureRequest(req);

          return res(ctx.status(200), ctx.json(getSettlementsResponseMock));
        })
      );

      const params = {
        startDate: '2021-05-10',
        endDate: '2021-05-12',
        status: 'processing',
        limit: 100,
        offset: 0
      };

      const result = await client.getSettlements(params);
      expect(result.length).toBe(2);
      expect(result[0].id).toBe('KBkdURgmE3Lsy9VTnavZHX');
      expect(result[0].accountId).toBe('YJCgTf3jrXHkUVzLQ7y4eg');
      expect(result[0].totalAmount).toBe(22.09);
      expect(result[1].id).toBe('RPWTabW8urd3xWv2To989v');
    });

    it('should get settlement', async () => {
      server.use(
        rest.get(host + '/settlements/DNFnN3fFjjzLn6if5bdGJC', async (req, res, ctx) => {
          validateMerchantTokenInUrl(req);
          validateSignatureRequest(req);

          return res(ctx.status(200), ctx.json(getSettlementResponseMock));
        })
      );

      const result = await client.getSettlement('DNFnN3fFjjzLn6if5bdGJC');
      expect(result.id).toBe('RPWTabW8urd3xWv2To989v');
      expect(result.accountId).toBe('YJCgTf3jrXHkUVzLQ7y4eg');
      expect(result.openingBalance).toBe(23.27);
      expect(result.payoutInfo.account).toBe('NL85ABNA0000000000');
    });

    it('should get settlement reconciliation report', async () => {
      const token = '5T1T5yGDEtFDYe8jEVBSYLHKewPYXZrDLvZxtXBzn69fBbZYitYQYH4BFYFvvaVU7D';
      server.use(
        rest.get(host + '/settlements/RvNuCTMAkURKimwgvSVEMP/reconciliationreport', async (req, res, ctx) => {
          if (req.url.searchParams.get('token') !== token) {
            throw new Error('Missing/wrong token');
          }
          validateSignatureRequest(req);

          return res(ctx.status(200), ctx.json(getSettlementReconciliationReportResponseMock));
        })
      );

      const result = await client.getSettlementReconciliationReport('RvNuCTMAkURKimwgvSVEMP', token);
      expect(result.id).toBe('RvNuCTMAkURKimwgvSVEMP');
      expect(result.accountId).toBe('YJCgTf3jrXHkUVzLQ7y4eg');
      expect(result.openingBalance).toBe(23.13);
      expect(result.payoutInfo.iban).toBe('NL85ABNA0000000000');
      expect(result.ledgerEntries.length).toBe(42);
    });
  });

  describe('Wallet', () => {
    it('should retrieve supported wallets', async () => {
      server.use(
        rest.get(host + '/supportedwallets', async (req, res, ctx) => {
          return res(ctx.status(200), ctx.json(getSupportedWalletsMock));
        })
      );

      const result = await client.getSupportedWallets();
      expect(result.length).toBe(7);
      expect(result[0].key).toBe('bitpay');
      expect(result[0].displayName).toBe('BitPay');
      expect(result[0].avatar).toBe('bitpay-wallet.png');
      expect(result[0].currencies[0].qr.type).toBe('BIP72b');
    });
  });
});
