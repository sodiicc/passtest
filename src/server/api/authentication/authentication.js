import express from 'express';
import moment from 'moment';
import passport from 'passport';
import database from '../../database';
import parsers from '../../helpers/parsers';
import ApiHelper from '../../helpers/api';
import config from '../../../../config/server.json';
import Rest from '../../helpers/rest';

const router = express.Router();
const http = require('http');
const jwt = require('jsonwebtoken');
const sessionsCollection = config.collections.sessions;
const apiHelper = new ApiHelper(config);
const rest = new Rest(config);
const expressJWT = require('express-jwt');
const authenticate = expressJWT({secret : config.authorization.secret});

router.post('/', passport.authenticate(
    'local', {
        session: false
    }
    ), generateToken, respond
);


router.get('/', authenticate, rest.base, rest.authorization, rest.pagination, function(request, response) {
    const options = apiHelper.buildRequest("GET",
        config.routes.user,
        apiHelper.authorization(response.locals.session));

    let req = http.request(options, function (result) {
        parsers.request_middleware(result, response, function (result) {
            if (result.error) {
                response.status(401).json({error_description: result.response});
                return;
            }

            response.status(204).send();
        });
    });

    req.end();
});

router.get('/country', function (request, response, next) {
    response.status(200).json({'country': response.locals.country})
});

router.get('/:code', function (request, response, next) {
    let code = encodeURIComponent(request.params.code) || null;

    let path = config.routes.authentication + '?code=' + code.toString('utf8');

    const activateOptions = apiHelper.buildRequest("GET", path, apiHelper.basicAuth());
    http.request(activateOptions, function (result) {
        parsers.request_middleware(result, response, function (result) {
            if (!result.error) {
                let userData = {};
                userData.access = {token: result.response["Value"]};
                userData.route = result.response["RouteTo"];
                request.user = userData;
                request.user.metadata = {
                    profile_completed: true
                };

                return generateToken(request, response, next)
            } else {
                response.status(502).json({error_description: result.response});
            }
        });
    }).end();
}, respond);


function generateToken(req, res, next) {
    let user = req.user;
    if (!user.metadata) user.metadata = {};
    if(req.user.access) {
        console.log('New customer authorization: ', user);

        database(function (db) {
            const collection = db.collection(sessionsCollection);
            const options = apiHelper.buildRequest("GET", config.routes.user,
                apiHelper.authorization(user.access, "token"));

            http.request(options, function (result) {
                parsers.request_middleware(result, res, function (result) {
                    if (result.error) {
                        res.status(502).json({error_description: result.response});
                    } else {
                        let date = new Date();
                        date = moment(date).unix();

                        /* Generating JWT token */
                        req.token = jwt.sign({
                            id: result.response.id,
                        }, config.authorization.secret);
                        let frontend_token = req.token;

                        let sessionObject = {
                            remote_id: result.response.id,
                            datetime: date,
                            username: result.response.mobilePhone,
                            frontendToken: frontend_token,
                            backendToken: user.access.token
                        };
                        let sessionMeta = Object.assign({
                            login_count: 0,
                            profile_completed: false,
                            show_guide: true
                        }, user.metadata);

                        collection.findOne({"remote_id": sessionObject.remote_id}, function(err, session) {
                            if (err) {
                                res.status(401).json({error_description: err.code});
                                return;
                            }

                            // If new user
                            if (!session) {
                                collection.insert(Object.assign(sessionObject, sessionMeta), function (err) {
                                    if (err) {
                                        res.status(401).json(err);
                                        return;
                                    }

                                    req.user.metadata = sessionMeta;
                                    next();
                                });

                            } else {
                                collection.update(
                                    {_id: session._id},
                                    {
                                        $inc: {login_count: 1},
                                        $set: Object.assign(sessionObject, {
                                            profile_completed: session.profile_completed === undefined ? true : session.profile_completed,
                                            show_guide: session.show_guide === undefined ? false : session.show_guide
                                        })
                                    },
                                    function (err, result) {
                                        if (err) {
                                            res.status(401).json(err);
                                            return;
                                        }
                                        collection.findOne({"remote_id": sessionObject.remote_id}, function(err, session) {
                                            if (err) {
                                                res.status(401).json(err);
                                                return;
                                            }

                                            req.user.metadata = {
                                                login_count: session.login_count,
                                                profile_completed: session.profile_completed,
                                                show_guide: session.show_guide
                                            };

                                            next();
                                        });
                                    }
                                );
                            }

                        });
                    }
                }, true);
            }).end();
        });
    } else {
        req.error_description = req.user.error_description;
        delete req.user;
        next();
    }
}

function respond(req, res) {
    if(req.user) {
        delete req.user.access;
        res.status(200).json({
            user: req.user,
            token: req.token
        });
    } else {
        res.status(502).json({
            error_description: req.error_description
        });
    }
}

module.exports = router;
