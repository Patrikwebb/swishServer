
# Swish för handel @getswish
https://www.getswish.se/handel/

I have made a full configuration to Swish testTools.

## Docker rebuild
```
docker rm -f swishServer
docker rmi -f swish/server
sudo docker build -t swish/server .
docker run -p 443:443 -dit --name swishServer swish/server
docker logs -f swishServer

```

docker logs -f swishServer

## Enter Docker enviorments
```
docker run --name swishServer -it --entrypoint /bin/bash swish/server
docker run --name swishServer2 -it --entrypoint /bin/bash swish/server
```


## Swish POST /paymentRequest
```
counter=100000001;
payerAlias=4607102030
payeeAlias=123456789
amount=1

curl -v POST https://swicpc.bankgirot.se/swish-cpcapi/api/v1/paymentrequests \
--cert   <---Cert---> \
--key    <---Key---> \
--pass   <---Pass---> \
--cacert <---CA-Cert---> \
--tlsv1.2 \
--ciphers DHE-RSA-AES256-GCM-SHA384 \
--header "Accept-Language: SV" \
--header "Content-Type: application/json" \
--data @- <<!
{
"payeePaymentReference": "${counter}",
"callbackUrl": "https://domain.se/api/swish/paymentCallback",
"payerAlias": ${payerAlias},
"payeeAlias": ${payeeAlias},
"amount": ${amount}, "currency": "SEK",
"message": "Payment Request"
}
!
```


## Check payment POST /paymentrequests

```
paymentReference=3425645FGHF2345234

curl -v --request GET https://swicpc.bankgirot.se/swish-cpcapi/api/v1/paymentrequests/${paymentReference} \
--cert   <---Cert---> \
--key    <---Key---> \
--pass   <---Pass---> \
--cacert <---CA-Cert---> \
--tlsv1.2 \
--ciphers DHE-RSA-AES256-GCM-SHA384 \
--header "Accept-Language: SV" \
--header "Content-Type: application/json"  | json_pp
```


## Swish POST /refunds
```
payerPaymentReference=100000001
originalPaymentReference=1231343TGDGDBGDGF134
amount=1

curl -v --request POST https://swicpc.bankgirot.se/swish-cpcapi/api/v1/refunds \
--cert   <---Cert---> \
--key    <---Key---> \
--pass   <---Pass---> \
--cacert <---CA-Cert---> \
--tlsv1.2 \
--ciphers DHE-RSA-AES256-GCM-SHA384 \
--header "Content-Type: application/json" \
--header "Accept-Language: SV" \
--data @- <<!
{
"payerPaymentReference": "${payerPaymentReference}",
"originalPaymentReference": "${originalPaymentReference}",
"callbackUrl": "https://domain.se/api/swish/refunds",
"payerAlias": "123456789",
"amount": "${amount}", "currency": "SEK",
"message": "Swish återbetalning"
}
!
```


## Check refunds POST /refunds
```
refundsReference=123434THFGBASEFRTH2342

curl -k -v --request GET https://swicpc.bankgirot.se/swish-cpcapi/api/v1/refunds/${refundsReference} \
--header "Accept-Language: SV" \
--header "Content-Type: application/json" \
--tlsv1.2 \
--ciphers DHE-RSA-AES256-GCM-SHA384 \
--cert   <---Cert---> \
--key    <---Key---> \
--pass   <---Pass---> \
--cacert <---CA-Cert---> \ | json_pp
```

## Generate keys and certs

    openssl genrsa -out key.key 2048

    openssl req -new -key key.key -out cert.csr

    sudo touch cert.pem && sudo nano cert.pem

    sudo chmod 400 cert.pem cert.csr key.key

## Export to pkcs12 and scrabble out to new certs files

    sudo openssl pkcs12 -export -out cert.p12 -inkey key.key -in cert.pem

    sudo chmod 400 cert.p12

    sudo openssl pkcs12 -nocerts -in cert.p12 -out cert.key

    sudo openssl pkcs12 -nokeys -clcerts -in cert.p12 -out cert.pem

    sudo openssl pkcs12 -nokeys -cacerts -in cert.p12 -out cert.pem

    sudo chmod 400 cert.pem cert.pem

## Connect to OpenSSL

    sudo openssl s_client -connect swicpc.bankgirot.se:443 -cert cert.pem -key key.key -pass pass:<-----PASS----> -CAfile cert.pem

