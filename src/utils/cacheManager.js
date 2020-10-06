// This file is a wrapper around node-cache
const NodeCache = require('node-cache');

const cache = new NodeCache();
let defaultCacheTtl = 0;

exports.get = function get(key) {
    return cache.get(key);
};
/**
 *  Clears the cache
 */
exports.flushAll = function flushAll() {
    cache.flushAll();
};

/**
 * Set a value in cache

 */

/**
 *
 * @param urlKey Key to use when looking up a cache value
 * @param cacheObj The actual object to store in cache
 * @param timeToLiveInSeconds  Set time to live in seconds for the cached object.
 * If undefined ttl will be set by defaultCacheTtl values.
 */
exports.set = function set(urlKey, cacheObj, timeToLiveInSeconds) {
    let ttl = timeToLiveInSeconds;
    if (!ttl) {
        ttl = defaultCacheTtl;
    }
    if (cacheObj) {
        cache.set(urlKey, cacheObj, ttl);
    }
};
exports.getCacheTtl = function getCacheTtl(cacheKey) {
    return cache.getTtl(cacheKey);
};

/**
 * Set the default time to live in seconds for cached objects.
 * @param ttl Seconds for the cache to live.
 * @param flushCache if set, delete all cache content when changing ttl.
 * @returns {number}
 */
exports.setDefaultCacheTtl = function setDefaultCacheTtl(ttl, flushCache) {
    if (flushCache) {
        cache.flushAll();
    }

    defaultCacheTtl = ttl;

    // Test setting cache value
    cache.set('TTLTest', 'TTLTest', ttl);
    const time = cache.getTtl('TTLTest');
    if (Number.isNaN(time)) {
        throw Error('"ttl" is not a valid cache time.');
    }
    return time;
};
