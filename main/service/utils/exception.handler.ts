import {contextType} from "../base/interface/contextType";
import {respondWithStatus} from "./respond.status";

/**
 * Handles exceptions that occur during an operation.
 *
 * @param {string} operation - The description of the operation being performed.
 * @param {unknown} e - The exception object or value.
 * @param {contextType} context - The context object for the operation.
 */
export const exceptionHandler = (operation: string, e: unknown, context: contextType)  => {
    if (e instanceof Error) {
        console.log(e);
        respondWithStatus(500, `Error while ${operation}: ${e.message}`, false, null, context);
    } else {
        console.log(e);
        respondWithStatus(500, `Error while ${operation}: ${e}`, false, null, context);
    }
}