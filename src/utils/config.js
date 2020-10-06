const config = require('../../config.json');

/**
 * Go trough each key in the config.json file and check if there
 * is any environment variable set with the same name. If there is
 * override config values with environment values. An example of usage
 * is to have the config.json as default values and then override with
 * environment variables depending on if the project is deployed on
 * dev, staging or prod.
 */
Object.keys(config).forEach((key) => {
    if (process.env[key] !== undefined) {
        config[key] = process.env[key];
    }
});

module.exports = config;
