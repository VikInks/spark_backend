import ImageModel from "../../model/image/image.model";

/**
 * Find all images
 * @param userId
 */
export const findImagesByUserId = async (userId: string) => {
    return ImageModel.find({ userId });
};

/**
 * Find image by id
 * @param id
 * @param userId
 */
export const findImageByIdAndUserId = async (id: string, userId: string) => {
    return ImageModel.findOne({ _id: id, userId });
};

/**
 * Find images by parking id
 * @param parkingId
 */
export const findImagesByParkingId = async (parkingId: string) => {
    return ImageModel.find({ parkingId });
};

/**
 * Find images by type
 * @param type
 */
export const findImagesByType = async (type: string) => {
    return ImageModel.find({ type });
};

/**
 * Find image by name and user id
 * @param name
 * @param userId
 */
export const findImageByNameAndUserId = async (name: string, userId: string) => {
    return ImageModel.findOne({ name: name, userId: userId });
};

/**
 * Find image by id and user id
 * @param id
 * @param userId
 * @param updateData
 */
export const updateImageByIdAndUserId = async (id: string, userId: string, updateData: any) => {
    return ImageModel.findOneAndUpdate({ _id: id, userId }, updateData, { new: true });
};

/**
 * Delete image by id and user id
 * @param id
 * @param userId
 */
export const deleteImageByIdAndUserId = async (id: string, userId: string) => {
    return ImageModel.findOneAndDelete({ _id: id, userId });
};

/**
 * Count images by user id
 * @param userId
 */
export const countParkingImagesByUserId = async (userId: string) => {
    return ImageModel.countDocuments({ userId, type: 'parking' });
}

/**
 * create a new image
 * @param imageData
 */
export const createImage = async (imageData: any) => {
    return ImageModel.create(imageData);
}