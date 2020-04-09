import MongoClient from 'mongodb';

const config = require('../../../config/server.json');
const socketService = require('./service');
const push = require('../api/push/push').push;
const redis = require("redis");
const http = require('http');
const NOTIFICATION_TYPE = 1;

let client = redis.createClient(config.redis.connection);

module.exports = function (socket, io) {
    let token = socket.handshake.query.token;
    MongoClient.connect(config.mongoDB, function (err, db) {
        if (err) {
            socket.disconnect();
            return;
        }

        let collection = db.collection(config.collections.sessions);
        collection.findOne({"frontendToken": token}, function (err, session) {
            if (err) {
                socket.disconnect('unauthorized');
                return;
            }
            if (!session) {
                socket.disconnect('unauthorized');
                return;
            }

            // Appending to REDIS user DB
            client.set(config.redis.client_prefix + session.remote_id, socket.id, function (err) {
                if (err) throw err;
                console.log('User ' + session.username + ' successfully connected! [ID:' + config.redis.client_prefix + session.remote_id + ']');
            });

            socketService.on('change', function (change) {
                if (change.property[0] === 'message' && socketService.subject.message) {
                    console.log('EVENT', socketService);
                    let messages = socketService.subject.message;

                    push.getNotifications().then(function (all_notifications) {
                        let pushes = {};
                        let notifications = {};

                        for (let index in all_notifications) {
                            pushes[all_notifications[index]["UserId"]] = all_notifications[index]["PushItems"];
                        }

                        //console.log('ALL NOTIFICATIONS', pushes);
                        console.log('UPDATE MESSAGES', messages);

                        for (let index in messages) {
                            let data = messages[index];

                            if (!notifications[data["PortalUserId"]]) {
                                notifications[data["PortalUserId"]] = {};
                            }
                            if (!notifications[data["PortalUserId"]][data["TypeId"]]) {
                                notifications[data["PortalUserId"]][data["TypeId"]] = 0;
                            }

                            notifications[data["PortalUserId"]][data["TypeId"]] += 1;
                        }

                        console.log("All UPDATE USERS", notifications);

                        for (let user_id in notifications) {
                            let data = notifications[user_id];

                            if (!data[NOTIFICATION_TYPE]) continue;
                            if (!pushes[user_id]) continue;

                            console.log("FOUND NEW NOTIFICATION FOR USER [ID:" + user_id + "]", data);
                            // Sending push-notification to user
                            for (let i=0; i<data[String(NOTIFICATION_TYPE)]; i++) {
                                let order = pushes[user_id].length-1;
                                let user_notification = pushes[user_id][order-i];

                                console.log("USER [ID:" + user_id + "] NOTIFICATION", user_notification);

                                client.get(config.redis.client_prefix + user_id, function (err, socketId) {
                                    if (err) throw err;
                                    console.log("Session id", socketId);
                                    console.log("Found User ID " + user_id);
                                    console.log("Send message", user_notification);

                                    io.to(socketId).emit("message", user_notification);
                                });
                            }
                        }
                    });
                    //socket.send(socketService.subject.message);
                    socketService.set('message', false);
                }
            });
        })
    });
};
