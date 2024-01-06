import {Reservation} from "../../model/reservation/reservation.model";

/**
 * Find all reservations by user id
 * @param userId
 */
export const findReservationsByUserId = async (userId: string) => {
    return Reservation.find({ userId: userId });
};

/**
 * Find all reservations by id
 * @param reservationId
 */
export const findReservationById = async (reservationId: string) => {
    return Reservation.findById({ _id: reservationId });
}

/**
 * create a new reservation
 * @param reservationData
 */
export const createReservation = async (reservationData: any) => {
    return Reservation.create(reservationData);
};

/**
 * update reservation by id
 * @param reservationId
 * @param updateData
 */
export const updateReservationById = async (reservationId: string, updateData: any) => {
    return Reservation.findByIdAndUpdate(reservationId, updateData, { new: true });
};

/**
 * delete reservation by id
 * @param reservationId
 */
export const deleteReservationById = async (reservationId: string) => {
    return Reservation.findByIdAndDelete(reservationId);
};
