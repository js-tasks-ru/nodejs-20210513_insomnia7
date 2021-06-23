const merge = require('lodash/merge');
const configCommon = require('./config_common');
const configSecret = require('./config_secret');

module.exports = merge(configCommon, configSecret);
