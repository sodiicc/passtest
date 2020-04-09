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
    const options = apiHelper.buildRequest("GET",
        response.locals.page.getAttributes(config.routes.news),
        apiHelper.authorization(response.locals.session));

    let req = http.request(options, function (result) {
        parsers.request_middleware(result, response, function (result) {
            if (result.error) {
                response.status(502).json({error_description: result.response});
                return;
            }

            let news = [];
            for (let i=0; i<result.response.length; i++) {
                news.push(parseNews(result.response[i]));
            }

            response.status(200).json(news);
        });
    });

    req.end();
});

router.get('/:id(\\d+)', authenticate, rest.base, rest.authorization, function(request, response) {
    const news_id = parseInt(request.params.id);
    const options = apiHelper.buildRequest("GET",
        config.routes.news + "?id=" + news_id,
        apiHelper.authorization(response.locals.session));

    let req = http.request(options, function (result) {
        parsers.request_middleware(result, response, function (result) {
            if (result.error) {
                response.status(502).json({error_description: result.response});
                return;
            }

            response.status(200).json(parseNews(result.response));
        });
    });

    req.end();
});

function parseNews(data) {
    let tags = [];
    if (data["Hashtags"]) {
        for (let tag of data["Hashtags"]) tags.push(tag.replace('#', ''));
    }

    return {
        id: data["Id"],
        name: data["Name"],
        description: data["Description"],
        content: data["Content"],
        date: data["UpdateTime"],
        tags: tags
    };
}

module.exports = router;
