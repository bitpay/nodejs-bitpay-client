# Bill

Bills are payment requests addressed to specific buyers. Bill line items have fixed prices, typically denominated in fiat currency.

## Create bill

`POST /bills`

### Facade `POS`

### HTTP Request

Headers

| Fields | Description | Presence |
| --- | --- | :---: |
| `X-Accept-Version` | Must be set to `2.0.0` for requests to the BitPay API. | Mandatory |
| `Content-Type` | must be set to `application/json` for requests to the BitPay API. | Mandatory |

Body

| Name | Description | Type | Presence |
| --- | --- | :---: | :---: |
| `number` | Bill identifier, specified by merchant | `string` | Optional |
| `currency` | ISO 4217 3-character currency code. This is the currency associated with the price field | `string` | Mandatory |
| `name` | Bill recipient's name | `string` | Optional |
| `address1` | Bill recipient's address | `string` | Optional |
| `address2` | Bill recipient's address | `string` | Optional |
| `city` | Bill recipient's city | `string` | Optional |
| `state` | Bill recipient's state or province | `string` | Optional |
| `zip` | Bill recipient's ZIP code | `string` | Optional |
| `country` | Bill recipient's country | `string` | Optional |
| `email` | Bill recipient's email address | `string` | Mandatory |
| `cc` | Email addresses to which a copy of the bill must be sent | `array` | Optional |
| `phone` | Bill recipient's phone number | `string` | Optional |
| `dueDate` | Date and time at which a bill is due, ISO-8601 format yyyy-mm-ddThh:mm:ssZ. (UTC) | `string` | Optional |
| `passProcessingFee` | If set to `true`, BitPay's processing fee will be included in the amount charged on the invoice | `boolean` | Optional |
| `items` | List of line items | `string` | Mandatory |
| &rarr; `description` | Line item description | `string` | Mandatory |
| &rarr; `price` | Line item unit price for the corresponding `currency` | `number` | Mandatory |
| &rarr; `quantity` | Bill identifier, specified by merchant | `number` | Mandatory |
| `token` | The API token can be retrieved from the dashboard (limited to pos facade) | `string` | Mandatory |

An example code of the create bill

```js
let basicBillUsd;

let items = [];

let item = new BillItem();
item.price = 30;
item.quantity = 9;
item.description = "Test Item 1";
items.push(item);

item.price = 13.7;
item.quantity = 18;
item.description = "Test Item 2";
items.push(item);

let bill = new BitPaySDKLight.Models.Bill("bill1234-ABCD", Currencies.USD, "", items);
bill.email = "john@doe.com";

basicBillUsd = await client.CreateBill(bill);
```

### HTTP Response

```json
{
    "facade": "pos/bill",
    "data": {
        "status": "draft",
        "url": "https://bitpay.com/bill?id=X6KJbe9RxAGWNReCwd1xRw&resource=bills",
        "number": "bill1234-ABCD",
        "createdDate": "2021-05-21T09:48:02.373Z",
        "dueDate": "2021-05-31T00:00:00.000Z",
        "currency": "USD",
        "email": "john@doe.com",
        "cc": [
        "jane@doe.com"
        ],
        "passProcessingFee": true,
        "id": "X6KJbe9RxAGWNReCwd1xRw",
        "items": [
        {
            "id": "EL4vx41Nxc5RYhbqDthjE",
            "description": "Test Item 1",
            "price": 6,
            "quantity": 1
        },
        {
            "id": "6spPADZ2h6MfADvnhfsuBt",
            "description": "Test Item 2",
            "price": 4,
            "quantity": 1
        }
        ],
        "token": "qVVgRARN6fKtNZ7Tcq6qpoPBBE3NxdrmdMD883RyMK4Pf8EHENKVxCXhRwyynWveo"
    }
}
```


## Get bill

`GET /bills/:billid`

### Facade `POS`

### HTTP Request

URL Parameters

| Parameter | Description | Type | Presence |
| --- | --- | :---: | :---: |
| `?token=` | when fetching settlememts, pass a merchant facade token as a URL parameter. | `string` | Mandatory |

Headers

| Fields | Description | Presence |
| --- | --- | :---: |
| `X-Accept-Version` | Must be set to `2.0.0` for requests to the BitPay API. | Mandatory |
| `Content-Type` | must be set to `application/json` for requests to the BitPay API. | Mandatory |

To get the generated bill details, pass the Bill Id with URL parameter

```js
retrievedBill = await client.GetBill(basicBillUsd.id);
```
### HTTP Response

```json
{
    "facade": "pos/bill",
    "data": {
        "status": "draft",
        "url": "https://bitpay.com/bill?id=X6KJbe9RxAGWNReCwd1xRw&resource=bills",
        "number": "bill1234-ABCD",
        "createdDate": "2021-05-21T09:48:02.373Z",
        "dueDate": "2021-05-31T00:00:00.000Z",
        "currency": "USD",
        "email": "john@doe.com",
        "cc": [
        "jane@doe.com"
        ],
        "passProcessingFee": true,
        "id": "X6KJbe9RxAGWNReCwd1xRw",
        "items": [
        {
            "id": "EL4vx41Nxc5RYhbqDthjE",
            "description": "Test Item 1",
            "price": 6,
            "quantity": 1
        },
        {
            "id": "6spPADZ2h6MfADvnhfsuBt",
            "description": "Test Item 2",
            "price": 4,
            "quantity": 1
        }
        ],
        "token": "qVVgRARN6fKtNZ7Tcq6qpoPBBE3NxdrmdMD883RyMK4Pf8EHENKVxCXhRwyynWveo"
    }
}
```


## Deliver bill

`GET /bills/:billid/deliveries`

### Facade `POS`

### HTTP Request

URL Parameters

| Parameter | Description | Type | Presence |
| --- | --- | :---: | :---: |
| `billId` | the id of the bill you want to deliver via email. | `string` | Mandatory |

Headers

| Fields | Description | Presence |
| --- | --- | :---: |
| `X-Accept-Version` | Must be set to `2.0.0` for requests to the BitPay API. | Mandatory |
| `Content-Type` | must be set to `application/json` for requests to the BitPay API. | Mandatory |

Body

| Name | Description | Type | Presence |
| --- | --- | :---: | :---: |
| `token` | The resource token for the billId you want to deliver via email. You need to retrieve this token from the bill object itself. | `string` | Mandatory |

To deliver the generated bill, pass the Bill Id with URL parameters

```js
deliveredBill = await client.DeliverBill(basicBillUsd.id, basicBillUsd.token);
```
HTTP Response

Body

| Name | Description | Type |
| --- | --- | :---: |
| `data` | set to `"Success"` once a bill is successfully sent via email. | `string` |

```json
{
    "data": "Success"
}
```

### [Back to guide index](../../GUIDE.md)