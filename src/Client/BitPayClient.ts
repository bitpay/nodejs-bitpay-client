/* eslint-disable @typescript-eslint/no-explicit-any */
import fetch from 'node-fetch';
import { Env, KeyUtils } from '../index';
import { ec } from 'elliptic';
import KeyPair = ec.KeyPair;
import * as qs from 'querystring';
import BitPayException from '../Exceptions/BitPayException';
import { BitPayResponseParser } from '../util/BitPayResponseParser';

export class BitPayClient {
  private readonly ecKey: KeyPair;
  private readonly identity: string;
  private readonly baseUrl: string;
  private readonly defaultHeaders: object;
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

      const result = await fetch(fullUrl, {
        method: 'get',
        headers: headers
      });

      return this.responseParser.responseToJsonString(result);
    } catch (e) {
      let message;
      if (e instanceof BitPayException) {
        message = e.message;
      } else {
        message = e.response.data;
      }

      throw new BitPayException(null, 'GET failed : ' + JSON.stringify(message));
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

      const result = await fetch(fullUrl, {
        method: 'post',
        headers: headers,
        body: formData
      });
      return this.responseParser.responseToJsonString(result);
    } catch (e) {
      let message: string;
      if (e instanceof BitPayException) {
        message = e.message;
      } else {
        message = e.response.data;
      }

      throw new BitPayException(null, 'Post failed : ' + JSON.stringify(message));
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

      const result = await fetch(fullUrl, {
        method: 'PUT',
        headers: headers,
        body: formData
      });
      return this.responseParser.responseToJsonString(result);
    } catch (e) {
      let message: string;
      if (e instanceof BitPayException) {
        message = e.message;
      } else {
        message = e.response.data;
      }

      throw new BitPayException(null, 'Put failed : ' + JSON.stringify(message));
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

      const result = await fetch(fullUrl, {
        method: 'delete',
        headers: headers
      });
      return this.responseParser.responseToJsonString(result);
    } catch (e) {
      let message: string;
      if (e instanceof BitPayException) {
        message = e.message;
      } else {
        message = e.response.data;
      }

      throw new BitPayException(null, 'Delete failed : ' + JSON.stringify(message));
    }
  }

  /**
   *
   * @param fullUrl
   * @param headers
   * @param jsonData
   * @returns
   */
  private getSignatureHeaders(fullUrl: string, headers: object, jsonData: string) {
    if (jsonData !== null) {
      fullUrl = fullUrl + jsonData;
    }

    headers['X-Signature'] = this.keyUtils.sign(fullUrl, this.ecKey);
    headers['X-Identity'] = this.identity;

    return headers;
  }
}
