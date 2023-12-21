import jwt from "jsonwebtoken";
import {User} from "../model/user.model";

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