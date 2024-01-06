/**
 * Importing necessary modules and types
 */
import {validateAndResponse} from "../../../utils/validate.response";
import {validationSchemas} from "../../data_validation/parking/mutation.validation";
import {exceptionHandler} from "../../../utils/exception.handler";
import {respondWithStatus} from "../../../utils/respond.status";
import {contextType} from "../../../service/base/interface/contextType";
import {
    createParking, deleteParkingById, deleteParkingHistoryById, findAllParkingHistoryByUserId,
    findParkingByFilter,
    findParkingByGeoLocation,
    findParkingById, findParkingHistoryByOwnerId,
    pushToHistoryParking,
    updateParkingById
} from "../../../data_access/parking/parking.dal";

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
                const parking = await findParkingById(id);
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
                    const parkings = await findParkingByFilter(filter);
                    return respondWithStatus(200, `${!!parkings ? parkings.length : 0} parking found`, true, parkings.map(parking => parking.toJSON()), context);
                } catch (e) {
                    return exceptionHandler('get parkings', e, context);
                }
            });
        },
        getAllParkingHistory: async (_: any, __: any, context: contextType) => {
            return validateAndResponse(null, null, 'get parking history', context, async () => {
                try {
                    const parkings = await findAllParkingHistoryByUserId(context.user as string);
                    if(!parkings) return exceptionHandler('No parking fount in history', 404, context);
                    return respondWithStatus(200, `${!!parkings ? parkings.length : 0} parking found`, true, parkings.map(parking => parking.toJSON()), context);
                } catch (e) {
                    return exceptionHandler('get parking history', e, context);
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
                const parkingExists = await findParkingByGeoLocation(parking.coordinates, parking.radius);
                if (parkingExists) {
                    return exceptionHandler('Parking this position already exist', 400, context);
                }
                const newParking = await createParking(parking);
                return respondWithStatus(200, 'Parking created', true, newParking.toJSON(), context);
            });
        },
        /**
         * updateParking resolver
         * @param _ - placeholder for the root object, which is not used in this resolver
         * @param {Object} args - an object containing the arguments passed to the mutation
         * @param {contextType} context - the context object passed from the server
         */
        updateParking: async (_: any, {id, parking}: { id: string, parking: any }, context: contextType) => {
            return validateAndResponse(validationSchemas.updateParkingValidationSchema, {
                id,
                parking
            }, 'update parking', context, async () => {
                const updatedParking = await updateParkingById(id, parking);
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
                    const pushToHistory = await findParkingById(id);
                    if (!pushToHistory) {
                        return exceptionHandler('Parking not found', 404, context);
                    }
                    await pushToHistoryParking(pushToHistory.toJSON());
                } catch (e) {
                    return exceptionHandler('add to history', 500, context);
                }

                const deletedParking = await deleteParkingById(id);
                if (!deletedParking) {
                    return exceptionHandler('Parking not found', 404, context);
                }
                return respondWithStatus(200, 'Parking deleted', true, null, context);
            });
        },
        recoverParking: async (_: any, id: any, context: contextType) => {
            return validateAndResponse(validationSchemas.getParkingValidationSchema, id, 'recover parking', context, async () => {
                const parking = await findParkingHistoryByOwnerId(id);
                if (!parking) {
                    return exceptionHandler('Parking not found', 404, context);
                }
                const newParking = await createParking(parking);
                await deleteParkingHistoryById(id);
                return respondWithStatus(200, 'Parking recovered', true, newParking.toJSON(), context);
            });
        }
    },
};