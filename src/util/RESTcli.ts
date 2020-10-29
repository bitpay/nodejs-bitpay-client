import {KeyUtils} from "../index";
import * as qs from "querystring";
import * as rp from 'request-promise';
import * as _ from 'underscore';
import * as elliptic from "elliptic";
import {Env} from "../index";
import BitPayException from "../exceptions/BitPayException";

export class RESTcli {
    public _ecKey: elliptic.ec.KeyPair;
    public _identity: string;
    public _baseUrl: string;
    private _keyUtils = new KeyUtils();

    private _commonOptions: {};

    public constructor(environment: string, ecKey: elliptic.ec.KeyPair) {
        this._ecKey = ecKey;
        this._baseUrl = environment.toUpperCase() == Env.Test ? Env.TestUrl : Env.ProdUrl;
        this.init();
    }

    private init() {
        try {
            this._identity = this._keyUtils.getPublicKeyFromPrivateKey(this._ecKey);

            this._commonOptions = {
                headers: {
                    'x-accept-version': Env.BitpayApiVersion,
                    'x-bitpay-plugin-info': Env.BitpayPluginInfo,
                    'x-bitpay-api-frame': Env.BitpayApiFrame,
                    'x-bitpay-api-frame-version': Env.BitpayApiFrameVersion,
                    'Content-Type': 'application/json'
                },
                json: true
            };
        } catch (e) {
            throw new BitPayException(null,"RESTcli init failed : " + e.message);
        }
    }

    private getSignedHeaders(uri: string, formData: string) {
        let exp1 = this._keyUtils.sign(uri + formData, this._ecKey);

        let result = {
            'x-identity': this._identity,
            'x-signature': this._keyUtils.sign(uri + formData, this._ecKey),
        };

        return result;
    }

    public async post (
        uri: string,
        formData: any = {},
        signatureRequired: boolean = true,
    ): Promise<any> {
        try {
            const _fullURL = this._baseUrl + uri;
            const _formData = JSON.stringify(formData);

            const _options = JSON.parse(JSON.stringify(this._commonOptions));

            _options.uri = _fullURL;
            _options.body = JSON.parse(JSON.stringify(formData));

            if (signatureRequired) {
                _.extend(_options.headers, this.getSignedHeaders(_fullURL, _formData));
            }

            return await rp.post(_options).then((resp: any) => resp).then(resp => {
                return this.responseToJsonString(resp);
            });
        } catch (e) {
            throw new BitPayException(null,"RESTcli POST failed : " + e.message);
        }
    }

    public async get (
        uri: string,
        parameters: any = {},
        signatureRequired: boolean = true,
    ): Promise<any> {
        try {
            const _fullURL = this._baseUrl + uri;
            const _options = JSON.parse(JSON.stringify(this._commonOptions));
            const _query = '?' + qs.stringify(parameters);

            _options.uri = _fullURL;
            _options.qs = parameters;

            if (signatureRequired) {
                _.extend(_options.headers, this.getSignedHeaders(_fullURL, _query));
            }

            return await rp.get(_options).then((resp: any) => resp).then(resp => {
                return this.responseToJsonString(resp);
            });
        } catch (e) {
            throw new BitPayException(null,"RESTcli GET failed : " + e.message);
        }
    }

    public async delete (
        uri: string,
        parameters: any = {},
    ): Promise<string> {
        const _fullURL = this._baseUrl + uri;
        const _options = JSON.parse(JSON.stringify(this._commonOptions));
        const _payload = '?' + qs.stringify(parameters);
        _.extend(_options.headers, this.getSignedHeaders(_fullURL, _payload));

        _options.uri = _fullURL;
        _options.qs = parameters;

        return rp.delete(_options).then((resp: any) => resp.data);
    }

    public async update (
        uri: string,
        formData: any = {},
    ): Promise<string> {
        const _fullURL = this._baseUrl + uri;
        const _formData = JSON.stringify(formData);
        const _options = JSON.parse(JSON.stringify(this._commonOptions));
            _.extend(_options.headers, this.getSignedHeaders(_fullURL, _formData));

        _options.uri = _fullURL;
        _options.body = formData;

        return rp.put(_options).then((resp: any) => resp.data);
    }

    public async responseToJsonString(response: any) {
        try {
            if (response == null) {
                throw new BitPayException(null, "Error: HTTP response is null");
            }

            let responsObj = JSON.parse(JSON.stringify(response));

            if (responsObj.hasOwnProperty("error")) {
                throw new BitPayException(null, "Error: " + responsObj["error"]);
            } else if (responsObj.hasOwnProperty("errors")) {
                let message = '';
                responsObj["errors"].forEach(function(error){
                    message += "\n" + error.toString();
                });
                throw new BitPayException(null, "Errors: " + message);
            }

            return JSON.stringify(responsObj["data"]);
        } catch (e) {
            throw new BitPayException("failed to retrieve HTTP response body : " + e.message);
        }
    }
}
