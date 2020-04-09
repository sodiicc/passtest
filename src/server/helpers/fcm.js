const FCM = require('fcm-node');
import config from '../../../config/server.json';
import MongoClient from 'mongodb';
const mongoDB = config.mongoDB;
const fcmCollection = config.collections.fcm;

let fcmService = {};
fcmService.fcm = {};


fcmService.sendMessage = function(key, registration_ids, title, body, url) {
    fcmService.fcm = new FCM(key);
    let message = {
        registration_ids: registration_ids,
        collapse_key: 'Updates Available',
        notification: {
            title: title,
            body: body
        },
        data: {
            url: url
        }
    };

    fcmService.fcm.send(message, function(err, response){
        if (err) {
            return err;
        } else {
            return response;
        }
    });
};

module.exports = fcmService;