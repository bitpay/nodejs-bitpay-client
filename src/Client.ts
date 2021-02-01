import * as elliptic from 'elliptic';
import {BitPayExceptions as Exceptions, Config, Facade, KeyUtils, RESTcli, Tokens} from './index';
import {
    Bill,
    BillInterface,
    Invoice,
    InvoiceInterface,
    PayoutBatch,
    PayoutBatchInterface,
    PayoutRecipient,
    PayoutRecipientInterface,
    PayoutRecipients,
    RateInterface,
    Rates
} from "./Model";
import {Refund, RefundInterface} from "./Model/Invoice/Refund";

const fs = require('fs');

/**
 * @author Antonio Buedo
 * @version 1.0.2102
 * See bitpay.com/api for more information.
 * date 01.02.2021
 */

export class Client {
    private _configuration: Config;
    private _env: string;
    private _tokenCache: Tokens;
    private _ecKey: elliptic.ec.KeyPair;
    private _RESTcli: RESTcli;
    public _currenciesInfo: [];
    private _keyUtils = new KeyUtils();

    constructor(
        configFilePath: string,
        environment: string,
        privateKey: string,
        tokens: Tokens,
    ) {
        try {
            // constructor with config file
            if(arguments.length > 1) {
                this._env = environment;
                this.BuildConfig(privateKey, tokens);
                this.initKeys();
                this.init();
            }
            // constructor with parameters
            else {
                this.BuildConfigFromFile(configFilePath);
                this.initKeys();
                this.init();
            }
        } catch (e) {
            throw new Exceptions.Generic(null, "failed to initiate client : " + e.message);
        }
    }

    private BuildConfigFromFile(filePath: string) {
        try {
            let envConfig;

            if (fs.existsSync(filePath)) {
                try {
                    let ConfigObj = JSON.parse(fs.readFileSync(filePath))['BitPayConfiguration'];
                    this._env = ConfigObj['Environment'];
                    envConfig = ConfigObj['EnvConfig'][this._env];
                } catch (e) {
                    throw new Exceptions.Generic(null, "Error when reading configuration file");
                }
            } else {
                throw new Exceptions.Generic(null, "Configuration file not found")
            }

            let config = new Config();
            config.environment = this._env;

            let envTarget = {};
            envTarget[this._env] = envConfig;

            config.envConfig = envTarget;
            this._configuration = config;
        } catch (e) {
            throw new Exceptions.Generic(null, "failed to process configuration : " + e.message);
        }
    }

    private BuildConfig(privateKey: string, tokens: Tokens) {
        try {
            let keyHex: string;
            let keyFile: string;

            if (!fs.existsSync(privateKey)) {
                try {
                    this._ecKey = this._keyUtils.load_keypair(Buffer.from(privateKey).toString().trim());
                    keyHex = privateKey
                } catch (e) {
                    throw new Exceptions.Generic(null, "Private Key file not found");
                }
            } else {
                try {
                    keyFile = privateKey;
                } catch (e) {
                    throw new Exceptions.Generic(null, "Could not read private Key file")
                }
            }

            let config = new Config();
            config.environment = this._env;

            let ApiTokens = tokens;
            let envConfig = {};

            envConfig["PrivateKeyPath"] = keyFile;
            envConfig["PrivateKey"] = keyHex;
            envConfig["ApiTokens"] = ApiTokens;

            let envTarget = {};
            envTarget[this._env] = envConfig;

            config.envConfig = envTarget;
            this._configuration = config;
        } catch (e) {
            throw new Exceptions.Generic(null, "failed to process configuration : " + e.message);
        }
    }

    private initKeys() {
        if (this._ecKey == null) {
            let keyHex: string;
            try {
                let privateKeyPath = this._configuration.envConfig[this._env]["PrivateKeyPath"].toString().replace("\"", "");
                if (fs.existsSync(privateKeyPath)) {
                    this._ecKey = this._keyUtils.load_keypair(fs.readFileSync(privateKeyPath).toString());
                } else {
                    keyHex = this._configuration.envConfig[this._env]["PrivateKey"].toString().replace("\"", "");
                    if (keyHex) {
                        this._ecKey = this._keyUtils.load_keypair(Buffer.from(keyHex).toString().trim());
                    }
                }
            } catch (e) {
                throw new Exceptions.Generic(null, "When trying to load private key. Make sure the configuration details are correct and the private key and tokens are valid : " + e.message);
            }
        }
    }

