# Invoice

Invoices are time-sensitive payment requests addressed to specific buyers. An invoice has a fixed price, typically denominated in fiat currency. It also has an equivalent price in the supported cryptocurrencies, calculated by BitPay, at a locked exchange rate with an expiration time of 15 minutes.

## Create an invoice

`POST /invoices`

Facade `POS` `MERCHANT`

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
| `token` | The API token can be retrieved from the dashboard (limited to `pos` facade) or using the Tokens resource to get access to the `merchant` facade. This is described in the section [Request an API token](GUIDE.md#getting-your-client-token)) | `string` | Mandatory |
| `price` | Fixed price amount for the checkout, in the "currency" of the invoice object | `string` | Mandatory |
| `currency` | ISO 4217 3-character currency code. This is the currency associated with the price field, supported currencies are available via the Currencies resource | `string` | Mandatory |
| `orderId` | Can be used by the merchant to assign their own internal Id to an invoice. If used, there should be a direct match between an orderId and an invoice id | `string` | Optional |
| `itemDesc` | Invoice description - will be added as a line item on the BitPay checkout page, under the merchant name | `string` | Optional |
| `itemCode` | "bitcoindonation" for donations, otherwise do not include the field in the request. | `string` | Optional |
| `notificationEmail` | Merchant email address for notification of invoice status change. It is also possible to configure this email via the account setting on the BitPay dashboard or disable the email notification | `string` | Optional |
| `notificationURL` | URL to which BitPay sends webhook notifications. HTTPS is mandatory. | `string` | Optional |
| `redirectURL` | The shopper will be redirected to this URL when clicking on the Return button after a successful payment or when clicking on the Close button if a separate `closeURL` is not specified. Be sure to include "http://" or "https://" in the url. | `string` | Optional |
| `closeURL` | URL to redirect if the shopper does not pay the invoice and click on the Close button instead. Be sure to include "http://" or "https://" in the url. | `string` | Optional |
| `autoRedirect` | Set to `false` by default, merchant can setup automatic redirect to their website by setting this parameter to `true`. This will applied to the following scenarios: When the invoice is paid, it automatically redirects the shopper to the `redirectURL` indicated When the invoice expires, it automatically redirects the shopper to the `closeURL` if specified and to the `redirectURL` otherwise Note: If automatic redirect is enabled, `redirectURL` becomes a mandatory invoice parameters. | `boolean` | Optional |
| `posData` | A passthru variable provided by the merchant during invoice creation and designed to be used by the merchant to correlate the invoice with an order or other object in their system. This passthru variable can be a serialized object, e.g.: `"posData": "\"{ \"ref\" : 711454, \"item\" : \"test_item\" }\""`. | `string` | Optional |
| `transactionSpeed` | This is a risk mitigation parameter for the merchant to configure how they want to fulfill orders depending on the number of block confirmations for the transaction made by the consumer on the selected cryptocurrency. high: The invoice is marked as "confirmed" by BitPay as soon as full payment is received but not yet validated on the corresponding blockchain. The invoice will go from a status of "new" to "confirmed", bypassing the "paid" status. If you want an immediate notification for a payment, you can use the high speed setting. However, it makes you more susceptible to receiving fraudulent payments, so it is not recommended. medium: (Recommended for most merchants) The invoice is marked as "confirmed" after the transaction has received basic confirmation on the corresponding blockchain. For invoices paid in Bitcoin (BTC), this means 1 confirmation on the blockchain which takes on average 10 minutes. The invoice will go from a status of "new" to "paid" followed by "confirmed" and then "complete" low: The invoice is marked as "confirmed" once BitPay has credited the funds to the merchant account. The invoice will go from a status of "new" to "paid" followed by "complete", thus bypassing the "confirmed" status. For invoices paid in Bitcoin (BTC), this means 6 confirmations on the blockchain which takes on average an hour If not set on the invoice, transactionSpeed will default to the account-level Order Settings. Note : orders are only credited to your BitPay Account Summary for settlement after the invoice reaches the status "complete" (regardless of this setting). | `string` | Optional |
| `fullNotifications` | This parameter is set to true by default, meaning all standard notifications are being sent for a payment made to an invoice. If you decide to set it to `false` instead, only 1 webhook will be sent for each invoice paid by the consumer. This webhook will be for the "confirmed" or "complete" invoice status, depending on the `transactionSpeed` selected. | `boolean` | Optional |
| `extendedNotifications` | Allows merchants to get access to additional webhooks. For instance when an invoice expires without receiving a payment or when it is refunded. If set to `true`, then `fullNotifications` is automatically set to `true`. When using the `extendedNotifications` parameter, the webhook also have a payload slightly different from the standard webhooks. | `boolean` | Optional |
| `physical` | Indicates whether items are physical goods. Alternatives include digital goods and services. | `boolean` | Optional |
| `buyer` | Allows merchant to pass buyer related information in the invoice object | `object` | Optional |
| &rarr; `name` | Buyer's name | `string` | Optional |
| &rarr; `address1` | Buyer's address | `string` | Optional |
| &rarr; `address2` | Buyer's appartment or suite number | `string` | Optional |
| &rarr; `locality` | Buyer's city or locality | `string` | Optional |
| &rarr; `region` | Buyer's state or province | `string` | Optional |
| &rarr; `postalCode` | Buyer's Zip or Postal Code | `string` | Optional |
| &rarr; `country` | Buyer's Country code. Format ISO 3166-1 alpha-2 | `string` | Optional |
| &rarr; `email` | Buyer's email address. If provided during invoice creation, this will bypass the email prompt for the consumer when opening the invoice. | `string` | Optional |
| &rarr; `phone` | Buyer's phone number | `string` | Optional |
| &rarr; `notify` | Indicates whether a BitPay email confirmation should be sent to the buyer once he has paid the invoice | `boolean` | Optional |
| `paymentCurrencies` | Allow the merchant to select the cryptocurrencies available as payment option on the BitPay invoice. Possible values are currently `"BTC"`, `"BCH"`, `"ETH"`, `"GUSD"`, `"PAX"`, `"BUSD"`, `"USDC"`, `"XRP"`, `"DOGE"`, `"DAI"` and `"WBTC"`. For instance `"paymentCurrencies": ["BTC"]` will create an invoice with only XRP available as transaction currency, thus bypassing the currency selection step on the invoice. | `array` | Optional |
| `jsonPayProRequired` | If set to `true`, this means that the invoice will only accept payments from wallets which have implemented the [BitPay JSON Payment Protocol](https://bitpay.com/docs/payment-protocol) | `boolean` | Optional |

An example code of the create invoice

```js
let buyer = new Buyer();
buyer.email = "john@doe.com";
buyer.name = "Bily Matthews";
buyer.address1 = "168 General Grove";
buyer.address2 = "";
buyer.locality = "Port Horizon";
buyer.region = "New Port";
buyer.postalCode = "KY7 1TH";
buyer.country = "AD";
buyer.phone = "+990123456789";
buyer.notify = true;

let invoiceData = new BitPaySDKLight.Models.Invoice(6.02, Currencies.USD);
invoiceData.buyer = buyer;
invoiceData.orderId = '65f5090680f6';
invoiceData.fullNotifications = true;
invoiceData.extendedNotifications = true;
invoiceData.notificationURL = "https://hookb.in/1gw8aQxYQDHj002yk79K";
invoiceData.redirectURL = "https://hookb.in/1gw8aQxYQDHj002yk79K";
invoiceData.itemDesc = 'Ab tempora sed ut.';
invoiceData.notificationEmail = '[MERCHANT EMAIL ADDRESS]';

let invoice;

invoice = await client.CreateInvoice(invoiceData);
```

### HTTP Response

```json
{
    "facade": "pos/invoice",
    "data": {
        "url": "https://bitpay.com/invoice?id=KSnNNfoMDsbRzd1U9ypmVH",
        "status": "new",
        "price": 10,
        "currency": "USD",
        "orderId": "20210511_abcde",
        "invoiceTime": 1620734545366,
        "expirationTime": 1620735445366,
        "currentTime": 1620734545415,
        "id": "KSnNNfoMDsbRzd1U9ypmVH",
        "lowFeeDetected": false,
        "amountPaid": 0,
        "displayAmountPaid": "0",
        "exceptionStatus": false,
        "redirectURL": "https://merchantwebsite.com/shop/return",
        "refundAddressRequestPending": false,
        "buyerProvidedInfo": {},
        "paymentSubtotals": {
            "BTC": 18200,
            "BCH": 744500,
            "ETH": 2535000000000000,
            "GUSD": 1000,
            "PAX": 10000000000000000000,
            "BUSD": 10000000000000000000,
            "USDC": 10000000,
            "XRP": 7084249,
            "DOGE": 2068707100,
            "DAI": 9990000000000000000,
            "WBTC": 18100
        },
        "paymentTotals": {
            "BTC": 29800,
            "BCH": 744500,
            "ETH": 2535000000000000,
            "GUSD": 1000,
            "PAX": 10000000000000000000,
            "BUSD": 10000000000000000000,
            "USDC": 10000000,
            "XRP": 7084249,
            "DOGE": 2068707100,
            "DAI": 9990000000000000000,
            "WBTC": 18100
        },
        "paymentDisplayTotals": {
            "BTC": "0.000298",
            "BCH": "0.007445",
            "ETH": "0.002535",
            "GUSD": "10.00",
            "PAX": "10.00",
            "BUSD": "10.00",
            "USDC": "10.00",
            "XRP": "7.084249",
            "DOGE": "20.687071",
            "DAI": "9.99",
            "WBTC": "0.000181"
        },
        "paymentDisplaySubTotals": {
            "BTC": "0.000182",
            "BCH": "0.007445",
            "ETH": "0.002535",
            "GUSD": "10.00",
            "PAX": "10.00",
            "BUSD": "10.00",
            "USDC": "10.00",
            "XRP": "7.084249",
            "DOGE": "20.687071",
            "DAI": "9.99",
            "WBTC": "0.000181"
        },
        "exchangeRates": {
            "BTC": {
            "USD": 55072.459995,
            "EUR": 45287.42496000001,
            "BCH": 40.884360403999914,
            "ETH": 13.953840617367156,
            "GUSD": 55072.459995,
            "PAX": 55072.459995,
            "BUSD": 55072.459995,
            "USDC": 55072.459995,
            "XRP": 38907.54307403195,
            "DOGE": 113694.39064944115,
            "DAI": 55018.486859390934,
            "WBTC": 0.9983514430763876
            },
            "BCH": {
            "USD": 1343.1537000000003,
            "EUR": 1104.481875,
            "BTC": 0.02437664632426631,
            "ETH": 0.34031805835672807,
            "GUSD": 1343.1537000000003,
            "PAX": 1343.1537000000003,
            "BUSD": 1343.1537000000003,
            "USDC": 1343.1537000000003,
            "XRP": 948.9100440136494,
            "DOGE": 2772.8748903518513,
            "DAI": 1341.8373575522414,
            "WBTC": 0.024348638771359274
            },
            "ETH": {
            "USD": 3944.6466899999996,
            "EUR": 3242.8077850000004,
            "BTC": 0.07159065804331831,
            "BCH": 2.9284029977060646,
            "GUSD": 3944.6466899999996,
            "PAX": 3944.6466899999996,
            "BUSD": 3944.6466899999996,
            "USDC": 3944.6466899999996,
            "XRP": 2786.8105223000134,
            "DOGE": 8143.529484384802,
            "DAI": 3940.7807840508463,
            "WBTC": 0.07150840394174397
            },
            ...
        },
        "supportedTransactionCurrencies": {
            "BTC": {
            "enabled": true
            },
            "BCH": {
            "enabled": true
            },
            "ETH": {
            "enabled": true
            },
            ...
        },
        "minerFees": {
            "BTC": {
            "satoshisPerByte": 79.152,
            "totalFee": 11600
            },
            "BCH": {
            "satoshisPerByte": 0,
            "totalFee": 0
            },
            "ETH": {
            "satoshisPerByte": 0,
            "totalFee": 0
            },
            ...
        },
        "jsonPayProRequired": false,
        "paymentCodes": {
            "BTC": {
            "BIP72b": "bitcoin:?r=https://bitpay.com/i/KSnNNfoMDsbRzd1U9ypmVH",
            "BIP73": "https://bitpay.com/i/KSnNNfoMDsbRzd1U9ypmVH"
            },
            "BCH": {
            "BIP72b": "bitcoincash:?r=https://bitpay.com/i/KSnNNfoMDsbRzd1U9ypmVH",
            "BIP73": "https://bitpay.com/i/KSnNNfoMDsbRzd1U9ypmVH"
            },
            "ETH": {
            "EIP681": "ethereum:?r=https://bitpay.com/i/KSnNNfoMDsbRzd1U9ypmVH"
            },
            ...
        },
        "token": "8nPJSGgi7omxcbGGZ4KsSgqdi6juypBe9pVpSURDeAwx4VDQx1XfWPy5qqknDKT9KQ"
    }
}
```

To get the generated invoice url and status

```js
let invoiceUrl = invoice.url;

let status = invoice.status;
```

> **WARNING**: 
If you get the following error when initiating the client for first time:
"500 Internal Server Error` response: {"error":"Account not setup completely yet."}"
Please, go back to your BitPay account and complete the required steps.
More info [here](https://support.bitpay.com/hc/en-us/articles/203010446-How-do-I-apply-for-a-merchant-account-)


## Retrieve an invoice

`GET /invoices/:invoiceid`

### Facade `POS` `MERCHANT`

### HTTP Request

URL Parameters

| Parameter | Description | Type | Presence |
| --- | --- | :---: | :---: |
| `?token=` | When fetching an invoice via the `merchant` or the `pos` facade, pass the API token as a URL parameter - the same token used to create the invoice in the first place. | `string` | Mandatory |

Headers

| Fields | Description | Presence |
| --- | --- | :---: |
| `X-Accept-Version` | Must be set to `2.0.0` for requests to the BitPay API. | Mandatory |
| `Content-Type` | must be set to `application/json` for requests to the BitPay API. | Mandatory |
| `X-Identity` | the hexadecimal public key generated from the client private key. This header is required when using tokens with higher privileges (`merchant` facade). When using standard `pos` facade token directly from the [BitPay dashboard](https://test.bitpay.com/dashboard/merchant/api-tokens) (with `"Require Authentication"` disabled), this header is not needed. | Mandatory |
| `X-Signature` | header is the ECDSA signature of the full request URL concatenated with the request body, signed with your private key. This header is required when using tokens with higher privileges (`merchant` facade). When using standard `pos` facade token directly from the [BitPay dashboard](https://test.bitpay.com/dashboard/merchant/api-tokens) (with `"Require Authentication"` disabled), this header is not needed. | Mandatory |


To get the generated invoice details, pass the Invoice Id with URL parameter

```js
let invoice = await client.GetInvoice(invoice.id);
```

### Retrieve invoices filtered by query

Facade `MERCHANT`

HTTP Request

URL Parameters

| Parameter | Description | Type | Presence |
| --- | --- | :---: | :---: |
| `?token=` | When fetching an invoice via the `merchant` or the `pos` facade, pass the API token as a URL parameter - the same token used to create the invoice in the first place. | `string` | Mandatory |
| `&dateStart=` | the start of the date window to query for invoices. Format `YYYY-MM-DD` | `string` | Mandatory |
| `&dateEnd=` | the end of the date window to query for invoices. Format `YYYY-MM-DD` | `string` | Mandatory |
| `&status=` | the invoice status you want to query on | `string` | Optional |
| `&orderId=` | the optional order id specified at time of invoice creation | `string` | Optional |
| `&limit=` | maximum results that the query will return (useful for paging results) | `number` | Optional |
| `&offset=` | number of results to offset (ex. skip 10 will give you results starting with the 11th result) | `number` | Optional |

Headers

| Fields | Description | Presence |
| --- | --- | :---: |
| `X-Accept-Version` | Must be set to `2.0.0` for requests to the BitPay API. | Mandatory |
| `Content-Type` | must be set to `application/json` for requests to the BitPay API. | Mandatory |
| `X-Identity` | the hexadecimal public key generated from the client private key. This header is required when using tokens with higher privileges (`merchant` facade). When using standard `pos` facade token directly from the [BitPay dashboard](https://test.bitpay.com/dashboard/merchant/api-tokens) (with `"Require Authentication"` disabled), this header is not needed. | Mandatory |
| `X-Signature` | header is the ECDSA signature of the full request URL concatenated with the request body, signed with your private key. This header is required when using tokens with higher privileges (`merchant` facade). When using standard `pos` facade token directly from the [BitPay dashboard](https://test.bitpay.com/dashboard/merchant/api-tokens) (with `"Require Authentication"` disabled), this header is not needed. | Mandatory |

To get the generated invoices filtered by query parameters 

```js
let date = new Date();
let dateEnd = new Date().toISOString().split('T')[0];
let dateStart = new Date(date.setDate(date.getDate()-30)).toISOString().split('T')[0];

let status = InvoiceStatus.New;
let limit = 30;
let offset = 0;
let retrievedInvoices;

retrievedInvoices = await client.GetInvoices(dateStart, dateEnd, status, null, limit, offset);
```

### [Back to guide index](../../GUIDE.md)