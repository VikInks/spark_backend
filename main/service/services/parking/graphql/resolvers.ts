/**
 * Importing necessary modules and types
 */
import {Context} from "joi";
import {contextType} from "../../../base/interface/contextType";
import {validateAndResponse} from "../../../utils/validate.response";
import {validationSchemas} from "./data_validation/mutation.validation";
import {History, Parking} from "../model/parking.model";
import {exceptionHandler} from "../../../utils/exception.handler";
import {respondWithStatus} from "../../../utils/respond.status";
import {redisHandler} from "../../../utils/redis.handler";

type filterType = {
    ownerId?: string,
    price?: number,
    geoLocation?: {
        coordinates: number[],
        radius: number,
    },
    evaluation?: {
        userId: string,
        rating: number,
    },
    capacity?: number,
}

/**
 * The resolvers object contains the Query and Mutation resolvers for the GraphQL schema.
 */
export const resolvers = {
    /**
     * Query resolvers
     */
    Query: {
        /**
         * getParking resolver
         * @param _ - placeholder for the root object, which is not used in this resolver
         * @param {Object} args - an object containing the arguments passed to the query
         * @param {contextType} context - the context object passed from the server
         */
        getParking: async (_: any, {id}: any, context: contextType) => {
            return validateAndResponse(validationSchemas.getParkingValidationSchema, {id}, 'get parking', context, async () => {
                const parking = await Parking.findById(id);
                if (!parking) {
                    exceptionHandler('Parking not found', 404, context);
                }
                await redisHandler(context, 'get', parking);
                return respondWithStatus(200, 'Parking found', true, context);
            });
        },
        /**
         * getParkings resolver
         * @param _ - placeholder for the root object, which is not used in this resolver
         * @param {Object} args - an object containing the arguments passed to the query
         * @param {contextType} context - the context object passed from the server
         */
        getParkings: async (_: any, {filter}: { filter: filterType }, context: contextType) => {
            return validateAndResponse(validationSchemas.getParkingsValidationSchema, {filter}, 'get parkings', context, async () => {
                const parkings = await Parking.find(filter);
                if (!parkings) {
                    exceptionHandler('Parkings not found', 404, context);
                }
                await redisHandler(context, 'get', parkings);
                return respondWithStatus(200, 'Parkings found', true, context);
            });
        }
    },
    /**
     * Mutation resolvers
     */
    Mutation: {
        /**
         * createParking resolver
         * @param _ - placeholder for the root object, which is not used in this resolver
         * @param {Object} args - an object containing the arguments passed to the mutation
         * @param {contextType} context - the context object passed from the server
         */
        createParking: async (_: any, {parking}: any, context: contextType) => {
            return validateAndResponse(validationSchemas.createParkingValidationSchema, {parking}, 'create parking', context, async () => {
                const parkingExists = await Parking.findOne({geoLocation: parking.geoLocation});
                if (parkingExists) {
                    exceptionHandler('Parking this position already exist', 400, context);
                }
                const newParking = new Parking(parking);
                try {
                    await newParking.save();
                } catch (e) {
                    exceptionHandler('create parking place', 500, context);
                }
                try {
                    await redisHandler(context, 'new', newParking);
                } catch (e) {
                    exceptionHandler('redis error', 500, context);
                }
                return respondWithStatus(200, 'Parking created', true, context);
            });
        },
        /**
         * updateParking resolver
         * @param _ - placeholder for the root object, which is not used in this resolver
         * @param {Object} args - an object containing the arguments passed to the mutation
         * @param {contextType} context - the context object passed from the server
         */
        updateParking: async (_: any, {id, parking}: any, context: contextType) => {
            return validateAndResponse(validationSchemas.updateParkingValidationSchema, {
                id,
                parking
            }, 'update parking', context, async () => {
                const updatedParking = await Parking.findByIdAndUpdate(id, parking);
                if (!updatedParking) {
                    exceptionHandler('Parking not found', 404, context);
                }
                try {
                    await redisHandler(context, 'update', updatedParking);
                } catch (e) {
                    exceptionHandler('redis error', 500, context);
                }
                return respondWithStatus(200, 'Parking updated', true, context);
            });
        },
        /**
         * deleteParking resolver
         * @param _ - placeholder for the root object, which is not used in this resolver
         * @param {Object} args - an object containing the arguments passed to the mutation
         * @param {contextType} context - the context object passed from the server
         */
        deleteParking: async (_: any, {id}: any, context: contextType) => {
            return validateAndResponse(validationSchemas.getParkingValidationSchema, {id}, 'delete parking', context, async () => {
                try {
                    const pushToHistory = await Parking.findById(id);
                    if (!pushToHistory) {
                        exceptionHandler('Parking not found', 404, context);
                    }
                    await History.create({...pushToHistory, active: false});
                } catch (e) {
                    exceptionHandler('add to history', 500, context);
                }

                const deletedParking = await Parking.findByIdAndDelete(id);
                if (!deletedParking) {
                    exceptionHandler('Parking not found', 404, context);
                }
                try {
                    await redisHandler(context, 'delete', deletedParking);
                } catch (e) {
                    exceptionHandler('redis error', 500, context);
                }
                return respondWithStatus(200, 'Parking deleted', true, context);
            });
        },
    },
};