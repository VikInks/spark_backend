import {imageValidation} from "./data_validation/mutation.validation";
import ImageModel from "../model/image.model";
import {deleteImage, processAndSaveImage} from "../function.utils.resolver";
import {contextType} from "../../../base/interface/contextType";
import {validateAndResponse} from "../../../utils/validate.response";
import {exceptionHandler} from "../../../utils/exception.handler";
import {respondWithStatus} from "../../../utils/respond.status";

export const resolvers = {
    Query: {
        images: async (_: any, __: any, context: contextType) => {
            return validateAndResponse(imageValidation.queryContextValidation, context, 'images', context, async () => {
                try {
                    const images = await ImageModel.find({userId: context.user});
                    return respondWithStatus(200, 'images retrieved successfully', true, images.map((image) => image.toJSON()), context);
                } catch (e) {
                    return exceptionHandler('images', e, context);
                }
            });
        },
        image: async (_: any, args: any, context: contextType) => {
            return validateAndResponse(imageValidation.deleteImageValidation, args, 'image', context, async () => {
                const image = await ImageModel.findOne({_id: args.id, userId: context.user});
                return respondWithStatus(200, 'image retrieved successfully', true, image?.toJSON(), context);
            });
        },
        count_parkingImages: async (_: any, __: any, context: contextType) => {
            return validateAndResponse(imageValidation.queryContextValidation, context, 'count_parkingImages', context, async () => {
                const count = await ImageModel.countDocuments({userId: context.user, type: 'parking'});
                return respondWithStatus(200, 'parking images count retrieved successfully', true, count, context);
            });
        }
    },
    Mutation: {
        addImage: async (_: any, args: any, context: contextType) => {
            return validateAndResponse(imageValidation.addImageValidation, args, 'createImage', context, async () => {
                try {
                    const exist = await ImageModel.findOne({userId: context.user, name: args.name});
                    if (exist) respondWithStatus(400, 'Image name already exists', false, null, context);
                } catch (e) {
                    return exceptionHandler('addImage', e, context);
                }
                try {
                    const imagePath = await processAndSaveImage(args.image, context.user as string, args.name, args.type);
                    try {
                        await ImageModel.create({
                            userId: args.userId,
                            parkingId: args.parkingId ?? null,
                            type: args.type,
                            name: args.name,
                            image: imagePath
                        });
                    } catch (e) {
                        return exceptionHandler('addImage', e, context);
                    }
                    return respondWithStatus(200, 'image added successfully', true, null, context);
                } catch (e) {
                    return exceptionHandler('addImage', e, context);
                }
            });
        },
        updateImage: async (_: any, args: any, context: contextType) => {
            return validateAndResponse(imageValidation.updateImageValidation, args, 'update', context, async () => {
                try {
                    const exist = await ImageModel.findOne({userId: context.user, name: args.name});
                    if (exist) respondWithStatus(400, 'Image name already exists', false, null, context);
                } catch (e) {
                    return exceptionHandler('updateImage', e, context);
                }
                try {
                    const imagePath = await processAndSaveImage(args.image, context.user as string, args.name, args.type);
                    try {
                        await ImageModel.findOneAndUpdate({_id: args.id, userId: context.user}, {
                            ...args,
                            image: imagePath,
                        }, {new: true});
                        return respondWithStatus(200, 'image updated successfully', true, imagePath, context);
                    } catch (e) {
                        return exceptionHandler('updateImage', e, context);
                    }
                } catch (e) {
                    return exceptionHandler('updateImage', e, context);
                }
            });
        },
        deleteImage: async (_: any, args: any, context: contextType) => {
            return validateAndResponse(imageValidation.deleteImageValidation, args, 'update', context, async () => {
                try {
                    const image = await ImageModel.findOneAndDelete({_id: args.id, userId: context.user});
                    deleteImage(image?.toJSON().image as string);
                    return respondWithStatus(200, 'image deleted successfully', true, image?.toJSON(), context);
                } catch (e) {
                    return exceptionHandler('deleteImage', e, context);
                }
            });
        },
        deleteAllImages: async (_: any, __: any, context: contextType) => {
            return validateAndResponse(imageValidation.queryContextValidation, context, 'update', context, async () => {
                let images;
                try {
                    images = await ImageModel.find({userId: context.user});
                    try {
                        await ImageModel.deleteMany({userId: context.user});
                        deleteImage(images?.map((image) => image.toJSON().image) as [string]);
                        return respondWithStatus(200, 'images deleted successfully', true, null, context);
                    } catch (e) {
                        return exceptionHandler('deleteAllImages', e, context);
                    }
                } catch (e) {
                    return exceptionHandler('deleteAllImages', e, context);
                }
            });
        }
    }
}