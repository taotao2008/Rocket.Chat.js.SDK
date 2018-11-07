/**
 * @module methodCache
 * Manages results cache for calls to server (via LRU cache)
 */
import LRU from 'lru-cache';
import { logger } from './log';
/** @TODO: Remove ! post-fix expression when TypeScript #9619 resolved */
export let instance;
export const results = new Map();
export const defaults = {
    max: 100,
    maxAge: 300 * 1000
};
/**
 * Set the instance to call methods on, with cached results.
 * @param instanceToUse Instance of a class
 */
export function use(instanceToUse) {
    instance = instanceToUse;
}
/**
 * Setup a cache for a method call.
 * @param method Method name, for index of cached results
 * @param options.max Maximum size of cache
 * @param options.maxAge Maximum age of cache
 */
export function create(method, options = {}) {
    options = Object.assign(defaults, options);
    results.set(method, new LRU(options));
    return results.get(method);
}
/**
 * Get results of a prior method call or call and cache.
 * @param method Method name, to call on instance in use
 * @param key Key to pass to method call and save results against
 */
export async function call(method, key) {
    if (!results.has(method))
        create(method); // create as needed
    const methodCache = results.get(method);
    if (methodCache.has(key)) {
        logger.debug(`[cache] Returning cached ${method}(${key})`);
        // return from cache if key has been used on method before
        return methodCache.get(key);
    }
    // call and cache for next time, returning results
    logger.debug(`[${method}] Caching new results of ${method}(${key})`);
    const result = await Promise.resolve(instance.call(method, key));
    methodCache.set(key, result);
    return result;
}
/**
 * Proxy for checking if method has been cached.
 * Cache may exist from manual creation, or prior call.
 * @param method Method name for cache to get
 */
export function has(method) {
    return results.has(method);
}
/**
 * Get results of a prior method call.
 * @param method Method name for cache to get
 * @param key Key for method result set to return
 */
export function get(method, key) {
    if (results.has(method))
        return results.get(method).get(key);
}
/**
 * Reset a cached method call's results (all or only for given key).
 * @param method Method name for cache to clear
 * @param key Key for method result set to clear
 */
export function reset(method, key) {
    if (results.has(method)) {
        if (key)
            return results.get(method).del(key);
        else
            return results.get(method).reset();
    }
}
/** Reset cached results for all methods. */
export function resetAll() {
    results.forEach((cache) => cache.reset());
}
//# sourceMappingURL=methodCache.js.map