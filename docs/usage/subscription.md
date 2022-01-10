# Subscription

Subscriptions are repeat billing agreements with specific buyers. BitPay sends bill emails to buyers identified in active subscriptions according to the specified schedule.

## Create a new subscription

`POST /subscriptions`

Facades `MERCHANT`

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
| `billData` | Object containing the recurring billing information | `obect` | Mandatory |
| &rarr; `cc` | Email addresses to which a copy of the recurring bill must be sent | `array` | Optional |
| &rarr; `number` | Recurring bill identifier, specified by merchant | `string` | Optional |
| &rarr; `currency` | ISO 4217 3-character currency code. This is the currency associated with the price field | `string` | Mandatory |
| &rarr; `name` | Recurring Bill recipient's name | `string` | Optional |
| &rarr; `address1` | Recurring Bill recipient's address | `string` | Optional |
| &rarr; `address2` | Recurring Bill recipient's address | `string` | Optional |
| &rarr; `city` | Recurring Bill recipient's city | `string` | Optional |
| &rarr; `state` | Recurring Bill recipient's state or province | `string` | Optional |
| &rarr; `zip` | Recurring Bill recipient's ZIP code | `string` | Optional |
| &rarr; `country` | Recurring Bill recipient's country | `string` | Optional |
| &rarr; `email` | Recurring Bill recipient's email address | `string` | Mandatory |
| &rarr; `phone` | Recurring Bill recipient's phone | `string` | Optional |
| &rarr; `dueDate` | Date and time at which a bill is due, ISO-8601 format `yyyy-mm-ddThh:mm:ssZ` (UTC). | `string` | Mandatory |
| &rarr; `passProcessingFee` | If set to `true`, BitPay's processing fee will be included in the amount charged on the invoice | `boolean` | Optional |
| &rarr; `items` | List of line items | `array` | Mandatory |
| &rarr; &rarr; `description` | Line item description | `string` | Mandatory |
| &rarr; &rarr; `price` | Line item unit price for the corresponding `currency` | `number` | Mandatory |
| &rarr; &rarr; `quantity` | Line item number of units | `number` | Mandatory |
| `schedule` | Schedule of repeat bill due dates. Can be `weekly`, `monthly`, `quarterly`, `yearly`, or a simple cron expression specifying seconds, minutes, hours, day of month, month, and day of week. BitPay maintains the difference between the due date and the delivery date in all subsequent, automatically-generated bills. | `string` | Mandatory |
| `nextDelivery` | Default is current date & time, ISO-8601 format yyyy-mm-ddThh:mm:ssZ (UTC). Current or past date indicates that the bill can be delivered immediately. BitPay may modify the hh:mm:ss values in order to distribute deliveries evenly throughout the day. | `string` | Optional |
| `token` | API token retrieved via endpoint `POST https://bitpay.com/tokens` (`merchant` facade) | `string` | Mandatory |

An example code of the create a new subscription

```js
let subscription;
let subscriptions;
let items = [];
let billData;
let subscriptionObj;
let lastSubscription;
let retrievedSubscription;
let updatedSubscription;

items.push(new SubscriptionItem(6, 10, "Item 1"));
items.push(new SubscriptionItem(4.3, 35, "Item 2"));

billData = new BillData('USD', 'sandbox+sub@bitpay.com', '2021-02-21', items);
billData.cc = 'sandbox+cc@bitpay.com';
billData.passProcessingFee = true;
billData.emailBill = true;
billData.name = 'aaaa';
billData.currency = 'USD';
billData.email = 'sandbox+sub2@bitpay.com';

subscriptionObj = new Subscription();
subscriptionObj.id = '123';
subscriptionObj.status = 'draft';
subscriptionObj.nextDelivery = '2021-02-19';
subscriptionObj.schedule = 'weekly';
subscriptionObj.billData = billData;

subscription = await client.CreateSubscription(subscriptionObj);
```

