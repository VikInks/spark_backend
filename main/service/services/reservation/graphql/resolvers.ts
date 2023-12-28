import {validateAndResponse} from "../../../utils/validate.response";
import {contextType} from "../../../base/interface/contextType";
import {validationSchemas} from "./data_validation/mutation.validation";
import {Parking} from "../../parking/model/parking.model";
import {exceptionHandler} from "../../../utils/exception.handler";
import {respondWithStatus} from "../../../utils/respond.status";
import {Reservation} from "../model/reservation.model";
import {redisHandler} from "../../../utils/redis.handler";

type reservationType = {
    userId?: string,
}

// todo : add a logic to check if the user and the parking exists in redis before adding them to redis, if not, add them to redis

export const reservationResolvers = {
    Query: {
        reservations: async (_: any, args: reservationType, context: contextType) => {
            return validateAndResponse(validationSchemas.idReservationValidation, args, 'get reservations', context,
                async () => {
                    const keyRedis = 'reservation:* { userId: ' + args.userId + ' }';
                    try {
                        let reservations = await redisHandler('get', 'reservation', keyRedis);
                        if(!reservations) {
                            // set the data from the db to redis
                            reservations = await Reservation.find({userId: args.userId});
                            await redisHandler('new', 'reservation', keyRedis, reservations);
                        }
                        return respondWithStatus(200, 'Reservations from Redis', true, reservations.toJSON(), context);
                    } catch (error) {
                        exceptionHandler('Error getting reservations from Redis', error, context);
                    }
                }
            );
        },
        reservation: async (_: any, {id}: any, {models}: any) => {

        },
    },
    Mutation: {
        createReservation: async (_: any, {reservation}: any, {models}: any) => {

        },
        updateReservation: async (_: any, {id, reservation}: any, {models}: any) => {

        },
        deleteReservation: async (_: any, {id}: any, {models}: any) => {

        },
    }
}