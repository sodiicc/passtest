import config from '../../../config/server.json';
import parsers from '../helpers/parsers';
import ApiHelper from '../helpers/api';

const http = require('http');
const apiHelper = new ApiHelper(config);

module.exports = {};

module.exports.confirmAction = function (code) {
    return new Promise((resolve, reject) => {
        let response = {};

        code = encodeURIComponent(code) || null;
        const options = apiHelper.buildRequest(
            "GET",
            config.routes.authentication + '?code=' + code.toString('utf8'),
            apiHelper.basicAuth());

        http.request(options, function (result) {
            parsers.request_middleware(result, response, function (result) {
                if (!result.error) {
                    return resolve(result.response);
                } else {
                    return reject({error_description: result.response});
                }
            });
        }).end();
    });
};
