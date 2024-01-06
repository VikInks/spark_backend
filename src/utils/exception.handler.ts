import {contextType} from "../service/base/interface/contextType";
import {respondWithStatus} from "./respond.status";

/**
 * Handles exceptions that occur during an operation.
 *
 * @param {string} operation - The description of the operation being performed.
 * @param {unknown} e - The exception object or value.
 * @param {contextType} context - The context object for the operation.
 */
export const exceptionHandler = (operation: string, e: unknown, context: contextType) => {
    console.log(e);
    const errorMessage = e instanceof Error ? e.message : 'Unknown error';
    return respondWithStatus(500, `Error while ${operation}: ${errorMessage}`, false, null, context);
};
