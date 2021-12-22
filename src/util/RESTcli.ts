import {Env, KeyUtils} from "../index";
import * as qs from "querystring";
import * as rp from 'request-promise-native';
import * as elliptic from "elliptic";
import BitPayException from "../Exceptions/BitPayException";

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

        return{
            'x-identity': this._identity,
            'x-signature': this._keyUtils.sign(uri + formData, this._ecKey),
        };
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
                Object.assign(_options.headers, this.getSignedHeaders(_fullURL, _formData));
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
                Object.assign(_options.headers, this.getSignedHeaders(_fullURL, _query));
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
        try {
            const _fullURL = this._baseUrl + uri;
            const _options = JSON.parse(JSON.stringify(this._commonOptions));
            const _query = '?' + qs.stringify(parameters);
            Object.assign(_options.headers, this.getSignedHeaders(_fullURL, _query));

            _options.uri = _fullURL;
            _options.qs = parameters;

            return await rp.delete(_options).then((resp: any) => resp).then(resp => {
                return this.responseToJsonString(resp);
            });
        } catch (e) {
            throw new BitPayException(null, "RESTcli DELETE failed : " + e.message);
        }
    }

    public async update (
        uri: string,
        formData: any = {},
    ): Promise<string> {
        try {
            const _fullURL = this._baseUrl + uri;
            const _formData = JSON.stringify(formData);
            const _options = JSON.parse(JSON.stringify(this._commonOptions));
            Object.assign(_options.headers, this.getSignedHeaders(_fullURL, _formData));

            _options.uri = _fullURL;
            _options.body = formData;

            return await rp.put(_options).then((resp: any) => resp.data).then(resp => {
                return this.responseToJsonString(resp);
            });
        } catch (e) {
            throw new BitPayException(null, "RESTcli UPDATE failed : " + e.message);
        }
    }

    public async responseToJsonString(response: any) {
        try {
            if (response == null) {
                throw new BitPayException(null, "Error: HTTP response is null");
            }

            let responsObj = JSON.parse(JSON.stringify(response));

            if (responsObj.hasOwnProperty("status")) {
                if(responsObj["status"] === 'error'){
                    throw new BitPayException(null, "Error: " + responsObj["error"], null, responsObj["code"]);
                }
            }

            if (responsObj.hasOwnProperty("error")) {
                throw new BitPayException(null, "Error: " + responsObj["error"]);
            } else if (responsObj.hasOwnProperty("errors")) {
                let message = '';
                responsObj["errors"].forEach(function(error){
                    message += "\n" + error.toString();
                });
                throw new BitPayException(null, "Errors: " + message);
            }

            if (responsObj.hasOwnProperty("success")) {
                return JSON.stringify(responsObj["success"]);
            }

            if (responsObj.hasOwnProperty("data")) {
                return JSON.stringify(responsObj["data"]);
            }

            return JSON.stringify(responsObj);
        } catch (e) {
            throw new BitPayException(null, "failed to retrieve HTTP response body : " + e.message);
        }
    }
}
