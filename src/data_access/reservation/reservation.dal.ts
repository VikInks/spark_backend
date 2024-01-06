import {Reservation} from "../../model/reservation/reservation.model";

export const findReservationsByUserId = async (userId: string) => {
    return Reservation.find({ userId: userId });
};

export const findReservationById = async (reservationId: string) => {
    return Reservation.findById({ _id: reservationId });
}

export const createReservation = async (reservationData: any) => {
    return Reservation.create(reservationData);
};

export const updateReservationById = async (reservationId: string, updateData: any) => {
    return Reservation.findByIdAndUpdate(reservationId, updateData, { new: true });
};

export const deleteReservationById = async (reservationId: string) => {
    return Reservation.findByIdAndDelete(reservationId);
};
