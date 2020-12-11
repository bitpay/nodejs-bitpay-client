import {Env} from "../src";
import {Buyer} from "../src/Model/Invoice/Buyer";

const BitPaySDK = require('../src/index');
const Currencies = BitPaySDK.Currency;
const Facades = BitPaySDK.Facade;
const InvoiceStatus = BitPaySDK.InvoiceStatus;

let client;
describe('BitPaySDK.Client', () => {
    beforeAll(() => {
        jest.setTimeout(20000); // browser takes a while
        let tokens = BitPaySDK.Tokens;
        tokens.merchant = 'EZGKrE4ZifLPPf31jcHd153a5ad9ePnqMx1gAomAjr3W';
        tokens.payroll = 'F5uY2NNspRyt6WHLkWsTV2eMzSYWzsADiAcznP3hPexL';
        let keyFilePath = __dirname+'/../examples/private_key_setup_test.key';
        let keyPlainText = '7b9ef624577998af6f16e32a1fae18b301274ef3631294c490c582183f21290d';
        let configFilePath = '/Users/antonio.buedo/Bitpay/Repos/nodejs-bitpay-client/setup/../examples/BitPay.config.json';

        client = new BitPaySDK.Client(null, Env.Test, keyPlainText, tokens);
        // client = new BitPaySDK.Client(configFilePath);
    });

    describe('Rates', () => {
        it('should get rates', async () => {
            const results = await client.GetRates();
            expect(results[0].rate).toBeDefined();
        });
        it('should update rates', async () => {
            let Rates = new BitPaySDK.Models.Rates(await client.GetRates(), client);
            await Rates.Update();
            let newRates = await Rates.GetRates();
            expect(newRates[0].rate).toBeDefined();
        });
        it('should get rates EUR', async () => {
            const Rates = await client.GetRates(Currencies.EUR);
            expect(Rates).toBeDefined();
        });
    });

    describe('Invoices', () => {
        let buyer = new Buyer();
        buyer.email = "agallardo@bitpay.com";
        buyer.name = "BuyerTest";
        let invoiceData = new BitPaySDK.Models.Invoice(50, Currencies.USD);
        invoiceData.buyer = buyer;
        let invoice;
        let retrievedInvoice;
        let retrievedInvoices;

        it('should create invoice', async () => {
            invoice = await client.CreateInvoice(invoiceData);
            console.log(invoice.token);
            expect(invoice).toBeDefined();
        });

        it('should retrieve invoice', async () => {
            retrievedInvoice = await client.GetInvoice(invoice.id);
            console.log(retrievedInvoice.token);
            expect(retrievedInvoice).toBeDefined();
        });

        it('should retrieve invoice list', async () => {
            let dateStart = "10-01-2020";
            let dateEnd = "10-26-2020";
            let status = InvoiceStatus.New;
            let orderId = "0000";
            let limit = 30;
            let offset = 0;

            retrievedInvoices = await client.GetInvoices(dateStart, dateEnd, status, null, limit, offset);
            console.log(retrievedInvoices);
            expect(retrievedInvoices).toBeDefined();
        });
    });

    describe('Refunds', () => {
        let dateStart = "11-01-2020";
        let dateEnd = "11-21-2020";
        let createdRefund;
        let refundEmail = "agallardo@bitpay.com";
        let canceledRefund;
        let firstPaidInvoice;
        let retrievedRefund;
        let firstRefund;

        it('should get first paid invoice', async () => {
            firstPaidInvoice = await client.GetInvoices(dateStart, dateEnd, InvoiceStatus.Complete, null, 1);
            firstPaidInvoice = firstPaidInvoice.shift();
        });

        it('should create refund request', async () => {
            createdRefund = await client.CreateRefund(firstPaidInvoice, refundEmail, firstPaidInvoice.price, firstPaidInvoice.currency);
        });

        it('should get refund request', async () => {
            retrievedRefund = await client.GetRefunds(firstPaidInvoice);
            firstRefund = retrievedRefund.shift();
        });

        it('should cancel refund request', async () => {
            canceledRefund = await client.CancelRefund(firstPaidInvoice, firstRefund);
        });

        console.log(createdRefund);
        expect(createdRefund).toBeDefined();

        console.log(retrievedRefund);
        expect(retrievedRefund).toBeDefined();

        console.log(canceledRefund);
        expect(canceledRefund).toBeDefined();
    });
});
