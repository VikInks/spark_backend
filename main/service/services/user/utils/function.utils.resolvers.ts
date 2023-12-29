import jwt from "jsonwebtoken";
import {User} from "../model/user.model";
import {contextType} from "../../../base/interface/contextType";
import {respondWithStatus} from "../../../utils/respond.status";

/**
 * Generate a JSON Web Token (JWT) for the given user ID.
 *
 * @param {string} userId - The user ID to generate the JWT for.
 * @return {string} - The generated JWT.
 */
export function generateJwt(userId: string): string {
    return jwt.sign({id: userId}, process.env.SECRET_KEY ?? 'SECRET_KEY', {expiresIn: '1h'});
}

/**
 * Updates the fields of a user.
 * @param {string} userId - The ID of the user.
 * @param {object} updateFields - The fields to update in the user document.
 * @returns {Promise<any>} - A promise that resolves to the updated user document.
 */
export function updateUserFields(userId: string, updateFields: object): Promise<any> {
    console.log('updateUserFields: ', userId, updateFields);
    return User.findByIdAndUpdate(userId, {...updateFields, updated: new Date().toISOString()}, {new: true});
}

/**
 * Validates the given password for its complexity.
 * The password must be at least 8 characters long, and contain at least one uppercase letter, one lowercase letter, one number, and one special character.
 *
 * @param {string} password - The password to be validated.
 * @param {contextType} context - The context in which the validation is performed.
 */
export const verifyPasswordValidity = (password: string, context: contextType) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/;
    if (!passwordRegex.test(password)) return respondWithStatus(401, 'Password must be at least 8 characters long, and contain at least one uppercase letter, one lowercase letter, one number and one special character!', false, null, context);
}