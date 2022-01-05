# Payout Batch

This resource allows merchants to send cryptocurrency payouts by batches. The typical use
case for this resource would be a company who wants to offer cryptocurrency payroll to their
employees.

For merchants interested who rather need individual withdrawal requests (e.g. marketplaces,
affiliates), the `Payouts` resource is meant for this use case.


## Create payout batch request

Allows a merchant to invite clients to sign up for a BitPay personal account.

`POST /payoutBatches`

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

An example code for create payout batch request

```js
let createdBatch;
let retrievedBatch;
let retrievedBatches;
let cancelledBatch;
let instructionsList = [];

instructionsList.push(new PayoutInstruction(7.05, RecipientReferenceMethod.EMAIL, "sandbox+recipient1@email.com"));
instructionsList.push(new PayoutInstruction(22.36, RecipientReferenceMethod.EMAIL, "sandbox+recipient2@email.com"));
instructionsList.push(new PayoutInstruction(251.29, RecipientReferenceMethod.EMAIL, "sandbox+recipient3@email.com"));

let batch0 = new PayoutBatch(Currencies.USD, instructionsList, Currencies.ETH);

createdBatch = await client.SubmitPayoutBatch(batch0);
```

The BitPay server shall return an HTTP 200 OK response, and the body of the response shall be
the `PayoutBatch` object.

The following table gives a description of the `PayoutBatch` object and all the fields returned by the BitPay server when merchants create or retrieve a `PayoutBatch` request. The following subsections will use this table as a reference for the body of the server response.

