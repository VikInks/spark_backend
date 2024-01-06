import {User} from "../../model/user/user.model";

/**
 * Find user by id
 */
export const findUserById = async (userId: string) => {
    return User.findById(userId);
};

/**
 * Find user by email
 * @param email
 */
export const findUserByEmail = async (email: string) => {
    return User.findOne({ email });
};

/**
 * Find user by username
 * @param username
 */
export const findUserByUsername = async (username: string) => {
    return User.findOne({ username });
};

/**
 * Find user by username or email
 * @param username
 * @param email
 */
export const findUserByUsernameOrEmail = async (username: string, email: string) => {
    return User.findOne({ $or: [{ username }, { email }] });
}

/**
 * Find all users
 */
export const createUser = async (userData: any) => {
    return User.create(userData);
};

/**
 * delete user by id
 * @param userId
 */
export const deleteUserById = async (userId: string) => {
    return User.findByIdAndDelete(userId);
};
