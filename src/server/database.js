import config from '../../config/server.json';
import MongoClient from 'mongodb';

let connectionInstance;

module.exports = function(callback) {
    if (connectionInstance) {
        callback(connectionInstance);
        return;
    }

    MongoClient.connect(config.mongoDB, function(err, db) {
        if (err) {
            console.log('MongoDB error', err);
            throw new Error(err);
        }
        console.log('Setting up new MongoDB connection...');
        connectionInstance = db;
        callback(connectionInstance);
    });
};