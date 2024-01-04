import Joi from "joi";

const idReservationValidation = Joi.object({
    id: Joi.string().required(),
});

const createReservationValidation = Joi.object({
    userId: Joi.string().required(),
    parkingId: Joi.string().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    price: Joi.number().required(),
    status: Joi.string().required(),
});

const updateReservationValidation = Joi.object({
    userId: Joi.string(),
    parkingId: Joi.string(),
    startDate: Joi.date(),
    endDate: Joi.date(),
    price: Joi.number(),
    status: Joi.string(),
});

export const validationSchemas = {
    idReservationValidation,
    createReservationValidation,
    updateReservationValidation,
}