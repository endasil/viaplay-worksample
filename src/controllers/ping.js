/**
 * Operations on /ping just an endpoint for testing
 */
module.exports = {
    get: function getPong(req, res, next) {
        res.send(200, `viaplay worksample is up ${new Date()}`);
        return next();
    },
};
