"use strict";
/*jshint esversion: 6 */

let https = require('https');
let fs = require('fs');
let bodyParser = require('body-parser');

// Express
let express = require('express');
let app = express();

// Date formater
let dateFormat = require('dateformat');

// Routes
let payment = require('./routes/payment');
let refunds = require('./routes/refunds');

// Headers options
let corsMiddleware = function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Content-Type', 'application/json', 'text/plain');
    next();
};

app.use(bodyParser.json());
app.use(corsMiddleware);
app.use('/api/swish', payment);
app.use('/api/swish', refunds);

app.use('/health', function(req, res, err) {

    if (err) {
        console.log(err);
    }

    var now = new Date();
    var dateNow = dateFormat(now, "dddd, mmmm dS, yyyy, h:MM:ss");

    console.log("\nGET /health: \tWelcome to Swish API server\n" + dateNow);
    res.send({ 'message': 'Welcome to Swish API server' });

});

// Local HTTPS server certificates
// Add you own certificates here
let options = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.crt'),
    passphrase: 'pass',
};

https.createServer(options, app).listen(443);

console.log("Swish server started at: https://127.0.0.1:443/api/swish");