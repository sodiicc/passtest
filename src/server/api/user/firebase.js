import express from 'express';
import config from '../../../../config/server.json';
import parsers from '../../helpers/parsers';
import Rest from '../../helpers/rest';
import ApiHelper from '../../helpers/api';
import database from '../../database';
import fcmService from './../../helpers/fcm';

const router = express.Router();
const expressJWT = require('express-jwt');
const authenticate = expressJWT({secret : config.authorization.secret});

const http = require('http');
const rest = new Rest(config);
const apiHelper = new ApiHelper(config);


const fcmCollection = config.collections.fcm;

const profileAttributes = {
    id: "id",
    first_name: {name: "firstName", id: "firstNameId"},
    middle_name: {name: "middleName", id: "middleNameId"},
    last_name: "lastName",
    mobile_phone: "mobilePhone",
    info_points: "infoPoints",

    organization: {name: "organizationName", id: "organizationId"},
    position: {name: "positionName", id: "positionId"},
    specialty: {name: "specialtyName", id: "specialtyId"},
    country: {name: "countryName", id: "countryId"},
    region: {name: "regionName", id: "regionId"},
    parent_region: {name: "parentRegionName", id: "parentRegionId"},
    city: {name: "cityName", id: "cityId"},
    street: {name: "streetName", id: "streetId"},

    street_number: "buildingNo",
    promo_code: "medbotId",
    email: "email",
    lang: "lang"
};


router.get('/messages', authenticate, rest.base, rest.authorization, function(request, response) {
    getProfile(response.locals.session).then(
        data => {
            database(function (db) {
                const collection = db.collection(fcmCollection);
                let tokenStream = collection.find({"id": data.id}).stream();
                let tokens = [];
                tokenStream.on('data', function (FCMObject) {
                    if (tokens) {
                        tokens.push(FCMObject.token);
                    }
                });
                tokenStream.on('end', function () {
                    response.status(200).json({token: tokens});
                });
            });
        },
        error => response.status(502).json(error)
    );
});

router.get('/messages/send', function(request, response) {
    database(function (db) {
        const collection = db.collection(fcmCollection);
        let tokenStream = collection.find().stream();
        let tokens = [];
        tokenStream.on('data', function (FCMObject) {
            if (tokens) {
                tokens.push(FCMObject.token);
            }
        });
        tokenStream.on('end', function () {
            fcmService.sendMessage(config.fcm.key, tokens, 'Test title', 'Test body', 'http://google.com');
            response.status(200).json({message: "Push sended."});
        });
    });
});


router.get('/messages/check/:token', function(request, response) {
    const token = request.params.token;
    database(function (db) {
        const collection = db.collection(fcmCollection);
        collection.findOne({"token": token}, function(err, data) {
            if (err) {
                response.status(401).json(err);
                return;
            }
            if (!data) {
                response.status(200).json({subscribed: false});
            } else {
                response.status(200).json({subscribed: true});
            }
        })
    });
});

router.post('/messages', authenticate, rest.base, rest.authorization, function(request, response) {
    let fcmData = request.body;
    getProfile(response.locals.session).then(
        data => {
            database(function (db) {
                const collection = db.collection(fcmCollection);
                let FCMObject = {
                    token: fcmData.token,
                    id: data.id,
                    mdm_id: data.mdm_id,
                    email: data.email,
                    username: data.mobilePhone
                };
                collection.update({"token": fcmData.token, "id": data.id}, FCMObject, { upsert: true }, function (err) {
                    if (err) {
                        res.status(401).json(err);
                    }
                    response.status(200).json({message: "FCM token save success."});
                });
            });
        },
        error => response.status(502).json(error)
    );
});

router.delete('/messages', authenticate, rest.base, rest.authorization, function(request, response) {
    getProfile(response.locals.session).then(
        data => {
            database(function (db) {
                const collection = db.collection(fcmCollection);
                collection.remove({"id": data.id}, function (err) {
                    if (err) {
                        response.status(400).json({error_description: err.code});
                        return;
                    }
                    response.status(200).json({message: "Unsubscribe success."});
                });
            });
        },
        error => response.status(502).json(error)
    );
});

let getProfile = function (session) {
    return new Promise((resolve, reject) => {
        let response = {};
        const options = apiHelper.buildRequest("GET",
            config.routes.user,
            apiHelper.authorization(session));
        http.request(options, function (result) {
            parsers.request_middleware(result, response, function (result) {
                if (result.error) {
                    return reject({error_description: result.response});
                } else {
                    return resolve(result.response);
                }
            });
        }).end();
    });
};

module.exports = router;
