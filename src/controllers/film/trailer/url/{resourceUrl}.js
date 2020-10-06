const filmLogic = require('../../../../logic/filmLogic');

module.exports = {

    /**
     * Entrypoint for getting a trailer based on a viaplay resource url
     * @param req.params.resourceUrl url to a viaplay movie resource.
.     * @param next
     * @returns {Promise<*>}
     */
    get: async function getTrailerByUrl(req, res, next) {
        try {
            // Call the function that has the actual logic for retrieving data then send
            // back the trailerUrl.
            const trailerUrl = await filmLogic.getTrailerUrl(req.params.resourceUrl.toLowerCase());
            res.send(200, trailerUrl);
        } catch (err) {
            res.send(err.statusCode || 500, err.message);
        }
        return next();
    },
};
