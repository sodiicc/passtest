import express from 'express';
import config from '../../../../config/server.json';
import commonConfig from '../../../../config/common.json';
import parsers from '../../helpers/parsers';
import Rest from '../../helpers/rest';
import ApiHelper from '../../helpers/api';
import database from '../../database';

const router = express.Router();
const jwt = require('jsonwebtoken');
const expressJWT = require('express-jwt');
const authenticate = expressJWT({secret : config.authorization.secret});
const querystring = require('querystring');
const http = require('http');
const dns = require('dns');
const rest = new Rest(config);
const apiHelper = new ApiHelper(config);

function parseAgreement(data) {
    let agreement = {
        id: data["Id"],
        text: data["Text"],
        answerText: data["AnswerText"],
        linkName: data["LinkName"],
        linkAddress: data["LinkAddress"],
        submitName: data["SubmitName"]
    };
    return agreement;
}

router.get('/', authenticate, rest.base, rest.authorization, function(request, response) {
    getAgreement(response.locals.session).then(
        data => response.status(200).json(data),
        error => response.status(502).json(error)
    );
});
router.post('/', authenticate, rest.base, rest.authorization, function(request, response) {
    let postData = JSON.stringify(request.body);
    saveAgreement(response.locals.session, postData).then(
        data => response.status(200).json(data),
        error => response.status(502).json(error)
    )
});

let getAgreement = (session) => {
    return new Promise((resolve, reject) => {
        let response = {};
        const options = apiHelper.buildRequest(
            "GET",
            config.routes.agreement,
            apiHelper.authorization(session));

        http.request(options, function (result) {
            parsers.request_middleware(result, response, function (result) {
                if (result.error) {
                    return reject({error_description: result.response});
                } else {
                    resolve(parseAgreement(result.response));
                }
            });
        }).end();
    });
};
let saveAgreement = (session, postData) => {
    return new Promise((resolve, reject) => {
        let response = {};
        const options = apiHelper.buildRequest(
            "POST", 
            config.routes.agreement, 
            apiHelper.authorization(session));

        let req = http.request(options, function (result) {
            parsers.request_middleware(result, response, function (result) {
                if (result.error) {
                    return reject({error_description: result.response});
                } else {
                    resolve(result.response);
                }
            });
        });
        req.write(postData);
        req.end();
    });
}

module.exports = router;
