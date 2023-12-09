import {IncomingMessage, ServerResponse} from "http";

interface ContextType {
    req: IncomingMessage;
    res: ServerResponse;
    userId?: string | null;
}

interface UserInput {
    username: string;
    password: string;
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    location: {
        address: string;
        city: string;
        state: string;
        zip: string;
        country: string;
    };
}

interface UpdateUserInput {
    username?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    location?: UpdateLocation;
}

interface UpdateLocation {
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
}

export {ContextType, UserInput, UpdateUserInput, UpdateLocation};