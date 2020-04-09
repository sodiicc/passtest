let parsers = {};

parsers.request = function (request) {
    return JSON.stringify(request, null).replace(/[\u200B-\u200F\uFEFF\u2060-\u206F]/g, '');
};

parsers.field = function (field) {
    return field.replace(/[\u200B-\u200F\uFEFF\u2060-\u206F]/g, '');
};

parsers.response = function (reponse) {
    let parsedReponse;
    let processedResponse = {
        error: false,
        response: ''
    };

    try {
        parsedReponse = JSON.parse(reponse.toString('utf8'));
    } catch(e) {
        parsedReponse = reponse.toString('utf8');
    }
    if(typeof(parsedReponse) == 'object') {
        if(parsedReponse.Code || parsedReponse.Message) {
            processedResponse = {
                error: true,
                response: parsedReponse.Code + ': ' +parsedReponse.Message
            }
        } else {
            processedResponse = {
                error: false,
                response: parsedReponse
            }
        }
    } else {
        processedResponse = {
            error: false,
            response: parsedReponse
        }
    }
    return processedResponse;
};

parsers.request_middleware = function (res, response, callback) {
    res.setEncoding('utf8');

    let output = '';

    res.on('data', function (chunk) {
        output += chunk;
    });

    res.on('end', function() {
        let result = parsers.response(output);

        if (callback && typeof callback === "function") {
            callback.call(this, result)
        }
    });

    res.on('error', function(e) {
        response.status(502).json({error_description: e});
    });
};

module.exports = parsers;
