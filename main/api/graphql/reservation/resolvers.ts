import {validateAndResponse} from "../../../utils/validate.response";
import {validationSchemas} from "../../data_validation/reservation/mutation.validation";
import {exceptionHandler} from "../../../utils/exception.handler";
import {respondWithStatus} from "../../../utils/respond.status";
import {Reservation} from "../../../model/reservation/reservation.model";
import {contextType} from "../../../service/base/interface/contextType";

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
                    try {
                        const reservations = await Reservation.find({userId: args.userId});
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
                        const reservation = await Reservation.findById(id);
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
                        const reservationCreated = await Reservation.create(reservation);
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
                        const reservationUpdated = await Reservation.findByIdAndUpdate(id, reservation, {new: true});
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
                        await Reservation.findByIdAndDelete(id);
                        return respondWithStatus(200, 'Reservation deleted', true, null, context);
                    } catch (error) {
                        return exceptionHandler('Error deleting reservation', error, context);
                    }
                }
            );
        },
    }
}