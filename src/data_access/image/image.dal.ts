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

export const findImageByNameAndUserId = async (name: string, userId: string) => {
    return ImageModel.findOne({ name: name, userId: userId });
};

export const updateImageByIdAndUserId = async (id: string, userId: string, updateData: any) => {
    return ImageModel.findOneAndUpdate({ _id: id, userId }, updateData, { new: true });
};

export const deleteImageByIdAndUserId = async (id: string, userId: string) => {
    return ImageModel.findOneAndDelete({ _id: id, userId });
};

export const countParkingImagesByUserId = async (userId: string) => {
    return ImageModel.countDocuments({ userId, type: 'parking' });
}

export const createImage = async (imageData: any) => {
    return ImageModel.create(imageData);
}