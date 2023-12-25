import Joi from "joi";

const getParkingValidationSchema = Joi.object({
    id: Joi.string().required(),
});


export const validationSchemas = {
    getParkingValidationSchema,
}