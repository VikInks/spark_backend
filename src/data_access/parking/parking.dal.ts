import {Parking, History} from "../../model/parking/parking.model";


export const findParkingsByUserId = async (userId: string) => {
    return Parking.find({ userId });
};

export const createParking = async (parkingData: any) => {
    return Parking.create(parkingData);
};

export const updateParkingById = async (parkingId: string, updateData: any) => {
    return Parking.findByIdAndUpdate(parkingId, updateData, { new: true });
};

export const deleteParkingById = async (parkingId: string) => {
    return Parking.findByIdAndDelete(parkingId);
};

export const findParkingByGeoLocation = async (coordinates: number[], radius: number) => {
    return Parking.find( {
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

export const addParkingEvaluation = async (parkingId: string, evaluation: any) => {
    return Parking.findByIdAndUpdate(
        parkingId,
        { $push: { evaluation } },
        { new: true }
    );
};

export const updateParkingActiveStatus = async (parkingId: string, isActive: boolean) => {
    return Parking.findByIdAndUpdate(
        parkingId,
        { active: isActive },
        { new: true }
    );
};

export const archiveParking = async (parkingId: string) => {
    const parking = await Parking.findById(parkingId);
    if (parking) {
        await new History(parking.toObject()).save();
        return Parking.findByIdAndDelete(parkingId);
    }
    return null;
};

export const findParkingHistoryByOwnerId = async (ownerId: string) => {
    return History.find({ ownerId });
};