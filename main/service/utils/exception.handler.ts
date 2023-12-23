import {contextType} from "../base/interface/contextType";

/**
 * Handles exceptions that occur during an operation.
 *
 * @param {string} operation - The description of the operation being performed.
 * @param {unknown} e - The exception object or value.
 * @param {contextType} context - The context object for the operation.
 */
export const exceptionHandler = (operation: string, e: unknown, context: contextType) => {
    if (e instanceof Error) {
        console.log(e);
        return context.res.status(500).json({success: false, message: `Error while ${operation}: ${e.message}`});
    } else {
        console.log(e);
        return context.res.status(500).json({success: false, message: `Error while ${operation}: ${e}`});
    }
}