```json
{
    "facade": "merchant/subscription",
    "data": {
        "id": "SeL33Hjyr3VmFHA5Skc4zy",
        "status": "draft",
        "billData": {
        "emailBill": true,
        "cc": [
            "jane@doe.com"
        ],
        "number": "subscription1234-ABCD",
        "currency": "USD",
        "name": "John Doe",
        "address1": "2630 Hegal Place",
        "address2": "Apt 42",
        "city": "Alexandria",
        "state": "VA",
        "zip": "23242",
        "country": "US",
        "email": "john@doe.com",
        "phone": "555-123-456",
        "dueDate": "2021-05-31T00:00:00.000Z",
        "passProcessingFee": true,
        "items": [
            {
            "description": "Test Item 1",
            "price": 6,
            "quantity": 1
            },
            {
            "description": "Test Item 2",
            "price": 4,
            "quantity": 1
            }
        ],
        "merchant": "5461e13dfd8b0047590d644a"
        },
        "schedule": "0 0 0 * * 1",
        "nextDelivery": "2021-05-24T00:00:00.000Z",
        "createdDate": "2021-05-21T12:29:54.428Z",
        "token": "85yxWk7aEgPdJME6zTkXkAGA3K13MtXf3WHqvtBvyhw3ycfEebJ5WMBRZHXsssSBvn"
    }
}
```


## Get subscription

`GET /subscriptions/:subscriptionId`

Facades `MERCHANT`

### HTTP Request

URL Parameters

| Parameter | Description | Type | Presence |
| --- | --- | :---: | :---: |
| `subscriptionId` | the subscription status you want to query on | `string` | Optional |
| `?token=` | when fetching subscriptions, pass a `merchant` facade token as a URL parameter. | `string` | Mandatory |

Headers

