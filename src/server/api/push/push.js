import express from 'express';
import config from '../../../../config/server.json';
import parsers from '../../helpers/parsers';
import Rest from '../../helpers/rest';
import ApiHelper from '../../helpers/api';

const router = express.Router();
const jwt = require('jsonwebtoken');
const expressJWT = require('express-jwt');
const authenticate = expressJWT({secret: config.authorization.secret});
const http = require('http');
const dns = require('dns');
const rest = new Rest(config);
const apiHelper = new ApiHelper(config);

let push = {};

router.post('/', authenticate, rest.base, rest.authorization, function (request, response) {
    if (!request.body.content || !request.body.link || !request.body.quantity) {
        response.status(400).json({error_description: "Data required"});
        return;
    }
    const content = encodeURIComponent(request.body.content);
    const link = encodeURIComponent(request.body.link);
    const quantity = encodeURIComponent(parseInt(request.body.quantity));

    let url = config.routes.push;
    url += "?text=" + content;
    url += "&actionLink=" + link;
    url += "&quantity=" + quantity;

    const options = apiHelper.buildRequest("POST", url, apiHelper.basicAuth());
    http.request(options, function (result) {
        parsers.request_middleware(result, response, function (result) {
            if (result.error) {
                response.status(502).json({error_description: result.response});
                return;
            }

            response.status(201).json({});
        });
    }).end();
});

push.getNotifications = function () {
    return new Promise((resolve, reject) => {
        const options = apiHelper.buildRequest("GET", config.routes.push, apiHelper.basicAuth());
        let response = {};
        let req = http.request(options, function (result) {
            parsers.request_middleware(result, response, function (result) {
                if (result.error) {
                    reject(new Error({error_description: result.response}));
                } else {
                    let pushes = result.response;

                    for (let index in pushes) {
                        for (let push_index in pushes[index]["PushItems"]) {
                            pushes[index]["PushItems"][push_index] = push.format(pushes[index]["PushItems"][push_index]);
                        }
                    }

                    resolve(pushes);
                }
            });
        });
        req.end();
    });
};

push.format = function(data) {
    return {
        title: data["Name"],
        external_url: data["ActionLink"],
        description: data["Description"],
        state: data["StateName"],
        type: data["TypeId"]
    }
};

push.setNotification = function (data) {
    return new Promise((resolve, reject) => {
        let messageData = data.body;
        let response = {};
        const options = apiHelper.buildRequest("POST", config.routes.push, apiHelper.authorization(response.locals.session));
        let req = http.request(options, function (result) {
            parsers.request_middleware(result, response, function (result) {
                if (result.error) {
                    reject(new Error({error_description: result.response}));
                } else {
                    resolve(result.response);
                }
            });
        });
        req.write(parsers.request(messageData));
        req.end();
    });
};

push.updateNotification = function (data) {
    return new Promise((resolve, reject) => {
        let messageData = data.body;
        let response = {};
        const options = apiHelper.buildRequest("POST", config.routes.push, apiHelper.authorization(response.locals.session));
        let req = http.request(options, function (result) {
            parsers.request_middleware(result, response, function (result) {
                if (result.error) {
                    reject(new Error({error_description: result.response}));
                } else {
                    resolve(result.response);
                }
            });
        });
        req.write(parsers.request(messageData));
        req.end();
    });
};

module.exports = {
    router: router,
    push: push
};
