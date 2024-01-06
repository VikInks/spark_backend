import ImageModel from "../../model/image/image.model";

export const findImagesByUserId = async (userId: string) => {
    return ImageModel.find({ userId });
};

export const findImageByIdAndUserId = async (id: string, userId: string) => {
    return ImageModel.findOne({ _id: id, userId });
};

export const findImagesByParkingId = async (parkingId: string) => {
    return ImageModel.find({ parkingId });
};

export const findImagesByType = async (type: string) => {
    return ImageModel.find({ type });
};

export const updateImageDetails = async (imageId: string, updateData: any) => {
    return ImageModel.findByIdAndUpdate(imageId, updateData, { new: true });
};

export const findImageByNameAndUserId = async (name: string, userId: string) => {
    return ImageModel.findOne({ name, userId });
};

export const updateImageByIdAndUserId = async (id: string, userId: string, updateData: any) => {
    return ImageModel.findOneAndUpdate({ _id: id, userId }, updateData, { new: true });
};

export const deleteImageByIdAndUserId = async (id: string, userId: string) => {
    return ImageModel.findOneAndDelete({ _id: id, userId });
};

export const removeImagesByUserId = async (userId: string) => {
    return ImageModel.deleteMany({ userId });
};

export const removeImagesByParkingId = async (parkingId: string) => {
    return ImageModel.deleteMany({ parkingId });
};