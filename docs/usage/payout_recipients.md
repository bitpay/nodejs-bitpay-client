# Payout Recipients

Merchants first need to issue email invites using the Recipients API resource. This is a required
step to onboard customers asking for cryptocurrency payouts.

The recipients of the email invites will be invited to create a BitPay personal account, submit
some verification documents and the cryptocurrency address to be used for the payouts. The
customer journey is detailed in the Appendices.

> **Note**:
The BitPay personal account is NOT a cryptocurrency wallet, it is a personal account which
allows customers to receive cryptocurrency payouts from merchants, make a larger purchase
or request a refund, but also apply for additional services like the BitPay Prepaid Mastercard
card.

## Create payout recipients

Allows a merchant to invite clients to sign up for a BitPay personal account.

`POST /recipients`

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

> **Note**:
1. For merchants who need to invite multiple recipients in a short period of time, make
sure to send batch of invites e.g. use this endpoint to invite an array [] of recipients (up
to 1000 in a single API call)

2. By default a merchant can invite a maximum of 1000 distinct recipients via the
business account. Reach out to your account manager at BitPay in order to increase
this limit.


| Name | Description | Type | Presence |
| --- | --- | :---: | :---: |
| `recipients` | Array of JSON objects made of the following parameters. Merchants can invite several recipients in one batch call. | `array` | Mandatory |
| &rarr; `label` | For merchant use, pass through - could be customer name or unique reference ID.| `string` | Optional |
| &rarr; `email` | Recipient email address to which the invite shall be sent. | `string` | Mandatory |
| &rarr; `notificationURL` | URL to which BitPay sends webhook notifications to inform the merchant about the status of a given recipient. HTTPS is mandatory. | `string` | Optional |
| `token` | Approved `payout` facade token. | `string` | Mandatory |

An example code of the create recipients

```js
let recipients = [];
let recipientsList = [];
let recipientsObj;

recipientsList.push(new PayoutRecipient("sandbox+recipient1@bitpay.com","recipient1","https://hookb.in/wNDlQMV7WMFz88VDyGnJ"));
recipientsList.push(new PayoutRecipient("sandbox+recipient2@bitpay.com","recipient2","https://hookb.in/QJOPBdMgRkukpp2WO60o"));
recipientsList.push(new PayoutRecipient("sandbox+recipient3@bitpay.com","recipient3","https://hookb.in/QJOPBdMgRkukpp2WO60o"));

recipientsObj = new PayoutRecipients(recipientsList);

recipients = await client.SubmitPayoutRecipients(recipientsObj);
```

The BitPay server returns a 200 OK response to a properly formatted request. The body of the
response is the following.

Response Body Fields

| Name | Description | Type |
| --- | --- | :---: |
| `facade` | Set to `"payout/recipient"`. | `string` |
| `data` | Array of JSON objects.  | `array` |
| &rarr; `email` | Recipient email address to which the invite shall be sent.  | `string` |
| &rarr; `notificationURL` | URL to which BitPay sends webhook notifications to inform the merchant about the status of a given recipient. HTTPS is mandatory. | `string` |
| &rarr; `label` | For merchant use, pass through - could be customer name or unique reference ID. | `string` |
| &rarr; `status` | Recipient status, can have the following values: `"invited"`, `"unverified"`, `"verified"`, `"active"`, `"paused"`, `"removed"` | `string` |
| &rarr; `id` | Unique recipient `id` assigned by BitPay for a given customer `email` | `string` |
| &rarr; `shopperId` | This is the unique id assigned by BitPay if the shopper used his personal BitPay account to authenticate and pay an invoice. For customers signing up for a brand new BitPay personal account, this id will only be created as part of the payout onboarding. The same field would also be available on paid invoices if the customer signed in with his BitPay personal account before completing the payment. This can allow merchants to monitor the activity of a customer  deposits & payouts). | `string` |
| &rarr; `token` | Resource token. This token is derived from the API token initially used to create the recipient and is tied to the specific recipient id created. | `string` |

