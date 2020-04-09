const observe = require('observe');
let storage = {};
let socketService = observe(storage);

module.exports = socketService;
