import {imageValidation} from "./data_validation/mutation.validation";
import ImageModel from "../model/image.model";
import {deleteImage, processAndSaveImage} from "../function.utils.resolver";
import {contextType} from "../../../base/interface/contextType";
import {validateAndResponse} from "../../../utils/validate.response";
import {exceptionHandler} from "../../../utils/exception.handler";
import {redisHandler} from "../../../utils/redis.handler";
import {respondWithStatus} from "../../../utils/respond.status";

export const resolvers = {
    Query: {
        images: async (_: any, __: any, context: contextType) => {
            return validateAndResponse(imageValidation.queryContextValidation, context, 'images', context, async () => {
                try {
                    const images = await ImageModel.find({userId: context.user});
                    await redisHandler(context, 'update', {image: [images]});
                    return respondWithStatus(200, 'images retrieved successfully', true, images.map((image) => image.toJSON()), context);
                } catch (e) {
                    exceptionHandler('images', e, context);
                }
            });
        },
        image: async (_: any, args: any, context: contextType) => {
            return validateAndResponse(imageValidation.deleteImageValidation, args, 'image', context, async () => {
                const image = await ImageModel.findOne({_id: args.id, userId: context.user});
                await redisHandler(context, 'update', {image: image});
                return respondWithStatus(200, 'image retrieved successfully', true, image?.toJSON(), context);
            });
        },
        count_parkingImages: async (_: any, __: any, context: contextType) => {
            return validateAndResponse(imageValidation.queryContextValidation, context, 'count_parkingImages', context, async () => {
                const count = await ImageModel.countDocuments({userId: context.user, type: 'parking'});
                await redisHandler(context, 'update', {count_parking: count});
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
                    exceptionHandler('addImage', e, context);
                }
                try {
                    const imagePath = await processAndSaveImage(args.image, context.user as string, args.name, args.type);
                    try {
                        await ImageModel.create({
                            userId: args.userId,
                            parkingId: args.parkingId ?? null,
                            type: args.type,
                            name: args.name,
                            image: imagePath,
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                        });
                    } catch (e) {
                        exceptionHandler('addImage', e, context);
                    }
                    try {
                        await redisHandler(context, 'update', {image: imagePath});
                    } catch (e) {
                        exceptionHandler('addImage', e, context);
                    }
                    return respondWithStatus(200, 'image added successfully', true, , context);
                } catch (e) {
                    exceptionHandler('addImage', e, context);
                }
            });
        },
        updateImage: async (_: any, args: any, context: contextType) => {
            return validateAndResponse(imageValidation.updateImageValidation, args, 'update', context, async () => {
                const exist = await ImageModel.findOne({userId: context.user, name: args.name});
                if (exist) respondWithStatus(400, 'Image name already exists', false, context);
                const imagePath = await processAndSaveImage(args.image, context.user as string, args.name, args.type);
                try {
                    await ImageModel.findOneAndUpdate({
                        _id: args.id,
                        userId: context.user
                    }, {
                        ...args,
                        image: imagePath,
                        updatedAt: new Date().toISOString()
                    }, {
                        new: true
                    });
                } catch (e) {
                    exceptionHandler('updateImage', e, context);
                }
                try {
                    await redisHandler(context, 'update', {image: imagePath});
                } catch (e) {
                    exceptionHandler('updateImage', e, context);
                }
                return respondWithStatus(200, 'image updated successfully', true, context);
            });
        },
        deleteImage: async (_: any, args: any, context: contextType) => {
            return validateAndResponse(imageValidation.deleteImageValidation, args, 'update', context, async () => {
                const image = await ImageModel.findOneAndDelete({
                    _id: args.id,
                    userId: context.user
                });
                await redisHandler(context, 'delete_one', {image: image?.toJSON().image});
                deleteImage(image?.toJSON().image as string);
                return respondWithStatus(200, 'image deleted successfully', true, context);
            });
        },
        deleteAllImages: async (_: any, __: any, context: contextType) => {
            return validateAndResponse(imageValidation.queryContextValidation, context, 'update', context, async () => {
                const images = await ImageModel.find({userId: context.user});
                await ImageModel.deleteMany({userId: context.user});
                await redisHandler(context, 'delete', {image: images.map((image) => image.toJSON().image)});
                deleteImage(images.map((image) => image.toJSON().image) as [string]);
                return respondWithStatus(200, 'images deleted successfully', true, context);
            });
        }
    }
}