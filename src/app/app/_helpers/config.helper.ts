const app_config = require('../../../../config/app.json');
const common_config = require('../../../../config/common.json');

let config = Object.assign(app_config, common_config);

export {config};
