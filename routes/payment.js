"use strict";
/*jshint esversion: 6 */

let https = require('https');
let fs = require('fs');
let httpsAgent = require('https-agent');

// Express
let express = require('express');
let router = express.Router();

// Date formater
let dateFormat = require('dateformat');

// Routes
let paymentRequest = ('/paymentRequest');
let paymentCallback = ('/paymentCallback');

// Swish API certificates
let certFile = fs.readFileSync('./ssl/swish/cert.pem');
let keyFile = fs.readFileSync('./ssl/swish/key.key');
let caFile = fs.readFileSync('./ssl/swish/cert.pem');

router.post(paymentRequest, function(req, res, err) {

    let now = new Date();
    let dateNow = dateFormat(now, "dddd, mmmm dS, yyyy, h:MM:ss");

    if (err) {
        console.log(err);
    }

    console.log('\nPOST: swishServer/paymentRequest ' + "\nDate: " + dateNow);

    let json_data = {
        "payeePaymentReference": "1000000001",
        "callbackUrl": "https://localhost/api/swish/paymentCallback",
        "payerAlias": "467102030",
        "payeeAlias": "123456789",
        "amount": "2",
        "currency": "SEK",
        "message": "Swish the NEW DEAL"
    };

    let post_data = JSON.stringify(json_data, null, 4);
    console.log("post_data: \n" + post_data);

    let agentOptions = httpsAgent({
        ca: caFile,
        cert: certFile,
        key: keyFile,
        passphrase: 'pass',
        secureProtocol: 'TLSv1_2_method'
    });

    let paymentrequests = {
        hostname: 'swicpc.bankgirot.se',
        port: 443,
        path: '/swish-cpcapi/api/v1/paymentrequests',
        method: 'POST',
        headers: {
            "Content-Type": 'application/json'
        },
        agent: agentOptions
    };

    let request = https.request(paymentrequests, function(response) {

        console.log('\nPOST: bankgirot/swish/api/paymentrequests ' + '\nDate: ' + now + '\n');

        let responseRequest = response.headers.location;
        let responseStatusCode = response.statusCode;
        console.log("\tResponseRequest: " + responseRequest);
        console.log("\tStatus code: " + responseStatusCode);

        response.on('data', function(data) {
            console.log(data);
        });

        response.on('end', function() {
            res.statusCode = responseStatusCode;
            res.send({ "location": responseRequest });
        });
    });

    request.on('error', function(error) {

        console.log("request error: ");
        console.log(error);

        res.send(error);
    });

    request.write(post_data);
    request.end();

});

router.get(paymentRequest, function(req, res, err) {

    let now = new Date();
    let dateNow = dateFormat(now, "dddd, mmmm dS, yyyy, h:MM:ss");

    if (err) {
        console.log(err);
    }

    console.log('\nGET: swishServer/paymentRequest ' + '\nDate: ' + dateNow + '\n');

    let paymentReference = req.query.paymentReference;

    let agentOptions = httpsAgent({
        ca: caFile,
        cert: certFile,
        key: keyFile,
        passphrase: 'pass',
        secureProtocol: 'TLSv1_2_method'
    });

    let httpsOptions = {
        hostname: 'mss.swicpc.bankgirot.se',
        port: 443,
        path: '/swish-cpcapi/api/v1/paymentrequests/' + paymentReference,
        method: 'GET',
        headers: {
            "Content-Type": 'application/json'
        },
        agent: agentOptions
    };

    let request = https.request(httpsOptions, function(response) {

        let jsonObject = [];

        console.log('\nGET: bankgirot/swish/api/paymentRequest ' + '\nDate: ' + now + '\n');

        response.on('data', function(chunk) {
            jsonObject += chunk;
        });

        response.on('end', function() {

            var body = JSON.parse(jsonObject);

            console.log("\tpayeePaymentReference: " + body.payeePaymentReference);
            console.log("\tpaymentReference: " + body.paymentReference);
            console.log("\tmessage: " + body.status);

            res.send(body); //TODO Only send important data
        });

    });

    request.on('error', function(error) {
        console.log(error);
    });

    request.end();

});

router.post(paymentCallback, function(req, res, err) {

    let now = new Date();
    let dateNow = dateFormat(now, "dddd, mmmm dS, yyyy, h:MM:ss");

    if (err) {
        console.log(err);
    }

    console.log('\nPOST: swishServer/paymentCallback ' + "\nDate: " + dateNow);

    console.log(req);

    res.send("paymentCallback");
});

module.exports = router;