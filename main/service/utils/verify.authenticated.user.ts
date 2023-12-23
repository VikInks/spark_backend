import {contextType} from "../base/interface/contextType";

/**
 * Verifies if the user is authenticated.
 *
 * @param {contextType} context - The context object containing user information.
 * @throws {Error} - Throws an error if the user is not authenticated.
 * @returns {string} - Returns the user ID if the user is authenticated.
 */
export function verifyAuthenticatedUser(context: contextType): string {
    if (!context.user) throw new Error('You are not authenticated!');
    return context.user;
}