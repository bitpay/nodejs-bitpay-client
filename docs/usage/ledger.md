# Ledger

## Get ledger

`GET /ledgers`

Facades `MERCHANT`

### HTTP Request

URL Parameters

| Parameter | Description | Type | Presence |
| --- | --- | :---: | :---: |
| `currency` | ISO 4217 3-character currency code for your merchant account | `string` | Mandatory |
| `?token=` | when fetching subscriptions, pass a `merchant` facade token as a URL parameter. | `string` | Mandatory |
| `&startDate=` | The start date for fetching ledger entries. Format `YYYY-MM-DD` | `string` | Mandatory |
| `&endDate=` | The end date for fetching ledger entries. Format `YYYY-MM-DD` | `string` | Mandatory |

Headers

| Fields | Description | Presence |
| --- | --- | :---: |
| `X-Accept-Version` | Must be set to `2.0.0` for requests to the BitPay API. | Mandatory |
| `Content-Type` | must be set to `application/json` for requests to the BitPay API. | Mandatory |
| `X-Identity` | the hexadecimal public key generated from the client private key. This header is required when using tokens with higher privileges (`merchant` facade). When using standard `pos` facade token directly from the [BitPay dashboard](https://test.bitpay.com/dashboard/merchant/api-tokens) (with `"Require Authentication"` disabled), this header is not needed. | Mandatory |
| `X-Signature` | header is the ECDSA signature of the full request URL concatenated with the request body, signed with your private key. This header is required when using tokens with higher privileges (`merchant` facade). When using standard `pos` facade token directly from the [BitPay dashboard](https://test.bitpay.com/dashboard/merchant/api-tokens) (with `"Require Authentication"` disabled), this header is not needed. | Mandatory |

Example code to get ledger entries.

```js
let retrievedLedger;

let date = new Date();
let dateEnd = new Date().toISOString().split('T')[0];
let dateStart = new Date(date.setDate(date.getDate()-30)).toISOString().split('T')[0];

retrievedLedger = await client.GetLedger(Currencies.USD, dateStart, dateEnd);
```

HTTP Response

```json
[
    {
        "type": "Invoice",
        "amount": 823000000,
        "code": 1000,
        "description": "20210510_fghij",
        "timestamp": "2021-05-10T20:08:52.919Z",
        "txType": "sale",
        "scale": 100000000,
        "invoiceId": "Hpqc63wvE1ZjzeeH4kEycF",
        "buyerFields": {
        "buyerName": "John Doe",
        "buyerAddress1": "2630 Hegal Place",
        "buyerAddress2": "Apt 42",
        "buyerCity": "Alexandria",
        "buyerState": "VA",
        "buyerZip": "23242",
        "buyerCountry": "US",
        "buyerPhone": "555-123-456",
        "buyerNotify": true,
        "buyerEmail": "john@doe.com"
        },
        "invoiceAmount": 10,
        "invoiceCurrency": "USD",
        "transactionCurrency": "BCH",
        "id": "FR4rgfADCRNmAhtz1Ci4kU"
    },
    {
        "type": "Invoice Fee",
        "amount": -8000000,
        "code": 1023,
        "description": "Invoice Fee",
        "timestamp": "2021-05-10T20:08:52.919Z",
        "txType": "Invoice Fee",
        "scale": 100000000,
        "invoiceId": "Hpqc63wvE1ZjzeeH4kEycF",
        "buyerFields": {
        "buyerName": "John Doe",
        "buyerAddress1": "2630 Hegal Place",
        "buyerAddress2": "Apt 42",
        "buyerCity": "Alexandria",
        "buyerState": "VA",
        "buyerZip": "23242",
        "buyerCountry": "US",
        "buyerPhone": "555-123-456",
        "buyerNotify": true,
        "buyerEmail": "john@doe.com"
        },
        "invoiceAmount": 10,
        "invoiceCurrency": "USD",
        "transactionCurrency": "BCH",
        "id": "XCkhgHKP2pSme4qszMpM3B"
    },
    {
        "type": "Invoice Refund",
        "supportRequest": "SYyrnbRCJ78V1DknHakKPo",
        "amount": -823000000,
        "code": 1020,
        "description": "Invoice Refund",
        "timestamp": "2021-05-12T13:00:45.063Z",
        "txType": "Invoice Refund",
        "scale": 100000000,
        "invoiceId": "Hpqc63wvE1ZjzeeH4kEycF",
        "buyerFields": {
        "buyerName": "John Doe",
        "buyerAddress1": "2630 Hegal Place",
        "buyerAddress2": "Apt 42",
        "buyerCity": "Alexandria",
        "buyerState": "VA",
        "buyerZip": "23242",
        "buyerCountry": "US",
        "buyerPhone": "555-123-456",
        "buyerNotify": true,
        "buyerEmail": "john@doe.com"
        },
        "invoiceAmount": 10,
        "invoiceCurrency": "USD",
        "transactionCurrency": "BCH",
        "id": "PBqakmWMZ2H3RwhGq9vCsg"
    }
]
```


## Get ledger

`GET /ledgers`

Facades `MERCHANT`

### HTTP Request

URL Parameters

| Parameter | Description | Type | Presence |
| --- | --- | :---: | :---: |
| `?token=` | when fetching subscriptions, pass a `merchant` facade token as a URL parameter. | `string` | Mandatory |

Headers

| Fields | Description | Presence |
| --- | --- | :---: |
| `X-Accept-Version` | Must be set to `2.0.0` for requests to the BitPay API. | Mandatory |
| `Content-Type` | must be set to `application/json` for requests to the BitPay API. | Mandatory |
| `X-Identity` | the hexadecimal public key generated from the client private key. This header is required when using tokens with higher privileges (`merchant` facade). When using standard `pos` facade token directly from the [BitPay dashboard](https://test.bitpay.com/dashboard/merchant/api-tokens) (with `"Require Authentication"` disabled), this header is not needed. | Mandatory |
| `X-Signature` | header is the ECDSA signature of the full request URL concatenated with the request body, signed with your private key. This header is required when using tokens with higher privileges (`merchant` facade). When using standard `pos` facade token directly from the [BitPay dashboard](https://test.bitpay.com/dashboard/merchant/api-tokens) (with `"Require Authentication"` disabled), this header is not needed. | Mandatory |

Response body fields

| Name | Description | Type |
| --- | --- | :---: |
| `data` | Array of objects indicating the balance for each currency | `array` |
| &rarr; `currency` | Ledger currency | `string` |
| &rarr; `balance` | Ledger balance in the corresponding currency | `number` |

Example code to get ledger balances

```js
retrievedLedger = await client.GetLedgers();
```

HTTP Response

```json
{
    "data": [
        {
        "currency": "EUR",
        "balance": 0
        },
        {
        "currency": "USD",
        "balance": 2389.82
        },
        {
        "currency": "BTC",
        "balance": 0.000287
        }
    ]
}
```


### [Back to guide index](../../GUIDE.md)