# Rates

## Get exchange Rates

Rates are exchange rates, representing the number of fiat currency units equivalent to one BTC. You can retrieve BitPay's [BBB exchange rates](https://bitpay.com/exchange-rates).

`GET /rates/:basecurrency`

Facades `PUBLIC`

### HTTP Request

URL Parameters

| Parameter | Description | Type | Presence |
| --- | --- | :---: | :---: |
| `baseCurrency` | the cryptocurrency for which you want to fetch the rates. Current supported values are BTC and BCH. | `string` | Mandatory |

Headers

| Fields | Description | Presence |
| --- | --- | :---: |
| `X-Accept-Version` | Must be set to `2.0.0` for requests to the BitPay API. | Mandatory |
| `Content-Type` | must be set to `application/json` for requests to the BitPay API. | Mandatory |

An example code of get rates

```js
const result = await client.GetRates();

let rate = await client.GetRate(Currency::USD); //Always use the included Currency model to avoid typos

let Rates = new BitPaySDK.Models.Rates(await client.GetRates(), client);
await Rates.Update();

let newRates = await Rates.GetRates();
```

HTTP Response

Body

| Name | Description | Type |
| --- | --- | :---: |
| `data` | array of currency rates for the requested `baseCurrency`. | `array` |
| &rarr; `code` | ISO 4217 3-character currency code. | `string` |
| &rarr; `name` | detailed currency name. | `string` |
| &rarr; `rate` | rate for the requested `baseCurrency` /`currency` pair. | `number` |

```json
{
    "data":[
        {
        "code":"BTC",
        "name":"Bitcoin",
        "rate":1
        },
        {
        "code":"BCH",
        "name":"Bitcoin Cash",
        "rate":50.77
        },
        {
        "code":"USD",
        "name":"US Dollar",
        "rate":41248.11
        },
        {
        "code":"EUR",
        "name":"Eurozone Euro",
        "rate":33823.04
        },
        {
        "code":"GBP",
        "name":"Pound Sterling",
        "rate":29011.49
        },
        {
        "code":"JPY",
        "name":"Japanese Yen",
        "rate":4482741
        },
        {
        "code":"CAD",
        "name":"Canadian Dollar",
        "rate":49670.85
        },
        {
        "code":"AUD",
        "name":"Australian Dollar",
        "rate":53031.99
        },
        {
        "code":"CNY",
        "name":"Chinese Yuan",
        "rate":265266.57
        },
        ...
    ]
}
```

You can retrieve all the rates for a given cryptocurrency

URL Parameters

| Parameter | Description | Type | Presence |
| --- | --- | :---: | :---: |
| `baseCurrency` | the cryptocurrency for which you want to fetch the rates. Current supported values are BTC and BCH. | `string` | Mandatory |
| `currency` | the fiat currency for which you want to fetch the `baseCurrency` rates. | `string` | Mandatory |

Headers

| Fields | Description | Presence |
| --- | --- | :---: |
| `X-Accept-Version` | Must be set to `2.0.0` for requests to the BitPay API. | Mandatory |
| `Content-Type` | must be set to `application/json` for requests to the BitPay API. | Mandatory |

```js
let rate = await client.GetRate(Currency::USD); //Always use the included Currency model to avoid typos
```

HTTP Response

Body

| Name | Description | Type |
| --- | --- | :---: |
| `data` | rate data object. | `object` |
| &rarr; `code` | ISO 4217 3-character currency code. | `string` |
| &rarr; `name` | detailed currency name. | `string` |
| &rarr; `rate` | rate for the requested `baseCurrency` /`currency` pair. | `number` |

```json
{
    "data":
        {
            "code":"USD",
            "name":"US Dollar",
            "rate":41154.05
        }
}
```
See also the test package for more examples of API calls.

## Get Currencies

`GET /currencies`

### Facade `PUBLIC`

### HTTP Request

Headers

| Fields | Description | Presence |
| --- | --- | :---: |
| `X-Accept-Version` | Must be set to `2.0.0` for requests to the BitPay API. | Mandatory |
| `Content-Type` | must be set to `application/json` for requests to the BitPay API. | Mandatory |

You can retrieve all the currencies supported by BitPay.

```js
let currencies = await client.GetCurrencyInfo()
```

HTTP Response

Body

| Name | Description | Type |
| --- | --- | :---: |
| `data` | Array of supported currencies | `array` |
| &rarr; `code` | ISO 4217 3-character currency code | `string` |
| &rarr; `symbol` | Display symbol | `string` |
| &rarr; `precision` | Number of decimal places | `number` |
| &rarr; `name` | English currency name | `string` |
| &rarr; `plural` | English plural form | `string` |
| &rarr; `alts` | Alternative currency name(s) | `string` |
| &rarr; `minimum` | Minimum supported value when creating an invoice, bill or payout for instance | `string` |
| &rarr; `sanctionned` | If the currency is linked to a sanctionned country | `boolean` |
| &rarr; `decimals` | decimal precision | `number` |
| &rarr; `chain` | For cryptocurrencies or tokens, the corresponding chain is also specified. For instance, with `USDC` (Circle USD Coin), the `chain` is `ETH`. | `string` |

```json
{
    "data": [
        {
        "code": "BTC",
        "symbol": "฿",
        "precision": 6,
        "name": "Bitcoin",
        "plural": "Bitcoin",
        "alts": "btc",
        "minimum": 0.000006,
        "sanctioned": false,
        "decimals": 8,
        "chain": "BTC"
        },
        ...
        ...
        {
        "code": "XRP",
        "symbol": "Ʀ",
        "precision": 6,
        "name": "Ripple",
        "plural": "Ripple",
        "alts": "xrp",
        "minimum": 0.000006,
        "sanctioned": false,
        "decimals": 6,
        "chain": "XRP"
        },
        ...
        ...
        {
        "code": "EUR",
        "symbol": "€",
        "precision": 2,
        "name": "Eurozone Euro",
        "plural": "Eurozone Euros",
        "alts": "eur",
        "minimum": 0.01,
        "sanctioned": false,
        "decimals": 2
        },
        ...
        ...
        {
        "code": "USD",
        "symbol": "$",
        "precision": 2,
        "name": "US Dollar",
        "plural": "US Dollars",
        "alts": "usd bucks",
        "minimum": 0.01,
        "sanctioned": false,
        "decimals": 2
        },
        {
        "code": "USDC",
        "symbol": "$",
        "precision": 2,
        "name": "Circle USD Coin",
        "plural": "Circle USD Coin",
        "alts": "",
        "minimum": 0.01,
        "sanctioned": false,
        "decimals": 6,
        "chain": "ETH"
        },
        ...
        ...
    ]
}
```

### [Back to guide index](../../GUIDE.md)