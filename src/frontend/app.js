import express from 'express';
import path from 'path';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import session from 'express-session'
import config from '../../config/server.json';

const querystring = require('querystring');
const http = require('http');
const dns = require('dns');
const app = express();
const fs = require('fs');

const combinedLogStream = fs.createWriteStream(path.join(__dirname, '../../access.log'), {flags: 'a'});

app.use(logger("combined", {
    stream: combinedLogStream
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use(morgan('combined'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({secret: 'keyboard cat', resave: false, saveUninitialized: false}));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/medbot', express.static(path.join(__dirname, 'medbot')));

// SSL Validation
app.use('/.well-known/pki-validation', express.static(path.join(__dirname, 'ssl_verification')));

app.use('/debug', function (req, res) {
    res.json({
        request: req.protocol
    });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    console.log(err);
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.json(err);
});

process.on('uncaughtException', (err) => {
    console.log(err);
    process.abort();
});

module.exports = app;
