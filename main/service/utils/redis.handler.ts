import { getRedisClient } from "./redis/redis";
import { contextType } from "../base/interface/contextType";
import { exceptionHandler } from "./exception.handler";

type operationType = 'new' | 'update' | 'delete' | 'get' | 'delete_one';
type resolverType = 'image' | 'parking' | 'reservation' | 'user';

async function updateRedisData(sessionId: string, newData: any, merge: boolean = true) {
    const updatedData = merge ? JSON.stringify({ ...JSON.parse(await getRedisClient().get(sessionId) || '{}'), ...newData }) : JSON.stringify(newData);
    await getRedisClient().set(sessionId, updatedData);
}

export async function redisHandler(context: contextType, operation: operationType, data?: any, sessionId?: string | null) {
    sessionId = sessionId || context.req.headers.cookie?.match(/(?:^|;\s*)sid=([^;]+)/)?.[1];
    if (!sessionId) return;

    try {
        switch (operation) {
            case 'new':
                await updateRedisData(sessionId, data, false);
                break;
            case 'update':
                await updateRedisData(sessionId, data);
                break;
            case 'get':
                const sessionData = await getRedisClient().get(sessionId);
                if (sessionData && JSON.parse(sessionData).userId !== context.user) {
                    throw new Error('Invalid session');
                }
                break;
            case 'delete':
                await getRedisClient().del(sessionId);
                break;
            case 'delete_one':
                const session = await getRedisClient().get(sessionId);
                if (session) {
                    const sessionData = JSON.parse(session);
                    const newData = { ...sessionData };
                    delete newData[data];
                    await updateRedisData(sessionId, newData);
                }
                break;
        }
    } catch (e) {
        exceptionHandler(operation, e, context);
    }
}
