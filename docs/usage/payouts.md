# Payouts

The BitPay Payout service enables businesses to payout fleets of users globally in one common
format using digital currency, to any internet-connected user, regardless of country or banking
status. The payout recipient could be an individual, or a company or a vendor that offered their
services or payout employees.

This resource allows merchants to submit individual cryptocurrency payout requests to active
bitpay recipients. The typical use case for this resource would be a company who wants to offer
cryptocurrency withdrawals to their customers, like marketplaces or affiliate networks.

> **Note**:
The BitPay payout service is only API based. Merchants will need to build their own
implementation as there are currently no dashboard functionalities to submit payout
requests.

The BitPay Payout service consists in 2 main processes:

A. Customer is invited by the merchant to signup for a BitPay personal account
The Merchant first needs to invite its customers to sign up for a BitPay personal account
where they will be invited to provide some documents for verifications (KYC) and provide a
bitcoin withdrawal address to be used for the payouts. To do this, the Merchant will need to
use the Recipients API resource.

B. Merchant sends Payout requests
Once a recipient has reached the active status, the Merchant has the option to use the
Payouts or PayoutBatches API resource to submit payout requests to BitPay.

1. Merchants will need to keep an operational reserve on their BitPay account to ensure the
batches are executed on the same day they are requested and will have to fund their
account (via bank transfer or cryptocurrency deposit) if necessary.

2. BitPay will only execute pending batches if the merchant has enough funds available on
their BitPay merchant account. Pending payout requests are executed twice per day,
2pm & 9pm UTC.

3. When the bitcoin transaction is fully confirmed on the network (6 block confirmations),
BitPay notifies the merchant (email & webhooks) that the Payout Batch has reached the
status "complete".


## Create payout request

Allows a merchant to invite clients to sign up for a BitPay personal account.

`POST /payouts`

Facades `PAYOUT`

### HTTP Request

Headers

