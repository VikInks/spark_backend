import {Response} from "express";
import {contextType} from "../service/base/interface/contextType";


/**
 * Manages the cookie in the given context or response object.
 *
 * @param {contextType|Response} contextOrResponse - The context or response object.
 * @param {string} [token] - The JWT token.
 * @param {string} [action] - The action to perform.
 * @return {void}
 */
export function manageCookie(
    contextOrResponse: contextType | Response,
    token?: string,
    action?: string
): void {
    const response = (contextOrResponse as contextType).res || contextOrResponse as Response;

    // if the action is login and the user is already logged in, return
    if (action === 'login' && (contextOrResponse as contextType).user) return;

    // if the action is delete or logout, delete the cookie
    if (action === 'delete' || action === 'logout') {
        response.setHeader('Set-Cookie', 'jwt=; HttpOnly; Path=/; Max-Age=0');
        return;
    }

    let cookieValue: string;
    if (token) {
        cookieValue = `jwt=${encodeURIComponent(token)};`;
        cookieValue += ' HttpOnly; Path=/; Max-Age=3600';
    } else {
        cookieValue = 'HttpOnly; Path=/; Max-Age=0';
    }

    response.setHeader('Set-Cookie', cookieValue);
}
