import {validateAndResponse} from "../../../utils/validate.response";
import {validationSchemas} from "../../data_validation/reservation/mutation.validation";
import {exceptionHandler} from "../../../utils/exception.handler";
import {respondWithStatus} from "../../../utils/respond.status";
import {contextType} from "../../../service/base/interface/contextType";
import {
    createReservation, deleteReservationById,
    findReservationById,
    findReservationsByUserId, updateReservationById
} from "../../../data_access/reservation/reservation.dal";

type reservationType = {
    userId?: string,
}

type reservationMutationType = {
    userId: string,
    parkingId: string,
    startDate: Date,
    endDate: Date,
    price: string,
    status: string,
}

export const resolvers = {
    Query: {
        reservations: async (_: any, args: reservationType, context: contextType) => {
            return validateAndResponse(validationSchemas.idReservationValidation, args, 'get reservations', context,
                async () => {
                    if(!args.userId) return exceptionHandler('User is required', 400, context);
                    try {
                        const reservations = await findReservationsByUserId(args.userId);
                        return respondWithStatus(200, 'Reservations from Redis', true, reservations.map((reservation) => reservation.toJSON()), context);
                    } catch (error) {
                        return exceptionHandler('Error getting reservations from Redis', error, context);
                    }
                }
            );
        },
        reservation: async (_: any, {id}: any, context: contextType) => {
            return validateAndResponse(validationSchemas.idReservationValidation, {id}, 'get reservation', context,
                async () => {
                    try {
                        const reservation = await findReservationById(id);
                        return respondWithStatus(200, 'Reservation found', true, reservation?.toJSON(), context);
                    } catch (error) {
                        return exceptionHandler('Reservation not found', 404, context);
                    }
                }
            );
        },
    },
    Mutation: {
        createReservation: async (_: any, {reservation}: {reservation : reservationMutationType}, context: contextType) => {
            return validateAndResponse(validationSchemas.createReservationValidation, reservation, 'create reservation', context,
                async () => {
                    try {
                        const reservationCreated = await createReservation(reservation);
                        return respondWithStatus(200, 'Reservation created', true, reservationCreated.toJSON(), context);
                    } catch (error) {
                        return exceptionHandler('Error creating reservation', error, context);
                    }
                }
            );
        },
        updateReservation: async (_: any, {id, reservation}: {id:string, reservation: reservationMutationType}, context: contextType) => {
            return validateAndResponse(validationSchemas.updateReservationValidation, reservation, 'update reservation', context,
                async () => {
                    try {
                        const reservationUpdated = await updateReservationById(id, reservation);
                        return respondWithStatus(200, 'Reservation updated', true, reservationUpdated?.toJSON(), context);
                    } catch (error) {
                        return exceptionHandler('Error updating reservation', error, context);
                    }
                }
            );
        },
        deleteReservation: async (_: any, {id}: {id: string},  context: contextType) => {
            return validateAndResponse(validationSchemas.idReservationValidation, {id}, 'delete reservation', context,
                async () => {
                    try {
                        await deleteReservationById(id);
                        return respondWithStatus(200, 'Reservation deleted', true, null, context);
                    } catch (error) {
                        return exceptionHandler('Error deleting reservation', error, context);
                    }
                }
            );
        },
    }
}