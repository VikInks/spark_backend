import {ContextType} from "../base/interface/context.type";

/**
 * Verifies if the user is authenticated.
 *
 * @param {ContextType} context - The context object containing user information.
 * @throws {Error} - Throws an error if the user is not authenticated.
 * @returns {string} - Returns the user ID if the user is authenticated.
 */
export function verifyAuthenticatedUser(context: ContextType): string {
    if (!context.user) throw new Error('You are not authenticated!');
    return context.user;
}