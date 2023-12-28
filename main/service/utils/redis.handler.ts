import { getRedisClient } from "./redis/redis";
import { contextType } from "../base/interface/contextType";

type operationType = 'new' | 'update' | 'delete' | 'get' | 'getUserRelated';
type resolverType = 'image' | 'parking' | 'reservation' | 'user';

const manageRedisData = async (context: contextType, redisClient: any, redisKey: string, data?: any, operation: operationType = 'get') => {
    const resolver = redisKey.split(':')[0];
    switch(operation) {
        case 'get':
        case 'getUserRelated':
            const keyToUse = operation === 'getUserRelated' ? `user:${context.user}:reservations` : redisKey;
            const dataInRedis = await redisClient.get(keyToUse);
            return dataInRedis ? JSON.parse(dataInRedis) : null;
        case 'new':
            await redisClient.set(redisKey, JSON.stringify(data));
            if (resolver === 'reservation') {
                const userReservationsKey = `user:${context.user}:reservations`;
                let userReservations = await redisClient.get(userReservationsKey) || '[]';
                userReservations = JSON.parse(userReservations);
                userReservations.push(data); // Ajoute la nouvelle réservation
                await redisClient.set(userReservationsKey, JSON.stringify(userReservations));
            }
            return data;
        // ... autres cas comme 'update' et 'delete'
    }
}

export const redisHandler = async (context: contextType, operation: operationType, resolver: resolverType, data?: any) => {
    const redisKey = `${resolver}:${data?.id || ''}`;
    const redisClient = getRedisClient();
    return await manageRedisData(context, redisClient, redisKey, data, operation);
}
