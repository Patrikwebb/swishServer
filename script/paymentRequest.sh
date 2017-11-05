#!bin/bash

payerAlias=467102030

payeeAlias=123456789

amount=10

curl -i -v --request POST https://mss.swicpc.bankgirot.se/swish-cpcapi/api/v1/paymentrequests \
--tlsv1.2 \
--cert cert.pem:<----PASSS----> \
--key key.key \
--header "Content-Type: application/json" \
--data @- <<!
{
"payeePaymentReference": "10000001",
"callbackUrl": "https://domain.se/api/swish/paymentrequests",
"payerAlias": "${payerAlias}",
"payeeAlias": "${payeeAlias}",
"amount": "${amount}", "currency": "SEK",
"message": "Kingston USB Flash Drive 8 GB"
}
!