    private async init() {
        try {
            this._RESTcli = new RESTcli(this._env, this._ecKey);
            this.LoadAccessTokens();
            this._currenciesInfo = await this.LoadCurrencies();
        } catch (e) {
            throw new Exceptions.Generic(null, "failed to deserialize BitPay server response (Token array) : " + e.message);
        }
    }

    private async LoadCurrencies(): Promise<[]> {
        try {
            let currenciesInfo = this._RESTcli.get("currencies/", {}, false).then(currenciesInfo => {
                return <[]>JSON.parse(currenciesInfo);
            });

            return currenciesInfo;
        } catch (e) {
            // No action required
        }
    }

    /**
     * Gets info for specific currency.
     *
     * @param currencyCode String Currency code for which the info will be retrieved.
     * @return Map|null
     */
    public async GetCurrencyInfo(currencyCode: string) {
        let currencyInfo = null;

        let loop = await this.LoadCurrencies().then(ratesData => {
            ratesData.some(element => {
                currencyInfo = element;
                if (element["code"] == currencyCode) {
                    currencyInfo = element;
                    return true;
                }
            });
        });

        return currencyInfo;
    }

    private getGuid(): string {
        let Min = 0;
        let Max = 99999999;

        return Min + (Math.random() * ((Max - Min) + 1)) + "";
    }

    private LoadAccessTokens() {
        try {
            this.ClearAccessTokenCache();
            this._tokenCache = this._configuration.envConfig[this._env]["ApiTokens"];
        } catch (e) {
            throw new Exceptions.Generic(null, "When trying to load the tokens : " + e.message);
        }
    }

    private ClearAccessTokenCache() {
        this._tokenCache = Tokens;
    }

    private GetAccessToken(key: string): string {
        try {
            return this._tokenCache[key];
        } catch (e) {
            throw new Exceptions.Generic(null,"There is no token for the specified key : " + e.message);
        }
    }

    public GetRates = async (currency: string = null): Promise<RateInterface[]> => {
        let uri = currency ? "rates/" + currency: "rates";
        try {
            return await this._RESTcli.get(uri, null, false).then(ratesData => {
                return new Rates(ratesData, this).GetRates();
            });
        } catch (e) {
            throw new Exceptions.RateQuery(e);
        }
    };



    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



    public async CreateInvoice(invoice: Invoice, facade: string = Facade.Merchant, signRequest: boolean = true): Promise<InvoiceInterface> {
        invoice.guid = this.getGuid();
        invoice.token = this.GetAccessToken(facade);

        try {
            return await this._RESTcli.post("invoices", invoice, signRequest).then(invoiceData => {
                return <InvoiceInterface>JSON.parse(invoiceData);
            });
        } catch (e)
        {
            throw new Exceptions.InvoiceCreation("failed to deserialize BitPay server response (Invoice) : " + e.message);
        }
    }

    public async GetInvoice(invoiceId: string, facade: string = Facade.Merchant, signRequest: boolean = true): Promise<InvoiceInterface> {
        const params = {
            'token': this.GetAccessToken(facade)
        };

        try {
            return await this._RESTcli.get("invoices/" + invoiceId, params, signRequest).then(invoiceData => {
                return <InvoiceInterface>JSON.parse(invoiceData);
            });
        } catch (e)
        {
            throw new Exceptions.InvoiceCreation("failed to deserialize BitPay server response (Invoice) : " + e.message);
        }
    }

    public async GetInvoices(dateStart: string, dateEnd: string, status: string = null, orderId: string = null, limit: number = null, offset: number = null): Promise<InvoiceInterface[]> {
        let params = {};

        params["token"] = this.GetAccessToken(Facade.Merchant);
        params["dateStart"] = dateStart;
        params["dateEnd"] = dateEnd;

        if (status) {params["status"] = status}
        if (orderId) {params["orderId"] = orderId}
        if (limit) {params["limit"] = limit}
        if (offset) {params["offset"] = offset}

        try {
            return await this._RESTcli.get("invoices", params).then(invoiceData => {
                return <InvoiceInterface[]>JSON.parse(invoiceData);
            });
        } catch (e)
        {
            throw new Exceptions.InvoiceQuery("failed to deserialize BitPay server response (Invoice) : " + e.message);
        }
    }

