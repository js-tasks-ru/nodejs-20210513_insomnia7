const merge = require('lodash/merge');
const configCommon = require('./config_common');

let configSecret = {};

try {
  configSecret = require('./config_secret');
} catch (_) {
  console.log('Secret config file is missing');
}

module.exports = merge(configCommon, configSecret);
