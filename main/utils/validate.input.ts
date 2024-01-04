import Joi from "joi";
import {contextType} from "../service/base/interface/contextType";

/**
 * Validates the input data against a given schema.
 *
 * @param {Joi.ObjectSchema<any>} schema - The schema to validate against.
 * @param {any} data - The input data to validate.
 * @throws {Error} If the validation fails, an error with the validation details will be thrown.
 */
export function validateInput(schema: Joi.ObjectSchema<any>, data: any, context: contextType) {
    const {error} = schema.validate(data);
    // todo : modifier pour utiliser le contexte res afin de renvoyer une erreur 400
    if (error) throw new Error(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
}