    /**
     * Request a BitPay Invoice Webhook.
     *
     * @param invoiceId String The id of the Invoice.
     * @return True if the webhook was successfully requested, false otherwise.
     * @throws BitPayException BitPayException class
     * @throws InvoiceQueryException InvoiceQueryException class
     */
    public async GetInvoiceWebHook(invoiceId: string): Promise<Boolean> {
        let invoice;

        try {
            invoice = await this.GetInvoice(invoiceId);
        } catch (e) {
            throw new Exceptions.InvoiceQuery("Invoice with ID: " + invoiceId + " Not Found : " + e.message);
        }

        const params = {
            'token': invoice.token
        };

        try {
            return await this._RESTcli.post("invoices/" + invoiceId + "/notifications", params).then(invoiceData => {
                const regex = /"/gi;
                invoiceData = invoiceData.replace(regex, '');
                return invoiceData.toLowerCase() == "success";
            });
        } catch (e) {
            throw new Exceptions.InvoiceQuery("failed to deserialize BitPay server response (InvoiceQuery) : " + e.message);
        }
    }

    /**
     * Create a refund for a BitPay invoice.
     *
     * @param invoice     A BitPay invoice object for which a refund request should be made.  Must have been obtained using the merchant facade.
     * @param refundEmail The email of the buyer to which the refund email will be sent
     * @param amount      The amount of money to refund. If zero then a request for 100% of the invoice value is created.
     * @param currency    The three digit currency code specifying the exchange rate to use when calculating the refund bitcoin amount. If this value is "BTC" then no exchange rate calculation is performed.
     * @return True if the refund was successfully canceled, false otherwise.
     * @throws RefundCreationException RefundCreationException class
     */
    public async CreateRefund(invoice: Invoice, refundEmail: string, amount: number, currency: string): Promise<Boolean> {
        let refund = new Refund();
        refund.token = invoice.token;
        refund.guid = this.getGuid();
        refund.amount = amount;
        refund.refundEmail = refundEmail;
        refund.currency = currency;

        try {
            return await this._RESTcli.post("invoices/" + invoice.id + "/refunds", refund).then(refundData => {
                return <Boolean>JSON.parse(refundData);
            });
        } catch (e) {
            throw new Exceptions.RefundCreation("failed to deserialize BitPay server response (Refund) : " + e.message);
        }
    }

    /**
     * Retrieve a previously made refund request on a BitPay invoice.
     *
     * @param invoice  The BitPay invoice having the associated refund.
     * @param refundId The refund id for the refund to be updated with new status.
     * @return A BitPay invoice object with the associated Refund object updated.
     * @throws RefundQueryException RefundQueryException class
     */
    public async GetRefund(invoice: Invoice, refundId: string): Promise<RefundInterface> {
        const params = {
            'token': this.GetAccessToken(Facade.Merchant)
        };

        try {
            return await this._RESTcli.get("invoices/" + invoice.id + "/refunds/" + refundId, params).then(refundData => {
                return <RefundInterface>JSON.parse(refundData);
            });
        } catch (e) {
            throw new Exceptions.RefundQuery("failed to deserialize BitPay server response (Refund) : " + e.message);
        }
    }

    /**
     * Retrieve all refund requests on a BitPay invoice.
     *
     * @param invoice The BitPay invoice object having the associated refunds.
     * @return A BitPay invoice object with the associated Refund objects updated.
     * @throws RefundQueryException RefundQueryException class
     */
    public async GetRefunds(invoice: Invoice): Promise<RefundInterface[]> {
        const params = {
            'token': invoice.token
        };

        try {
            return await this._RESTcli.get("invoices/" + invoice.id + "/refunds", params).then(refundData => {
                return <RefundInterface[]>JSON.parse(refundData);
            });
        } catch (e) {
            throw new Exceptions.RefundQuery("failed to deserialize BitPay server response (Refund) : " + e.message);
        }
    }

    /**
     * Cancel a previously submitted refund request on a BitPay invoice.
     *
     * @param invoice  The BitPay invoice having the associated refund to be canceled. Must have been obtained using the merchant facade.
     * @param refund The refund to be canceled.
     * @return True if the refund was successfully canceled, false otherwise.
     * @throws RefundCancellationException RefundCancellationException class
     */
    public async CancelRefund(invoice: Invoice, refund: Refund): Promise<Boolean> {
        const params = {
            'token': refund.token
        };

        try {
            return await this._RESTcli.delete("invoices/" + invoice.id + "/refunds/" + refund.id, params).then(refundData => {
                const regex = /"/gi;
                refundData = refundData.replace(regex, '');
                return refundData.toLowerCase() == "success";
            });
        } catch (e) {
            throw new Exceptions.RefundCreation("failed to deserialize BitPay server response (Refund) : " + e.message);
        }
    }

