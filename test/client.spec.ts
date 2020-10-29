import {Env} from "../src";
import {Invoice} from "../src/models";

const BitPaySDK = require('../src/index');
const Currencies = BitPaySDK.Currency;
const Facades = BitPaySDK.Facade;
const InvoiceStatus = BitPaySDK.InvoiceStatus;

let client;
describe('BitPaySDK.Client', () => {
    beforeAll(() => {
        jest.setTimeout(20000); // browser takes a while
        let tokens = BitPaySDK.Tokens;
        tokens.merchant = '3AHzQTE8gSAsiic69TPZSoKSWkjg4euCLsivcbAdsBgK';
        let keyFilePath = __dirname+'/../examples/private_key_setup_test.key';
        let keyPlainText = 'e78c0a2ed82ac9cdb442fdd606b8b1af9e082b0337e8ee0094342894be6ce203';
        let configFilePath = '/Users/antonio.buedo/Bitpay/Repos/nodejs-bitpay-client/setup/../examples/BitPay.config.json';

        client = new BitPaySDK.Client(null, Env.Test, keyFilePath, tokens);
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
        let invoiceData = new BitPaySDK.Models.Invoice(50, Currencies.USD);
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
            let dateEnd = "10-260-2020";
            let status = InvoiceStatus.New;
            let orderId = "0000";
            let limit = 30;
            let offset = 0;

            retrievedInvoices = await client.GetInvoices(dateStart, dateEnd, status, null, limit, offset);
            console.log(retrievedInvoices);
            expect(retrievedInvoices).toBeDefined();
        });
    });
});
