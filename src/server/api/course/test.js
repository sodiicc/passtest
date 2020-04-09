import express from 'express';
import config from '../../../../config/server.json';
import parsers from '../../helpers/parsers';
import Rest from '../../helpers/rest';
import ApiHelper from '../../helpers/api';

const router = express.Router();
const striptags = require('striptags');
const jwt = require('jsonwebtoken');
const expressJWT = require('express-jwt');
const authenticate = expressJWT({secret: config.authorization.secret});
const querystring = require('querystring');
const http = require('http');
const dns = require('dns');
const rest = new Rest(config);
const apiHelper = new ApiHelper(config);

let getQuestion = function (question_id, session) {
    return new Promise((resolve, reject) => {
        let response = {};
        const options = apiHelper.buildRequest("GET",
            config.routes.question + "?questionId=" + question_id,
            apiHelper.authorization(session));

        http.request(options, function (result) {
            parsers.request_middleware(result, response, function (result) {
                if (result.error) {
                    return reject({error_description: result.response});
                }

                return resolve(formatQuestion(result.response));
            });
        }).end();
    });
};

router.get('/:id(\\d+)', authenticate, rest.base, rest.authorization, function (request, response) {
    const lesson_id = parseInt(request.params.id);
    const options = apiHelper.buildRequest("GET",
        config.routes.test + '?parentId=' + lesson_id,
        apiHelper.authorization(response.locals.session));

    let req = http.request(options, function (result) {
        parsers.request_middleware(result, response, function (result) {
            if (result.error) {
                response.status(502).json({error_description: result.response});
                return;
            }

            response.status(200).json(formatTest(result.response));
        });
    });

    req.end();
});

router.get('/:parent_id(\\d+)/question/:id(\\d+)', authenticate, rest.base, rest.authorization,
    function (request, response) {
    const parent_id = parseInt(request.params.parent_id);
    const question_id = parseInt(request.params.id);

    getQuestion(question_id, response.locals.session).then(
        data => response.status(200).json(data),
        error => response.status(502).json(error)
    );
});

router.post('/:parent_id(\\d+)/question/:id(\\d+)', authenticate, rest.base, rest.authorization, function (request, response) {
    if (!request.body.answer_id) {
        response.status(400).json({error_description: "answer_id is required"});
        return;
    }
    const parent_id = parseInt(request.params.parent_id);
    const question_id = parseInt(request.params.id);
    const options = apiHelper.buildRequest("POST",
        config.routes.question,
        apiHelper.authorization(response.locals.session));
    const answer_data = {
        "QuestionId": question_id,
        "Answer": request.body.answer_id
    };

    let req = http.request(options, function (result) {
        parsers.request_middleware(result, response, function (result) {
            if (result.error) {
                response.status(502).json({error_description: result.response});
                return;
            }

            let response_data = {
                'success': (result.response["State"] === 1),
                'anchor': ''
            };

            getQuestion(question_id, response.locals.session).then(
                data => {
                    response_data.anchor = data.anchor;
                    return response.status(200).json(response_data);
                },
                error => {
                    console.log("Can't get question");

                    return response.status(201).json(response_data);
                }
            );
        });
    });

    req.write(parsers.request(answer_data));
    req.end();
});

function formatQuestion(data) {
    let types = {
        0: "radio",
        18: "radio",
        29: "checkbox"
    };
    if (!(data["TypeId"] in types)) {
        data["TypeId"] = 0;
    }

    let question = {
        id: data["Id"],
        type: types[data["TypeId"]],
        description: striptags(data["Text"]),
        answer: (data["UserAnswer"]) ? data["UserAnswer"].split(",").map(item => parseInt(item)) : [],
        anchor: data["SectionParam"],
        lesson_id: data["ParentId"],
        can_edit: !data["IsReadOnly"],
        items: []
    };

    // Resetting items order
    let items = data["AnswerItems"].sort(function (a, b) {
        return parseInt(a["No"]) - parseInt(b["No"]);
    });

    for (let i = 0; i < items.length; i++) {
        let item = {
            id: items[i]["Id"],
            order: i,
            name: items[i]["Name"]
        };
        question["items"].push(item)
    }

    return question
}

function formatTest(data) {
    let test = {
        id: data["Id"],
        name: data["Name"],
        correct_percentage: data["CorrectAnswersPercentage"],
        completed: data["IsCompleted"],
        time_limit: (data["InterviewTime"]) ? data["InterviewTime"] : 0,
        time_last: data["TimeToEnd"],
        items: [],
        redirectUrl: data["RedirectUrl"] || false
    };

    if (test.time_limit && !("TimeToEnd" in data)) {
        test.time_last = test.time_limit;
    }

    // Resetting items order
    let items = [];

    if (data["QuestionItems"] instanceof Array) {
        items = data["QuestionItems"].sort(function (a, b) {
            return parseInt(a["No"]) - parseInt(b["No"]);
        });
    }

    for (let i = 0; i < items.length; i++) {
        let item = {
            id: items[i]["Id"],
            order: i,
            name: items[i]["Description"],
            state: items[i]["State"]
        };
        test["items"].push(item)
    }

    return test
}

router.post('/submit', authenticate, rest.base, rest.authorization, function (request, response) {
    if (!("lessonId" in request.body)) {
        response.status(400).json({error_description: "lessonId is required"});
        return;
    }

    const options = apiHelper.buildRequest("POST",
        config.routes.test + "?parentId=" + request.body.lessonId,
        apiHelper.authorization(response.locals.session));
    let req = http.request(options, function (result) {
        parsers.request_middleware(result, response, function (result) {
            if (result.error) {
                response.status(502).json({error_description: result.response});
                return;
            }
            let data = result.response;

            response.status(201).json(data);
        });
    });
    req.end();
});

module.exports = router;