| Fields | Description | Presence |
| --- | --- | :---: |
| `X-Accept-Version` | Must be set to `2.0.0` for requests to the BitPay API. | Mandatory |
| `Content-Type` | must be set to `application/json` for requests to the BitPay API. | Mandatory |
| `X-Identity` | the hexadecimal public key generated from the client private key. This header is required when using tokens with higher privileges (`merchant` facade). When using standard `pos` facade token directly from the [BitPay dashboard](https://test.bitpay.com/dashboard/merchant/api-tokens) (with `"Require Authentication"` disabled), this header is not needed. | Mandatory |
| `X-Signature` | header is the ECDSA signature of the full request URL concatenated with the request body, signed with your private key. This header is required when using tokens with higher privileges (`merchant` facade). When using standard `pos` facade token directly from the [BitPay dashboard](https://test.bitpay.com/dashboard/merchant/api-tokens) (with `"Require Authentication"` disabled), this header is not needed. | Mandatory |

Body

| Name | Description | Type | Presence |
| --- | --- | :---: | :---: |
| `amount` | The payout request amount in the requested currency. The minimum amount per instruction is `$5 USD` equivalent. | `number` | Mandatory |
| `currency` | Currency code set for the request `amount` (ISO 4217 3-character currency code). | `string` | Mandatory |
| `ledgerCurrency` | Ledger currency code set for the payout request (ISO 4217 3-character currency code), it indicates on which ledger the payout request will be recorded. If not provided in the request, this parameter will be set by default to the active ledger currency on your account, e.g. your settlement currency. Supported ledger currency codes for payout requests are EUR, USD, GBP, CAD, NZD, AUD, ZAR, JPY, BTC, BCH, GUSD, USDC, PAX, XRP, BUSD, DOGE, ETH, WBTC, DAI. | `string` | Mandatory |
| `reference` | For the merchant to pass their own reference label for this batch. It will be passed-through on each response for you to identify the batch in your system. Maximum string length is 100 characters | `string` | Optional |
| `notificationURL` | URL to which BitPay sends webhook notifications. HTTPS is mandatory. | `string` | Optional |
| `notificationEmail` | Merchant email address for notification of payout status change. | `string` | Optional |
| `email` | Email address of an active recipient. Note: In the future, BitPay may allow Recipients to update the email address tied to their personal account. BitPay encourages the use of `recipientId` or `shopperId` when programatically creating payouts requests. | `string` | Conditional |
| `recipientId` | Active recipient id. This is the id assigned by BitPay for a given recipient email during the onboarding process (see Recipients resource). | `string` | Conditional |
| `shopperId` | This is the unique id assigned by BitPay if the shopper used his personal BitPay account to authenticate and pay an invoice. For customers signing up for a brand new BitPay personal account, this id will only be created as part of the payout onboarding. The same field would also be available on paid invoices for customers who signed in with their BitPay personal accounts before completing the payment. This can allow merchants to monitor the activity of a customer (deposits & payouts). Merchants have the choice to pass this field in the payload instead of the `email` or `recipientId`. Merchants can only issue payout requests to recipients in an `active` status. | `string` | Conditional |
| `label` | For merchant use, pass through - can be the customer name or unique merchant reference assigned by the merchant to to the recipient. | `string` | Optional |
| `effectiveDate` | Effective date and time (UTC) for the request. ISO-8601 date format `yyyy-mm-dd`. | `string` | Optional |
| `token` | Approved payout facade token. | `string` | Mandatory |

An example code of the create payout request

```js
let createdPayout;
let recipients;

let payout0 = new Payout(6.75, Currencies.USD, Currencies.ETH);

recipients = await client.GetPayoutRecipients('active', 2);
payout0.recipientId = recipients[1].id;

createdPayout = await client.SubmitPayout(payout0);
```

The BitPay server shall return an HTTP 200 OK response, and the body of the response shall be
the payout object.

The following table gives a description of the Payout object and all the fields returned by the
BitPay server when merchants create or retrieve a payout request. The following subsections
will use this table as a reference for the body of the server response.

| Name | Description | Type |
| --- | --- | :---: |
| `facade` | This indicates the facade used to create the payout request. When the payout facade is used to create a payout request, the BitPay server returns the payout object as seen from the payout facade, that is `"payout/payout"`. | `string` |
| `data` | Payout data object. | `object` |
| &rarr; `id` | Payout request id. | `string` |
| &rarr; `recipientId` | BitPay recipient id, assigned by BitPay for a given recipient email during the onboarding process (see Recipients resource). | `string` |
| &rarr; `shopperId` | This is the unique id assigned by BitPay if the shopper used his personal BitPay account to authenticate and pay an invoice. For customers signing up for a brand new BitPay personal account, this id will only be created as part of the payout onboarding. The same field would also be available on paid invoices for customers who signed in with their BitPay personal accounts before completing the payment. This can allow merchants to monitor the activity of a customer (deposits & payouts). | `string` |
| &rarr; `amount` | The amount to be sent to the recipient in the indicated `currency`. The minimum amount per instruction is `$5 USD` equivalent. | `number` |
| &rarr; `currency` | Currency code set for the batch amount (ISO 4217 3-character currency code). | `string` |
| &rarr; `ledgerCurrency` | Ledger currency code set for the payout request (ISO 4217 3-character currency code), it indicates on which ledger the payout request will be recorded. If not provided in the request, this parameter will be set by default to the active ledger currency on your account, e.g. your settlement currency. Supported ledger currency codes for payout requests are EUR, USD, GBP, CAD, NZD, AUD, ZAR, JPY, BTC, BCH, GUSD, USDC, PAX, XRP, BUSD, DOGE, ETH, WBTC, DAI. | `string` |
| &rarr; `exchangeRates` | Exchange rates keyed by source and target currencies.  | `array` |
| &rarr; `email` | Email address of an active recipient. Note: In the future, BitPay may allow recipients to update the email address tied to their personal account. BitPay encourages the use of `recipientId` or `shopperId` when programatically creating payouts requests. | `string` |
| &rarr; `reference` | Present only if specified by the merchant in the request. Merchants can pass their own unique identifier in this field for reconciliation purposes. Maximum string length is 100 characters. | `string` |
| &rarr; `label` | For merchant use, pass through - can be the customer name or unique merchant reference assigned by the merchant to the recipient. | `string` |
| &rarr; `notificationURL` | URL to which BitPay sends webhook notifications. HTTPS is mandatory | `string` |
| &rarr; `notificationEmail` | Merchant email address for notification of payout status change.  | `string` |
| &rarr; `effectiveDate` | DescrEffective date and time (UTC) for the batch. ISO-8601 format `yyyy-mm-ddThh:mm:ssZ` - Note that the time of day will automatically be set to 09:00:00.000 UTC time for the given day.iption | `string` |
| &rarr; `requestDate` | Date and time (UTC) when BitPay received the batch. ISO-8601 format `yyyy-mm-ddThh:mm:ssZ`. | `string` |
| &rarr; `status` | Payout request status, the possible values are: ● new - initial status when the payout batch is created ● funded - if there are enough funds available on the merchant account, the payout batches are set to funded. This happens at the daily cutoff time for payout processing, e.g. 2pm and 9pm UTC ● processing - the payout batches switch to this status whenever the corresponding cryptocurrency transactions are broadcasted by BitPay ● complete - the payout batches are marked as complete when the cryptocurrency transaction has reached the typical target confirmation for the corresponding asset. For instance, 6 confirmations for a bitcoin transaction. ● cancelled - when the merchant cancels a payout batch (only possible for requests in the status new | `string` |
| &rarr; `transactions` | Contains the cryptocurrency transaction details for the executed payout request. | `string` |
| &rarr; &rarr; `txid` | Cryptocurrency transaction hash for the executed payout.  | `string` |
| &rarr; &rarr; `amount` | Amount of cryptocurrency sent to the requested address. | `number` |
| &rarr; &rarr; `date` | Date and time (UTC) when the cryptocurrency transaction is broadcasted. ISO-8601 format `yyyy-mm-ddThh:mm:ssZ`. | `string` |
| &rarr; `token` | Resource token - this token is actually derived from the API token used to submit the payout request and is tied to the specific payout resource id created. | `string` |
| `status` | Set to `success` in case of successful request and to `error` if the request failed, a description of the error will then be indicated in the `message` field. | `string` |
| `message` | In case of error, this field will contain a description message. Set to `null` if the request is successful. | `string` |


HTTP Response

```json
{
    "facade":"payout/payout",
    "data":{
        "id":"JMwv8wQCXANoU2ZZQ9a9GH",
        "recipientId":"LDxRZCGq174SF8AnQpdBPB",
        "shopperId":"7qohDf2zZnQK5Qanj8oyC2",
        "amount":10,
        "currency":"USD",
        "ledgerCurrency":"GBP",
        "exchangeRates":{
            "BTC":{
                "USD":39390.47,
                "GBP":27883.962246420004
            }
        },
        "email":"john@doe.com",
        "reference":"payout_20210527",
        "label":"John Doe",
        "notificationURL":"https://yournotiticationURL.com/wed3sa0wx1rz5bg0bv97851eqx",
        "notificationEmail":"merchant@email.com",
        "effectiveDate":"2021-05-27T09:00:00.000Z",
        "requestDate":"2021-05-27T10:47:37.834Z",
        "status":"complete",
        "transactions":[
            {
                "txid":"db53d7e2bf3385a31257ce09396202d9c2823370a5ca186db315c45e24594057",
                "amount":0.000254,
                "date":"2021-05-27T11:04:23.155Z"
            }
        ],
        "token":"6RZSTPtnzEaroAe2X4YijenRiqteRDNvzbT8NjtcHjUVd9FUFwa7dsX8RFgRDDC5SL"
    },
    "status":"success",
    "message":null
}
```

## Get payout

`GET /payouts/:payoutId`

Facades `PAYOUT`

### HTTP Request

URL Parameters

| Parameter | Description | Type | Presence |
| --- | --- | :---: | :---: |
| `payoutId` | The specific payout request id you want to retrieve. | `string` | Mandatory |
| `?token=` | Approved `payout` facade token. | `string` | Mandatory |

Headers

| Fields | Description | Presence |
| --- | --- | :---: |
| `X-Accept-Version` | Must be set to `2.0.0` for requests to the BitPay API. | Mandatory |
| `Content-Type` | must be set to `application/json` for requests to the BitPay API. | Mandatory |
| `X-Identity` | the hexadecimal public key generated from the client private key. This header is required when using tokens with higher privileges (`merchant` facade). When using standard `pos` facade token directly from the [BitPay dashboard](https://test.bitpay.com/dashboard/merchant/api-tokens) (with `"Require Authentication"` disabled), this header is not needed. | Mandatory |
| `X-Signature` | header is the ECDSA signature of the full request URL concatenated with the request body, signed with your private key. This header is required when using tokens with higher privileges (`merchant` facade). When using standard `pos` facade token directly from the [BitPay dashboard](https://test.bitpay.com/dashboard/merchant/api-tokens) (with `"Require Authentication"` disabled), this header is not needed. | Mandatory |

An example code to fetch single payout by `payoutId`

```js
retrievedPayout = await client.GetPayout(createdPayout.id);
```

HTTP Response

```json
{
    "facade":"payout/payout",
    "data":{
        "id":"JMwv8wQCXANoU2ZZQ9a9GH",
        "recipientId":"LDxRZCGq174SF8AnQpdBPB",
        "shopperId":"7qohDf2zZnQK5Qanj8oyC2",
        "amount":10,
        "currency":"USD",
        "ledgerCurrency":"GBP",
        "exchangeRates":{
            "BTC":{
                "USD":39390.47,
                "GBP":27883.962246420004
            }
        },
        "email":"john@doe.com",
        "reference":"payout_20210527",
        "label":"John Doe",
        "notificationURL":"https://yournotiticationURL.com/wed3sa0wx1rz5bg0bv97851eqx",
        "notificationEmail":"merchant@email.com",
        "effectiveDate":"2021-05-27T09:00:00.000Z",
        "requestDate":"2021-05-27T10:47:37.834Z",
        "status":"complete",
        "transactions":[
            {
                "txid":"db53d7e2bf3385a31257ce09396202d9c2823370a5ca186db315c45e24594057",
                "amount":0.000254,
                "date":"2021-05-27T11:04:23.155Z"
            }
        ],
        "token":"6RZSTPtnzEaroAe2X4YijenRiqteRDNvzbT8NjtcHjUVd9FUFwa7dsX8RFgRDDC5SL"
    },
    "status":"success",
    "message":null
}
```

## Get payouts

`GET /payouts`

Facades `PAYOUT`

### HTTP Request

URL Parameters

| Parameter | Description | Type | Presence |
| --- | --- | :---: | :---: |
| `?token=` | Approved `payout` facade token. | `string` | Mandatory |
| `&startDate=` | The start of the date window to query for payout requests. Format `YYYY-MM-DD`. | `string` | Optional |
| `&endDate=` | the end of the date window to query for payout requests. Format `YYYY-MM-DD` | `string` | Optional |
| `&status=` | The payout request status you want to query on.  | `string` | Optional |
| `&reference=` | The optional reference specified at payout request creation. | `string` | Optional |
| `&limit=` | Maximum results that the query will return (useful for paging results). | `number` | Optional |
| `&offset= ` | Number of results to offset (ex. skip 10 will give you results starting with the 11th result). | `number` | Optional |

Headers

| Fields | Description | Presence |
| --- | --- | :---: |
| `X-Accept-Version` | Must be set to `2.0.0` for requests to the BitPay API. | Mandatory |
| `Content-Type` | must be set to `application/json` for requests to the BitPay API. | Mandatory |
| `X-Identity` | the hexadecimal public key generated from the client private key. This header is required when using tokens with higher privileges (`merchant` facade). When using standard `pos` facade token directly from the [BitPay dashboard](https://test.bitpay.com/dashboard/merchant/api-tokens) (with `"Require Authentication"` disabled), this header is not needed. | Mandatory |
| `X-Signature` | header is the ECDSA signature of the full request URL concatenated with the request body, signed with your private key. This header is required when using tokens with higher privileges (`merchant` facade). When using standard `pos` facade token directly from the [BitPay dashboard](https://test.bitpay.com/dashboard/merchant/api-tokens) (with `"Require Authentication"` disabled), this header is not needed. | Mandatory |

The BitPay server shall return a 200 OK response, and the body of the response shall be an array
of payout objects previously described. The only difference is that the data parameter is an
array instead of an object.

An example code to fetch the list of payouts

```js
retrievedPayouts = await client.GetPayouts(null, null, PayoutStatus.New);
```

HTTP Response

```json
{
    "facade":"payout/payout",
    "data":[
        {
            "id":"JMwv8wQCXANoU2ZZQ9a9GH",
            "recipientId":"LDxRZCGq174SF8AnQpdBPB",
            "shopperId":"7qohDf2zZnQK5Qanj8oyC2",
            "amount":10,
            "currency":"USD",
            "ledgerCurrency":"GBP",
            "exchangeRates":{
                "BTC":{
                "USD":39390.47,
                "GBP":27883.962246420004
                }
            },
            "email":"john@doe.com",
            "reference":"payout_20210527",
            "label":"John Doe",
            "notificationURL":"https://yournotiticationURL.com/wed3sa0wx1rz5bg0bv97851eqx",
            "notificationEmail":"merchant@email.com",
            "effectiveDate":"2021-05-27T09:00:00.000Z",
            "requestDate":"2021-05-27T10:47:37.834Z",
            "status":"complete",
            "transactions":[
                {
                "txid":"db53d7e2bf3385a31257ce09396202d9c2823370a5ca186db315c45e24594057",
                "amount":0.000254,
                "date":"2021-05-27T11:04:23.155Z"
                }
            ],
            "token":"9pVLfvdjt59q1JiY2JEsf2uzeeEpSqDwwfRAzuFr9CcrxZX25rTnP6HdRhsMBGLArz"
        },
        {
            "id":"KMXZeQigXG6T5abzCJmTcH",
            "recipientId":"LDxRZCGq174SF8AnQpdBPB",
            "shopperId":"7qohDf2zZnQK5Qanj8oyC2",
            "amount":10,
            "currency":"USD",
            "ledgerCurrency":"GBP",
            "email":"jane@doe.com",
            "reference":"payout_20210528",
            "label":"Jane Doe",
            "notificationURL":"https://yournotiticationURL.com/wed3sa0wx1rz5bg0bv97851eqx",
            "notificationEmail":"merchant@email.com",
            "effectiveDate":"2021-05-28T09:00:00.000Z",
            "requestDate":"2021-05-28T10:23:43.765Z",
            "status":"cancelled",
            "transactions":[
                
            ],
            "token":"9pVLfvdjt59q1JiY2JEsf2hr5FsjimfY4qRLFi85tMiXSCkJ9mQ2oSQqYKVangKaro"
        }
    ],
    "status":"success",
    "message":null
}
```


## Cancel payouts

Cancel a specific payout batch request, based on the payout batch ID.

> **Note**
It is very important that merchants implement this endpoint as it is the only way for them to
cancel a batch prior to execution. Once a payout has been executed, the funds cannot be recovered.

`DELETE /payouts/:payoutId`

Facades `PAYOUT`

### HTTP Request

URL Parameters

| Parameter | Description | Type | Presence |
| --- | --- | :---: | :---: |
| `payoutId` | The payout request id you want to cancel. | `string` | Mandatory |
| `?token=` | Approved `payout` facade token. | `string` | Mandatory |

Headers

| Fields | Description | Presence |
| --- | --- | :---: |
| `X-Accept-Version` | Must be set to `2.0.0` for requests to the BitPay API. | Mandatory |
| `Content-Type` | must be set to `application/json` for requests to the BitPay API. | Mandatory |
| `X-Identity` | the hexadecimal public key generated from the client private key. This header is required when using tokens with higher privileges (`merchant` facade). When using standard `pos` facade token directly from the [BitPay dashboard](https://test.bitpay.com/dashboard/merchant/api-tokens) (with `"Require Authentication"` disabled), this header is not needed. | Mandatory |
| `X-Signature` | header is the ECDSA signature of the full request URL concatenated with the request body, signed with your private key. This header is required when using tokens with higher privileges (`merchant` facade). When using standard `pos` facade token directly from the [BitPay dashboard](https://test.bitpay.com/dashboard/merchant/api-tokens) (with `"Require Authentication"` disabled), this header is not needed. | Mandatory |

An example code to cancel payout

```js
cancelledPayout = await client.CancelPayout(retrievedPayout.id);
```

Response Body Fields

| Name | Description | Type |
| --- | --- | :---: |
| `status` | Set to `success` in case of successful request and to `error` if the request failed, a description of the error will then be indicated in the `message` field. | `string` |
| `code` | Reserved for future use. | `number` |
| `data` | Empty data object {}.  | `object` |
| `message` | In case of error, this field will contain a description message. Set to `null` if the request is successful. | `string` |

HTTP Response

```json
{
    "status": "success",
    "data": {},
    "message": null
}
```


## Request payout notification

`POST /payouts/:payoutId/notifications`

Facades `PAYOUT`

### HTTP Request

URL Parameters

| Parameter | Description | Type | Presence |
| --- | --- | :---: | :---: |
| `payoutId` | The id of the payout request for which you want the last webhook to be resent. |  `string` | Mandatory |

Headers

| Fields | Description | Presence |
| --- | --- | :---: |
| `X-Accept-Version` | Must be set to `2.0.0` for requests to the BitPay API. | Mandatory |
| `Content-Type` | must be set to `application/json` for requests to the BitPay API. | Mandatory |
| `X-Identity` | the hexadecimal public key generated from the client private key. This header is required when using tokens with higher privileges (`merchant` facade). When using standard `pos` facade token directly from the [BitPay dashboard](https://test.bitpay.com/dashboard/merchant/api-tokens) (with `"Require Authentication"` disabled), this header is not needed. | Mandatory |
| `X-Signature` | header is the ECDSA signature of the full request URL concatenated with the request body, signed with your private key. This header is required when using tokens with higher privileges (`merchant` facade). When using standard `pos` facade token directly from the [BitPay dashboard](https://test.bitpay.com/dashboard/merchant/api-tokens) (with `"Require Authentication"` disabled), this header is not needed. | Mandatory |

Body

| Parameter | Description | Type | Presence |
| --- | --- | :---: | :---: |
| `token` | Approved payout facade token. | `string` | Mandatory |

An example code to request payout recipient notification

```js
recipients = await client.GetPayoutRecipients('active', 2);
            
payout0.recipientId = recipients[1].id;
payout0.notificationEmail = 'john@doe.com';
payout0.notificationURL = 'https://hookb.in/QJOPBdMgRkukpp2WO60o';

createdPayout = await client.SubmitPayout(payout0);
requestedNotification = await client.RequestPayoutNotification(createdPayout.id);
```

Response Body Fields

| Name | Description | Type |
| --- | --- | :---: |
| `status` | Set to `success` in case of successful request and to `error` if the request failed, a description of the error will then be indicated in the `message` field. | `string` |
| `code` | Reserved for future use. | `number` |
| `data` | Empty data object {}.  | `object` |
| `message` | In case of error, this field will contain a description message. Set to `null` if the request is successful. | `string` |

HTTP Response

```json
{
    "status": "success",
    "data": {},
    "message": null
}
```

## Payout webhooks

Webhooks are an HTTP POST message sent from the BitPay server to the merchant’s eCommerce server. The primary purpose of a webhook is to alert the merchant’s ecommerce server that the status of a resource has changed. The messages are sent to the `notificationURL` field when creating the payout request.

### Handling

BitPay does not sign webhooks, so the information in the payload should never be trusted outright:

1. The webhook shall be used by the merchant as a trigger to verify the status of a specific recipient. This can be done by retrieving the corresponding recipient object, via the GET `payouts/payoutId` endpoint (payoutId will be provided in the body of the webhook).

2. Merchants will be waiting for the `"complete"` status for a given payout request.

3. The BitPay server expects an HTTP 200 response with an empty body to the webhook. Any other response is considered by BitPay as a failed delivery. The BitPay server attempts to send webhooks multiple times until the send is either successful or the BitPay server gives up.

4. Merchants must use HTTPS for the `notificationURL`.

5. The BitPay server attempts to send webhooks multiple times until the send is either successful or the BitPay server gives up. (schedule to be defined).

Headers

| Header | Value |
| --- | --- |
| `Accept` | application/json |
| `Content-Type` | application/json |

Body

| Name | Description | Type |
| --- | --- | :---: |
| `event` | Webhook event object. | `object` |
| &rarr; `code` | See the list of available Webhook notification codes for more information. | `number` |
| &rarr; `name` | See the list of available Webhook notification codes for more information. | `string` |
| `data` | Payout data object. | `object` |
| &rarr; `id` | Payout id | `string` |
| &rarr; `recipientId` | BitPay recipient id, assigned by BitPay for a given recipient email during the onboarding process (invite recipients) | `string` |
| &rarr; `shopperId` | This is the unique id assigned by BitPay if the shopper used his personal BitPay account to authenticate and pay an invoice. For customers signing up for a brand new BitPay personal account, this id will only be created as part of the payout onboarding. The same field would also be available on paid invoices if the customer signed in with his BitPay personal account before completing the payment. This can allow merchants to monitor the activity of a customer  deposits & payouts). | `string` |
| &rarr; `amount` | The amount of the payout request in the indicated currency | `string` |
| &rarr; `currency` | ISO 4217 3-character currency code. Supported transaction currencies are: https://bitpay.com/currencies | `string` |
| &rarr; `ledgerCurrency` | Ledger currency code set for the payout request (ISO 4217 3-character currency code), it indicates on which ledger the payout request will be recorded. If not provided in the request, this parameter will be set by default to the active ledger currency on your account, e.g. your settlement currency. Supported ledger currency codes for payout requests are EUR, USD, GBP, CAD, NZD, AUD, ZAR, JPY, BTC, BCH, GUSD, USDC, PAX, XRP, BUSD, DOGE, ETH, WBTC, DAI. | `string` |
| &rarr; `exchangeRates` | Exchange rates keyed by source and target currencies. | `string` |
| &rarr; `email` | Email address of an active recipient. Note: In the future, BitPay may allow recipients to update the email address tied to their personal account. BitPay encourages the use of `recipientId` or `shopperId` when programatically creating payouts requests.  | `string` |
| &rarr; `reference` | Present only if specified by the merchant in the request. Merchants can pass their own unique identifier in this field for reconciliation purposes. Maximum string length is 100 characters. | `string` |
| &rarr; `label` | For merchant use, pass through - can be the customer name or unique merchant reference assigned by the merchant to to the recipient | `string` |
| &rarr; `notificationURL` | URL to which BitPay sends webhook notifications. HTTPS is mandatory. | `string` |
| &rarr; `notificationEmail` | Merchant email address for notification of payout status change. | `string` |
| &rarr; `effectiveDate` | Effective date and time (UTC) for the batch. ISO-8601 format `yyyy-mm-ddThh:mm:ssZ` - Note that the time of day will automatically be set to 09:00:00.000 UTC time for the given day | `string` |
| &rarr; `requestDate` | Date and time (UTC) when BitPay received the batch. ISO-8601 format `yyyy-mm-ddThh:mm:ssZ`. | `string` |
| &rarr; `status` | Payout request status, the possible values are: ● new - initial status when the payout batch is created ● funded - if there are enough funds available on the merchant account, the payout batches are set to funded. This happens at the daily cutoff time for payout processing, e.g. 2pm and 9pm UTC ● processing - the payout batches switch to this status whenever the corresponding cryptocurrency transactions are broadcasted by BitPay ● complete - the payout batches are marked as complete when the cryptocurrency transaction has reached the typical target confirmation for the corresponding asset. For instance, 6 confirmations for a bitcoin transaction. ● cancelled - when the merchant cancels a payout batch (only possible for requests in the status new | `string` |
| &rarr; `transactions` | Contains the cryptocurrency transaction details for the executed payout request. | `string` |
| &rarr; &rarr; `txid` | Cryptocurrency transaction hash for the executed payout. | `string` |
| &rarr; &rarr; `amount` | Amount of cryptocurrency sent to the requested address. | `string` |
| &rarr; &rarr; `date` | Date and time (UTC) when the cryptocurrency transaction is broadcasted. ISO-8601 format `yyyy-mm-ddThh:mm:ssZ`. | `string` |

Webhook notification codes

| Code | Name | Purpose |
| --- | --- | --- |
| `5001` | `"payout_funded"` | To notify a merchant that a payout batch has been set to the status `funded` |
| `5002` | `"payout_processing"` | To notify a merchant that a payout batch has been set to the status `processing` |
| `5003` | `"payout_completed"` | To notify a merchant that a payout batch has been set to the status `complete` |
| `5003` | `"payout_cancelled"` | To notify a merchant that a payout batch has been set to the status `cancelled` |
| `5005` | `"payout_manuallyNotified"` | Whenever a merchant request for the last notification to be resent (see section Request a webhook to be resent) |

HTTP Response

Webhook for funded payout request

```json
{
    "event":{
        "code":5001,
        "name":"payout_funded"
    },
    "data":{
        "id":"JMwv8wQCXANoU2ZZQ9a9GH",
        "recipientId":"LDxRZCGq174SF8AnQpdBPB",
        "shopperId":"7qohDf2zZnQK5Qanj8oyC2",
        "amount":10,
        "currency":"USD",
        "ledgerCurrency":"GBP",
        "exchangeRates":{
            "BTC":{
                "USD":39390.47,
                "GBP":27883.962246420004
            }
        },
        "email":"john@doe.com",
        "reference":"payout_20210527",
        "label":"John Doe",
        "notificationEmail":"merchant@email.com",
        "effectiveDate":"2021-05-27T09:00:00.000Z",
        "requestDate":"2021-05-27T10:47:37.834Z",
        "status":"funded",
        "transactions":[
            
        ]
    }
}
```

Webhook for completed payout request

```json
{
    "event":{
        "code":5003,
        "name":"payout_completed"
    },
    "data":{
        "id":"JMwv8wQCXANoU2ZZQ9a9GH",
        "recipientId":"LDxRZCGq174SF8AnQpdBPB",
        "shopperId":"7qohDf2zZnQK5Qanj8oyC2",
        "amount":10,
        "currency":"USD",
        "ledgerCurrency":"GBP",
        "exchangeRates":{
            "BTC":{
                "USD":39390.47,
                "GBP":27883.962246420004
            }
        },
        "email":"john@doe.com",
        "reference":"payout_20210527",
        "label":"John Doe",
        "notificationEmail":"merchant@email.com",
        "effectiveDate":"2021-05-27T09:00:00.000Z",
        "requestDate":"2021-05-27T10:47:37.834Z",
        "status":"complete",
        "transactions":[
            {
                "txid":"db53d7e2bf3385a31257ce09396202d9c2823370a5ca186db315c45e24594057",
                "amount":0.000254,
                "date":"2021-05-27T11:04:23.155Z"
            }
        ]
    }
}
```



### [Back to guide index](../../GUIDE.md)