import Joi from "joi";

/**
 * Validates the input data against a given schema.
 *
 * @param {Joi.ObjectSchema<any>} schema - The schema to validate against.
 * @param {any} data - The input data to validate.
 * @throws {Error} If the validation fails, an error with the validation details will be thrown.
 */
export function validateInput(schema: Joi.ObjectSchema<any>, data: any) {
    const {error} = schema.validate(data);
    if (error) throw new Error(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
}