    /**
     * Create a BitPay Bill.
     *
     * @param bill        A Bill object with request parameters defined.
     * @return A BitPay generated Bill object.
     * @throws BitPayException       BitPayException class
     * @throws BillCreationException BillCreationException class
     */
    public async CreateBill(bill: Bill): Promise<BillInterface> {
        bill.token = this.GetAccessToken(Facade.Merchant);

        try {
            return await this._RESTcli.post("bills", bill).then(billData => {
                return <BillInterface>JSON.parse(billData);
            });
        } catch (e) {
            throw new Exceptions.BillCreation("failed to deserialize BitPay server response (Bill) : " + e.message);
        }
    }

    /**
     * Retrieve a collection of BitPay bills.
     *
     * @param status The status to filter the bills.
     * @return A list of BitPay Bill objects.
     * @throws BitPayException    BitPayException class
     * @throws BillQueryException BillQueryException class
     */
    public async GetBills(status: string = null): Promise<BillInterface[]> {
        const params = {
            'token': this.GetAccessToken(Facade.Merchant)
        };

        if (status) {
            params["status"] = status
        }

        try {
            return await this._RESTcli.get("bills", params).then(billData => {
                return <BillInterface[]>JSON.parse(billData);
            });
        } catch (e) {
            throw new Exceptions.BillQuery("failed to deserialize BitPay server response (Bill) : " + e.message);
        }
    }

    /**
     * Retrieve a BitPay bill by bill id using the specified facade.
     *
     * @param billId      The id of the bill to retrieve.
     * @return A BitPay Bill object.
     * @throws BitPayException    BitPayException class
     * @throws BillQueryException BillQueryException class
     */
    public async GetBill(billId: string): Promise<BillInterface> {
        const params = {
            'token': this.GetAccessToken(Facade.Merchant)
        };

        try {
            return await this._RESTcli.get("bills/" + billId, params).then(billData => {
                return <BillInterface>JSON.parse(billData);
            });
        } catch (e) {
            throw new Exceptions.BillQuery("failed to deserialize BitPay server response (Bill) : " + e.message);
        }
    }

    /**
     * Update a BitPay Bill.
     *
     * @param bill   A Bill object with the parameters to update defined.
     * @param billId The Id of the Bill to udpate.
     * @return An updated Bill object.
     * @throws BitPayException     BitPayException class
     * @throws BillUpdateException BillUpdateException class
     */
    public async UpdateBill(bill: Bill, billId: string): Promise<BillInterface> {
        try {
            return await this._RESTcli.update("bills/" + billId, bill).then(billData => {
                return <BillInterface>JSON.parse(billData);
            });
        } catch (e) {
            throw new Exceptions.BillUpdate("failed to deserialize BitPay server response (Bill) : " + e.message);
        }
    }

    /**
     * Deliver a BitPay Bill.
     *
     * @param billId      The id of the requested bill.
     * @param billToken   The token of the requested bill.
     * @return A response status returned from the API.
     * @throws BillDeliveryException BillDeliveryException class
     */
    public async DeliverBill(billId: string, billToken: string): Promise<Boolean> {
        const params = {
            'token': billToken
        };

        try {
            return await this._RESTcli.post("bills/" + billId + "/deliveries", params).then(billData => {
                return (<string>JSON.parse(billData) == "Success");
            });
        } catch (e) {
            throw new Exceptions.BillDelivery("failed to deserialize BitPay server response (Bill) : " + e.message);
        }
    }

    /**
     * Submit BitPay Payout Recipients.
     *
     * @param recipients PayoutRecipients A PayoutRecipients object with request parameters defined.
     * @return array A list of BitPay PayoutRecipients objects..
     * @throws BitPayException BitPayException class
     * @throws PayoutCreationException PayoutCreationException class
     */
    public async SubmitPayoutRecipients(recipients: PayoutRecipients): Promise<PayoutRecipientInterface[]> {
        recipients.token = this.GetAccessToken(Facade.Payroll);
        recipients.guid = this.getGuid();

        try {
            return await this._RESTcli.post("recipients", recipients).then(recipientsData => {
                return <PayoutRecipientInterface[]>JSON.parse(recipientsData);
            });
        } catch (e) {
            throw new Exceptions.PayoutCreation("failed to deserialize BitPay server response (PayoutRecipients) : " + e.message);
        }
    }

