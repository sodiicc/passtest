let socketService = require('./service');
let push = require('../api/push/push');
const config = require('../../../config/server.json');
import moment from 'moment';
import MongoClient from 'mongodb';
import fcmService from './../helpers/fcm';

const mongoDB = config.mongoDB;
const fcmCollection = config.collections.fcm;

module.exports = function (connection) {
    console.log('Client connected');

    connection.on('error', function(error) {
        console.log("Client connection error: " + error.toString());
    });
    connection.on('close', function() {
        console.log('Client connection closed');
    });
    connection.on('message', function(message) {
        console.log('--message--');
        try {
            message = message[message["type"] + "Data"]
        } catch (err) {
            console.log("Remote WebSocket message guess error. ", err, message);
            return;
        }

        try {
            message = JSON.parse(message);
        } catch (err) {
            console.log("Remote WebSocket message JSON Parse error", err, message);
            return;
        }

        console.log(message);

        //socketService.set('message', message);

        MongoClient.connect(mongoDB, function (err, db) {
            if (err) return res.status(401).json(err);
            const collection = db.collection(fcmCollection);
            let tokenStream = collection.find().stream();
            let tokens = [];
            tokenStream.on('data', function (FCMObject) {
                if (tokens) {
                    tokens.push(FCMObject.token);
                }
            });
            tokenStream.on('end', function () {
                //TODO: Add real message data
                fcmService.sendMessage(config.fcm.key, tokens, 'Test title', 'Test body');
            });
        });

        console.log('--message--');
    });
};