| Name | Description | Type |
| --- | --- | :---: |
| `facade` | This indicates the facade used to create the payout batch. When the payout facade is used to create a payout batch, the BitPay server returns the payout batch object as seen from the payout facade, that is `"payout/payoutBatch"`. | `string` |
| `data` | Payout batch data object. | `object` |
| &rarr; `id` | Payout batch id. | `string` |
| &rarr; `account` | String identifying the BitPay merchant, for internal use. | `string` |
| &rarr; `reference` | Present only if specified by the merchant in the request. Merchants can pass their own unique identifier in this field for reconciliation purposes. Maximum string length is 100 characters. | `string` |
| &rarr; `status` | Payout request status, the possible values are: ● `new` - initial status when the payout batch is created ● `funded` - if there are enough funds available on the merchant account, the payout batches are set to funded. This happens at the daily cutoff time for payout processing, e.g. 2pm and 9pm UTC ● `processing` - the payout batches switch to this status whenever the corresponding cryptocurrency transactions are broadcasted by BitPay ● `complete` - the payout batches are marked as complete when the cryptocurrency transaction has reached the typical target confirmation for the corresponding asset. For instance, 6 confirmations for a bitcoin transaction. ● `cancelled` - when the merchant cancels a payout batch (only possible for requests in the status new | `string` |
| &rarr; `amount` | The total amount of the batch in the indicated currency. This amount must equal the sum of the instruction's amounts. | `number` |
| &rarr; `currency` | ISO 4217 3-character currency code.  | `string` |
| &rarr; `ledgerCurrency` | Ledger currency code set for the payout request (ISO 4217 3-character currency code), it indicates on which ledger the payout request will be recorded. If not provided in the request, this parameter will be set by default to the active ledger currency on your account, e. . your settlement currency. Supported ledger currency codes for payout requests are EUR, USD, GBP, CAD, NZD, AUD, ZAR, JPY, BTC, BCH, GUSD, USDC, PAX, XRP, BUSD, DOGE, ETH, WBTC, DAI. | `string` |
| &rarr; `exchangeRates` | Exchange rates keyed by source and target currencies. | `array` |
| &rarr; `requestDate` | Date and time (UTC) when BitPay received the batch. ISO-8601 format `yyyy-mm-ddThh:mm:ssZ`. | `string` |
| &rarr; `effectiveDate` | Effective date and time (UTC) for the batch. ISO-8601 format `yyyy-mm-ddThh:mm:ssZ` - Note that the time of day will automatically be set to 09:00:00.000 UTC time for the given day | `string` |
| &rarr; `notificationURL` | URL to which BitPay sends webhook notifications. HTTPS is mandatory.  | `string` |
| &rarr; `notificationEmail` | Merchant email address for notification of payout status change. | `string` |
| &rarr; `dateExecuted` | Date and time (UTC) when the batch has been executed. ISO-8601 format `yyyy-mm-ddThh:mm:ssZ`. | `string` |
| &rarr; `instructions` | This is an array containing the detailed payout instruction objects. This array can contain a maximum of 200 instructions. Note: It is not allowed to have more than 1 instruction towards the same recipient within a batch. | `array` |
| &rarr; &rarr; `id` | Resource id for the instruction | `string` |
| &rarr; &rarr; `amount` | The amount to be sent to the recipient in the indicated currency, for the corresponding instruction. The minimum amount per instruction is $5 USD equivalent. | `string` |
| &rarr; &rarr; `email` | Email address of an active recipient. Note: In the future, BitPay may allow recipients to update the email address tied to their personal account. BitPay encourages the use of recipientId or shopperId when programatically creating payouts requests. | `string` |
| &rarr; &rarr; `recipientId` | BitPay recipient id, assigned by BitPay for a given recipient email during the onboarding process (invite recipients) | `string` |
| &rarr; &rarr; `shopperId` | This is the unique id assigned by BitPay if the shopper used his personal BitPay account to authenticate and pay an invoice. For customers signing up for a brand new BitPay personal account, this id will only be created as part of the payout onboarding. The same field would also be available on paid invoices if the customer signed in with his BitPay personal account before completing the payment. This can allow merchants to monitor the activity of a customer (deposits & payouts). | `string` |
| &rarr; &rarr; `label` | For merchant use, pass through - can be the customer name or unique merchant reference assigned by the merchant to to the recipient | `string` |
| &rarr; &rarr;  `transactions` | Contains the cryptocurrency transaction details for the executed payout request. | `string` |
| &rarr; &rarr; &rarr; `txid` | Cryptocurrency transaction hash for the executed payout.  | `string` |
| &rarr; &rarr; &rarr; `amount` | Amount of cryptocurrency sent to the requested address.  | `amount` |
| &rarr; &rarr; &rarr; `date` | Date and time (UTC) when the cryptocurrency transaction is broadcasted. ISO-8601 format `yyyy-mm-ddThh:mm:ssZ`. | `string` |
| `token` | Resource token. This token is derived from the payout API token initially used to create the payout batch and is tied to the specific payout batch id created. | `string` |
| `status` | Set to `success` in case of successful request and to `error` if the request failed, a description of the error will then be indicated in the `message` field | `string` |
| `message` | In case of error, this field will contain a description message. Set to `null` if the request is successful. | `string` |



HTTP Response

```json
{
    "facade":"payout/payoutBatch",
    "data":{
        "id":"A4fjK6BxMDYCNv5KytzzkE",
        "account":"YJCgTf3jrXHkUVzLQ7y4eg",
        "reference":"payoutBatches_20210526",
        "status":"complete",
        "amount":20,
        "currency":"USD",
        "ledgerCurrency":"GBP",
        "exchangeRates":{
            "BTC":{
                "USD":40170.8,
                "GBP":28373.881334800008
            }
        },
        "requestDate":"2021-05-26T12:46:03.427Z",
        "effectiveDate":"2021-05-26T09:00:00.000Z",
        "notificationURL":"https://yournotiticationURL.com/wed3sa0wx1rz5bg0bv97851eqx",
        "notificationEmail":"merchant@email.com",
        "dateExecuted":"2021-05-26T12:53:23.251Z",
        "supportPhone":"1-855-4-BITPAY",
        "instructions":[
            {
                "id":"JEBf5jkAAAuPiu9PoeyKqZ",
                "amount":10,
                "email":"john@doe.com",
                "recipientId":"LDxRZCGq174SF8AnQpdBPB",
                "shopperId":"7qohDf2zZnQK5Qanj8oyC2",
                "label":"John Doe",
                "transactions":[
                {
                    "txid":"bb4bfa8a4b9be16825c9241196cd8184a748c5fdb38650e66ebc97892dc78b71",
                    "amount":0.000249,
                    "date":"2021-05-26T12:53:23.191Z"
                }
                ]
            },
            {
                "id":"VzQ5QRsY5AKTKumgCkY6Nv",
                "amount":10,
                "email":"jane@doe.com",
                "recipientId":"2rtUBVzJLYVitwYjhuYJiu",
                "shopperId":"Nau3F8b9gpC89orzbfTzie",
                "label":"Jane Doe",
                "transactions":[
                {
                    "txid":"bb4bfa8a4b9be16825c9241196cd8184a748c5fdb38650e66ebc97892dc78b71",
                    "amount":0.000249,
                    "date":"2021-05-26T12:53:23.301Z"
                }
                ]
            }
        ],
        "token":"3g83fyMkM8ed3QLDzUpfGhaDd7gHVgVS5UZb6hjmqtVmK41fDuj87zSySZNVygWryx"
    },
    "status":"success",
    "message":null
}
```

## Get payout batch

`GET /payoutBatches/:payoutBatchId`

Facades `PAYOUT`

### HTTP Request

URL Parameters

| Parameter | Description | Type | Presence |
| --- | --- | :---: | :---: |
| `payoutBatchId` | The payout batch ID you want to retrieve | `string` | Mandatory |
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
retrievedBatch = await client.GetPayoutBatch(createdBatch.id);
```

HTTP Response

```json
{
    "facade":"payout/payoutBatch",
    "data":{
        "id":"A4fjK6BxMDYCNv5KytzzkE",
        "account":"YJCgTf3jrXHkUVzLQ7y4eg",
        "reference":"payoutBatches_20210526",
        "status":"complete",
        "amount":20,
        "currency":"USD",
        "ledgerCurrency":"GBP",
        "exchangeRates":{
            "BTC":{
                "USD":40170.8,
                "GBP":28373.881334800008
            }
        },
        "requestDate":"2021-05-26T12:46:03.427Z",
        "effectiveDate":"2021-05-26T09:00:00.000Z",
        "notificationURL":"https://yournotiticationURL.com/wed3sa0wx1rz5bg0bv97851eqx",
        "notificationEmail":"merchant@email.com",
        "dateExecuted":"2021-05-26T12:53:23.251Z",
        "supportPhone":"1-855-4-BITPAY",
        "instructions":[
            {
                "id":"JEBf5jkAAAuPiu9PoeyKqZ",
                "amount":10,
                "email":"john@doe.com",
                "recipientId":"LDxRZCGq174SF8AnQpdBPB",
                "shopperId":"7qohDf2zZnQK5Qanj8oyC2",
                "label":"John Doe",
                "transactions":[
                {
                    "txid":"bb4bfa8a4b9be16825c9241196cd8184a748c5fdb38650e66ebc97892dc78b71",
                    "amount":0.000249,
                    "date":"2021-05-26T12:53:23.191Z"
                }
                ]
            },
            {
                "id":"VzQ5QRsY5AKTKumgCkY6Nv",
                "amount":10,
                "email":"jane@doe.com",
                "recipientId":"2rtUBVzJLYVitwYjhuYJiu",
                "shopperId":"Nau3F8b9gpC89orzbfTzie",
                "label":"Jane Doe",
                "transactions":[
                {
                    "txid":"bb4bfa8a4b9be16825c9241196cd8184a748c5fdb38650e66ebc97892dc78b71",
                    "amount":0.000249,
                    "date":"2021-05-26T12:53:23.301Z"
                }
                ]
            }
        ],
        "token":"3g83fyMkM8ed3QLDzUpfGhaDd7gHVgVS5UZb6hjmqtVmK41fDuj87zSySZNVygWryx"
    },
    "status":"success",
    "message":null
}
```

## Get payout batches

`GET /payoutBatches`

Facades `PAYOUT`

### HTTP Request

URL Parameters

| Parameter | Description | Type | Presence |
| --- | --- | :---: | :---: |
| `?token=` | Approved `payout` facade token. | `string` | Mandatory |
| `&startDate=` | The start of the date window to query for payout batches. Format `YYYY-MM-DD`. | `string` | Optional |
| `&endDate=` | the end of the date window to query for payout batches. Format `YYYY-MM-DD` | `string` | Optional |
| `&status=` | The payout batch status you want to query on.  | `string` | Optional |
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
retrievedBatches = await client.GetPayoutBatches(null, null, PayoutStatus.New);
```

HTTP Response

```json
{
    "facade":"payout/payoutBatch",
    "data":[
        {
            "id":"59G1qBfkBsJqCc9h83n6RA",
            "account":"YJCgTf3jrXHkUVzLQ7y4eg",
            "reference":"payoutBatches_20210526",
            "status":"cancelled",
            "amount":20,
            "currency":"USD",
            "ledgerCurrency":"GBP",
            "requestDate":"2021-05-26T14:26:40.407Z",
            "effectiveDate":"2021-05-26T09:00:00.000Z",
            "notificationURL":"https://yournotiticationURL.com/wed3sa0wx1rz5bg0bv97851eqx",
            "notificationEmail":"merchant@email.com",
            "supportPhone":"1-855-4-BITPAY",
            "instructions":[
                {
                "id":"3ccRFs3NgKscYg8nQAKpqz",
                "amount":10,
                "email":"charles+13@bitpay.com",
                "recipientId":"LDxRZCGq174SF8AnQpdBPB",
                "shopperId":"7qohDf2zZnQK5Qanj8oyC2",
                "label":"John Doe",
                "transactions":[
                    
                ]
                },
                {
                "id":"VezZURxomKPJeRjAVkKEwX",
                "amount":10,
                "email":"charles+payouts@bitpay.com",
                "recipientId":"2rtUBVzJLYVitwYjhuYJiu",
                "shopperId":"Nau3F8b9gpC89orzbfTzie",
                "label":"Jane Doe",
                "transactions":[
                    
                ]
                }
            ],
            "token":"5Gr5dFJXKrA1ByKQKSpqah2uFtd8CXaFeY7wTJH9ph4YBykQYvKZikTjC7izyTfWg4"
        },
        {
            "id":"UZkWbQQtPcoBxY7ra9L1bS",
            "account":"YJCgTf3jrXHkUVzLQ7y4eg",
            "reference":"payoutBatches_20210527",
            "status":"cancelled",
            "amount":20,
            "currency":"USD",
            "ledgerCurrency":"GBP",
            "requestDate":"2021-05-27T15:25:09.728Z",
            "effectiveDate":"2021-05-27T09:00:00.000Z",
            "notificationURL":"https://yournotiticationURL.com/wed3sa0wx1rz5bg0bv97851eqx",
            "notificationEmail":"merchant@email.com",
            "supportPhone":"1-855-4-BITPAY",
            "instructions":[
                {
                "id":"8rs9odVzrTeMp1HTcnFbKT",
                "amount":10,
                "email":"charles+13@bitpay.com",
                "recipientId":"LDxRZCGq174SF8AnQpdBPB",
                "shopperId":"7qohDf2zZnQK5Qanj8oyC2",
                "label":"John Doe",
                "transactions":[
                    
                ]
                },
                {
                "id":"AvQxKNxrUAbAc48LqMiTd5",
                "amount":10,
                "email":"charles+payouts@bitpay.com",
                "recipientId":"2rtUBVzJLYVitwYjhuYJiu",
                "shopperId":"Nau3F8b9gpC89orzbfTzie",
                "label":"Jane Doe",
                "transactions":[
                    
                ]
                }
            ],
            "token":"5Gr5dFJXKrA1ByKQKSpqagxstp75wiMB4YkWXoKcL78XQN78sEYx5rJYPxUKPW68Xx"
        }
    ],
    "status":"success",
    "message":null
}
```


## Cancel payout batch

Cancel a specific payout batch request, based on the payout batch ID.

> **Note**
It is extremely important that merchants implement this endpoint as it is the only way for them to cancel a batch prior to execution. Once a payout has been executed, the funds cannot be recovered.

`DELETE /payoutBatches/:payoutBatchId`

Facades `PAYOUT`

### HTTP Request

URL Parameters

| Parameter | Description | Type | Presence |
| --- | --- | :---: | :---: |
| `payoutBatchId` | The payout batch ID you want to cancel. | `string` | Mandatory |
| `?token=` | Approved `payout` facade token. | `string` | Mandatory |

Headers

| Fields | Description | Presence |
| --- | --- | :---: |
| `X-Accept-Version` | Must be set to `2.0.0` for requests to the BitPay API. | Mandatory |
| `Content-Type` | must be set to `application/json` for requests to the BitPay API. | Mandatory |
| `X-Identity` | the hexadecimal public key generated from the client private key. This header is required when using tokens with higher privileges (`merchant` facade). When using standard `pos` facade token directly from the [BitPay dashboard](https://test.bitpay.com/dashboard/merchant/api-tokens) (with `"Require Authentication"` disabled), this header is not needed. | Mandatory |
| `X-Signature` | header is the ECDSA signature of the full request URL concatenated with the request body, signed with your private key. This header is required when using tokens with higher privileges (`merchant` facade). When using standard `pos` facade token directly from the [BitPay dashboard](https://test.bitpay.com/dashboard/merchant/api-tokens) (with `"Require Authentication"` disabled), this header is not needed. | Mandatory |

An example code to cancel payout batch

```js
cancelledBatch = await client.CancelPayoutBatch(retrievedBatch.id);
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

`POST /payoutBatches/:payoutBatchId/notifications`

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
| `token` | Approved `payout` facade token. | `string` | Mandatory |

An example code to request payout batch notification

```js
let instructionsList = [];

instructionsList.push(new PayoutInstruction(7.05, RecipientReferenceMethod.EMAIL, "sandbox+recipient1@email.com"));
instructionsList.push(new PayoutInstruction(22.36, RecipientReferenceMethod.EMAIL, "sandbox+recipient2@email.com"));
instructionsList.push(new PayoutInstruction(251.29, RecipientReferenceMethod.EMAIL, "sandbox+recipient3@email.com"));

let batch0 = new PayoutBatch(Currencies.USD, instructionsList, Currencies.ETH);
batch0.notificationEmail = 'john@doe.com';
batch0.notificationURL = 'https://hookb.in/QJOPBdMgRkukpp2WO60o';

createdBatch = await client.SubmitPayoutBatch(batch0);
requestedNotification = await client.RequestPayoutBatchNotification(createdBatch.id);
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

## Payout batch webhooks

Webhooks are an HTTP POST message sent from the BitPay server to the merchant’s eCommerce server. The primary purpose of a webhook is to alert the merchant’s ecommerce server that the status of a resource has changed. The messages are sent to the `notificationURL` field when creating the payout request.

### Handling

BitPay does not sign webhooks, so the information in the payload should never be trusted outright:

1. The webhook shall be used by the merchant as a trigger to verify the status of a specific recipient. This can be done by retrieving the corresponding recipient object, via the GET `payoutBatches/payoutBatchId` endpoint (`payoutBatchId` will be provided in the body of the webhook).

2. Merchants will be waiting for the `"complete"` status for a given payout request.

3. The BitPay server expects an HTTP 200 response with an empty body to the webhook. Any other response is considered by BitPay as a failed delivery. The BitPay server attempts to send webhooks multiple times until the send is either successful or the BitPay server gives up.

4. Merchants must use HTTPS for the `notificationURL`.

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
| `data` | Payout batch data object. | `object` |
| &rarr; `id` | Payout batch id | `string` |
| &rarr; `account` | String identifying the BitPay merchant, for internal use. | `string` |
| &rarr; `reference` | Present only if specified by the merchant in the request. Merchants can pass their own unique identifier in this field for reconciliation purposes. Maximum string length is 100 characters | `string` |
| &rarr; `status` | Payout request status, the possible values are: ● `new` - initial status when the payout batch is created ● `funded` - if there are enough funds available on the merchant account, the payout batches are set to funded. This happens at the daily cutoff time for payout processing, e.g. 2pm and 9pm UTC ● `processing` - the payout batches switch to this status whenever the corresponding cryptocurrency transactions are broadcasted by BitPay ● `complete` - the payout batches are marked as complete when the cryptocurrency transaction has reached the typical target confirmation for the corresponding asset. For instance, 6 confirmations for a bitcoin transaction. ● `cancelled` - when the merchant cancels a payout batch (only possible for requests in the status new. | `string` |
| &rarr; `amount` | The total amount of the batch in the indicated currency. It equals the sum of the various instruction's amounts. | `string` |
| &rarr; `currency` | ISO 4217 3-character currency code. | `string` |
| &rarr; `ledgerCurrency` | Ledger currency code set for the payout request (ISO 4217 3-character currency code), it indicates on which ledger the payout request will be recorded. If not provided in the request, this parameter will be set by default to the active ledger currency on your account, e.g. your settlement currency. Supported ledger currency codes for payout requests are EUR, USD, GBP, CAD, NZD, AUD, ZAR, JPY, BTC, BCH, GUSD, USDC, PAX, XRP, BUSD, DOGE, ETH, WBTC, DAI. | `string` |
| &rarr; `exchangeRates` | Exchange rates keyed by source and target currencies. | `string` |
| &rarr; `requestDate` | Date and time (UTC) when BitPay received the batch. ISO-8601 format `yyyy-mm-ddThh:mm:ssZ`. | `string` |
| &rarr; `effectiveDate` | Effective date and time (UTC) for the batch. ISO-8601 format `yyyy-mm-ddThh:mm:ssZ` - Note that the time of day will automatically be set to 09:00:00.000 UTC time for the given day. | `string` |
| &rarr; `notificationURL` | URL to which BitPay sends webhook notifications. HTTPS is mandatory. | `string` |
| &rarr; `notificationEmail` | Merchant email address for notification of payout status change. | `string` |
| &rarr; `dateExecuted` | Date and time (UTC) when the batch has been executed. ISO-8601 format `yyyy-mm-ddThh:mm:ssZ`. | `string` |
| &rarr; `instructions` | This is an array containing the detailed payout instruction objects. This array can contain a maximum of 200 instructions. Note: It is not allowed to have more than 1 instruction towards the same recipient within a batch. | `string` |
| &rarr; &rarr; `id` | Resource id for the instruction. | `string` |
| &rarr; &rarr; `amount` | The amount to be sent to the recipient in the indicated currency, for the corresponding instruction. The minimum amount per instruction is $5 USD equivalent. | `string` |
| &rarr; &rarr; `email` | Email address of an active recipient. Note: In the future, BitPay may allow recipients to update the email address tied to their personal account. BitPay encourages the use of recipientId or shopperId when programatically creating payouts requests. | `string` |
| &rarr; &rarr; `recipientId` | BitPay recipient id, assigned by BitPay for a given recipient email during the onboarding process (invite recipients). | `string` |
| &rarr; &rarr; `shopperId` | This is the unique id assigned by BitPay if the shopper used his personal BitPay account to authenticate and pay an invoice. For customers signing up for a brand new BitPay personal account, this id will only be created as part of the payout onboarding. The same field would also be available on paid invoices if the customer signed in with his BitPay personal account before completing the payment. This can allow merchants to monitor the activity of a customer (deposits & payouts). | `string` |
| &rarr; &rarr; `transactions` | Contains the cryptocurrency transaction details for the executed payout request. | `string` |
| &rarr; &rarr; &rarr; `txid` | Cryptocurrency transaction hash for the executed payout. | `string` |
| &rarr; &rarr; &rarr; `amount` | Amount of cryptocurrency sent to the requested address. | `string` |
| &rarr; &rarr; &rarr; `date` | Date and time (UTC) when the cryptocurrency transaction is broadcasted. ISO-8601 format `yyyy-mm-ddThh:mm:ssZ`. | `string` |


Webhook notification codes

| Code | Name | Purpose |
| --- | --- | --- |
| `5001` | `"payout_funded"` | To notify a merchant that a payout batch has been set to the status `funded`. |
| `5002` | `"payout_processing"` | To notify a merchant that a payout batch has been set to the status `processing`. |
| `5003` | `"payout_completed"` | To notify a merchant that a payout batch has been set to the status `complete`. |
| `5003` | `"payout_cancelled"` | To notify a merchant that a payout batch has been set to the status `cancelled`. |
| `5005` | `"payout_manuallyNotified"` | Whenever a merchant request for the last notification to be resent (see section Request a webhook to be resent). |

HTTP Response

Webhook for funded payout batch request

```json
{
    "event":{
        "code":6001,
        "name":"payoutBatch_funded"
    },
    "data":{
        "id":"A4fjK6BxMDYCNv5KytzzkE",
        "account":"YJCgTf3jrXHkUVzLQ7y4eg",
        "reference":"payoutBatches_20210526",
        "status":"complete",
        "amount":20,
        "currency":"USD",
        "ledgerCurrency":"GBP",
        "exchangeRates":{
            "BTC":{
                "USD":40170.8,
                "GBP":28373.881334800008
            }
        },
        "requestDate":"2021-05-26T12:46:03.427Z",
        "effectiveDate":"2021-05-26T09:00:00.000Z",
        "notificationURL":"https://yournotiticationURL.com/wed3sa0wx1rz5bg0bv97851eqx",
        "notificationEmail":"merchant@email.com",
        "supportPhone":"1-855-4-BITPAY",
        "instructions":[
            {
                "id":"JEBf5jkAAAuPiu9PoeyKqZ",
                "amount":10,
                "email":"john@doe.com",
                "recipientId":"LDxRZCGq174SF8AnQpdBPB",
                "shopperId":"7qohDf2zZnQK5Qanj8oyC2",
                "label":"John Doe",
                "transactions":[
                
                ]
            },
            {
                "id":"VzQ5QRsY5AKTKumgCkY6Nv",
                "amount":10,
                "email":"jane@doe.com",
                "recipientId":"2rtUBVzJLYVitwYjhuYJiu",
                "shopperId":"Nau3F8b9gpC89orzbfTzie",
                "label":"Jane Doe",
                "transactions":[
                
                ]
            }
        ]
    }
}
{
    "event":{
        "code":6002,
        "name":"payoutBatch_completed"
    },
    "data":{
        "id":"A4fjK6BxMDYCNv5KytzzkE",
        "account":"YJCgTf3jrXHkUVzLQ7y4eg",
        "reference":"payoutBatches_20210526",
        "status":"complete",
        "amount":20,
        "currency":"USD",
        "ledgerCurrency":"GBP",
        "exchangeRates":{
            "BTC":{
                "USD":40170.8,
                "GBP":28373.881334800008
            }
        },
        "requestDate":"2021-05-26T12:46:03.427Z",
        "effectiveDate":"2021-05-26T09:00:00.000Z",
        "notificationURL":"https://yournotiticationURL.com/wed3sa0wx1rz5bg0bv97851eqx",
        "notificationEmail":"merchant@email.com",
        "dateExecuted":"2021-05-26T12:53:23.251Z",
        "supportPhone":"1-855-4-BITPAY",
        "instructions":[
            {
                "id":"JEBf5jkAAAuPiu9PoeyKqZ",
                "amount":10,
                "email":"john@doe.com",
                "recipientId":"LDxRZCGq174SF8AnQpdBPB",
                "shopperId":"7qohDf2zZnQK5Qanj8oyC2",
                "label":"John Doe",
                "transactions":[
                {
                    "txid":"bb4bfa8a4b9be16825c9241196cd8184a748c5fdb38650e66ebc97892dc78b71",
                    "amount":0.000249,
                    "date":"2021-05-26T12:53:23.191Z"
                }
                ]
            },
            {
                "id":"VzQ5QRsY5AKTKumgCkY6Nv",
                "amount":10,
                "email":"jane@doe.com",
                "recipientId":"2rtUBVzJLYVitwYjhuYJiu",
                "shopperId":"Nau3F8b9gpC89orzbfTzie",
                "label":"Jane Doe",
                "transactions":[
                {
                    "txid":"bb4bfa8a4b9be16825c9241196cd8184a748c5fdb38650e66ebc97892dc78b71",
                    "amount":0.000249,
                    "date":"2021-05-26T12:53:23.301Z"
                }
                ]
            }
        ]
    }
}
```



### [Back to guide index](../../GUIDE.md)