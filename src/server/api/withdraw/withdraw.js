import express from 'express';
import config from '../../../../config/server.json';
import parsers from '../../helpers/parsers';
import Rest from '../../helpers/rest';
import ApiHelper from '../../helpers/api';
import common from '../common';

const router = express.Router();
const jwt = require('jsonwebtoken');
const expressJWT = require('express-jwt');
const authenticate = expressJWT({secret : config.authorization.secret});
const http = require('http');
const dns = require('dns');
const rest = new Rest(config);
const apiHelper = new ApiHelper(config);

function formatAvailableWithdraw(data) {
    return {
        id: data["Id"],
        name: data["Name"],
        amount: data["BonusPointsAmount"],
        available: data["IsBonusPointsEnough"]
    }
}


function formatTransactions(data) {
    return {
        id: data["id"],
        income: (data["Direction"] === "Input"),
        date: data["ExecuteTime"],
        type: data["Type"],
        state: data["Проведена"],
        description: data["SourceValue"],
        amount: data["Amount"]
    }
}


router.get('/', authenticate, rest.base, rest.authorization, rest.pagination, function(request, response) {
    const options = apiHelper.buildRequest("GET",
        response.locals.page.getAttributes(config.routes.transactions),
        apiHelper.authorization(response.locals.session));

    let req = http.request(options, function (result) {
        parsers.request_middleware(result, response, function (result) {
            if (result.error) {
                response.status(502).json({error_description: result.response});
                return;
            }

            let transactions_list = [];

            for (let i=0; i<result.response.length; i++) {
                transactions_list.push(formatTransactions(result.response[i]))
            }

            response.status(202).json(transactions_list);
        });
    });

    req.end();
});


router.get('/:type', authenticate, rest.base, rest.authorization, function(request, response) {
    const withdraw_type = encodeURIComponent(request.params.type);
    const path = config.routes.withdraw + '?type=' + withdraw_type;

    const options = apiHelper.buildRequest("GET",
        path, apiHelper.authorization(response.locals.session));

    let req = http.request(options, function (result) {
        parsers.request_middleware(result, response, function (result) {
            if (result.error) {
                response.status(502).json({error_description: result.response});
                return;
            }

            let withdraw_list = [];

            for (let i=0; i<result.response.length; i++) {
                withdraw_list.push(formatAvailableWithdraw(result.response[i]))
            }


            response.status(202).json(withdraw_list);
        });
    });

    req.end();
});


router.post('/', authenticate, rest.base, rest.authorization, function (request, response) {
    if (!request.body.id || !request.body.phone) {
        response.status(400).json({error_description: "Missed fields"});
        return;
    }
    let code = request.body.code;

    if (code) {
        common.confirmAction(code).then(
            data => response.status(200).json(data),
            error => response.status(400).json(error)
        );
    } else {
        const options = apiHelper.buildRequest("POST",
            config.routes.withdraw,
            apiHelper.authorization(response.locals.session));
        const withdraw_data = {
            "Key": request.body.id,
            "Value": request.body.phone
        };

        let req = http.request(options, function (result) {
            parsers.request_middleware(result, response, function (result) {
                if (result.error) {
                    response.status(502).json({error_description: result.response});
                    return;
                }

                response.status(202).json(result.response);
            });
        });

        req.write(parsers.request(withdraw_data));
        req.end();
    }
});

module.exports = router;
