import {Parking, History} from "../../model/parking/parking.model";

/**
 * Find all parkings
 * @param userId
 */
export const findParkingsByUserId = async (userId: string) => {
    return Parking.find({userId: userId});
};

/**
 * Find parking by id
 * @param parkingId
 */
export const findParkingById = async (parkingId: string) => {
    return Parking.findById({_id: parkingId});
}

/**
 * Find parking by filter
 * @param filter
 */
export const findParkingByFilter = async (filter: any) => {
    return Parking.find(filter);
}

/**
 * Create a new parking
 * @param parkingData
 */
export const createParking = async (parkingData: any) => {
    return Parking.create(parkingData);
};

/**
 * Update parking by id
 * @param parkingId
 * @param updateData
 */
export const updateParkingById = async (parkingId: string, updateData: any) => {
    return Parking.findByIdAndUpdate(parkingId, updateData, {new: true});
};

/**
 * Delete parking by id
 * @param parkingId
 */
export const deleteParkingById = async (parkingId: string) => {
    return Parking.findByIdAndDelete(parkingId);
};

/**
 * Find parking by geo location
 * @param coordinates
 * @param radius
 */
export const findParkingByGeoLocation = async (coordinates: number[], radius: number) => {
    return Parking.find({
        geoLocation: {
            $near: {
                $geometry: {
                    type: "Point",
                    coordinates
                },
                $maxDistance: radius
            }
        }
    });
}

/**
 * Add parking evaluation
 * @param parkingId
 * @param evaluation
 */
export const addParkingEvaluation = async (parkingId: string, evaluation: any) => {
    return Parking.findByIdAndUpdate(
        parkingId,
        {$push: {evaluation}},
        {new: true}
    );
};

/**
 * Update parking active status
 * @param parkingId
 * @param isActive
 */
export const updateParkingActiveStatus = async (parkingId: string, isActive: boolean) => {
    return Parking.findByIdAndUpdate(
        parkingId,
        {active: isActive},
        {new: true}
    );
};

/**
 * Push parking to history
 * @param parking
 */
export const pushToHistoryParking = async (parking: any) => {
    const exist = await Parking.findById({_id: parking._id});
    if (exist) {
        await new History(parking.toObject()).save();
        return Parking.findByIdAndDelete(exist._id);
    }
    return null;
};

/**
 * Find parking history by owner id
 * @param parkingId
 */
export const findParkingHistoryByOwnerId = async (parkingId: string) => {
    return History.find({_id: parkingId});
};

/**
 * delete parking history by id
 * @param parkingId
 */
export const deleteParkingHistoryById = async (parkingId: string) => {
    return History.findByIdAndDelete({_id: parkingId});
}

/**
 * Find all parking history by user id
 * @param userId
 */
export const findAllParkingHistoryByUserId = async (userId: string) => {
    return History.find({userId: userId});
}