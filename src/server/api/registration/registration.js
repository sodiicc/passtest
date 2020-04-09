import express from 'express';
import config from '../../../../config/server.json';
import parsers from '../../helpers/parsers';
import ApiHelper from '../../helpers/api';

const router = express.Router();
const http = require('http');
const dns = require('dns');
const apiHelper = new ApiHelper(config);

router.post('/', function (request, response) {
    let userData = request.body;
    const options = apiHelper.buildRequest("POST", config.routes.user, apiHelper.basicAuth());
    let req = http.request(options, function (result) {
        parsers.request_middleware(result, response, function (result) {
            if (result.error) {
                response.status(502).json({error_description: result.response});
            } else {
                response.status(200).json(result.response);
            }
        });
    });
    req.write(parsers.request(userData));
    req.end();
});

router.post('/restore', function (request, response) {
    let userData = request.body;
    const options = apiHelper.buildRequest("POST", config.routes.password, apiHelper.basicAuth());
    let req = http.request(options, function (result) {
        parsers.request_middleware(result, response, function (result) {
            if (result.error) {
                response.status(502).json({error_description: result.response});
            } else {
                response.status(200).json({message: result.response});
            }
        });
    });
    req.write(parsers.request(userData));
    req.end();
});

module.exports = router;
