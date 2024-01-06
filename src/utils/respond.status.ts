import {contextType} from "../service/base/interface/contextType";

/**
 * Sets the HTTP response status code and sends a JSON response with the given data.
 *
 * @param {number} status - The HTTP response status code.
 * @param {string} message - The message to be included in the response.
 * @param {boolean} success - Indicates whether the response is successful.
 * @param data
 * @param {contextType} context - The execution context for the Azure Function.
 */
export const respondWithStatus = (status: number, message: string, success: boolean, data: any, context: contextType) => {
    console.trace();
    console.log('respondWithStatus: ', status, message, success, data);
    context.res.status(status);
    return {success: success, message: message, data: data};
}