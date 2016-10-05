'use strict';
const yamlConfig = require('yaml-config');

const confFilePath = `${__dirname}/config.yaml`;
console.log(`Going to use config file : ${confFilePath}`);
const config = yamlConfig.readConfig(confFilePath);
module.exports = config;
