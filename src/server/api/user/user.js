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

const profileAttributes = {
    id: "id",
    first_name: {name: "firstName", id: "firstNameId"},
    middle_name: {name: "middleName", id: "middleNameId"},
    last_name: "lastName",
    mobile_phone: "mobilePhone",
    info_points: "infoPoints",

    organization: {name: "organizationName", id: "organizationId"},
    position: {name: "positionName", id: "positionId"},
    specialty: {name: "specialityName", id: "specialityId"},
    country: {name: "countryName", id: "countryId"},
    region: {name: "regionName", id: "regionId"},
    parent_region: {name: "parentRegionName", id: "parentRegionId"},
    city: {name: "cityName", id: "cityId"},
    street: {name: "streetName", id: "streetId"},

    street_number: "buildingNo",
    promo_code: "medbotId",
    email: "email",
    lang: "lang",
    isAgreementExists: "IsAgreementExists"
};

const requiredFieds = [
    "first_name", "middle_name", "last_name",
    "organization", "position", "specialty",
    "country", "city", "street",
    "street_number"
];

let checkRequired = function (data) {
    for (let i=0; i<requiredFieds.length; i++) {
        let rq_field = requiredFieds[i];

        if ((profileAttributes[rq_field] instanceof String && !data[rq_field]) ||
            (profileAttributes[rq_field] instanceof Object && (
                !data[rq_field]|| !data[rq_field] instanceof Object ||
                (!data[rq_field]['name'] && !data[rq_field]['id']))
            )) return false;
    }

    return true;
};

let formatOldProfile = function (data) {
    let formatted_data = {};

    for (let key in profileAttributes) {
        if (!profileAttributes.hasOwnProperty(key) || !data[key]) continue;

        if (typeof profileAttributes[key] === 'string') {
            formatted_data[profileAttributes[key]] = data[key];
        } else if (profileAttributes[key] instanceof Object) {
            if (!(data[key] instanceof Object)) continue;
            if (data[key]['id']) data[key]['name'] = false;

            for (let item in profileAttributes[key]) {
                if (!profileAttributes[key].hasOwnProperty(item) || !data[key][item]) continue;

                formatted_data[profileAttributes[key][item]] = data[key][item]
            }
        }
    }

    return formatted_data;
};

let formatNewProfile = function(data) {
    let formatted_data = {};

    for (let key in profileAttributes) {
        if (!profileAttributes.hasOwnProperty(key)) continue;

        if (typeof profileAttributes[key] === 'string') {
            formatted_data[key] = data[profileAttributes[key]] || "";
        } else if (profileAttributes[key] instanceof Object) {
            formatted_data[key] = {};

            for (let item in profileAttributes[key]) {
                if (!profileAttributes[key].hasOwnProperty(item)) continue;

                if (!data[profileAttributes[key][item]]) {
                    if (item === 'id') {
                        data[profileAttributes[key][item]] = 0;
                    } else {
                        data[profileAttributes[key][item]] = '';
                    }
                }

                formatted_data[key][item] = data[profileAttributes[key][item]]
            }

            let elements_exist = false;
            for (let item in formatted_data[key]) {
                if (formatted_data[key][item]) {
                    elements_exist = true;
                    continue;
                }
            }

            if(!Object.keys(formatted_data[key]).length || !elements_exist) delete formatted_data[key];
        }
    }

    return formatted_data;
};

let getLocalProfile = function (mobile_phone, data) {
    data = data || {};

    return new Promise((resolve, reject) => {
        database(function (db) {
            const collection = db.collection(config.collections.sessions);
            collection.findOne({"username": mobile_phone}, function(err, session) {
                if (err) {
                    return reject({error_description: 'Unknown error'});
                } if (!session) {
                    return reject({error_description: 'User not found'});
                }

                let profile = {};
                profile['profile_completed'] = session.profile_completed;
                profile['login_count'] = session.login_count;
                profile['show_guide'] = session.show_guide;

                return resolve(Object.assign(data, profile));
            })
        });
    });
};

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
                    let profile = formatNewProfile(result.response);

                    try {
                        // Getting user local data
                        getLocalProfile(profile['mobile_phone'], profile).then(
                            data => resolve(data),
                            error => reject({error_description: 'Unknown error'})
                        );

                    } catch (e) {
                        return reject({error_description: 'Unknown error'});
                    }
                }
            });
        }).end();
    });
};


router.delete('/guide', authenticate, rest.base, rest.authorization, function(request, response) {
    database(function (db) {
        const collection = db.collection(config.collections.sessions);

        collection.update(
            {_id: response.locals.session._id},
            {
                $set: Object.assign(response.locals.session, {
                    show_guide: false
                })
            },
            function (err, result) {
                if (err) {
                    return response.status(502).json({error_description: 'Unknown error'});
                }

                return response.status(200).json();
            }

        );
    });
});

router.get('/', authenticate, rest.base, rest.authorization, function(request, response) {
    getProfile(response.locals.session).then(
        data => response.status(200).json(data),
        error => response.status(502).json(error)
    );
});

