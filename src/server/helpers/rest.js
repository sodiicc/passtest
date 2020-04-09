import Pagintation from './pagination';
import database from '../database';

module.exports = function (config) {
    let middleware = {};

    middleware.base = function (request, response, next) {
        //Setup MongoDB
        database(function (db) {
            response.locals.db = db;
            next();
        });
    };

    middleware.authorization = function (request, response, next) {
        const collection = response.locals.db.collection(config.collections.sessions);
        const token = request.headers.authorization.replace(config.authorization.type, '');
        collection.findOne({"frontendToken": token}, function (err, session) {
            if (err) {
                response.status(401).json(err);
                return;
            }
            if (!session) {
                response.status(401).json({error_description: 'Wrong token'});
                return;
            }
            response.locals.collection = collection;
            response.locals.session = session;
            next();
        })
    };

    function getRemoteTimeFormat(date) {
        function zeroPad(num, places) {
            let zero = places - num.toString().length + 1;
            return Array(+(zero > 0 && zero)).join("0") + num;
        }

        return date.getFullYear() + "-"
            + zeroPad((date.getMonth() + 1), 2)
            + "-" + zeroPad(date.getDate(), 2)
            + "T" + zeroPad(date.getHours(), 2)
            + ":" + zeroPad(date.getMinutes(), 2)
            + ":" + zeroPad(date.getSeconds(), 2);
    }


    middleware.pagination = function (request, response, next) {
        let page = parseInt(request.query.page) || 0;
        let page_records = parseInt(request.query.page_records) || config.pagination.page_items;
        let date_to = request.query.date_to || getRemoteTimeFormat(new Date());

        response.locals.page = new Pagintation(page, page_records, date_to);
        next();
    };

    return middleware;
};
