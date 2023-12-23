import {getRedisClient} from "./redis/redis";
import {NextFunction, Request, Response} from "express";

/**
 * Cleans the session data by removing the user's password from the session object, if present.
 *
 * @param {Object} sessionData - The session data object to clean.
 * @return {Object} - The cleaned session data object.
 */
function cleanSessionData(sessionData: any) {
    const cleanedSession = { ...sessionData };
    if (!cleanedSession.user) {
        return cleanedSession;
    }
    delete cleanedSession.user.password;
    return cleanedSession;
}

/**
 * Validates the provided user ID.
 *
 * @param {string} userId - The user ID to be validated.
 * @param {Response} res - The response object to send the error message if the user ID is not valid.
 *
 * @return {boolean} - Returns true if the user ID is valid, false otherwise.
 */
function validateUserId(userId: string, res: Response): boolean {
    if (!userId) {
        res.status(401).send('Unauthorized');
        return false;
    }
    return true;
}

/**
 * Extracts the session ID from the request headers.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {string|null} - The session ID if found, otherwise null.
 */
function extractSessionId(req: Request, res: Response): string | null {
    const sessionId = req.headers.cookie?.split(';').find(c => c.trim().startsWith('sid='))?.split('=')[1];
    if (!sessionId) {
        res.status(401).send('Unauthorized');
        return null;
    }
    return sessionId;
}

/**
 * Deletes the session for a user if unauthorized.
 * @param {string} userId - The user ID.
 * @param {ReturnType<typeof getRedisClient>} redisClient - The Redis client.
 * @param {Response} res - The response object.
 * @return {Promise<boolean>} Returns true if the session exists and is authorized, false otherwise.
 */
async function deleteSessionIfUnauthorized(userId: string, redisClient: ReturnType<typeof getRedisClient>, res: Response): Promise<boolean> {
    const sessionExists = await redisClient.get(userId);
    if (!sessionExists) {
        await redisClient.del(userId);  // Supprime la session si non autorisée
        res.status(401).send('Unauthorized');
        return false;
    }
    return true;
}

async function deleteSession(userId: string, redisClient: ReturnType<typeof getRedisClient>) {
    await redisClient.del(userId);
}

/**
 * Watches the session for a given user ID and updates the session data with the provided data.
 * If the user ID is not valid, it returns without making any changes to the session data.
 *
 * @param {string} userId - The ID of the user whose session is being watched.
 * @param {any} updatedSessionData - The updated session data to be applied.
 * @param {string?} action - The action to perform on the session.
 * @return {Function} - The session watcher middleware function.
 */
export function SessionWatcher(userId: string, updatedSessionData: any, action?: string) : Function {
    /**
     * Watches the session for a given user ID and updates the session data with the provided data.
     * If the user ID is not valid, it returns without making any changes to the session data.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     * @param {NextFunction} next - The next function.
     * @return {Promise<void>} - A promise that resolves when the session is updated, or rejects with an error.
     */
    return async function (req: Request, res: Response, next: NextFunction): Promise<void> {
        if(action === 'delete') {
            const redisClient = getRedisClient();
            await deleteSession(userId, redisClient);
            return;
        }

        if (!validateUserId(userId, res)) return;

        const sessionId = extractSessionId(req, res);
        if (!sessionId) {
            await deleteSessionIfUnauthorized(userId, getRedisClient(), res);
            return;
        }

        const redisClient = getRedisClient();
        try {
            const sessionValid = await deleteSessionIfUnauthorized(userId, redisClient, res);
            if (!sessionValid) return;

            const cleanedSession = cleanSessionData(updatedSessionData);
            await redisClient.set(userId, JSON.stringify(cleanedSession));
            next();
        } catch (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        }
    };
}