    /**
     * Retrieve a collection of BitPay Payout Recipients.
     *
     * @param status String|null The recipient status you want to query on.
     * @param limit  int|null Maximum results that the query will return (useful for paging results).
     *               result).
     * @return array     A list of BitPayRecipient objects.
     * @throws BitPayException BitPayException class
     * @throws PayoutQueryException PayoutQueryException class
     */
    public async GetPayoutRecipients(status: string, limit: number): Promise<PayoutRecipientInterface[]> {
        const params = {
            'token': this.GetAccessToken(Facade.Payroll)
        };

        if (status) {
            params["status"] = status
        }
        if (limit) {
            params["limit"] = limit
        }

        try {
            return await this._RESTcli.get("recipients", params).then(recipientsData => {
                return <PayoutRecipientInterface[]>JSON.parse(recipientsData);
            });
        } catch (e) {
            throw new Exceptions.PayoutQuery("failed to deserialize BitPay server response (PayoutRecipients) : " + e.message);
        }
    }

    /**
     * Retrieve a BitPay payout recipient.
     *
     * @param recipientId String The id of the recipient to retrieve.
     * @return PayoutRecipient A BitPay PayoutRecipient object.
     * @throws BitPayException BitPayException class
     * @throws PayoutQueryException PayoutQueryException class
     */
    public async GetPayoutRecipient(recipientId: string): Promise<PayoutRecipientInterface> {
        const params = {
            'token': this.GetAccessToken(Facade.Payroll)
        };

        try {
            return await this._RESTcli.get("recipients/" + recipientId, params).then(recipientData => {
                return <PayoutRecipientInterface>JSON.parse(recipientData);
            });
        } catch (e) {
            throw new Exceptions.PayoutQuery("failed to deserialize BitPay server response (PayoutRecipient) : " + e.message);
        }
    }

    /**
     * Update BitPay Payout Recipient.
     *
     * @param recipientId String The id of the recipient to update.
     * @param label String The new label for the recipient.
     * @param notificationURL String The new notificationURL for the recipient.
     * @return PayoutRecipient A BitPay PayoutRecipient object.
     * @throws BitPayException BitPayException class
     * @throws PayoutQueryException PayoutQueryException class
     */
    public async UpdatePayoutRecipient(recipientId: string, label: string, notificationURL: string): Promise<PayoutRecipientInterface> {
        const params = {
            'token': this.GetAccessToken(Facade.Payroll)
        };

        if (label) {
            params["label"] = label
        }
        if (notificationURL) {
            params["notificationURL"] = notificationURL
        }

        try {
            return await this._RESTcli.update("recipients/" + recipientId, params).then(recipientData => {
                return <PayoutRecipientInterface>JSON.parse(recipientData);
            });
        } catch (e) {
            throw new Exceptions.PayoutUpdate("failed to deserialize BitPay server response (PayoutRecipient) : " + e.message);
        }
    }

    /**
     * Cancel a previously submitted refund request on a BitPay invoice.
     *
     * @param invoice  The BitPay invoice having the associated refund to be canceled. Must have been obtained using the merchant facade.
     * @param refund The refund to be canceled.
     * @return True if the refund was successfully canceled, false otherwise.
     * @throws RefundCancellationException RefundCancellationException class
     */
    public async DeletePayoutRecipient(recipientId: string): Promise<Boolean> {
        const params = {
            'token': this.GetAccessToken(Facade.Payroll)
        };

        try {
            return await this._RESTcli.delete("recipients/" + recipientId, params).then(recipientData => {
                return <Boolean>JSON.parse(recipientData);
            });
        } catch (e) {
            throw new Exceptions.PayoutDelete("failed to deserialize BitPay server response (PayoutRecipient) : " + e.message);
        }
    }

