import express from 'express';
import path from 'path';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import passport from 'passport';
import Strategy from 'passport-local'
import session from 'express-session'
import fileUpload from 'express-fileupload'
import ApiHelper from './helpers/api';

import parsers from './helpers/parsers';
import sendmail from './helpers/sendmail';
import authentication from './api/authentication/authentication';
import registration from './api/registration/registration';
import user from './api/user/user';
import firebase from './api/user/firebase';
import agreement from './api/agreement/agreement';
import course from './api/course/course';
import lesson from './api/course/lesson';
import test from './api/course/test';
import feed from './api/feed/feed';
import push from './api/push/push';
import news from './api/news/news';
import withdraw from './api/withdraw/withdraw';
import fcmService from './helpers/fcm';
import config from '../../config/server.json';

const querystring = require('querystring');
const http = require('http');
const dns = require('dns');
const app = express();
const fs = require('fs');
const smtpTransport = sendmail.smtpTransport;
const apiHelper = new ApiHelper(config);
const ipCountry = require('ip-country');

const combinedLogStream = fs.createWriteStream(path.join(__dirname, '../../access.log'), {flags: 'a'});

app.use(logger("combined", {
    stream: combinedLogStream
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.set('view engine', 'pug');

passport.use(new Strategy(
    {passReqToCallback: true},
    function(request, username, password, done) {
        let analyticsMetadata = request.body.metadata || {};
        let userData = {
            'loginName': username,
            'loginPwd': password,
            'userSession': analyticsMetadata
        };
        const options = apiHelper.buildRequest(
            "POST",
            config.routes.authentication,
            apiHelper.basicAuth()
        );
        let response;
        let req = http.request(options, function (result) {
            parsers.request_middleware(result, response, function (result) {
                if (result.error) {
                    let path = config.routes.authentication+'?code='+password;
                    const activateOptions = apiHelper.buildRequest("GET",path, apiHelper.basicAuth());
                    let activateRequest = http.request(activateOptions, function (activateResult) {
                        parsers.request_middleware(activateResult, response, function (activateResult) {
                            if (!activateResult.error) {
                                userData.access = {token: activateResult.response["Value"]};
                                done(null, userData);
                            } else {
                                done(null, {error_description: result.response});
                            }
                        });
                    });
                    activateRequest.end();
                } else {
                    userData.access = {token: result.response};
                    done(null, userData);
                }
            });
        });
        req.write(parsers.request(userData));
        req.end();
    }
));

// Setup ip country
app.enable('trust proxy');
app.use(ipCountry.setup({
    mmdb: __dirname + '/libs/mmdb/GeoLite2-Country.mmdb',
    fallbackCountry: 'UA',
    exposeInfo: true
}));

app.use(fileUpload());
app.use(morgan('combined'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({secret: 'keyboard cat', resave: false, saveUninitialized: false}));

const allowCrossDomain = function(req, res, next) {
    let origin = req.headers.origin;
    res.header('Access-Control-Allow-Origin', origin);
    res.header("Access-Control-Allow-Credentials", "true");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    if ('OPTIONS' == req.method) {
        res.send(200);
    }
    else {
        next();
    }
};
app.use(allowCrossDomain);


app.use(passport.initialize());

app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/v1/authentication', authentication);
app.use('/api/v1/registration', registration);
app.use('/api/v1/user', user);
app.use('/api/v1/firebase', firebase);
app.use('/api/v1/agreement', agreement);
app.use('/api/v1/courses', course);
app.use('/api/v1/lessons', lesson);
app.use('/api/v1/test', test);
app.use('/api/v1/feed', feed);
app.use('/api/v1/push', push.router);
app.use('/api/v1/news', news);

app.use('/api/v1/withdraw', withdraw);

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
    let mailOptions= sendmail.mailOptions;
    mailOptions.subject = err.code;
    mailOptions.text =  err.message;
    if(config.sendmail.notify) {
        smtpTransport.sendMail(mailOptions, function (error, response) {
            if (error) {
                console.log(error);
                process.abort();
            } else {
                console.log('Sendmail: ' + response.response);
                process.abort();
            }
        });
    }  else {
        console.log(err);
        process.abort();
    }
});

module.exports = app;
