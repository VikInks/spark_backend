import {Parking, History} from "../../model/parking/parking.model";


export const findParkingsByUserId = async (userId: string) => {
    return Parking.find({userId: userId});
};

export const findParkingById = async (parkingId: string) => {
    return Parking.findById({_id: parkingId});
}

export const findParkingByFilter = async (filter: any) => {
    return Parking.find(filter);
}

export const createParking = async (parkingData: any) => {
    return Parking.create(parkingData);
};

export const updateParkingById = async (parkingId: string, updateData: any) => {
    return Parking.findByIdAndUpdate(parkingId, updateData, {new: true});
};

export const deleteParkingById = async (parkingId: string) => {
    return Parking.findByIdAndDelete(parkingId);
};

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

export const addParkingEvaluation = async (parkingId: string, evaluation: any) => {
    return Parking.findByIdAndUpdate(
        parkingId,
        {$push: {evaluation}},
        {new: true}
    );
};

export const updateParkingActiveStatus = async (parkingId: string, isActive: boolean) => {
    return Parking.findByIdAndUpdate(
        parkingId,
        {active: isActive},
        {new: true}
    );
};

export const pushToHistoryParking = async (parking: any) => {
    const exist = await Parking.findById({_id: parking._id});
    if (exist) {
        await new History(parking.toObject()).save();
        return Parking.findByIdAndDelete(exist._id);
    }
    return null;
};

export const findParkingHistoryByOwnerId = async (parkingId: string) => {
    return History.find({_id: parkingId});
};

export const deleteParkingHistoryById = async (parkingId: string) => {
    return History.findByIdAndDelete({_id: parkingId});
}

export const findAllParkingHistoryByUserId = async (userId: string) => {
    return History.find({userId: userId});
}