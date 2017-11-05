"use strict";
/*jshint esversion: 6 */

// Express
let express = require('express');
let router = express.Router();
let httpsAgent = require('https-agent');
let https = require('https');
let fs = require('fs');

// Date formater
let dateFormat = require('dateformat');

// Swish API certificates
let certFile = fs.readFileSync('./ssl/swish/clientcertTest.pem');
let keyFile = fs.readFileSync('./ssl/swish/keyTest.key');
let caFile = fs.readFileSync('./ssl/swish/cacertTest.pem');

// Routes
let refunds = ('/refunds');

router.post(refunds, function(req, res) {

    let now = new Date();
    let dateNow = dateFormat(now, "dddd, mmmm dS, yyyy, h:MM:ss");

    console.log('\nPOST: swishServer/refunds ' + "\nDate: " + dateNow);

    let payerPaymentReference = req.body.payerPaymentReference;
    let originalPaymentReference = req.body.originalPaymentReference;
    let payerAlias = '123456789';
    let req_amount = req.body.amount;
    let amount = req_amount + '';

    let json_data = {
        "payerPaymentReference": payerPaymentReference,
        "originalPaymentReference": originalPaymentReference,
        "callbackUrl": "https://localhost/api/swish/refundsCallback",
        "payerAlias": payerAlias,
        "amount": amount,
        "currency": "SEK",
        "message": "Återbetalning"
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

    let httpsOptions = {
        hostname: 'mss.swicpc.bankgirot.se',
        port: 443,
        path: '/swish-cpcapi/api/v1/refunds',
        method: 'POST',
        headers: {
            "Content-Type": 'application/json'
        },
        agent: agentOptions
    };

    let request = https.request(httpsOptions, function(response) {


        let now = new Date();
        let dateNow = dateFormat(now, "dddd, mmmm dS, yyyy, h:MM:ss");

        let body;

        let responseRequest = response.headers.location;
        console.log("\tResponseRequest: " + responseRequest);
        console.log("\tStatus code: " + response.statusCode);

        console.log('\nPOST: bankgirot/swish/api/refunds ' + '\nDate: ' + dateNow + '\n');

        response.on('data', function(data) {
            body = data;

            console.log(JSON.parse(data, null, 4));

        });

        response.on('end', function() {
            res.send({ "location": responseRequest });
        });
    });

    request.on('error', function(error) {
        console.log(error);
    });

    request.write(post_data);
    request.end();

});

router.get(refunds, function(req, res, err) {

    let now = new Date();
    let dateNow = dateFormat(now, "dddd, mmmm dS, yyyy, h:MM:ss");

    if (err) {
        console.log(err);
    }

    console.log('\nGET: swishServer/refunds ' + '\nDate: ' + dateNow + '\n');

    let paymentReference = req.query.originalPaymentReference;

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
        path: '/swish-cpcapi/api/v1/refunds/' + paymentReference,
        method: 'GET',
        headers: {
            "Content-Type": 'application/json'
        },
        agent: agentOptions
    };

    let request = https.request(httpsOptions, function(response) {


        let now = new Date();
        let dateNow = dateFormat(now, "dddd, mmmm dS, yyyy, h:MM:ss");

        let jsonObject = [];

        console.log('\nGET: bankgirot/swish/api/refunds ' + '\nDate: ' + dateNow + '\n');

        response.on('data', function(chunk) {
            jsonObject += chunk;
        });

        response.on('end', function() {
            let body = JSON.parse(jsonObject);

            console.log("\tpayeePaymentReference: " + body.payeePaymentReference);
            console.log("\tpaymentReference: " + body.paymentReference);
            console.log("\tpayerAlias: " + body.payerAlias);
            console.log("\tpayeeAlias: " + body.payeeAlias);
            console.log("\tmessage: " + body.status);

            res.send(body); //TODO Only send important data
        });

    });

    request.on('error', function(error) {
        console.log(error);
    });

    request.end();

});

module.exports = router;