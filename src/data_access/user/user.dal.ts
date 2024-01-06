import {User} from "../../model/user/user.model";

export const findUserById = async (userId: string) => {
    return User.findById(userId);
};

export const findUserByEmail = async (email: string) => {
    return User.findOne({ email });
};

export const findUserByUsername = async (username: string) => {
    return User.findOne({ username });
};

export const findUserByUsernameOrEmail = async (username: string, email: string) => {
    return User.findOne({ $or: [{ username }, { email }] });
}

export const createUser = async (userData: any) => {
    return User.create(userData);
};

export const deleteUserById = async (userId: string) => {
    return User.findByIdAndDelete(userId);
};
