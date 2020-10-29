import * as elliptic from 'elliptic';
import {BitPayExceptions as Exceptions, Config, Facade, KeyUtils, RESTcli, Tokens} from './index';
import {Invoice, InvoiceInterface, RateInterface, Rates} from "./models";

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
}
