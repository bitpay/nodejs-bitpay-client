import * as elliptic from 'elliptic';
import {BitPayExceptions as Exceptions, Config, Facade, KeyUtils, RESTcli, Tokens} from './index';
import {Invoice, InvoiceInterface, RateInterface, Rates} from "./Model";
import {Refund, RefundInterface} from "./Model/Invoice/Refund";

const fs = require('fs');

export class Client {
    private _configuration: Config;
    private _env: string;
    private _tokenCache: Tokens;
    private _ecKey: elliptic.ec.KeyPair;
    private _RESTcli: RESTcli;
    private _currenciesInfo: {};
    private _keyUtils = new KeyUtils();

    constructor(
        configFilePath: string,
        environment: string,
        privateKey: string,
        tokens: Tokens,
    ) {
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

    private init() {
        try {
            this._RESTcli = new RESTcli(this._env, this._ecKey);
            this.LoadAccessTokens();
            // this.LoadCurrencies();
        } catch (e) {
            throw new Exceptions.Generic(null, "failed to deserialize BitPay server response (Token array) : " + e.message);
        }
    }

    private getGuid(): string {
        let Min = 0;
        let Max = 99999999;

        return Min + (Math.random() * ((Max - Min) + 1)) + "";
    }

    private LoadAccessTokens() {
        try {
            this.ClearAccessTokenCache();

            let tokens = this._configuration.envConfig[this._env]["ApiTokens"];
            this._tokenCache = tokens;
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

    private LoadCurrencies() {
        try {
            this._currenciesInfo = this._RESTcli.get("currencies/", {}, false);
        } catch (e) {
            // No action required
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

    // /**
    //  * Create a BitPay bill using the POS facade.
    //  *
    //  * @param bill An Bill object with request parameters defined.
    //  * @return A BitPay generated Bill object.
    //  * @throws BillCreationException BillCreationException class
    //  */
    // public Bill createBill(Bill bill) throws BillCreationException {
    //     try {
    //         return this.createBill(bill, Facade.Merchant, true);
    //     } catch (Exception e) {
    //         throw new BillCreationException(e.getMessage());
    //     }
    // }
    //
    // /**
    //  * Create a BitPay Bill.
    //  *
    //  * @param bill        A Bill object with request parameters defined.
    //  * @param facade      The facade used to create it.
    //  * @param signRequest Signed request.
    //  * @return A BitPay generated Bill object.
    //  * @throws BitPayException       BitPayException class
    //  * @throws BillCreationException BillCreationException class
    //  */
    // public Bill createBill(Bill bill, String facade, boolean signRequest) throws BitPayException, BillCreationException {
    //     String token = this.getAccessToken(facade);
    //     bill.setToken(token);
    //     ObjectMapper mapper = new ObjectMapper();
    //     String json;
    //
    //     try {
    //         json = mapper.writeValueAsString(bill);
    //     } catch (JsonProcessingException e) {
    //         throw new BillCreationException("failed to serialize Bill object : " + e.getMessage());
    //     }
    //
    //     try {
    //         HttpResponse response = this.post("bills", json, signRequest);
    //         bill = mapper.readerForUpdating(bill).readValue(this.responseToJsonString(response));
    //     } catch (Exception e) {
    //         throw new BillCreationException("failed to deserialize BitPay server response (Bill) : " + e.getMessage());
    //     }
    //
    //     this.cacheToken(bill.getId(), bill.getToken());
    //     return bill;
    // }
    //
    // /**
    //  * Retrieve a BitPay bill by bill id using the public facade.
    //  *
    //  * @param billId The id of the bill to retrieve.
    //  * @return A BitPay Bill object.
    //  * @throws BillQueryException BillQueryException class
    //  */
    // public Bill getBill(String billId) throws BillQueryException {
    //     try {
    //         return this.getBill(billId, Facade.Merchant, true);
    //     } catch (Exception e) {
    //         throw new BillQueryException(e.getMessage());
    //     }
    // }
    //
    // /**
    //  * Retrieve a BitPay bill by bill id using the specified facade.
    //  *
    //  * @param billId      The id of the bill to retrieve.
    //  * @param facade      The facade used to retrieve it.
    //  * @param signRequest Signed request.
    //  * @return A BitPay Bill object.
    //  * @throws BitPayException    BitPayException class
    //  * @throws BillQueryException BillQueryException class
    //  */
    // public Bill getBill(String billId, String facade, boolean signRequest) throws BitPayException, BillQueryException {
    //     String token = this.getAccessToken(facade);
    //     final List<BasicNameValuePair> params = new ArrayList<BasicNameValuePair>();
    //     params.add(new BasicNameValuePair("token", token));
    //
    //     Bill bill;
    //
    //     try {
    //         HttpResponse response = this.get("bills/" + billId, params, signRequest);
    //         bill = new ObjectMapper().readValue(this.responseToJsonString(response), Bill.class);
    //     } catch (JsonProcessingException e) {
    //         throw new BillQueryException("failed to deserialize BitPay server response (Bill) : " + e.getMessage());
    //     } catch (Exception e) {
    //         throw new BillQueryException("failed to deserialize BitPay server response (Bill) : " + e.getMessage());
    //     }
    //
    //     return bill;
    // }
    //
    // /**
    //  * Retrieve a collection of BitPay bills.
    //  *
    //  * @param status The status to filter the bills.
    //  * @return A list of BitPay Bill objects.
    //  * @throws BitPayException    BitPayException class
    //  * @throws BillQueryException BillQueryException class
    //  */
    // public List<Bill> getBills(String status) throws BitPayException, BillQueryException {
    //     final List<BasicNameValuePair> params = new ArrayList<BasicNameValuePair>();
    //     params.add(new BasicNameValuePair("token", this.getAccessToken(Facade.Merchant)));
    //     params.add(new BasicNameValuePair("status", status));
    //
    //     List<Bill> bills;
    //
    //     try {
    //         HttpResponse response = this.get("bills", params);
    //         bills = Arrays.asList(new ObjectMapper().readValue(this.responseToJsonString(response), Bill[].class));
    //     } catch (JsonProcessingException e) {
    //         throw new BillQueryException("failed to deserialize BitPay server response (Bills) : " + e.getMessage());
    //     } catch (Exception e) {
    //         throw new BillQueryException("failed to deserialize BitPay server response (Bills) : " + e.getMessage());
    //     }
    //
    //     return bills;
    // }
    //
    // /**
    //  * Retrieve a collection of BitPay bills.
    //  *
    //  * @return A list of BitPay Bill objects.
    //  * @throws BitPayException    BitPayException class
    //  * @throws BillQueryException BillQueryException class
    //  */
    // public List<Bill> getBills() throws BitPayException, BillQueryException {
    //     final List<BasicNameValuePair> params = new ArrayList<BasicNameValuePair>();
    //     params.add(new BasicNameValuePair("token", this.getAccessToken(Facade.Merchant)));
    //
    //     List<Bill> bills;
    //
    //     try {
    //         HttpResponse response = this.get("bills", params);
    //         bills = Arrays.asList(new ObjectMapper().readValue(this.responseToJsonString(response), Bill[].class));
    //     } catch (JsonProcessingException e) {
    //         throw new BillQueryException("failed to deserialize BitPay server response (Bills) : " + e.getMessage());
    //     } catch (Exception e) {
    //         throw new BillQueryException("failed to deserialize BitPay server response (Bills) : " + e.getMessage());
    //     }
    //
    //     return bills;
    // }
    //
    // /**
    //  * Update a BitPay Bill.
    //  *
    //  * @param bill   A Bill object with the parameters to update defined.
    //  * @param billId The Id of the Bill to udpate.
    //  * @return An updated Bill object.
    //  * @throws BitPayException     BitPayException class
    //  * @throws BillUpdateException BillUpdateException class
    //  */
    // public Bill updateBill(Bill bill, String billId) throws BitPayException, BillUpdateException {
    //     ObjectMapper mapper = new ObjectMapper();
    //     String json;
    //     try {
    //         json = mapper.writeValueAsString(bill);
    //     } catch (JsonProcessingException e) {
    //         throw new BillUpdateException("failed to serialize Bill object : " + e.getMessage());
    //     }
    //
    //     try {
    //         HttpResponse response = this.update("bills/" + billId, json);
    //         bill = mapper.readerForUpdating(bill).readValue(this.responseToJsonString(response));
    //     } catch (Exception e) {
    //         throw new BillUpdateException("failed to deserialize BitPay server response (Bill) : " + e.getMessage());
    //     }
    //
    //     this.cacheToken(bill.getId(), bill.getToken());
    //     return bill;
    // }
    //
    // /**
    //  * Deliver a BitPay Bill.
    //  *
    //  * @param billId    The id of the requested bill.
    //  * @param billToken The token of the requested bill.
    //  * @return A response status returned from the API.
    //  * @throws BillDeliveryException BillDeliveryException class
    //  */
    // public String deliverBill(String billId, String billToken) throws BillDeliveryException {
    //     try {
    //         return this.deliverBill(billId, billToken, true);
    //     } catch (Exception e) {
    //         throw new BillDeliveryException(e.getMessage());
    //     }
    // }
    //
    // /**
    //  * Deliver a BitPay Bill.
    //  *
    //  * @param billId      The id of the requested bill.
    //  * @param billToken   The token of the requested bill.
    //  * @param signRequest Allow unsigned request
    //  * @return A response status returned from the API.
    //  * @throws BillDeliveryException BillDeliveryException class
    //  */
    // public String deliverBill(String billId, String billToken, boolean signRequest) throws BillDeliveryException {
    //     Map<String, String> map = new HashMap<>();
    //     map.put("token", billToken);
    //     ObjectMapper mapper = new ObjectMapper();
    //     String json;
    //     String result;
    //     try {
    //         json = mapper.writerWithDefaultPrettyPrinter().writeValueAsString(map);
    //     } catch (JsonProcessingException e) {
    //         throw new BillDeliveryException("failed to serialize Bill object : " + e.getMessage());
    //     }
    //
    //     try {
    //         HttpResponse response = this.post("bills/" + billId + "/deliveries", json, signRequest);
    //         result = this.responseToJsonString(response).replace("\"", "");
    //     } catch (Exception e) {
    //         throw new BillDeliveryException("failed to deserialize BitPay server response (Bill) : " + e.getMessage());
    //     }
    //
    //     return result;
    // }
}
