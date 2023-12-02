import {IncomingMessage, ServerResponse} from "http";
import UserInterface from "../model/user.interface";

interface QueryArgs {
    username: string;
    password: string;
}

interface ContextType {
    req: IncomingMessage;
    res: ServerResponse;
    user?: UserInterface | null;
}

interface UpdateUserInput {
    username?: string;
    password?: string;
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
    location?: {
        address?: string;
        city?: string;
        state?: string;
        zip?: string;
        country?: string;
    };
}

export {QueryArgs, ContextType, UpdateUserInput};