import express from 'express';
import config from '../../../../config/server.json';
import parsers from '../../helpers/parsers';
import Rest from '../../helpers/rest';
import ApiHelper from '../../helpers/api';

const router = express.Router();
const jwt = require('jsonwebtoken');
const expressJWT = require('express-jwt');
const authenticate = expressJWT({secret : config.authorization.secret});
const querystring = require('querystring');
const http = require('http');
const dns = require('dns');
const rest = new Rest(config);
const apiHelper = new ApiHelper(config);

router.get('/', authenticate, rest.base, rest.authorization, rest.pagination, function(request, response) {
    let type = (request.query.type) ? request.query.type : false;
    let path = config.routes.feed;
    if(type) {
        path = path + '?type=' + type;
    }
    path = response.locals.page.getAttributes(path);
    const options = apiHelper.buildRequest("GET", path, apiHelper.authorization(response.locals.session));
    http.request(options, function (result) {
        parsers.request_middleware(result, response, function (result) {
            if (result.error) {
                response.status(502).json({error_description: result.response});
            } else {
                let data = result.response,
                    feed = [];

                for (let i in data) {
                    if (!data.hasOwnProperty(i)) continue;
                    feed.push(formatFeed(data[i]));
                }

                response.status(200).json(feed);
            }
        });
    }).end();
});

function formatFeed(data) {
    let tags = [];
    if (data["Hashtags"]) {
        for (let tag of data["Hashtags"]) tags.push(tag.replace('#', ''));
    }

    return {
        id: data["Id"],
        type: data["TypeId"],
        name: data["Name"],
        completed: data["IsCompleted"],
        description: data["Description"],
        organization_name: data["OrganizationName"],
        organization_icon: data["LogoUrl"],
        color_schema: data["ColorScheme"],
        tags: tags
    };
}

module.exports = router;
