/* eslint-disable @typescript-eslint/no-explicit-any */
import { Env, KeyUtils } from '../index';
import { ec } from 'elliptic';
import KeyPair = ec.KeyPair;
import * as qs from 'querystring';
import BitPayException from '../Exceptions/BitPayException';
import { BitPayResponseParser } from '../util/BitPayResponseParser';
import { BitPayExceptionProvider } from '../Exceptions/BitPayExceptionProvider';
import { LoggerProvider } from '../Logger/LoggerProvider';

export class BitPayClient {
  private readonly ecKey: KeyPair;
  private readonly identity: string;
  private readonly baseUrl: string;
  private readonly defaultHeaders: Record<string, string>;
  private readonly keyUtils: KeyUtils;
  private readonly responseParser: BitPayResponseParser;

  public constructor(baseUrl: string, ecKey: KeyPair, identity: string) {
    this.ecKey = ecKey;
    this.baseUrl = baseUrl;
    this.identity = identity;
    this.defaultHeaders = {
      'X-Accept-Version': Env.BitpayApiVersion,
      'x-bitpay-plugin-info': Env.BitpayPluginInfo,
      'x-bitpay-api-frame': Env.BitpayApiFrame,
      'x-bitpay-api-frame-version': Env.BitpayApiFrameVersion,
      'Content-Type': 'application/json'
    };
    this.keyUtils = new KeyUtils();
    this.responseParser = new BitPayResponseParser();
  }

  /**
   *
   * @param uri
   * @param parameters
   * @param signatureRequired
   * @returns
   */
  public async get(uri: string, parameters: any, signatureRequired = false): Promise<any> {
    try {
      let fullUrl = this.baseUrl + uri;

      if (parameters !== null) {
        const query = '?' + qs.stringify(parameters);
        fullUrl = fullUrl + query;
      }

      let headers = this.defaultHeaders;

      if (signatureRequired) {
        headers = this.getSignatureHeaders(fullUrl, headers, null);
      }

      const method = 'GET';

      LoggerProvider.getLogger().logRequest(method, fullUrl, null);

      const response = await fetch(fullUrl, {
        method: method,
        headers: headers
      });

      const jsonObject = (await response.json()) as object;

      LoggerProvider.getLogger().logResponse(method, fullUrl, JSON.stringify(jsonObject));

      return this.responseParser.getJsonDataFromJsonResponse(jsonObject);
    } catch (e) {
      if (e instanceof BitPayException) {
        throw e;
      }

      BitPayExceptionProvider.throwApiExceptionWithMessage(JSON.stringify(e.message), null);
    }
  }

  /**
   *
   * @param uri
   * @param formData
   * @param signatureRequired
   * @returns
   */
  public async post(uri: string, formData: any = {}, signatureRequired = true): Promise<any> {
    try {
      formData = JSON.stringify(formData);
      const fullUrl = this.baseUrl + uri;
      let headers = this.defaultHeaders;

      if (signatureRequired) {
        headers = this.getSignatureHeaders(fullUrl, headers, formData);
      }

      const method = 'POST';

      const response = await fetch(fullUrl, {
        method: method,
        headers: headers,
        body: formData
      });

      const jsonObject = (await response.json()) as object;

      LoggerProvider.getLogger().logResponse(method, fullUrl, JSON.stringify(jsonObject));

      return this.responseParser.getJsonDataFromJsonResponse(jsonObject);
    } catch (e) {
      if (e instanceof BitPayException) {
        throw e;
      }

      BitPayExceptionProvider.throwApiExceptionWithMessage(JSON.stringify(e.message), null);
    }
  }

  /**
   *
   * @param uri
   * @param formData
   * @param signatureRequired
   * @returns
   */
  public async put(uri: string, formData: any = {}, signatureRequired = true): Promise<any> {
    try {
      formData = JSON.stringify(formData);

      const fullUrl = this.baseUrl + uri;
      let headers = this.defaultHeaders;

      if (signatureRequired) {
        headers = this.getSignatureHeaders(fullUrl, headers, formData);
      }

      const method = 'PUT';

      const response = await fetch(fullUrl, {
        method: method,
        headers: headers,
        body: formData
      });

      const jsonObject = (await response.json()) as object;

      LoggerProvider.getLogger().logResponse(method, fullUrl, JSON.stringify(jsonObject));

      return this.responseParser.getJsonDataFromJsonResponse(jsonObject);
    } catch (e) {
      if (e instanceof BitPayException) {
        throw e;
      }

      BitPayExceptionProvider.throwApiExceptionWithMessage(JSON.stringify(e.message), null);
    }
  }

  /**
   *
   * @param uri
   * @param parameters
   * @param signatureRequired
   * @returns
   */
  public async delete(uri: string, parameters: any = {}, signatureRequired = true): Promise<any> {
    try {
      const query = '?' + qs.stringify(parameters);
      const fullUrl = this.baseUrl + uri + query;
      let headers = this.defaultHeaders;

      if (signatureRequired) {
        headers = this.getSignatureHeaders(fullUrl, headers, null);
      }

      const method = 'DELETE';

      const response = await fetch(fullUrl, {
        method: method,
        headers: headers
      });

      const jsonObject = (await response.json()) as object;

      LoggerProvider.getLogger().logResponse(method, fullUrl, JSON.stringify(jsonObject));

      return this.responseParser.getJsonDataFromJsonResponse(jsonObject);
    } catch (e) {
      if (e instanceof BitPayException) {
        throw e;
      }

      BitPayExceptionProvider.throwApiExceptionWithMessage(JSON.stringify(e.message), null);
    }
  }

  /**
   *
   * @param fullUrl
   * @param headers
   * @param jsonData
   * @throws BitPayApiExtension
   */
  private getSignatureHeaders(fullUrl: string, headers: Record<string, string>, jsonData: string) {
    if (jsonData !== null) {
      fullUrl = fullUrl + jsonData;
    }

    try {
      headers['X-Signature'] = this.keyUtils.sign(fullUrl, this.ecKey);
    } catch (e) {
      BitPayExceptionProvider.throwGenericExceptionWithMessage('Wrong ecKey. ' + e.message);
    }
    headers['X-Identity'] = this.identity;

    return headers;
  }
}
