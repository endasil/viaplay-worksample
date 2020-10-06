const {
    CACHE_TTL,
} = require('../utils/config');

const viaplayData = require('../dataAccess/viaplayData');
const tmdbData = require('../dataAccess/tmDbData');
const cacheMgr = require('../utils/cacheManager');
const logger = require('../utils/logger');

/**
 * Retreives a trailer url based on an url to a viaplay film resource description
 * If successful the trailer url will be saved in cache for CACHE_TTL seconds.
 * @param viaplayResourceUrl the url, example:
 * https://content.viaplay.se/pc-se/film/bloodshot-2020
 * @returns {Promise<unknown>} Returns Url for the trailer.
 */
module.exports.getTrailerUrl = async function getTrailerUrl(viaplayResourceUrl) {
    const CACHE_PREFIX = 'TRAILER';

    // Check if this is in the cache already, if so send it back.
    const cachedTrailerUrl = cacheMgr.get(CACHE_PREFIX + viaplayResourceUrl);
    if (cachedTrailerUrl != null) {
        logger.debug(`Value found in cache ${cachedTrailerUrl}`);
        return cachedTrailerUrl;
    }

    // No cache found at that point, call viaplay to get an IMDB id for the movie
    // and then use it with The Movie Database to get an actual trailer.
    const imDbId = await viaplayData.getIMDBIdFromResourceUrl(viaplayResourceUrl);
    const trailerUrl = await tmdbData.getTrailerFromIMDBId(imDbId);

    // Data retreived successfully, store it in cache and send response to client.
    cacheMgr.set(CACHE_PREFIX + viaplayResourceUrl, trailerUrl, CACHE_TTL);
    return trailerUrl;
};
