import Joi from "joi";
import {contextType} from "../service/base/interface/contextType";
import {validateInput} from "./validate.input";
import {exceptionHandler} from "./exception.handler";

/**
 * Validates input data against a given schema and then calls a callback function.
 * If the validation succeeds and a callback function is provided, the callback is called and its return value is returned.
 * If the validation fails or an error occurs during the callback execution, an exception handler is called and its return value is returned.
 *
 * @param {Joi.ObjectSchema<any> | null} schema - The validation schema or null if no validation is required.
 * @param {any} data - The input data to be validated against the schema.
 * @param {string} operation - The name of the operation for error logging.
 * @param {contextType} context - The context or state related to the operation.
 * @param {() => Promise<any>} callback - The callback function to be executed if validation succeed.
 */
export const validateAndResponse = async (schema: Joi.ObjectSchema<any> | null, data: any, operation: string, context: contextType, callback: () => Promise<any>) => {
    try {
        if (schema && data) {
            const val = validateInput(schema, data, context);
            if(!val) return;
        }
        return await callback();
    } catch (e) {
        console.log(`validate and response error: ${e}`);
        return exceptionHandler(operation, e, context);
    }
}