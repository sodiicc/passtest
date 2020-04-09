const config = require('../../../config/server.json');
const http = require('http');

var connections = {};

function format_data(data) {

}

module.exports = function (io) {
    io.sockets.on('connection', function (socket) {
        console.log('Comet server user connected');

        socket.on('data', function (data) {
            connections[socket.id].data = data;
        });

        socket.once('disconnect', function () {
            console.log('Comet server disconnected');
            delete connections[socket.id];
        });
    });

    io.sockets.on('connect_failed', function(){
        console.log('Comet server connection Failed');
    });
};
