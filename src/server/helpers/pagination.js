const url = require('url');

module.exports = function(page, page_records, date_to) {
    let pagination = {};

    pagination.getAttributes = function(path) {
        let args = "page=" + page + "&pageRecords=" + page_records + "&to=" + date_to;

        if (!url) return args;

        if(url.parse(path).query) {
            path += "&" + args
        } else {
            path += "?" + args
        }

        return path
    };

    return pagination
};
