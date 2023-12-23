import joi from 'joi';

const addImageValidation = joi.object({
    userId: joi.string().required(),
    parkingId: joi.string(),
    type: joi.string().valid('avatar', 'parking').required(),
    name: joi.string().required(),
});

const updateImageValidation = joi.object({
    userId: joi.string().required(),
    parkingId: joi.string(),
    type: joi.string().valid('avatar', 'parking'),
    name: joi.string(),
});

const deleteImageValidation = joi.object({
    id: joi.string().required(),
});

const queryContextValidation = joi.object({
    userId: joi.string().required(),
});

export const imageValidation = {
    addImageValidation,
    updateImageValidation,
    deleteImageValidation,
    queryContextValidation
}