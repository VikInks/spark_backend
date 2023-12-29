import Joi from "joi";

const signUpValidationSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().min(8).max(30).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    active: Joi.boolean(),
    location: Joi.object({
        address: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        zip: Joi.string().required(),
        country: Joi.string().required(),
    }).required()
});

const loginValidationSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30),
    email: Joi.string().email(),
    password: Joi.string().min(8).max(30).required(),
});

const updateValidationSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30),
    password: Joi.string().min(8).max(30),
    email: Joi.string().email(),
    phone: Joi.string(),
    firstName: Joi.string(),
    lastName: Joi.string(),
    active: Joi.boolean(),
    location: Joi.object({
        address: Joi.string(),
        city: Joi.string(),
        state: Joi.string(),
        zip: Joi.string(),
        country: Joi.string(),
    })
});

const updatePasswordValidationSchema = Joi.object({
    password: Joi.string().min(8).max(30).required(),
});

const updateEmailValidationSchema = Joi.object({
    email: Joi.string().email().required(),
});

const updateLocationValidationSchema = Joi.object({
    location: Joi.object({
        address: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        zip: Joi.string().required(),
        country: Joi.string().required(),
    })
});

const updateCarsValidationSchema = Joi.object({
    cars: Joi.object({
        list: Joi.array().items(Joi.object({
            type: Joi.string().required(),
            plug: Joi.string().required(),
        })),
    }),
});

const updateActiveValidationSchema = Joi.object({
    active: Joi.boolean().required(),
});

/**
 * Variable representing a collection of validation schemas for different actions.
 *
 * @type {Object}
 * @property {Object} signUpValidationSchema - The validation schema for sign up action.
 * @property {Object} loginValidationSchema - The validation schema for login action.
 * @property {Object} updateValidationSchema - The validation schema for update action.
 * @property {Object} updatePasswordValidationSchema - The validation schema for updating password action.
 * @property {Object} updateEmailValidationSchema - The validation schema for updating email action.
 * @property {Object} updateLocationValidationSchema - The validation schema for updating location action.
 * @property {Object} updateActiveValidationSchema - The validation schema for updating active status action.
 */
export const validationSchemas = {
    signUpValidationSchema,
    loginValidationSchema,
    updateValidationSchema,
    updatePasswordValidationSchema,
    updateEmailValidationSchema,
    updateLocationValidationSchema,
    updateCarsValidationSchema,
    updateActiveValidationSchema,
};