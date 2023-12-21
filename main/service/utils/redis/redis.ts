import session from 'express-session';
import connectRedis from 'connect-redis';
import {createClient} from "redis";

const REDIS_URL = 'redis://redis-server:6379';
const SESSION_SECRET = 'your-session-secret';

let redisClient = createClient({ url: REDIS_URL });

/**
 * Configures Redis client and returns a new connectRedis instance.
 *
 * @returns {Promise<connectRedis>} A promise that resolves to a new connectRedis instance.
 */
export async function configureRedis() {
    await redisClient.connect().then(() => console.log('Connected to Redis'));
    return new connectRedis({ client: redisClient });
}

/**
 * Returns the Redis client.
 *
 * @throws {Error} Throws an error if the Redis client is not initialized.
 *
 * @return {RedisClient} The Redis client instance.
 */
export function getRedisClient() {
    if (!redisClient) throw new Error('Redis client not initialized!');
    return redisClient;
}

/**
 * Configures the session middleware for Express.js using Redis as the session store.
 *
 * @param {connectRedis} redisStore - The Redis session store.
 * @return {function} - The configured session middleware.
 */
export function configureSession(redisStore: connectRedis) {
    return session({
        store: redisStore,
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: false,
            maxAge: 60 * 60 * 1000 // 1 hour
        }
    });
}