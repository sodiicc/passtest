import express from 'express';
import config from '../../../../config/server.json';
import parsers from '../../helpers/parsers';
import Rest from '../../helpers/rest';
import ApiHelper from '../../helpers/api';
import lessonsHelper from '../../helpers/lessons';

const router = express.Router();
const jwt = require('jsonwebtoken');
const expressJWT = require('express-jwt');
const authenticate = expressJWT({secret: config.authorization.secret});
const querystring = require('querystring');
const http = require('http');
const dns = require('dns');
const rest = new Rest(config);
const apiHelper = new ApiHelper(config);

const LESSON_TYPES = {
    0: "html",
    15: "html",
    28: "youtube",
    27: "audio",
    14: "image",
    26: "presentation"
};

router.get('/:id(\\d+)', authenticate, rest.base, rest.authorization, function (request, response) {
    const lesson_id = parseInt(request.params.id);
    const options = apiHelper.buildRequest("GET",
        config.routes.lesson + '?lessonId=' + lesson_id,
        apiHelper.authorization(response.locals.session));

    let req = http.request(options, function (result) {
        parsers.request_middleware(result, response, function (result) {
            if (result.error) {
                response.status(404).json({error_description: result.response});
                return;
            }

            response.status(200).json(formatLesson(result.response));
        });
    });

    req.end();
});

function formatLesson(data) {
    let lesson = {
        id: data["Id"],
        name: data["Name"],
        completed: data["IsCompleted"],
        description: data["Description"],
        type: null,
        format: data["ContentExtension"],
        content: data["Content"],
        course_id: data["CourseId"],
        course_name: data["CourseName"],
        organization_name: data["OrganizationName"],
        color_schema: data["ColorScheme"]
    };

    if (!(data["ContentTypeId"] in LESSON_TYPES)) {
        data["ContentTypeId"] = 0;
    }
    lesson["type"] = LESSON_TYPES[data["ContentTypeId"]];

    if (lesson.type === 'youtube') {
        lesson.content = lessonsHelper.matchYoutubeUrl(lesson.content)
    }

    return lesson
}

function getLessonType(data) {
    if (!(data in LESSON_TYPES)) {
        data = 0;
    }
    return LESSON_TYPES[data];
}

module.exports = router;
module.exports.getLessonType = getLessonType;