HTTP Response

```json
{
   "facade":"payout/recipient",
   "data":[
        {
            "email":"john1@doe.com",
            "label":"recipient1",
            "notificationURL":"https://yournotiticationURL.com/b3sarz5bg0wx01eq1bv9785amx",
            "status":"invited",
            "id":"JA4cEtmBxCp5cybtnh1rds",
            "shopperId":null,
            "token":"2LVBntm7z92rnuVjVX5ZVaDoUEaoY4LxhZMMzPAMGyXcejgPXVmZ4Ae3oGaCGBFKQf"
        },
        {
            "email":"john2@doe.com",
            "label":"recipient2",
            "notificationURL":"https://yournotiticationURL.com/01eq1bv9783sarb0wxz5bg5amx",
            "status":"invited",
            "id":"X3icwc4tE8KJ5hEPNPpDXW",
            "shopperId":null,
            "token":"2LVBntm7z92rnuVjVX5ZVaDoUEaoY4LxhZMMzPAMGyXrrBAB9vRY3BVxGLbAa6uEx7"
        }
   ]
}
```

## Get payout recipient

`GET /recipients/:recipientId`

Facades `PAYOUT`

### HTTP Request

URL Parameters

| Parameter | Description | Type | Presence |
| --- | --- | :---: | :---: |
| `recipientId` | The `id` of the recipient you want to retrieve, this is the `id` returned in the body of the response to POST /recipients. | `string` | Mandatory |
| `?token=` | Approved `payout` facade token. | `string` | Mandatory |

Headers

