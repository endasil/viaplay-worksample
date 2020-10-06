const request = require('request-promise-native');
const util = require('util');
const logger = require('./logger');
const cacheMgr = require('./cacheManager');
/**
 * make a request to an endpoint.
 * Has the possibility to store and retrieve data from cache (with lowercased url as the key) for a
 * duration set by the setDefaultCacheTtl function.
 * options.url - The url to make a request to.
 * options.method - Type of request, GET, PUT or POST. If undefined a GET
 * request will be made.
 * options.useCache - If set to true the response will be
 * cached (using url as key). Caching will only be done if no error is received.
 * options.cacheKey - optional name of cache key. Use this if you do not
 * want to cache on url. (Useful if you want to cache on a user session together with url). This
 * will be lowercased in makerequest.
 *options.headers - Headers to use for this request,
 * options.cacheTTL - Used to override the default time
 * for holding response to this request in in cache.

 * @return
 * response.obj JSON-parsed version of the response body object,
 * response.body body from the response.
 * response.headers response headers.
 * response.statusCode status code from the response.
 * rejects with `{statusCode: Number, message: String}`
 * </ul>
 *
 */
module.exports = async function makeRequest(requestOptions) {
    const options = requestOptions;
    const cacheKey = options.cacheKey
        ? options.cacheKey.toLowerCase() : options.url.toLowerCase();

    // Automatically decode the response to json
    options.json = true;

    // Get the complete response object back, not just header
    options.resolveWithFullResponse = true;

    // Set the accept-encoding header to gzip, if not already present
    // and turn on automatic decoding of gzip data if this is the type
    // of content actually returned.
    options.gzip = true;

    // If no method is specced, perform a get request
    if (!options.method) {
        options.method = 'GET';
    }

    // If this is a get request and use cache is set to true, try to get data from cache
    if (options.useCache && (options.method.toUpperCase() === 'GET')) {
        const cacheData = cacheMgr.get(cacheKey);
        if (cacheData !== undefined) {
            logger.debug(`pop cache: ${cacheKey}`);
            return cacheData;
        }
    }

    const startTime = new Date().getTime();

    try {
        const response = await request(options);
        const stopTime = new Date().getTime();

        logger.debug(`Successful makeRequest call to ${options.method} ${options.url} request time: ${(stopTime - startTime)}`
            + ` statusCode from call: ${response ? response.statusCode : 500}`);

        const responseObj = {};
        responseObj.headers = response.headers;
        responseObj.statusCode = response.statusCode;
        responseObj.body = response.body;

        // If use cache is set to true and this is a get request, update cache.
        if (options.useCache && (!options.method || options.method.toUpperCase() === 'GET')) {
            logger.debug(`cache set for ${cacheKey}`);
            cacheMgr.set(cacheKey, responseObj, options.cacheTTL);
        }

        return responseObj;
    } catch (err) {
        // If an error occurred, reject.
        const stopTime = new Date().getTime();
        const errorMessage = (typeof (err.error) === 'object' ? util.inspect(err.error) : err.error);

        logger.warn(`makeRequest received an error from ${options.method} ${options.url}: ${errorMessage} request time: ${(stopTime - startTime)}`
            + `statusCode from call: ${err.statusCode || 500}`);
        throw {
            statusCode: err.statusCode || 500,
            message: errorMessage,
        };
    }
};
