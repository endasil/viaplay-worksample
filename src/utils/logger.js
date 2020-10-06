/**
 * Gives access to the logger.
 * @type {winston}
 */

const winston = require('winston');
const {
    LOG_LEVEL,
} = require('./config');

module.exports = winston.createLogger({
    level: LOG_LEVEL,
    transports: [
        new winston.transports.Console(),
    ],
});
