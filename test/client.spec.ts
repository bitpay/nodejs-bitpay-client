import {Env, RecipientReferenceMethod} from "../src";
import {Buyer} from "../src/Model/Invoice/Buyer";
import {Item, PayoutRecipients, PayoutRecipient, PayoutInstruction, PayoutBatch} from "../src/Model";
const BitPaySDK = require('../src/index');
const Currencies = BitPaySDK.Currency;
const InvoiceStatus = BitPaySDK.InvoiceStatus;
const PayoutStatus = BitPaySDK.PayoutStatus;

let client;
describe('BitPaySDK.Client', () => {
    beforeAll(() => {
        jest.setTimeout(20000); // browser takes a while
        let tokens = BitPaySDK.Tokens;
        tokens.merchant = '';
        tokens.payroll = '';
        let keyFilePath = __dirname+'/../examples/private_key_setup_test.key';
        let keyPlainText = '';
        let configFilePath = __dirname+'/../examples/BitPay.config.json';

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
        buyer.email = "sandbox@bitpay.com";
        buyer.name = "BuyerTest";
        let invoiceData = new BitPaySDK.Models.Invoice(50, Currencies.USD);
        invoiceData.buyer = buyer;
        invoiceData.notificationURL = "https://hookb.in/1gw8aQxYQDHj002yk79K";
        invoiceData.extendedNotifications = true;
        let invoice;
        let retrievedInvoice;
        let retrievedInvoices;
        let webhookRequested;

        it('should create invoice', async () => {
            invoice = await client.CreateInvoice(invoiceData);

            expect(invoice).toBeDefined();
        });

        it('should retrieve invoice', async () => {
            invoice = await client.CreateInvoice(invoiceData);
            retrievedInvoice = await client.GetInvoice(invoice.id);

            expect(retrievedInvoice).toBeDefined();
        });

        it('should retrieve invoice list', async () => {
            let dateEnd = new Date();
            let dateStart = new Date();
            dateStart.setDate(dateEnd.getDate()-30);

            let status = InvoiceStatus.New;
            let limit = 30;
            let offset = 0;

            retrievedInvoices = await client.GetInvoices(dateStart, dateEnd, status, null, limit, offset);

            expect(retrievedInvoices).toBeDefined();
        });

        it('should request invoice webhook', async () => {
            invoice = await client.CreateInvoice(invoiceData);
            webhookRequested = await client.GetInvoiceWebHook(invoice.id);

            expect(invoice).toBeDefined();
            expect(webhookRequested).toBeTruthy();
        });
    });

    describe('Refunds', () => {
        let dateEnd = new Date();
        let dateStart = new Date();
        dateStart.setDate(dateEnd.getDate()-30);

        let createdRefund;
        let refundEmail = "sandbox@bitpay.com";
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
            expect(createdRefund).toBeDefined();
        });

        it('should get refund request', async () => {
            retrievedRefund = await client.GetRefunds(firstPaidInvoice);
            firstRefund = retrievedRefund.shift();
            expect(retrievedRefund).toBeDefined();
        });

        it('should cancel refund request', async () => {
            canceledRefund = await client.CancelRefund(firstPaidInvoice, firstRefund);
            expect(canceledRefund).toBeDefined();
        });
    });

    describe('Bills', () => {
        let basicBillUsd;
        let basicBillEur;
        let retrievedBill;
        let updatedBill;
        let deliveredBill;

        let items = [];
        let item = new Item();
        item.price = 30;
        item.quantity = 9;
        item.description = "product-a";
        items.push(item);

        item.price = 13.7;
        item.quantity = 18;
        item.description = "product-b";
        items.push(item);

        item.price = 2.1;
        item.quantity = 43;
        item.description = "product-c";
        items.push(item);

        it('should create bill USD', async () => {
            let bill = new BitPaySDK.Models.Bill("0001", Currencies.USD, "sandbox@bitpay.com", items);
            basicBillUsd = await client.CreateBill(bill);
            expect(basicBillUsd).toBeDefined();
        });

        it('should create bill EUR', async () => {
            let bill = new BitPaySDK.Models.Bill("0002", Currencies.EUR, "sandbox@bitpay.com", items);
            basicBillEur = await client.CreateBill(bill);
            expect(basicBillEur).toBeDefined();
        });

        it('should get bill', async () => {
            let bill = new BitPaySDK.Models.Bill("0003", Currencies.USD, "sandbox@bitpay.com", items);
            basicBillUsd = await client.CreateBill(bill);
            retrievedBill = await client.GetBill(basicBillUsd.id);
            expect(retrievedBill).toBeDefined();
        });

        it('should get and update bill', async () => {
            let bill = new BitPaySDK.Models.Bill("0004", Currencies.USD, "sandbox@bitpay.com", items);
            basicBillUsd = await client.CreateBill(bill);
            retrievedBill = await client.GetBill(basicBillUsd.id);
            basicBillUsd.number = "0005";
            updatedBill = await client.UpdateBill(basicBillUsd, basicBillUsd.id);
            expect(updatedBill).toBeDefined();
        });

        it('should deliver bill', async () => {
            let bill = new BitPaySDK.Models.Bill("0006", Currencies.USD, "sandbox@bitpay.com", items);
            basicBillUsd = await client.CreateBill(bill);
            deliveredBill = await client.DeliverBill(basicBillUsd.id, basicBillUsd.token);
            expect(deliveredBill).toBeTruthy();
        });
    });

    describe('PayoutRecipients', () => {

        let recipients = [];
        let recipientsList = [];
        let recipientsObj;
        let lastRecipient;
        let retrieved;
        let updatedRecipient;
        let deleted;
        let webhookRequested;

        recipientsList.push(new PayoutRecipient("sandbox+recipient1@bitpay.com","recipient1","https://hookb.in/wNDlQMV7WMFz88VDyGnJ"));
        recipientsList.push(new PayoutRecipient("sandbox+recipient2@bitpay.com","recipient2","https://hookb.in/QJOPBdMgRkukpp2WO60o"));
        recipientsList.push(new PayoutRecipient("sandbox+recipient3@bitpay.com","recipient3","https://hookb.in/QJOPBdMgRkukpp2WO60o"));

        recipientsObj = new PayoutRecipients(recipientsList);

        it('should submit payout recipient', async () => {
            recipients = await client.SubmitPayoutRecipients(recipientsObj);
            expect(recipients).toBeDefined();
            expect(recipients.length).toBe(3);
        });

        it('should get payout recipient', async () => {
            recipients = await client.SubmitPayoutRecipients(recipientsObj);
            lastRecipient = recipients.slice(-1).pop();

            retrieved = await client.GetPayoutRecipient(lastRecipient.id);

            expect(lastRecipient).toBeDefined();
            expect(retrieved.id).toBeDefined();
            expect(lastRecipient.id).toEqual(retrieved.id);
        });

        it('should get and update payout recipient', async () => {
            recipients = await client.SubmitPayoutRecipients(recipientsObj);
            lastRecipient = recipients.slice(-1).pop();

            retrieved = await client.GetPayoutRecipient(lastRecipient.id);

            updatedRecipient = await client.UpdatePayoutRecipient(lastRecipient.id, "label.UPDATED", "https://hookb.in/1gw8aQxYQDHj002yk79K");

            expect(lastRecipient).toBeDefined();
            expect(retrieved.id).toBeDefined();
            expect(updatedRecipient.label).toEqual("label.UPDATED");
            expect(updatedRecipient.notificationURL).toEqual("https://hookb.in/1gw8aQxYQDHj002yk79K");
        });

        it('should get and delete payout recipient', async () => {
            recipients = await client.GetPayoutRecipients();
            lastRecipient = recipients.slice(-1).pop();

            retrieved = await client.GetPayoutRecipient(lastRecipient.id);

            deleted = await client.DeletePayoutRecipient(retrieved.id);

            expect(deleted).toBeTruthy();
        });

        it('should get and request a payout recipient webhook', async () => {
            recipients = await client.GetPayoutRecipients();
            lastRecipient = recipients.slice(-1).pop();

            updatedRecipient = await client.UpdatePayoutRecipient(lastRecipient.id, "label.IPN_TEST", "https://hookb.in/1gw8aQxYQDHj002yk79K");

            retrieved = await client.GetPayoutRecipient(updatedRecipient.id);

            webhookRequested = await client.GetPayoutRecipientWebHook(retrieved.id);

            expect(webhookRequested).toBeTruthy();
        });
    });

    describe('Payouts', () => {
        let date = new Date();
        let threeDaysFromNow = new Date();
        threeDaysFromNow.setDate(date.getDate()+3);
        let effectiveDate = threeDaysFromNow.getDate().toString();

        let createdBatch;
        let retrievedBatch;
        let retrievedBatches;
        let canceledBatch;


        let instructionsList = [];

        instructionsList.push(new PayoutInstruction(100.05, RecipientReferenceMethod.EMAIL, "sandbox+recipient1@bitpay.com"));
        instructionsList.push(new PayoutInstruction(22.36, RecipientReferenceMethod.EMAIL, "sandbox+recipient2@bitpay.com"));
        instructionsList.push(new PayoutInstruction(251.29, RecipientReferenceMethod.EMAIL, "sandbox+recipient3@bitpay.com"));

        let batch0 = new PayoutBatch(Currencies.USD, effectiveDate, instructionsList);

        it('should submit payout batch', async () => {
            createdBatch = await client.SubmitPayoutBatch(batch0);
            expect(createdBatch).toBeDefined();
            expect(createdBatch.instructions).toBe(3);
        });

        it('should get payout batch', async () => {
            createdBatch = await client.SubmitPayoutBatch(batch0);
            retrievedBatch = await client.getPayoutBatch(createdBatch.id);

            expect(retrievedBatch).toBeDefined();
            expect(retrievedBatch.id).toBeDefined();
            expect(createdBatch.id).toEqual(retrievedBatch.id);
        });

        it('should get payout batches by status', async () => {
            retrievedBatches = await client.getPayoutBatches(PayoutStatus.New);

            expect(retrievedBatches).toBeDefined();
        });

        it('should create, get and cancel payout batch', async () => {
            createdBatch = await client.SubmitPayoutBatch(batch0);

            retrievedBatch = await client.getPayoutBatch(createdBatch.id);

            canceledBatch = await client.cancelPayoutBatch(retrievedBatch.id);

            expect(canceledBatch).toBeDefined();
            expect(retrievedBatch.id).toEqual(canceledBatch.id);
        });
    });
});
