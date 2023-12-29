import {contextType} from "../base/interface/contextType";
import {respondWithStatus} from "./respond.status";

/**
 * Verifies if the user is authenticated.
 *
 * @param {contextType} context - The context object containing user information.
 * @throws {Error} - Throws an error if the user is not authenticated.
 */
export function verifyAuthenticatedUser(context: contextType) {
    if (!context.user) return respondWithStatus(401, 'Unauthorized', false, null, context)
    return context.user;
}