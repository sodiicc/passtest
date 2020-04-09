let api = function(config) {
    this.config = config;
};

api.prototype.authorization = function(session, name) {
    if (typeof name === "undefined") name = "backendToken";
    let token = session[name];
    return {
        'Authorization': this.config.access.user + ' ' + token,
        'Content-Type': 'application/json'
    }
};

api.prototype.basicAuth = function() {
    const token = this.config.access.token;
    const type = this.config.access.type;
    return {
        'Authorization': type + ' ' + token,
        'Content-Type': 'application/json'
    }
};

api.prototype.buildRequest = function(method, route, headers) {
    let options = {
        host: this.config.access.host,
        path: this.config.routes.base + route,
        method: method,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    console.log("Remote API request: ", options.host + options.path);

    if (typeof headers === "object") {
        options["headers"] = Object.assign(options["headers"], headers);
    }

    return options;
};

module.exports = api;