| Fields | Description | Presence |
| --- | --- | :---: |
| `X-Accept-Version` | Must be set to `2.0.0` for requests to the BitPay API. | Mandatory |
| `Content-Type` | must be set to `application/json` for requests to the BitPay API. | Mandatory |
| `X-Identity` | the hexadecimal public key generated from the client private key. This header is required when using tokens with higher privileges (`merchant` facade). When using standard `pos` facade token directly from the [BitPay dashboard](https://test.bitpay.com/dashboard/merchant/api-tokens) (with `"Require Authentication"` disabled), this header is not needed. | Mandatory |
| `X-Signature` | header is the ECDSA signature of the full request URL concatenated with the request body, signed with your private key. This header is required when using tokens with higher privileges (`merchant` facade). When using standard `pos` facade token directly from the [BitPay dashboard](https://test.bitpay.com/dashboard/merchant/api-tokens) (with `"Require Authentication"` disabled), this header is not needed. | Mandatory |

An example code to fetch single payout recipient by `recipientId`

```js
lastRecipient = recipients.slice(-1).pop();

retrievedRecipient = await client.GetPayoutRecipient(lastRecipient.id);
```
Response Body Fields

| Name | Description | Type |
| --- | --- | :---: |
| `facade` | Set to `"payout/recipient"`. | `string` |
| `data` | Array of JSON objects.  | `array` |
| &rarr; `email` | Recipient email address to which the invite shall be sent.  | `string` |
| &rarr; `notificationURL` | URL to which BitPay sends webhook notifications to inform the merchant about the status of a given recipient. HTTPS is mandatory. | `string` |
| &rarr; `label` | For merchant use, pass through - could be customer name or unique reference ID. | `string` |
| &rarr; `status` | Recipient status, can have the following values: "invited", "unverified", "verified", "active", "paused", "removed" | `string` |
| &rarr; `id` | Unique recipient `id` assigned by BitPay for a given customer `email` | `string` |
| &rarr; `shopperId` | This is the unique id assigned by BitPay if the shopper used his personal BitPay account to authenticate and pay an invoice. For customers signing up for a brand new BitPay personal account, this id will only be created as part of the payout onboarding. The same field would also be available on paid invoices if the customer signed in with his BitPay personal account before completing the payment. This can allow merchants to monitor the activity of a customer  deposits & payouts). | `string` |
| &rarr; `token` | Resource token. This token is derived from the API token initially used to create the recipient and is tied to the specific recipient id created. | `string` |

HTTP Response

```json
{
    "facade":"payout/recipient",
    "data":{
        "email":"alice@email.com",
        "notificationURL":"https://yournotiticationURL.com/b3sarz5bg0wx01eq1bv9785amx",
        "label":"Alice",
        "status":"invited",
        "id":"JA4cEtmBxCp5cybtnh1rds",
        "shopperId":null,
        "token":"2LVBntm7z92rnuVjVX5ZVaDoUEaoY4LxhZMMzPAMGyXcejgPXVmZ4Ae3oGaCGBFKQf"
   }
}
```

## Get payout recipients

`GET /recipients`

Facades `PAYOUT`

### HTTP Request

URL Parameters

| Parameter | Description | Type | Presence |
| --- | --- | :---: | :---: |
| `?token=` | Approved `payout` facade token. | `string` | Mandatory |
| `&status=` | The recipient status you want to query on. | `string` | Optional |
| `&limit=` | Maximum results that the query will return (useful for paging results). | `string` | Optional |
| `&offset=` | Number of results to offset (ex. skip 10 will give you results starting with the 11th result). | `string` | Optional |

Headers

| Fields | Description | Presence |
| --- | --- | :---: |
| `X-Accept-Version` | Must be set to `2.0.0` for requests to the BitPay API. | Mandatory |
| `Content-Type` | must be set to `application/json` for requests to the BitPay API. | Mandatory |
| `X-Identity` | the hexadecimal public key generated from the client private key. This header is required when using tokens with higher privileges (`merchant` facade). When using standard `pos` facade token directly from the [BitPay dashboard](https://test.bitpay.com/dashboard/merchant/api-tokens) (with `"Require Authentication"` disabled), this header is not needed. | Mandatory |
| `X-Signature` | header is the ECDSA signature of the full request URL concatenated with the request body, signed with your private key. This header is required when using tokens with higher privileges (`merchant` facade). When using standard `pos` facade token directly from the [BitPay dashboard](https://test.bitpay.com/dashboard/merchant/api-tokens) (with `"Require Authentication"` disabled), this header is not needed. | Mandatory |

The BitPay server shall return a 200 OK response, and the body of the response shall be an array
of recipients objects previously described. The only difference is that the data parameter is an
array instead of an object.

An example code to fetch the list of payout recipients

```js
recipients = await client.GetPayoutRecipients(PayoutStatus.Active, 3);
```

HTTP Response

```json
{
    "facade":"payout/recipient",
    "data":[
        {
            "email":"john1@doe.com",
            "label":"recipient1",
            "notificationURL":"https://yournotiticationURL.com/b3sarz5bg0wx01eq1bv9785amx",
            "status":"invited",
            "id":"JA4cEtmBxCp5cybtnh1rds",
            "shopperId":null,
            "token":"2LVBntm7z92rnuVjVX5ZVaDoUEaoY4LxhZMMzPAMGyXcejgPXVmZ4Ae3oGaCGBFKQf"
        },
        {
            "email":"john2@doe.com",
            "label":"recipient2",
            "notificationURL":"https://yournotiticationURL.com/01eq1bv9783sarb0wxz5bg5amx",
            "status":"invited",
            "id":"X3icwc4tE8KJ5hEPNPpDXW",
            "shopperId":null,
            "token":"2LVBntm7z92rnuVjVX5ZVaDoUEaoY4LxhZMMzPAMGyXrrBAB9vRY3BVxGLbAa6uEx7"
        }
    ]
}
```


## Update payout recipient

`PUT /recipients/:recipientId`

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

| Parameter | Description | Type | Presence |
| --- | --- | :---: | :---: |
| `label` | For merchant use, pass through - could be customer name or unique reference ID. | `string` | Optional |
| `notificationURL` | URL to which BitPay sends webhook notifications to inform the merchant about the status of a given recipient. HTTPS is mandatory. | `string` | Optional |
| `token` | Pass the `merchant` with request body paraments. | `string` | Mandatory |

An example to update the existing payout recipient details

```js
updatedRecipient = await client.UpdatePayoutRecipient(lastRecipient.id, "label.UPDATED", "https://hookb.in/1gw8aQxYQDHj002yk79K");
```

Response Body Fields

| Name | Description | Type |
| --- | --- | :---: |
| `facade` | Set to `"payout/recipient"`. | `string` |
| `data` | Array of JSON objects.  | `array` |
| &rarr; `email` | Recipient email address to which the invite shall be sent.  | `string` |
| &rarr; `notificationURL` | URL to which BitPay sends webhook notifications to inform the merchant about the status of a given recipient. HTTPS is mandatory. | `string` |
| &rarr; `label` | For merchant use, pass through - could be customer name or unique reference ID. | `string` |
| &rarr; `status` | Recipient status, can have the following values: "invited", "unverified", "verified", "active", "paused", "removed" | `string` |
| &rarr; `id` | Unique recipient `id` assigned by BitPay for a given customer `email` | `string` |
| &rarr; `shopperId` | This is the unique id assigned by BitPay if the shopper used his personal BitPay account to authenticate and pay an invoice. For customers signing up for a brand new BitPay personal account, this id will only be created as part of the payout onboarding. The same field would also be available on paid invoices if the customer signed in with his BitPay personal account before completing the payment. This can allow merchants to monitor the activity of a customer  deposits & payouts). | `string` |
| &rarr; `token` | Resource token. This token is derived from the API token initially used to create the recipient and is tied to the specific recipient id created. | `string` |

HTTP Response

```json
{
    "facade":"payout/recipient",
    "data":{
        "email":"john1@doe.com",
        "label":"updatedLabel",
        "notificationURL":"https://yournotiticationURL.com/XrrBAB9vRY3BVxGLbAa6uEx7",
        "status":"invited",
        "id":"X3icwc4tE8KJ5hEPNPpDXW",
        "shopperId":null,
        "token":"2LVBntm7z92rnuVjVX5ZVaDoUEaoY4LxhZMMzPAMGyXrrBAB9vRY3BVxGLbAa6uEx7"
    }
}
```


## Delete payout recipient

`DELETE /recipients/:recipientId`

Facades `PAYOUT`

### HTTP Request

URL Parameters

| Parameter | Description | Type | Presence |
| --- | --- | :---: | :---: |
| `recipientId` | The `id` of the recipient you want to retrieve, this is the `id` returned in the body of the response to POST /recipients. | `string` | Mandatory |
| `?token=` | Approved `payout` facade token. | `string` | Mandatory |

Headers

| Fields | Description | Presence |
| --- | --- | :---: |
| `X-Accept-Version` | Must be set to `2.0.0` for requests to the BitPay API. | Mandatory |
| `Content-Type` | must be set to `application/json` for requests to the BitPay API. | Mandatory |
| `X-Identity` | the hexadecimal public key generated from the client private key. This header is required when using tokens with higher privileges (`merchant` facade). When using standard `pos` facade token directly from the [BitPay dashboard](https://test.bitpay.com/dashboard/merchant/api-tokens) (with `"Require Authentication"` disabled), this header is not needed. | Mandatory |
| `X-Signature` | header is the ECDSA signature of the full request URL concatenated with the request body, signed with your private key. This header is required when using tokens with higher privileges (`merchant` facade). When using standard `pos` facade token directly from the [BitPay dashboard](https://test.bitpay.com/dashboard/merchant/api-tokens) (with `"Require Authentication"` disabled), this header is not needed. | Mandatory |

An example code to delete payout recipient

```js
deleted = await client.DeletePayoutRecipient(retrievedRecipient.id);
```

HTTP Response

```json
{
    "success":true
}
```


## Request payout recipient notification

`POST /recipients/:recipientId/notifications`

Facades `PAYOUT`

### HTTP Request

URL Parameters

| Parameter | Description | Type | Presence |
| --- | --- | :---: | :---: |
| `recipientId` | The id of the recipient for which you want the last webhook to be resent. | `string` | Mandatory |

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
| `token` | Pass the `merchant` with request body paraments. | `string` | Mandatory |

An example code to request payout recipient notification

```js
recipients = await client.GetPayoutRecipients();
lastRecipient = recipients.slice(-1).pop();

updatedRecipient = await client.UpdatePayoutRecipient(lastRecipient.id, "label.IPN_TEST", "https://hookb.in/1gw8aQxYQDHj002yk79K");

retrieved = await client.GetPayoutRecipient(updatedRecipient.id);

webhookRequested = await client.GetPayoutRecipientWebHook(retrieved.id);
```

HTTP Response

```json
{
    "success":true
}
```

## Recipient webhooks

Webhooks are an HTTP POST message sent from the BitPay server to the merchant’s eCommerce server. The primary purpose of a webhook is to alert the merchant’s ecommerce server that the status of a resource (invoice, payout, and now recipients) has changed. The messages are sent to the `notificationURL` field when creating the invoice or payout request.

### Handling

BitPay does not sign webhooks, so the information in the payload should never be trusted outright:

1. The webhook shall be used by the merchant as a trigger to verify the status of a specific
recipient. This can be done by retrieving the corresponding recipient object, via the GET
recipients/recipientId endpoint (recipientId will be provided in the body of the webhook).

2. Merchants will be waiting for the `"active"` status for a given recipient before they include them on a payout batch

3. The BitPay server expects an HTTP 200 response with an empty body to the webhook. Any other response is considered by BitPay as a failed delivery.

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
| `data` | Webhook data object, containing the recipient information. | `object` |
| &rarr; `id` | Unique recipient id assigned by BitPay for a given customer email. | `string` |
| &rarr; `shopperId` | This is the unique id assigned by BitPay if the shopper used his personal BitPay account to authenticate and pay an invoice. For customers signing up for a brand new BitPay personal account, this id will only be created as part of the payout onboarding. The same field would also be available on paid invoices if the customer signed in with his BitPay personal account before completing the payment. This can allow merchants to monitor the activity of a customer  deposits & payouts). | `string` |
| &rarr; `email` | Recipient email address to which the invite link shall be sent.  | `string` |
| &rarr; `status` | Recipient status, can have the following values: `"invited"`, `"unverified"`, `"verified"`, `"active"`, `"paused"`, `"removed"` | `string` |
| &rarr; `label` | For merchant use, pass through - could be customer name or unique reference ID. | `string` |

Webhook notification codes

| Code | Name | Purpose |
| --- | --- | :---: |
| `4001` | `"recipient_invited"` | To notify merchants that a recipient has reached the status `"invited"` |
| `4002` | `"recipient_unverified"` | To notify merchants that a recipient has reached the status `"unverified"` |
| `4003` | `"recipient_verified"` | To notify merchants that a recipient has reached the status `"verified"` |
| `4004` | `"recipient_active"` | To notify merchants that a recipient has reached the status `"active"` |
| `4005` | `"recipient_paused"` | To notify merchants that a recipient has reached the status `"paused"` |
| `4006` | `"recipient_removed"` | To notify merchants that a recipient has reached the status `"removed"` |
| `4007` | `"recipient_manuallyNotified"` | Whenever a merchant request for the last notification to be resent |

HTTP Response

```json
{
    "event":{
        "code":4003,
        "name":"recipient_verified"
    },
    "data":{
        "id":"8Gq174SFAnQpdLDxRZCBPB",
        "shopperId":"5QZnQKyanj8o7qohDf2zC2",
        "email":"john1@doe.com",
        "label":"updatedLabel",
        "status":"verified"
    }
}
```



### [Back to guide index](../../GUIDE.md)