| Fields | Description | Presence |
| --- | --- | :---: |
| `X-Accept-Version` | Must be set to `2.0.0` for requests to the BitPay API. | Mandatory |
| `Content-Type` | must be set to `application/json` for requests to the BitPay API. | Mandatory |
| `X-Identity` | the hexadecimal public key generated from the client private key. This header is required when using tokens with higher privileges (`merchant` facade). When using standard `pos` facade token directly from the [BitPay dashboard](https://test.bitpay.com/dashboard/merchant/api-tokens) (with `"Require Authentication"` disabled), this header is not needed. | Mandatory |
| `X-Signature` | header is the ECDSA signature of the full request URL concatenated with the request body, signed with your private key. This header is required when using tokens with higher privileges (`merchant` facade). When using standard `pos` facade token directly from the [BitPay dashboard](https://test.bitpay.com/dashboard/merchant/api-tokens) (with `"Require Authentication"` disabled), this header is not needed. | Mandatory |

Example code to get the subscription details, pass the Subscriptions Id with URL parameter

```js
subscriptions = await client.GetSubscriptions();
lastSubscription = subscriptions.slice(-1).pop();

retrievedSubscription = await client.GetSubscription(lastSubscription.id);
```

HTTP Response

```json
{
    "facade": "merchant/subscription",
    "data": {
        "id": "6gqe8y5mkc5Qx2a9zmspgx",
        "status": "draft",
        "billData": {
        "emailBill": true,
        "cc": [
            "jane@doe.com"
        ],
        "number": "subscription1234-ABCD",
        "currency": "USD",
        "name": "John Doe",
        "address1": "2630 Hegal Place",
        "address2": "Apt 42",
        "city": "Alexandria",
        "state": "VA",
        "zip": "23242",
        "country": "US",
        "email": "john@doe.com",
        "phone": "555-123-456",
        "dueDate": "2021-05-31T00:00:00.000Z",
        "passProcessingFee": true,
        "items": [
            {
            "description": "Test Item 1",
            "price": 6,
            "quantity": 1
            },
            {
            "description": "Test Item 2",
            "price": 4,
            "quantity": 1
            }
        ],
        "merchant": "5461e13dfd8b0047590d644a"
        },
        "schedule": "0 0 0 * * 1",
        "nextDelivery": "2021-05-24T00:00:00.000Z",
        "createdDate": "2021-05-21T12:41:51.841Z",
        "token": "85yxWk7aEgPdJME6zTkXkA9UAGL1BW3TnJ3oTFYSa936qGRT2xDy6t5m9CUDhTt8w6"
    }
}
```


## Get subscriptions based on status

`GET /subscriptions`

Facades `MERCHANT`

### HTTP Request

URL Parameters

| Parameter | Description | Type | Presence |
| --- | --- | :---: | :---: |
| `?token=` | when fetching subscriptions, pass a `merchant` facade token as a URL parameter. | `string` | Mandatory |
| `&status=` | The subscription status you want to query on. | `string` | Optional |

Headers

| Fields | Description | Presence |
| --- | --- | :---: |
| `X-Accept-Version` | Must be set to `2.0.0` for requests to the BitPay API. | Mandatory |
| `Content-Type` | must be set to `application/json` for requests to the BitPay API. | Mandatory |
| `X-Identity` | the hexadecimal public key generated from the client private key. This header is required when using tokens with higher privileges (`merchant` facade). When using standard `pos` facade token directly from the [BitPay dashboard](https://test.bitpay.com/dashboard/merchant/api-tokens) (with `"Require Authentication"` disabled), this header is not needed. | Mandatory |
| `X-Signature` | header is the ECDSA signature of the full request URL concatenated with the request body, signed with your private key. This header is required when using tokens with higher privileges (`merchant` facade). When using standard `pos` facade token directly from the [BitPay dashboard](https://test.bitpay.com/dashboard/merchant/api-tokens) (with `"Require Authentication"` disabled), this header is not needed. | Mandatory |

Example code for get all subscriptions. Also, can get subscription by status.

```js
subscriptions = await client.GetSubscriptions();
```

HTTP Response

```json
{
    "facade": "merchant/subscription",
    "data": [
        {
        "id": "6gqe8y5mkc5Qx2a9zmspgx",
        "status": "draft",
        "billData": {
            "emailBill": true,
            "cc": [
            "jane@doe.com"
            ],
            "number": "subscription1234-ABCD",
            "currency": "USD",
            "name": "John Doe",
            "address1": "2630 Hegal Place",
            "address2": "Apt 42",
            "city": "Alexandria",
            "state": "VA",
            "zip": "23242",
            "country": "US",
            "email": "john@doe.com",
            "phone": "555-123-456",
            "dueDate": "2021-05-31T00:00:00.000Z",
            "passProcessingFee": true,
            "items": [
            {
                "description": "Test Item 1",
                "price": 6,
                "quantity": 1
            },
            {
                "description": "Test Item 2",
                "price": 4,
                "quantity": 1
            }
            ],
            "merchant": "5461e13dfd8b0047590d644a"
        },
        "schedule": "0 0 0 * * 1",
        "nextDelivery": "2021-05-24T00:00:00.000Z",
        "createdDate": "2021-05-21T12:41:51.841Z",
        "token": "85yxWk7aEgPdJME6zTkXkA9UAGL1BW3TnJ3oTFYSa936qGRT2xDy6t5m9CUDhTt8w6"
        },
        {
        "id": "2WDabp4eXU2UMbPYKYoPwA",
        "status": "draft",
        "billData": {
            "emailBill": true,
            "cc": [
            "jane@doe.com"
            ],
            "number": "subscription1234-EFGH",
            "currency": "USD",
            "name": "John Doe",
            "address1": "2630 Hegal Place",
            "address2": "Apt 42",
            "city": "Alexandria",
            "state": "VA",
            "zip": "23242",
            "country": "US",
            "email": "john@doe.com",
            "phone": "555-123-456",
            "dueDate": "2021-05-31T00:00:00.000Z",
            "passProcessingFee": true,
            "items": [
            {
                "description": "Test Item 1",
                "price": 6,
                "quantity": 1
            },
            {
                "description": "Test Item 2",
                "price": 4,
                "quantity": 1
            }
            ],
            "merchant": "5461e13dfd8b0047590d644a"
        },
        "schedule": "0 0 0 * * 1",
        "nextDelivery": "2021-05-24T00:00:00.000Z",
        "createdDate": "2021-05-21T12:42:01.029Z",
        "token": "85yxWk7aEgPdJME6zTkXkACFxcVxzQuhyGuYv4ESYEgdkReFnqzN5WdACzSNGEBE99"
        }
    ]
}
```


## Update subscription

`PUT /subscriptions/:subscriptionId`

Facades `MERCHANT`

### HTTP Request

URL Parameters

| Parameter | Description | Type | Presence |
| --- | --- | :---: | :---: |
| `subscriptionId` | the subscription you want to update | `string` | Mandatory |

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
| `status` | Can be `"draft"` or `"active"` or `"cancelled"`. Subscriptions in active state will create new Bills on the `nextDelivery` date. | `obect` | Optional |
| `billData` | Object containing the recurring billing information | `obect` | Optional |
| &rarr; `cc` | Email addresses to which a copy of the recurring bill must be sent | `array` | Optional |
| &rarr; `number` | Recurring bill identifier, specified by merchant | `string` | Optional |
| &rarr; `currency` | ISO 4217 3-character currency code. This is the currency associated with the price field | `string` | Optional |
| &rarr; `name` | Recurring Bill recipient's name | `string` | Optional |
| &rarr; `address1` | Recurring Bill recipient's address | `string` | Optional |
| &rarr; `address2` | Recurring Bill recipient's address | `string` | Optional |
| &rarr; `city` | Recurring Bill recipient's city | `string` | Optional |
| &rarr; `state` | Recurring Bill recipient's state or province | `string` | Optional |
| &rarr; `zip` | Recurring Bill recipient's ZIP code | `string` | Optional |
| &rarr; `country` | Recurring Bill recipient's country | `string` | Optional |
| &rarr; `email` | Recurring Bill recipient's email address | `string` | Optional |
| &rarr; `phone` | Recurring Bill recipient's phone | `string` | Optional |
| &rarr; `dueDate` | Date and time at which a bill is due, ISO-8601 format `yyyy-mm-ddThh:mm:ssZ` (UTC). | `string` | Optional |
| &rarr; `passProcessingFee` | If set to `true`, BitPay's processing fee will be included in the amount charged on the invoice | `boolean` | Optional |
| &rarr; `items` | List of line items | `array` | Optional |
| &rarr; &rarr; `description` | Line item description | `string` | Optional |
| &rarr; &rarr; `price` | Line item unit price for the corresponding `currency` | `number` | Optional |
| &rarr; &rarr; `quantity` | Line item number of units | `number` | Optional |
| `schedule` | Schedule of repeat bill due dates. Can be `weekly`, `monthly`, `quarterly`, `yearly`, or a simple cron expression specifying seconds, minutes, hours, day of month, month, and day of week. BitPay maintains the difference between the due date and the delivery date in all subsequent, automatically-generated bills. | `string` | Optional |
| `nextDelivery` | Default is current date & time, ISO-8601 format yyyy-mm-ddThh:mm:ssZ (UTC). Current or past date indicates that the bill can be delivered immediately. BitPay may modify the hh:mm:ss values in order to distribute deliveries evenly throughout the day. | `string` | Optional |
| `token` | API token retrieved via endpoint `POST https://bitpay.com/tokens` (`merchant` facade) | `string` | Mandatory |

To update the status of subscription

```js
subscription = await client.CreateSubscription(subscriptionObj);
retrievedSubscription = await client.GetSubscription(subscription.id);

retrievedSubscription.nextDelivery = '2021-02-20';

updatedSubscription = await client.UpdateSubscription(retrievedSubscription, retrievedSubscription.id);
```

Success will return the updated subscription details

HTTP Response

```json
{
    "facade": "merchant/subscription",
    "data": {
        "id": "SeL33Hjyr3VmFHA5Skc4zy",
        "status": "active",
        "billData": {
        "emailBill": true,
        "cc": [
            "jane@doe.com"
        ],
        "number": "subscription1234-ABCD",
        "currency": "USD",
        "name": "John Doe",
        "address1": "2630 Hegal Place",
        "address2": "Apt 42",
        "city": "Alexandria",
        "state": "VA",
        "zip": "23242",
        "country": "US",
        "email": "john@doe.com",
        "phone": "555-123-456",
        "dueDate": "2021-05-31T00:00:00.000Z",
        "passProcessingFee": true,
        "items": [
            {
            "description": "Test Item 1",
            "price": 6,
            "quantity": 1
            },
            {
            "description": "Test Item 2",
            "price": 4,
            "quantity": 1
            }
        ],
        "merchant": "5461e13dfd8b0047590d644a"
        },
        "schedule": "0 0 0 * * 1",
        "nextDelivery": "2021-05-24T00:00:00.000Z",
        "createdDate": "2021-05-21T12:29:54.428Z",
        "token": "85yxWk7aEgPdJME6zTkXkAGA3K13MtXf3WHqvtBvyhw3ycfEebJ5WMBRZHXsssSBvn"
    }
}
```


### [Back to guide index](../../GUIDE.md)