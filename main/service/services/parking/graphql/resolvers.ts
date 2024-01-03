/**
 * Importing necessary modules and types
 */
import {contextType} from "../../../base/interface/contextType";
import {validateAndResponse} from "../../../utils/validate.response";
import {validationSchemas} from "./data_validation/mutation.validation";
import {History, Parking} from "../model/parking.model";
import {exceptionHandler} from "../../../utils/exception.handler";
import {respondWithStatus} from "../../../utils/respond.status";

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
                    return exceptionHandler('Parking not found', 404, context);
                }
                return respondWithStatus(200, 'Parking found', true, parking.toJSON(), context);
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
                try {
                    const parkings = await Parking.find(filter);
                    return respondWithStatus(200, `${!!parkings ? parkings.length : 0} parking found`, true, parkings.map(parking => parking.toJSON()), context);
                } catch (e) {
                    return exceptionHandler('get parkings', e, context);
                }
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
                    return exceptionHandler('Parking this position already exist', 400, context);
                }
                const newParking = new Parking(parking);
                try {
                    await newParking.save();
                } catch (e) {
                    return exceptionHandler('create parking place', 500, context);
                }
                return respondWithStatus(200, 'Parking created', true, newParking.toJSON(), context);
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
                    return exceptionHandler('Parking not found', 404, context);
                }
                return respondWithStatus(200, 'Parking updated', true, updatedParking.toJSON(), context);
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
                        return exceptionHandler('Parking not found', 404, context);
                    }
                    await History.create({...pushToHistory, active: false});
                } catch (e) {
                    return exceptionHandler('add to history', 500, context);
                }

                const deletedParking = await Parking.findByIdAndDelete(id);
                if (!deletedParking) {
                    return exceptionHandler('Parking not found', 404, context);
                }
                return respondWithStatus(200, 'Parking deleted', true, null, context);
            });
        },
    },
};