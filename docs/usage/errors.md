# Errors

## Description and Methodology:

An error codes framework was created for this project. An error code consists of 6 digits. The first two digits of an error code represent the HTTP
method that was used to call it. The next two digits refer to the resource that was impacted. The last two digits refer to the specific error.

## Error Response Format

| Field | Description | Type
| ------ | ------ | ------ |
| `status` | will always be “error” for an error response | `string` |
| `code` | six digit error code | `string` |
| `data` | will be null for an error response | `string` |
| `error` | error message | `string` |

HTTP Response

```json
// example error response
{
"status": "error",
"code": "010207",
"data": null,
"error": "Invalid invoice state for refund"
}
```

## HTTP Method - First two digits

| Code | Description | Type
| ------ | ------ | ------ |
| `00xxxx` | generic, unmapped error | `string` |
| `01xxxx` | POST error | `string` |
| `02xxxx` | GET error | `string` |
| `03xxxx` | PUT error | `string` |
| `04xxxx` | DELETE error | `string` |


## Resource and Error - Last four digits

Unmapped Errors xx00xx

These errors are not mapped to a specific resource

| Code | Error | Type
| ------ | ------ | ------ |
| `xx0000` | Generic server error | `string` |
| `xx0001` | Resource not found | `string` |
| `xx0002` | Invalid params | `string` |
| `xx0003` | Missing params | `string` |

## Invoice Errors: xx01xx

These errors are mapped to the invoice resource

| Code | Error | Type
| ------ | ------ | ------ |
| `xx0100` | Generic server error | `string` |
| `xx0101` | Invoice not found | `string` |
| `xx0102` | Invalid params | `string` |
| `xx0103` | Missing params | `string` |
| `xx0107` | Invalid invoice state for cancel | `string` |
| `xx0108` | Invoice is missing email or sms | `string` |
| `xx0109` | Sms is not verified | `string` |
| `xx0110` | Invoice price is below minimum threshold | `string` |
| `xx0111` | Invoice price is above maximum threshold | `string` |
| `xx0112` | Invalid sms number | `string` |
| `xx0113` | Error verifying sms | `string` |

## Refund Errors: xx02xx

These errors are mapped to the refund resource

| Code | Error | Type
| ------ | ------ | ------ |
| `xx0200` | Generic refund error | `string` |
| `xx0201` | Refund not found | `string` |
| `xx0202` | Invalid params | `string` |
| `xx0203` | Missing params | `string` |
| `xx0207` | Invalid invoice state for refund | `string` |
| `xx0208` | Fees are greater than refund amount | `string` |


### [Back to guide index](../../GUIDE.md)