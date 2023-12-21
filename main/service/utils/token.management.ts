import {Response} from "express";
import {ContextType} from "../base/interface/context.type";


/**
 * Manages the cookie in the given context or response object.
 *
 * @param {ContextType|Response} contextOrResponse - The context or response object.
 * @param {string} [token] - The JWT token.
 * @param {string} [sessionId] - The session ID.
 * @param {string} [action] - The action to perform.
 * @return {void}
 */
export function manageCookie(
    contextOrResponse: ContextType | Response,
    token?: string,
    sessionId?: string,
    action?: string
): void {
    const response = (contextOrResponse as ContextType).res || contextOrResponse as Response;

    // if the action is login and the user is already logged in, return
    if (action === 'login' && (contextOrResponse as ContextType).user) return;

    // if the action is delete or logout, delete the cookie
    if (action === 'delete' || action === 'logout') {
        response.setHeader('Set-Cookie', 'jwt=; HttpOnly; Path=/; Max-Age=0');
        return;
    }

    // if no session ID is provided, extract it from the request object to check if it exists
    if (!sessionId) {
        const request = (contextOrResponse as ContextType).req;
        sessionId = request.headers.cookie?.split(';').find(c => c.trim().startsWith('sid='))?.split('=')[1];
    }

    const cookieValue = token ?
        `jwt=${token};
        ${sessionId ? `sid=${sessionId};` : ''}
        HttpOnly; 
        Path=/; 
        Max-Age=${60 * 60}`
        :
        'HttpOnly; ' +
        'Path=/; ' +
        'Max-Age=0';

    response.setHeader('Set-Cookie', cookieValue);
}
