import {contextType} from "../base/interface/contextType";

/**
 * Sets the HTTP response status code and sends a JSON response with the given data.
 *
 * @param {number} status - The HTTP response status code.
 * @param {string} message - The message to be included in the response.
 * @param {boolean} success - Indicates whether the response is successful.
 * @param {contextType} context - The execution context for the Azure Function.
 */
export const respondWithStatus = (status: number, message: string, success: boolean, context: contextType) => {
    return context.res.status(status).json({success: success, message: message});
}