    /**
     * Request a BitPay payout recipient Webhook.
     *
     * @param recipientId String The id of the recipient.
     * @return True if the webhook was successfully requested, false otherwise.
     * @throws BitPayException BitPayException class
     * @throws PayoutQueryException PayoutQueryException class
     */
    public async GetPayoutRecipientWebHook(recipientId: string): Promise<Boolean> {
        const params = {
            'token': this.GetAccessToken(Facade.Payroll)
        };

        try {
            return await this._RESTcli.post("recipients/" + recipientId + "/notifications", params).then(recipientData => {
                return <Boolean>JSON.parse(recipientData);
            });
        } catch (e) {
            throw new Exceptions.PayoutQuery("failed to deserialize BitPay server response (PayoutRecipient) : " + e.message);
        }
    }

    /**
     * Submit a BitPay Payout batch.
     *
     * @param batch A PayoutBatch object with request parameters defined.
     * @return A BitPay generated PayoutBatch object.
     * @throws BitPayException         BitPayException class
     * @throws PayoutCreationException PayoutCreationException class
     */
    public async SubmitPayoutBatch(batch: PayoutBatch): Promise<PayoutBatchInterface> {

        let currencyInfo = await this.GetCurrencyInfo(batch.currency);
        let precision = !currencyInfo ? 2 : parseInt(currencyInfo["precision"]);

        let amount = 0.0;

        batch.instructions.forEach(instruction => {
            amount += instruction.amount;
        });

        batch.amount = parseFloat(amount.toFixed(precision));


        batch.token = this.GetAccessToken(Facade.Payroll);
        batch.guid = this.getGuid();

        try {
            return await this._RESTcli.post("payouts", batch).then(PayoutBatchData => {
                return <PayoutBatchInterface>JSON.parse(PayoutBatchData);
            });
        } catch (e) {
            throw new Exceptions.PayoutCreation("failed to deserialize BitPay server response (PayoutBatch) : " + e.message);
        }
    }

    /**
     * Retrieve a collection of BitPay payout batches.
     *
     * @param status The status to filter the Payout Batches.
     * @return A list of BitPay PayoutBatch objects.
     * @throws BitPayException      BitPayException class
     * @throws PayoutQueryException PayoutQueryException class
     */
    public async getPayoutBatches(status: string): Promise<PayoutBatchInterface[]> {
        const params = {
            'token': this.GetAccessToken(Facade.Payroll)
        };

        if (status) {
            params["status"] = status
        }

        try {
            return await this._RESTcli.get("payouts", params).then(payoutBatchData => {
                return <PayoutBatchInterface[]>JSON.parse(payoutBatchData);
            });
        } catch (e) {
            throw new Exceptions.PayoutQuery("failed to deserialize BitPay server response (PayoutBatch) : " + e.message);
        }
    }

    /**
     * Retrieve a BitPay payout batch by batch id using.  The client must have been previously authorized for the payroll facade.
     *
     * @param batchId The id of the batch to retrieve.
     * @return A BitPay PayoutBatch object.
     * @throws BitPayException      BitPayException class
     * @throws PayoutQueryException PayoutQueryException class
     */
    public async getPayoutBatch(batchId: string): Promise<PayoutBatchInterface> {
        const params = {
            'token': this.GetAccessToken(Facade.Payroll)
        };

        try {
            return await this._RESTcli.get("payouts/" + batchId, params).then(payoutBatchData => {
                return <PayoutBatchInterface>JSON.parse(payoutBatchData);
            });
        } catch (e) {
            throw new Exceptions.PayoutQuery("failed to deserialize BitPay server response (PayoutBatch) : " + e.message);
        }
    }

    /**
     * Cancel a BitPay Payout batch.
     *
     * @param batchId The id of the batch to cancel.
     * @return A BitPay generated PayoutBatch object.
     * @throws PayoutCancellationException PayoutCancellationException class
     */
    public async cancelPayoutBatch(batchId: string): Promise<PayoutBatchInterface> {
        let batch: PayoutBatchInterface;

        try {
            batch = await this.getPayoutBatch(batchId);
        } catch (e) {
            throw new Exceptions.PayoutQuery("Payout Batch with ID: " + batchId + " Not Found : " + e.message);
        }

        const params = {
            'token': batch.token
        };

        try {
            return await this._RESTcli.delete("payouts/" + batchId, params).then(payoutBatchData => {
                return <PayoutBatchInterface>JSON.parse(payoutBatchData);
            });
        } catch (e) {
            throw new Exceptions.PayoutCancellation("failed to deserialize BitPay server response (PayoutBatch) : " + e.message);
        }
    }
}
