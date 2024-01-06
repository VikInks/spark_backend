import Joi from "joi";
import {contextType} from "../service/base/interface/contextType";
import {exceptionHandler} from "./exception.handler";

/**
 * Validates the input data against a given schema.
 *
 * @param {Joi.ObjectSchema<any>} schema - The schema to validate against.
 * @param {any} data - The input data to validate.
 * @param context
 * @throws {Error} If the validation fails, an error with the validation details will be thrown.
 */
export function validateInput(schema: Joi.ObjectSchema<any>, data: any, context: contextType) {
    const {error} = schema.validate(data);
    if (error) {
        exceptionHandler('validateInput', error, context);
        return false;
    }
    return true;
}