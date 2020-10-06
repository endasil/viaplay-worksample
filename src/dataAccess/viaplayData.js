const makeRequest = require('../utils/makeRequest');
const logger = require('../utils/logger');

/* eslint no-underscore-dangle: 0 */

/**
 *
 * @param url url to a viaplay movie resource.
 * @returns {Promise<*>} returns a imdbId that will be used to look up
 * the trailer url-
 */
exports.getIMDBIdFromResourceUrl = async function getIMDBIdFromResourceUrl(url) {
    try {
        const response = await makeRequest({
            url,
            useCache: true,
            method: 'GET',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        });

        // This is not a viaplay endpoint...
        if (!response.body._embedded) {
            throw {
                statusCode: 404,
                message: 'No movie data found.',
            };
        }
        return response.body._embedded['viaplay:blocks'][0]._embedded['viaplay:product'].content.imdb.id;
    } catch (err) {
        logger.error(`Error received in getIMDBIdFromResourceUrl. Call url: ${url}`, err);
        throw (err);
    }
};
