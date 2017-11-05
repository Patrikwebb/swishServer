#!bin/bash

id=49E60D95608E479D805F614D25C00C21

curl -v --request GET https://mss.swicpc.bankgirot.se/swish-cpcapi/api/v1/paymentrequests/${id} \
--cert cert.pem:<---PASS----> \
--key key.key | json_pp
