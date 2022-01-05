# Settlement

Settlements are transfers of payment profits from BitPay to bank accounts and cryptocurrency wallets owned by merchants, partners, etc. This endpoint exposes reports detailing these settlements.

## Get settlements

`GET /settlements`

Facades `MERCHANT`

### HTTP Request

URL Parameters

| Parameter | Description | Type | Presence |
| --- | --- | :---: | :---: |
| `?token=` | The resource token for the `settlementId` you want to look up. You need to retrieve this token from the settlement object itself, using the `merchant` facade. | `string` | Mandatory |
| `&startDate` | The start of the date window to query for settlements. Format `YYYY-MM-DD` | `string` | Optional |
| `&endDate=` | The end of the date window to query for settlements. Format `YYYY-MM-DD` | `string` | Optional |
| `&status=` | The settlement status you want to query on | `string` | Optional |
| `&currency=` | The settlement currency you want to query on | `string` | Optional |
| `&limit=` | Maximum results that the query will return (useful for paging results) | `number` | Optional |
| `&offset=` | Number of results to offset (ex. skip 10 will give you results starting with the 11th result) | `number` | Optional |

Headers

| Fields | Description | Presence |
| --- | --- | :---: |
| `X-Accept-Version` | Must be set to `2.0.0` for requests to the BitPay API. | Mandatory |
| `Content-Type` | must be set to `application/json` for requests to the BitPay API. | Mandatory |
| `X-Identity` | the hexadecimal public key generated from the client private key. This header is required when using tokens with higher privileges (`merchant` facade). When using standard `pos` facade token directly from the [BitPay dashboard](https://test.bitpay.com/dashboard/merchant/api-tokens) (with `"Require Authentication"` disabled), this header is not needed. | Mandatory |
| `X-Signature` | header is the ECDSA signature of the full request URL concatenated with the request body, signed with your private key. This header is required when using tokens with higher privileges (`merchant` facade). When using standard `pos` facade token directly from the [BitPay dashboard](https://test.bitpay.com/dashboard/merchant/api-tokens) (with `"Require Authentication"` disabled), this header is not needed. | Mandatory |

Example code to et all settlements with optional parameters

```js
let retrievedSettlements;
let retrievedSettlement;
let firstSettlement;
let date = new Date();
let dateEnd = new Date().toISOString().split('T')[0];
let dateStart = new Date(date.setDate(date.getDate()-30)).toISOString().split('T')[0];

retrievedSettlements = await client.GetSettlements(Currencies.USD, dateStart, dateEnd, null, null, null);
```

HTTP Response

```json
{
    "facade": "merchant/settlement",
    "data": [
        {
        "id": "KBkdURgmE3Lsy9VTnavZHX",
        "accountId": "YJCgTf3jrXHkUVzLQ7y4eg",
        "status": "processing",
        "currency": "EUR",
        "payoutInfo": {
            "label": "Corporate account",
            "bankCountry": "Netherlands",
            "name": "Test Organization",
            "bank": "Test",
            "swift": "RABONL2U",
            "account": "NL85ABNA0000000000"
        },
        "dateCreated": "2021-05-10T09:05:00.176Z",
        "dateExecuted": "2021-05-10T11:52:29.681Z",
        "openingDate": "2021-05-09T09:00:00.000Z",
        "closingDate": "2021-05-10T09:00:00.000Z",
        "openingBalance": 1.27,
        "ledgerEntriesSum": 20.82,
        "withholdings": [],
        "withholdingsSum": 0,
        "totalAmount": 22.09,
        "token": "2gBtViSiBWSEJGo1LfaMFHoaBRzE2jek2VitKAYeenj2SRiTVSCgRvs1WTN8w4w8Lc"
        },
        {
        "id": "RPWTabW8urd3xWv2To989v",
        "accountId": "YJCgTf3jrXHkUVzLQ7y4eg",
        "status": "processing",
        "currency": "EUR",
        "payoutInfo": {
            "label": "Corporate account",
            "bankCountry": "Netherlands",
            "name": "Test Organization",
            "bank": "Test",
            "swift": "RABONL2U",
            "account": "NL85ABNA0000000000"
        },
        "dateCreated": "2021-05-11T09:05:00.176Z",
        "dateExecuted": "2021-05-11T11:52:29.681Z",
        "openingDate": "2021-05-10T09:00:00.000Z",
        "closingDate": "2021-05-11T09:00:00.000Z",
        "openingBalance": 23.27,
        "ledgerEntriesSum": 20.82,
        "withholdings": [
            {
            "amount": 8.21,
            "code": "W005",
            "description": "Pending Refunds"
            }
        ],
        "withholdingsSum": 8.21,
        "totalAmount": 35.88,
        "token": "2gBtViSiBWSEJitKAYSCgRvs1WTN8w4Go1Leenj2SRiTVFHoaBRzE2jek2VfaMw8Lc"
        }
    ]
}
```


## Get settlement

`GET /settlements/:settlementId`

Facades `MERCHANT`

### HTTP Request

URL Parameters

| Parameter | Description | Type | Presence |
| --- | --- | :---: | :---: |
| `settlementId` | id of the specific settlement resource to be fetched | `string` | Mandatory |
| `?token=` | The resource token for the `settlementId` you want to look up. You need to retrieve this token from the settlement object itself, using the `merchant` facade. | `string` | Mandatory |


Headers

| Fields | Description | Presence |
| --- | --- | :---: |
| `X-Accept-Version` | Must be set to `2.0.0` for requests to the BitPay API. | Mandatory |
| `Content-Type` | must be set to `application/json` for requests to the BitPay API. | Mandatory |
| `X-Identity` | the hexadecimal public key generated from the client private key. This header is required when using tokens with higher privileges (`merchant` facade). When using standard `pos` facade token directly from the [BitPay dashboard](https://test.bitpay.com/dashboard/merchant/api-tokens) (with `"Require Authentication"` disabled), this header is not needed. | Mandatory |
| `X-Signature` | header is the ECDSA signature of the full request URL concatenated with the request body, signed with your private key. This header is required when using tokens with higher privileges (`merchant` facade). When using standard `pos` facade token directly from the [BitPay dashboard](https://test.bitpay.com/dashboard/merchant/api-tokens) (with `"Require Authentication"` disabled), this header is not needed. | Mandatory |

Example code to get settlement by settlementId

```js
firstSettlement = retrievedSettlements.shift();

retrievedSettlement = await client.GetSettlement(firstSettlement.id);
```

HTTP Response

```json
{
    "facade": "merchant/settlement",
    "data": {
        "id": "RPWTabW8urd3xWv2To989v",
        "accountId": "YJCgTf3jrXHkUVzLQ7y4eg",
        "status": "processing",
        "currency": "EUR",
        "payoutInfo": {
        "label": "Corporate account",
        "bankCountry": "Netherlands",
        "name": "Test Organization",
        "bank": "Test",
        "swift": "RABONL2U",
        "account": "NL85ABNA0000000000"
        },
        "dateCreated": "2021-05-11T09:05:00.176Z",
        "dateExecuted": "2021-05-11T11:52:29.681Z",
        "openingDate": "2021-05-10T09:00:00.000Z",
        "closingDate": "2021-05-11T09:00:00.000Z",
        "openingBalance": 23.27,
        "ledgerEntriesSum": 20.82,
        "withholdings": [
        {
            "amount": 8.21,
            "code": "W005",
            "description": "Pending Refunds"
        }
        ],
        "withholdingsSum": 8.21,
        "totalAmount": 35.88,
        "token": "2GrR6GDeYxUFYM9sDKViy6nFFTy4Rjvm1SYdLBjK46jkeJdgUTRccRfhtwkhNcuZky"
    }
}
```


## Get settlement reconciliation report

`GET /settlements/:settlementId/reconciliationReport`

Facades `MERCHANT`

### HTTP Request

URL Parameters

| Parameter | Description | Type | Presence |
| --- | --- | :---: | :---: |
| `settlementId` | id of the specific settlement resource to be fetched | `string` | Mandatory |
| `?token=` | The resource token for the `settlementId` you want to look up. You need to retrieve this token from the settlement object itself, using the `merchant` facade. | `string` | Mandatory |


Headers

| Fields | Description | Presence |
| --- | --- | :---: |
| `X-Accept-Version` | Must be set to `2.0.0` for requests to the BitPay API. | Mandatory |
| `Content-Type` | must be set to `application/json` for requests to the BitPay API. | Mandatory |
| `X-Identity` | the hexadecimal public key generated from the client private key. This header is required when using tokens with higher privileges (`merchant` facade). When using standard `pos` facade token directly from the [BitPay dashboard](https://test.bitpay.com/dashboard/merchant/api-tokens) (with `"Require Authentication"` disabled), this header is not needed. | Mandatory |
| `X-Signature` | header is the ECDSA signature of the full request URL concatenated with the request body, signed with your private key. This header is required when using tokens with higher privileges (`merchant` facade). When using standard `pos` facade token directly from the [BitPay dashboard](https://test.bitpay.com/dashboard/merchant/api-tokens) (with `"Require Authentication"` disabled), this header is not needed. | Mandatory |

To get all refund requests for an invoice, pass the Invoice Id with URL parameter

```js
retrievedSettlements = await client.GetSettlements(Currencies.USD, dateStart, dateEnd, null, null, null);

firstSettlement = retrievedSettlements.shift();

retrievedSettlement = await client.GetSettlementReconciliationReport(firstSettlement);
```

HTTP Response

```json
{
    "data": {
        "id": "RvNuCTMAkURKimwgvSVEMP",
        "accountId": "YJCgTf3jrXHkUVzLQ7y4eg",
        "status": "processing",
        "currency": "USD",
        "payoutInfo": {
        "label": "Test",
        "bankCountry": "Netherlands",
        "bankAddress": "test",
        "bankAddress2": "test",
        "bankName": "Test",
        "iban": "NL85ABNA0000000000",
        "swift": "RABONL2U",
        "accountHolderCountry": "United States",
        "accountHolderCity": "test",
        "accountHolderPostalCode": "test",
        "accountHolderAddress": "test",
        "accountHolderAddress2": "test",
        "accountHolderName": "test",
        "wire": true
        },
        "dateCreated": "2018-08-23T20:45:22.742Z",
        "dateExecuted": "2018-08-23T20:47:06.912Z",
        "openingDate": "2018-08-01T13:00:00.000Z",
        "closingDate": "2018-08-23T13:00:00.000Z",
        "openingBalance": 23.13,
        "ledgerEntriesSum": 2956.77,
        "withholdings": [
        {
            "amount": 590.08,
            "code": "W005",
            "description": "Pending Refunds"
        }
        ],
        "withholdingsSum": 590.08,
        "totalAmount": 2389.82,
        "ledgerEntries": [
        {
            "code": 1000,
            "description": "Test invoice BCH",
            "timestamp": "2018-08-01T20:16:03.742Z",
            "amount": 5.83,
            "invoiceId": "E1pJQNsHP2oHuMo2fagpe6",
            "invoiceData": {
            "orderId": "Test invoice BCH",
            "date": "2018-08-01T19:24:42.789Z",
            "price": 5,
            "currency": "EUR",
            "transactionCurrency": "BCH",
            "payoutPercentage": {
                "USD": 100
            }
            }
        },
        {
            "code": 1023,
            "description": "Invoice Fee",
            "timestamp": "2018-08-01T20:16:03.742Z",
            "amount": -0.06,
            "invoiceId": "E1pJQNsHP2oHuMo2fagpe6"
        },
        {
            "code": 1017,
            "description": "Account Settlement XGJqZmdSGDwi5exXqQusJf",
            "timestamp": "2018-08-01T20:19:54.394Z",
            "amount": -23.13
        },
        {
            "code": 1000,
            "description": "Test invoice BCH",
            "timestamp": "2018-08-01T20:20:25.258Z",
            "amount": 5.84,
            "invoiceId": "PbPTukHvymCZYA8FGDa5wh",
            "invoiceData": {
            "orderId": "Test invoice BCH",
            "date": "2018-08-01T19:37:52.790Z",
            "price": 5,
            "currency": "EUR",
            "transactionCurrency": "BCH",
            "payoutPercentage": {
                "USD": 100
            }
            }
        },
        {
            "code": 1023,
            "description": "Invoice Fee",
            "timestamp": "2018-08-01T20:20:25.258Z",
            "amount": -0.06,
            "invoiceId": "PbPTukHvymCZYA8FGDa5wh"
        },
        {
            "code": 1000,
            "description": "Bill 2",
            "timestamp": "2018-08-02T13:54:16.656Z",
            "amount": 1010.1,
            "invoiceId": "GfcuUrvc2TAeCdSzAupbe8",
            "invoiceData": {
            "orderId": "Bill 2",
            "date": "2018-08-02T12:11:15.760Z",
            "price": 1010.1,
            "currency": "USD",
            "transactionCurrency": "BTC",
            "payoutPercentage": {
                "USD": 100
            }
            }
        },
        {
            "code": 1023,
            "description": "Invoice Fee",
            "timestamp": "2018-08-02T13:54:16.656Z",
            "amount": -10.1,
            "invoiceId": "GfcuUrvc2TAeCdSzAupbe8"
        },
        {
            "code": 1000,
            "description": "Bill 2",
            "timestamp": "2018-08-02T13:54:16.663Z",
            "amount": 1010.1,
            "invoiceId": "C3ak5sJD3k15nxTePgVYBv",
            "invoiceData": {
            "orderId": "Bill 2",
            "date": "2018-08-02T12:01:44.613Z",
            "price": 1010.1,
            "currency": "USD",
            "transactionCurrency": "BTC",
            "payoutPercentage": {
                "USD": 100
            }
            }
        },
        {
            "code": 1023,
            "description": "Invoice Fee",
            "timestamp": "2018-08-02T13:54:16.663Z",
            "amount": -10.1,
            "invoiceId": "C3ak5sJD3k15nxTePgVYBv"
        },
        {
            "code": 1000,
            "description": "Test bill 1",
            "timestamp": "2018-08-03T10:15:39.714Z",
            "amount": 1311.81,
            "invoiceId": "5Bfnr8eamNCAYjhVYfzJxs",
            "invoiceData": {
            "orderId": "Test bill 1",
            "date": "2018-08-03T09:22:55.518Z",
            "price": 1010.1,
            "currency": "GBP",
            "transactionCurrency": "BTC",
            "payoutPercentage": {
                "USD": 100
            }
            }
        },
        {
            "code": 1023,
            "description": "Invoice Fee",
            "timestamp": "2018-08-03T10:15:39.714Z",
            "amount": -13.12,
            "invoiceId": "5Bfnr8eamNCAYjhVYfzJxs"
        },
        {
            "code": 1000,
            "description": "test bill",
            "timestamp": "2018-08-06T13:41:58.036Z",
            "amount": 1010.1,
            "invoiceId": "RMUkvBHVQnr9wLDHgD646u",
            "invoiceData": {
            "orderId": "test bill",
            "date": "2018-08-06T13:24:43.826Z",
            "price": 1010.1,
            "currency": "USD",
            "transactionCurrency": "BTC",
            "payoutPercentage": {
                "USD": 100
            }
            }
        },
        {
            "code": 1023,
            "description": "Invoice Fee",
            "timestamp": "2018-08-06T13:41:58.036Z",
            "amount": -10.1,
            "invoiceId": "RMUkvBHVQnr9wLDHgD646u"
        },
        {
            "code": 1020,
            "description": "Invoice Refund",
            "timestamp": "2018-08-07T08:34:49.842Z",
            "amount": -1010.1,
            "invoiceId": "RMUkvBHVQnr9wLDHgD646u",
            "invoiceData": {
            "orderId": "test bill",
            "date": "2018-08-06T13:24:43.826Z",
            "price": 1010.1,
            "currency": "USD",
            "transactionCurrency": "BTC",
            "payoutPercentage": {
                "USD": 100
            },
            "refundInfo": {
                "supportRequest": "Cw4dQ1wnEaL11EkfLrBQAC",
                "currency": "USD",
                "amounts": {
                "USD": 1010.1,
                "BTC": 0.145439
                }
            }
            }
        },
        {
            "code": 1039,
            "description": "Refund Fee",
            "timestamp": "2018-08-07T08:34:49.842Z",
            "amount": -0.92
        },
        {
            "code": 1000,
            "description": "Test invoice BCH",
            "timestamp": "2018-08-07T10:06:35.804Z",
            "amount": 5.8,
            "invoiceId": "LWgqvm3CH47psfgy83DvLX",
            "invoiceData": {
            "orderId": "Test invoice BCH",
            "date": "2018-08-07T09:14:09.106Z",
            "price": 5,
            "currency": "EUR",
            "transactionCurrency": "BCH",
            "payoutPercentage": {
                "USD": 100
            }
            }
        },
        {
            "code": 1023,
            "description": "Invoice Fee",
            "timestamp": "2018-08-07T10:06:35.804Z",
            "amount": -0.06,
            "invoiceId": "LWgqvm3CH47psfgy83DvLX"
        },
        {
            "code": 1000,
            "description": "Test invoice BCH",
            "timestamp": "2018-08-08T12:52:29.384Z",
            "amount": 3.43,
            "invoiceId": "932QfiTCd4ALwaLfqxH5ae",
            "invoiceData": {
            "orderId": "Test invoice BCH",
            "date": "2018-08-08T12:40:00.622Z",
            "price": 2.96,
            "currency": "EUR",
            "transactionCurrency": "BTC",
            "payoutPercentage": {
                "USD": 100
            }
            }
        },
        {
            "code": 1023,
            "description": "Invoice Fee",
            "timestamp": "2018-08-08T12:52:29.384Z",
            "amount": -0.03,
            "invoiceId": "932QfiTCd4ALwaLfqxH5ae"
        },
        {
            "code": 1011,
            "timestamp": "2018-08-09T13:04:49.607Z",
            "amount": -340.19
        },
        {
            "code": 1011,
            "timestamp": "2018-08-13T14:14:25.311Z",
            "amount": -1.06
        },
        {
            "code": 1011,
            "timestamp": "2018-08-13T14:15:09.605Z",
            "amount": -1.33
        },
        {
            "code": 1011,
            "timestamp": "2018-08-13T14:15:18.557Z",
            "amount": -1.06
        },
        {
            "code": 1034,
            "description": "PayoutRequest TDZZuBiqnsNnLjaX93ydcb",
            "timestamp": "2018-08-13T14:17:01.081Z",
            "amount": -1
        },
        {
            "code": 1040,
            "description": "Payout Fee",
            "timestamp": "2018-08-13T14:17:01.081Z",
            "amount": -0.01
        },
        {
            "code": 1011,
            "timestamp": "2018-08-13T14:17:21.617Z",
            "amount": -1.11
        },
        {
            "code": 1011,
            "timestamp": "2018-08-13T14:17:30.296Z",
            "amount": -1.29
        },
        {
            "code": 1011,
            "timestamp": "2018-08-13T14:29:52.473Z",
            "amount": -1.09
        },
        {
            "code": 1034,
            "description": "PayoutRequest BhKWi3WPSoGmCQfvvzfV9B",
            "timestamp": "2018-08-14T10:34:39.372Z",
            "amount": -3000
        },
        {
            "code": 1040,
            "description": "Payout Fee",
            "timestamp": "2018-08-14T10:34:39.372Z",
            "amount": -30
        },
        {
            "code": 1011,
            "timestamp": "2018-08-14T10:34:39.434Z",
            "amount": 69.78
        },
        {
            "code": 1000,
            "description": "Test invoice",
            "timestamp": "2018-08-14T11:13:38.374Z",
            "amount": 582.49,
            "invoiceId": "WxY7d2qUzJawZTTqpXUHov",
            "invoiceData": {
            "orderId": "Test invoice",
            "date": "2018-08-14T10:32:11.015Z",
            "price": 1000,
            "currency": "BGN",
            "transactionCurrency": "BCH",
            "payoutPercentage": {
                "USD": 100
            }
            }
        },
        {
            "code": 1023,
            "description": "Invoice Fee",
            "timestamp": "2018-08-14T11:13:38.374Z",
            "amount": -5.82,
            "invoiceId": "WxY7d2qUzJawZTTqpXUHov"
        },
        {
            "code": 1000,
            "description": "Test invoice",
            "timestamp": "2018-08-14T11:22:12.577Z",
            "amount": 3000,
            "invoiceId": "76ZQGxLuKwKJ5vBMvjdAbh",
            "invoiceData": {
            "orderId": "Test invoice",
            "date": "2018-08-14T10:37:06.348Z",
            "price": 3000,
            "currency": "USD",
            "transactionCurrency": "BTC",
            "payoutPercentage": {
                "USD": 100
            }
            }
        },
        {
            "code": 1023,
            "description": "Invoice Fee",
            "timestamp": "2018-08-14T11:22:12.577Z",
            "amount": -30,
            "invoiceId": "76ZQGxLuKwKJ5vBMvjdAbh"
        },
        {
            "code": 1034,
            "description": "PayoutRequest NkdbgovhHE8CED1ogUJ9Yg",
            "timestamp": "2018-08-14T11:45:08.017Z",
            "amount": -4502
        },
        {
            "code": 1040,
            "description": "Payout Fee",
            "timestamp": "2018-08-14T11:45:08.017Z",
            "amount": -45.02
        },
        {
            "code": 1011,
            "timestamp": "2018-08-14T11:45:08.073Z",
            "amount": 1000.35
        },
        {
            "code": 1000,
            "description": "Test invoice",
            "timestamp": "2018-08-14T13:10:18.890Z",
            "amount": 3000,
            "invoiceId": "RSPnAH9L5yDWUFNYTGDJmi",
            "invoiceData": {
            "orderId": "Test invoice",
            "date": "2018-08-14T11:58:30.028Z",
            "price": 3000,
            "currency": "USD",
            "transactionCurrency": "BTC",
            "payoutPercentage": {
                "USD": 100
            }
            }
        },
        {
            "code": 1023,
            "description": "Invoice Fee",
            "timestamp": "2018-08-14T13:10:18.890Z",
            "amount": -30,
            "invoiceId": "RSPnAH9L5yDWUFNYTGDJmi"
        },
        {
            "code": 1000,
            "description": "Iphone-Order 1",
            "timestamp": "2018-08-16T13:32:23.205Z",
            "amount": 10,
            "invoiceId": "WwCouQindnn6TYW9PvRMSU",
            "invoiceData": {
            "orderId": "Iphone-Order 1",
            "date": "2018-08-16T12:01:32.513Z",
            "price": 10,
            "currency": "USD",
            "transactionCurrency": "BTC",
            "payoutPercentage": {
                "USD": 100
            }
            }
        },
        {
            "code": 1023,
            "description": "Invoice Fee",
            "timestamp": "2018-08-16T13:32:23.205Z",
            "amount": -0.1,
            "invoiceId": "WwCouQindnn6TYW9PvRMSU"
        }
        ]
    }
}
```


### [Back to guide index](../../GUIDE.md)