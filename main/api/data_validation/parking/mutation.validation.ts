import Joi from "joi";

const getParkingValidationSchema = Joi.object({
    id: Joi.string().required(),
});

const moveToHistoryValidationSchema = Joi.object({
    id: Joi.string().required(),
    status: Joi.string().valid('canceled', 'completed').required(),
});

const getParkingsValidationSchema = Joi.object({
    filter: Joi.object({
        ownerId: Joi.string(),
        price: Joi.number(),
        geoLocation: Joi.object({
            coordinates: Joi.array().items(Joi.number()),
            radius: Joi.number(),
        }),
        evaluation: Joi.object({
            userId: Joi.string(),
            rating: Joi.number(),
        }),
        capacity: Joi.number(),
    })
});

const createParkingValidationSchema = Joi.object({
    ownerId: Joi.string().required(),
    name: Joi.string().required(),
    price: Joi.number().required(),
    geoLocation: Joi.object({
        type: Joi.string().default('Point'),
        coordinates: Joi.array().items(Joi.number()).required(),
    }),
    description: Joi.string,
    imagePaths: Joi.array().items(Joi.string()),
    capacity: Joi.number().required(),
    active: Joi.boolean().default(true),
});

const updateParkingValidationSchema = Joi.object({
    id: Joi.string().required(),
    parking: Joi.object({
        ownerId: Joi.string(),
        name: Joi.string(),
        price: Joi.number(),
        geoLocation: Joi.object({
            type: Joi.string().default('Point'),
            coordinates: Joi.array().items(Joi.number()),
        }),
        description: Joi.string,
        imagePaths: Joi.array().items(Joi.string()),
        capacity: Joi.number(),
        active: Joi.boolean(),
    }),

});

export const validationSchemas = {
    getParkingValidationSchema,
    moveToHistoryValidationSchema,
    getParkingsValidationSchema,
    createParkingValidationSchema,
    updateParkingValidationSchema,
}