const path = require('path');
const restify = require('restify');
const swaggerize = require('swaggerize-restify');
const logger = require('./utils/logger');

// Load in the port this service should listen to from config.json or
// environment variable if set.
const {
    LISTEN_PORT,
    CACHE_TTL,
} = require('./utils/config');

require('./utils/cacheManager').setDefaultCacheTtl(CACHE_TTL);

let connection;

exports.startServer = function startServer(cb) {
    const serverInstance = restify.createServer();
    serverInstance.use(restify.fullResponse());
    // Allow the client to request gzipped data.
    serverInstance.use(restify.gzipResponse());

    // Load in a description of the api from swaggerConfig/swagger.json
    // That json file is used to instruct the application on what endpoint
    // to receive calls on as well as the parameters used.
    // api: path to a swagger json describing the routes.
    // handlers: The folder under which the application will look for files
    //           under a structure matching routes specified in the json.
    // docspath: The path that the documentation will be exposed on for
    // any swagger that want to use it. In this example when /api-docs
    // is specified, the application exposes the swagger json on
    // http://localhost:1337/api-docs
    swaggerize(serverInstance, {
        api: path.resolve('swaggerConfig/swagger.json'),
        handlers: './controllers',
        docspath: '/api-docs',
    });

    // Start server to be able to take api calls.
    connection = serverInstance.listen(LISTEN_PORT, () => {
        logger.info(`${serverInstance.name} listening at ${serverInstance.url}`);
        if (cb) {
            cb();
        }
    });
};

exports.stopServer = function stopServer(cb) {
    connection.close(() => {
        if (cb) {
            cb();
        }
    });
};
