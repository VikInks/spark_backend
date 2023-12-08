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

export const validationSchemas = {
    signUpValidationSchema,
    loginValidationSchema,
    updateValidationSchema,
    updatePasswordValidationSchema,
    updateEmailValidationSchema,
    updateLocationValidationSchema,
};