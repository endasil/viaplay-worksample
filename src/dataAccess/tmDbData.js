const makeRequest = require('../utils/makeRequest');

// Get constants specified in config.json or set in environment variables
const {
    THE_MOVIE_DB_URL,
    THE_MOVIE_DB_API_KEY,
    YOUTUBE_TRAILER_URL,
} = require('../utils/config');

const logger = require('../utils/logger');

/**
 * Get the first trailer from TheMovieDB matching
 * an imdb id and  returns it.
 * @param imDbId - The imdb id to use when looking for a movie resource.
 * @returns {Promise<string>} Url for the movie trailer
 */
exports.getTrailerFromIMDBId = async function getTrailerFromIMDBId(imDbId) {
    // Construct the url to call to get the trailer
    const theMovieDbVideoUrl = `${THE_MOVIE_DB_URL}/${imDbId}/videos?api_key=${THE_MOVIE_DB_API_KEY}`;
    try {
        // Call the endpoint to retreive the actual URL
        const response = await makeRequest({
            url: theMovieDbVideoUrl,
            method: 'GET',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        });

        const trailers = response.body.results;
        const MOVIE_TYPE = 'Trailer';
        const SITE = 'YouTube';

        for (let i = 0; i < trailers.length; i += 1) {
            const videoResource = trailers[i];
            if (videoResource.type === MOVIE_TYPE && videoResource.site === SITE) {
                const trailerUrl = `${YOUTUBE_TRAILER_URL}?v=${videoResource.key}`;
                return trailerUrl;
            }
        }

        throw new Error({
            statusCode: 404,
            message: 'Error: No youtube trailer found for this movie.',
        });
    } catch (err) {
        logger.error(`Error received in getTrailerFromIMDBId. Call url: ${theMovieDbVideoUrl}`, err);
        throw err;
    }
};
