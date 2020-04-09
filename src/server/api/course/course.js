import express from 'express';
import config from '../../../../config/server.json';
import parsers from '../../helpers/parsers';
import Rest from '../../helpers/rest';
import ApiHelper from '../../helpers/api';
import lesson from './lesson'

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
        response.locals.page.getAttributes(config.routes.course),
        apiHelper.authorization(response.locals.session));

    let req = http.request(options, function (result) {
        parsers.request_middleware(result, response, function (result) {
            if (result.error) {
                response.status(502).json({error_description: result.response});
                return;
            }

            let colors = 2,
                current_color = 0,
                courses = [];

            for (let i=0; i<result.response.length; i++) {
                let data = parseCourse(result.response[i]);

                current_color += 1;

                if (current_color > colors) {
                    current_color = 1;
                }
                data["color_order"] = current_color;

                courses.push(data);
            }


            response.status(202).json(courses);
        });
    });

    req.end();
});

router.get('/:id(\\d+)', authenticate, rest.base, rest.authorization, function(request, response) {
    const course_id = parseInt(request.params.id);
    const options = apiHelper.buildRequest("GET",
        config.routes.course + "?id=" + course_id, apiHelper.authorization(response.locals.session));

    let req = http.request(options, function (result) {
        parsers.request_middleware(result, response, function (result) {
            if (result.error) {
                response.status(502).json({error_description: result.response});
                return;
            }

            response.status(200).json(parseCourse(result.response));
        });
    });

    req.end();
});

function parseCourse(data) {
    let course = {
        id: data["Id"],
        name: data["Name"],
        completed: data["IsCompleted"],
        description: data["Description"],
        organization_name: data["OrganizationName"],
        organization_icon: data["LogoUrl"],
        color_schema: data["ColorScheme"],
        lessons: []
    };

    for (let l=0; l<data["LessonHeadItems"].length; l++) {
        course["lessons"].push({
            id: data["LessonHeadItems"][l]["Id"],
            name: data["LessonHeadItems"][l]["Name"],
            completed: data["LessonHeadItems"][l]["IsCompleted"],
            description: data["LessonHeadItems"][l]["Description"],
            type: lesson.getLessonType(data["LessonHeadItems"][l]["ContentTypeId"])
        });
    }

    return course;
}

module.exports = router;