router.post('/', authenticate, rest.base, rest.authorization, function(request, response) {
    const options = apiHelper.buildRequest("PUT", config.routes.user, apiHelper.authorization(response.locals.session));
    let userData = request.body;
    let paramsList = [
        "first_name",
        "middle_name",
        "last_name",
        "country",
        "parent_region",
        "region",
        "city",
        "street",
        "street_number",
        "organization",
        "position",
        "specialty",
        "email",
        "promo_code",
        "lang"
    ];

    getProfile(response.locals.session).then(
        data => {
            for (let key in userData) {
                if (!userData.hasOwnProperty(key) || paramsList.indexOf(key) === -1) continue;
                data[key] = userData[key];
            }

            let res = http.request(options, function (result) {
                parsers.request_middleware(result, response, function (result) {
                    if (result.error) {
                        response.status(502).json({error_description: result.response});
                    } else {
                        database(function (db) {
                            const collection = db.collection(config.collections.sessions);
                            let profile = formatNewProfile(result.response);

                            getLocalProfile(profile['mobile_phone'], profile).then(
                                data => {
                                    let profile_completed = true;
                                    if (!data['profile_completed'] && !checkRequired(profile)) {
                                        profile_completed = false;
                                    }

                                    collection.update(
                                        {"username": profile['mobile_phone']},
                                        {
                                            $set: {
                                                profile_completed: profile_completed
                                            }
                                        },
                                        function (err, result) {
                                            response.status(200).json(data)
                                        });
                                },
                                error => response.status(502).json(error)
                            );
                        });
                    }
                });
            });
            res.write(parsers.request(formatOldProfile(data)));
            res.end();
        },
        error => response.status(502).json(error)
    );
});

router.get('/dictionary', function (request, response) {
    let lang = (request.query.lang) ? request.query.lang : commonConfig.default.lang;
    let search = (request.query.search) ? request.query.search : "";
    let dictionary = (request.query.dictionary) ? request.query.dictionary : 1;
    let parentId = (request.query.parentId) ? request.query.parentId : false;
    let path = config.routes.dictionary + '?type='+ dictionary +'&lang='+ lang;
    if(parentId) {
        path = path + '&parentId='+parentId
    }
    const options = apiHelper.buildRequest("GET", path, apiHelper.basicAuth());
    let req = http.request(options, function (result) {
        parsers.request_middleware(result, response, function (result) {
            if (result.error) {
                response.status(502).json({error_description: result.response});
            } else {
                response.status(200).json(filterDictionary(result.response, search));
            }
        });
    });
    req.end();
});

router.get('/logout', authenticate, rest.base, rest.authorization, function(request, response) {
    const backendToken = response.locals.session.backendToken;
    const frontendToken = response.locals.session.frontendToken;
    const collection = response.locals.collection;
    const options = apiHelper.buildRequest("DELETE", config.routes.authentication, apiHelper.authorization(response.locals.session));
    let req = http.request(options, function (result) {
        parsers.request_middleware(result, response, function (result) {
            if (result.error) {
                response.status(502).json({error_description: result.response});
            } else {
                collection.remove({"frontendToken": frontendToken, "backendToken": backendToken}, function (err) {
                    if (err) {
                        response.status(400).json({error_description: err.code});
                        return;
                    }
                    response.status(200).json({message: "Logout success."});
                });
            }
        });
    });
    req.end();
});

router.get('/delete/:id', authenticate, rest.base, rest.authorization, function(request, response) {
    const backendToken = response.locals.session.backendToken;
    const frontendToken = response.locals.session.frontendToken;
    const collection = response.locals.collection;
    let uid = (request.query.id) ? request.query.id : false;
    if(uid) {
        const options = apiHelper.buildRequest("DELETE", config.routes.user + '?id=' + uid, apiHelper.authorization(response.locals.session));
        let req = http.request(options, function (result) {
            parsers.request_middleware(result, response, function (result) {
                if (result.error) {
                    response.status(502).json({error_description: result.response});
                } else {
                    collection.remove({"frontendToken": frontendToken, "backendToken": backendToken}, function (err) {
                        if (err) {
                            response.status(400).json({error_description: err.code});
                            return;
                        }
                        response.status(200).json({message: "Delete success."});
                    });
                }
            });
        });
        req.end();
    } else {
        response.status(400).json({error_description: 'Id not provided.'});
    }
});

router.put('/password', authenticate, rest.base, rest.authorization, function(request, response) {
    const options = apiHelper.buildRequest("PUT", config.routes.password, apiHelper.authorization(response.locals.session));
    let userData = request.body;
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


function formatDictionary(data) {
    if(typeof data.Value !== undefined && data.Value) {
        return {
            id: data.Key,
            name: data.Value
        }
    }
}

function filterDictionary(data) {
    let result = [];
    for (let key in data) {
        if (!data.hasOwnProperty(key)) continue;
        let value = formatDictionary(data[key]);
        if(value) {
            result.push(value);
        }
    }
    return result;
}

module.exports = router;
