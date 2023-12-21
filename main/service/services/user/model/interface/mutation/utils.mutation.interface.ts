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

export {UserInput, UpdateUserInput, UpdateLocation};