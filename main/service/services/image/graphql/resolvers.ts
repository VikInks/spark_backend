import { imageValidation } from "./data_validation/mutation.validation";
import ImageModel from "../model/image.model";
import {processAndSaveImage} from "../function.utils.resolver";

interface contextType {
    userId: string
}

export const resolvers = {
    Query: {
        images: async (parent: any, args: any, context: contextType) => {
            if(imageValidation.queryContextValidation.validate(context).error) throw new Error('Invalid context');
            return await ImageModel.find({ userId: context.userId });
        },
        image: async (parent: any, args: any, context: contextType) => {
            if(imageValidation.deleteImageValidation.validate(args).error) throw new Error('Invalid args');
            return await ImageModel.findOne({ _id: args.id, userId: context.userId });
        },
        count_parkingImages: async (parent: any, args: any, context: contextType) => {
            if(imageValidation.queryContextValidation.validate(context).error) throw new Error('Invalid context');
            return await ImageModel.countDocuments({ userId: context.userId, type: 'parking' });
        }
    },
    Mutation: {
        createImage: async (parent: any, args: any, context: contextType) => {
            if(imageValidation.addImageValidation.validate(args).error) throw new Error('Invalid args');
            const exist = await ImageModel.findOne({ userId: context.userId, name: args.name });
            if (exist) throw new Error('Image name already exists');
            const imagePath = await processAndSaveImage(args.image, context.userId, args.name);
            return await ImageModel.create({
                userId: args.userId,
                parkingId: args.parkingId ?? null,
                type: args.type,
                name: args.name,
                image: imagePath,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            });
        },
        updateImage: async (parent: any, args: any, context: contextType) => {
            if(imageValidation.updateImageValidation.validate(args).error) throw new Error('Invalid args');
            const exist = await ImageModel.findOne({ userId: context.userId, name: args.name });
            if (exist) throw new Error('Image name already exists');
            const imagePath = await processAndSaveImage(args.image, context.userId, args.name);
            return await ImageModel.findOneAndUpdate({
                _id: args.id,
                userId: context.userId
            }, {
                ...args,
                image: imagePath,
                updatedAt: new Date().toISOString()
            }, {
                new: true
            });
        },
        deleteImage: async (parent: any, args: any, context: contextType) => {
            if(imageValidation.deleteImageValidation.validate(args).error) throw new Error('Invalid args');
            return await ImageModel.findOneAndDelete({
                _id: args.id,
                userId:
                context.userId
            });
        }
    }
}