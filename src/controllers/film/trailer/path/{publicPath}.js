const filmLogic = require(`../../../../logic/filmLogic`);
const {
    VIAPLAY_CONTENT_URL
} = require(`../../../../utils/config`);

module.exports = {

    /**
     * Entrypoint for getting a trailer based on a viaplay public path value
     * @param req.params.publicPath public patg value for a viaplay movie resource.
     * @returns {Promise<*>}
     */
    get: async function getTrailer(req, res, next) {
        try {
            var viaplayResourceUrl = `${VIAPLAY_CONTENT_URL}/${req.params.publicPath.toLowerCase()}` ;

            // Call the function that has the actual logic for retrieving data then send
            // back the trailerUrl.
            const trailerUrl = await filmLogic.getTrailerUrl(viaplayResourceUrl);
            res.send(200, trailerUrl);
        } catch (err) {
            res.send(err.statusCode || 500, err.message);
        }
        return next();
    },
};
