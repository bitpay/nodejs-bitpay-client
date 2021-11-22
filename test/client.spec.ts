import {Env, RecipientReferenceMethod} from "../src";
import {Buyer} from "../src/Model/Invoice/Buyer";
import {BillItem, PayoutRecipients, PayoutRecipient, PayoutInstruction, Payout, PayoutBatch, BillData, SubscriptionItem} from "../src/Model";
import {Subscription} from "../src/Model/Subscription/Subscription";
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
        tokens.payout = '';
        let keyFilePath = __dirname+'/../secure/private_key_test.key';
        let keyPlainText = '';
        let configFilePath = __dirname+'/../secure/BitPay.config.json';

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
        let invoiceData = new BitPaySDK.Models.Invoice(7, Currencies.USD);
        invoiceData.buyer = buyer;
        invoiceData.notificationURL = "https://hookb.in/1gw8aQxYQDHj002yk79K";
        invoiceData.extendedNotifications = true;
        let invoice;
        let retrievedInvoice;
        let retrievedInvoices;
        let webhookRequested;

        it('should create invoice', async () => {
            invoice = await client.CreateInvoice(invoiceData);
            console.log(invoice);

            expect(invoice).toBeDefined();
        });

        it('should retrieve invoice', async () => {
            invoice = await client.CreateInvoice(invoiceData);
            retrievedInvoice = await client.GetInvoice(invoice.id);

            expect(retrievedInvoice).toBeDefined();
        });

        it('should retrieve invoice list', async () => {
            let date = new Date();
            let dateEnd = new Date().toISOString().split('T')[0];
            let dateStart = new Date(date.setDate(date.getDate()-30)).toISOString().split('T')[0];

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
        let date = new Date();
        let dateEnd = new Date().toISOString().split('T')[0];
        let dateStart = new Date(date.setDate(date.getDate()-30)).toISOString().split('T')[0];

        let createdRefund;
        let refundEmail = "sandbox@bitpay.com";
        let canceledRefund;
        let firstPaidInvoice;
        let retrievedRefund;
        let firstRefund;

        it('should get first paid invoice', async () => {
            firstPaidInvoice = await client.GetInvoices(dateStart, dateEnd, InvoiceStatus.Complete, null, 1);
            firstPaidInvoice = firstPaidInvoice.shift();

            expect(firstPaidInvoice).toBeDefined();
        });

        it('should create refund request', async () => {
            firstPaidInvoice = await client.GetInvoices(dateStart, dateEnd, InvoiceStatus.Complete, null, 1);
            firstPaidInvoice = firstPaidInvoice.shift();
            createdRefund = await client.CreateRefund(firstPaidInvoice, refundEmail, firstPaidInvoice.price, firstPaidInvoice.currency);

            expect(createdRefund).toBeDefined();
        });

        it('should get refund request', async () => {
            firstPaidInvoice = await client.GetInvoices(dateStart, dateEnd, InvoiceStatus.Complete, null, 1);
            firstPaidInvoice = firstPaidInvoice.shift();
            retrievedRefund = await client.GetRefunds(firstPaidInvoice);
            firstRefund = retrievedRefund.shift();

            expect(retrievedRefund).toBeDefined();
        });

        it('should cancel refund request', async () => {
            firstPaidInvoice = await client.GetInvoices(dateStart, dateEnd, InvoiceStatus.Complete, null, 1);
            firstPaidInvoice = firstPaidInvoice.shift();
            retrievedRefund = await client.GetRefunds(firstPaidInvoice);
            firstRefund = retrievedRefund.shift();
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
        let item = new BillItem();
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

    describe('Ledger', () => {
        let retrievedLedger;

        it('should get ledgers', async () => {
            retrievedLedger = await client.GetLedgers();

            expect(retrievedLedger).toBeDefined();
            expect(retrievedLedger.length).toBeGreaterThan(0);
        });

        it('should retrieve ledger USD', async () => {
            let date = new Date();
            let dateEnd = new Date().toISOString().split('T')[0];
            let dateStart = new Date(date.setDate(date.getDate()-30)).toISOString().split('T')[0];

            retrievedLedger = await client.GetLedger(Currencies.USD, dateStart, dateEnd);

            expect(retrievedLedger).toBeDefined();
            expect(retrievedLedger.length).toBeGreaterThan(0);
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
            recipients = await client.GetPayoutRecipients(PayoutStatus.Active, 3);
            
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
        
        let createdPayout;
        let retrievedPayout;
        let retrievedPayouts;
        let cancelledPayout;
        let recipients;
        let requestedNotification;

        let payout0 = new Payout(6.75, Currencies.USD, Currencies.ETH);

        it('should submit payout', async () => {
            recipients = await client.GetPayoutRecipients('active', 2);
            payout0.recipientId = recipients[1].id;

            createdPayout = await client.SubmitPayout(payout0);
            cancelledPayout = await client.CancelPayout(createdPayout.id);
            
            expect(createdPayout).toBeDefined();
            expect(cancelledPayout).toBeTruthy();
        });

        it('should get payout', async () => {
            createdPayout = await client.SubmitPayout(payout0);
            retrievedPayout = await client.GetPayout(createdPayout.id);
            cancelledPayout = await client.CancelPayout(retrievedPayout.id);
            
            expect(createdPayout).toBeDefined();
            expect(retrievedPayout).toBeDefined();
            expect(retrievedPayout.id).toBeDefined();
            expect(retrievedPayout.id).toEqual(createdPayout.id);
            expect(cancelledPayout).toBeTruthy();
        });

        it('should get payouts by status', async () => {
            retrievedPayouts = await client.GetPayouts(null, null, PayoutStatus.New);

            expect(retrievedPayouts).toBeDefined();
        });

        it('should create, get and cancel payout', async () => {
            createdPayout = await client.SubmitPayout(payout0);
            retrievedPayout = await client.GetPayout(createdPayout.id);
            cancelledPayout = await client.CancelPayout(retrievedPayout.id);
            
            expect(createdPayout).toBeDefined();
            expect(retrievedPayout).toBeDefined();
            expect(retrievedPayout.id).toBeDefined();
            expect(retrievedPayout.id).toEqual(createdPayout.id);
            expect(cancelledPayout).toBeTruthy();
        });

        it('should request payout notification', async () => {
            recipients = await client.GetPayoutRecipients('active', 2);
            
            payout0.recipientId = recipients[1].id;
            payout0.notificationEmail = 'sandbox@bitpay.com';
            payout0.notificationURL = 'https://hookb.in/QJOPBdMgRkukpp2WO60o';

            createdPayout = await client.SubmitPayout(payout0);
            requestedNotification = await client.RequestPayoutNotification(createdPayout.id);
            cancelledPayout = await client.CancelPayout(createdPayout.id);

            expect(createdPayout).toBeDefined();
            expect(requestedNotification).toBeTruthy();
            expect(cancelledPayout).toBeTruthy();
        });
    });

    describe('PayoutBatches', () => {

        let createdBatch;
        let retrievedBatch;
        let retrievedBatches;
        let canceledBatch;
        let requestedNotification;

        let instructionsList = [];

        instructionsList.push(new PayoutInstruction(7.05, RecipientReferenceMethod.EMAIL, "sandbox+recipient1@bitpay.com"));
        instructionsList.push(new PayoutInstruction(22.36, RecipientReferenceMethod.EMAIL, "sandbox+recipient2@bitpay.com"));
        instructionsList.push(new PayoutInstruction(251.29, RecipientReferenceMethod.EMAIL, "sandbox+recipient3@bitpay.com"));

        let batch0 = new PayoutBatch(Currencies.USD, instructionsList, Currencies.ETH);

        it('should submit payout batch', async () => {
            createdBatch = await client.SubmitPayoutBatch(batch0);
            canceledBatch = await client.CancelPayoutBatch(createdBatch.id);
            
            expect(createdBatch).toBeDefined();
            expect(createdBatch.instructions.length).toBe(3);
            expect(canceledBatch).toBeTruthy();
        });

        it('should get payout batch', async () => {
            createdBatch = await client.SubmitPayoutBatch(batch0);
            retrievedBatch = await client.GetPayoutBatch(createdBatch.id);
            canceledBatch = await client.CancelPayoutBatch(retrievedBatch.id);

            expect(retrievedBatch).toBeDefined();
            expect(retrievedBatch.id).toBeDefined();
            expect(createdBatch.id).toEqual(retrievedBatch.id);
            expect(canceledBatch).toBeTruthy();
        });

        it('should get payout batches by status', async () => {
            retrievedBatches = await client.GetPayoutBatches(null, null, PayoutStatus.New);

            expect(retrievedBatches).toBeDefined();
        });

        it('should create, get and cancel payout batch', async () => {
            createdBatch = await client.SubmitPayoutBatch(batch0);
            retrievedBatch = await client.GetPayoutBatch(createdBatch.id);
            canceledBatch = await client.CancelPayoutBatch(retrievedBatch.id);
            
            expect(retrievedBatch.id).toEqual(createdBatch.id);
            expect(canceledBatch).toBeTruthy();
        });

        it('should request payout batch notification', async () => {
            batch0.notificationEmail = 'sandbox@bitpay.com';
            batch0.notificationURL = 'https://hookb.in/QJOPBdMgRkukpp2WO60o';

            createdBatch = await client.SubmitPayoutBatch(batch0);
            requestedNotification = await client.RequestPayoutBatchNotification(createdBatch.id);
            canceledBatch = await client.CancelPayoutBatch(createdBatch.id);

            expect(createdBatch).toBeDefined();
            expect(requestedNotification).toBeTruthy();
            expect(canceledBatch).toBeTruthy();
        });
    });

    describe('Settlements', () => {
        let retrievedSettlements;
        let retrievedSettlement;
        let firstSettlement;
        let date = new Date();
        let dateEnd = new Date().toISOString().split('T')[0];
        let dateStart = new Date(date.setDate(date.getDate()-30)).toISOString().split('T')[0];

        it('should get settlements', async () => {
            retrievedSettlements = await client.GetSettlements(Currencies.USD, dateStart, dateEnd, null, null, null);

            expect(retrievedSettlements).toBeDefined();
            expect(retrievedSettlements.length).toBeGreaterThan(0);
        });

        it('should retrieve settlements USD', async () => {
            retrievedSettlements = await client.GetSettlements(Currencies.USD, dateStart, dateEnd, null, null, null);
            firstSettlement = retrievedSettlements.shift();
            retrievedSettlement = await client.GetSettlement(firstSettlement.id);

            expect(retrievedSettlements).toBeDefined();
            expect(retrievedSettlement).toBeDefined();
            expect(firstSettlement.id).toEqual(retrievedSettlement.id);
        });

        it('should retrieve reconciliation report USD', async () => {
            retrievedSettlements = await client.GetSettlements(Currencies.USD, dateStart, dateEnd, null, null, null);
            firstSettlement = retrievedSettlements.shift();
            retrievedSettlement = await client.GetSettlementReconciliationReport(firstSettlement);

            expect(retrievedSettlements).toBeDefined();
            expect(retrievedSettlement).toBeDefined();
            expect(firstSettlement.id).toEqual(retrievedSettlement.id);
        });
    });

    describe('Subscriptions', () => {

        let subscription;
        let subscriptions;
        let items = [];
        let billData;
        let subscriptionObj;
        let lastSubscription;
        let retrievedSubscription;
        let updatedSubscription;

        items.push(new SubscriptionItem(6, 10, "Item 1"));
        items.push(new SubscriptionItem(4.3, 35, "Item 2"));

        billData = new BillData('USD', 'sandbox+sub@bitpay.com', '2021-02-21', items);
        billData.cc = 'sandbox+cc@bitpay.com';
        billData.passProcessingFee = true;
        billData.emailBill = true;
        billData.name = 'aaaa';
        billData.currency = 'USD';
        billData.email = 'sandbox+sub2@bitpay.com';

        subscriptionObj = new Subscription();
        subscriptionObj.id = '123';
        subscriptionObj.status = 'draft';
        subscriptionObj.nextDelivery = '2021-02-19';
        subscriptionObj.schedule = 'weekly';
        subscriptionObj.billData = billData;

        it('should submit subscription', async () => {
            subscription = await client.CreateSubscription(subscriptionObj);
            expect(subscription).toBeDefined();
            expect(subscription.billData.items.length).toBe(2);
        });

        it('should get subscription', async () => {
            subscriptions = await client.GetSubscriptions();
            lastSubscription = subscriptions.slice(-1).pop();

            retrievedSubscription = await client.GetSubscription(lastSubscription.id);

            expect(lastSubscription).toBeDefined();
            expect(retrievedSubscription.id).toBeDefined();
            expect(lastSubscription.id).toEqual(retrievedSubscription.id);
        });

        it('should get and update subscription', async () => {
            subscription = await client.CreateSubscription(subscriptionObj);
            retrievedSubscription = await client.GetSubscription(subscription.id);

            retrievedSubscription.nextDelivery = '2021-02-20';

            updatedSubscription = await client.UpdateSubscription(retrievedSubscription, retrievedSubscription.id);

            expect(subscription).toBeDefined();
            expect(retrievedSubscription.id).toBeDefined();
            expect(updatedSubscription).toBeDefined();
        });
    });
});
