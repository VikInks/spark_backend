import bcrypt from 'bcryptjs';
import {validationSchemas} from "../../data_validation/user/mutation.validation";
import {generateJwt, updateUserFields, verifyPasswordValidity} from "./function.utils.resolvers";
import {verifyAuthenticatedUser} from "../../../utils/verify.authenticated.user";
import {exceptionHandler} from "../../../utils/exception.handler";
import {respondWithStatus} from "../../../utils/respond.status";
import {validateAndResponse} from "../../../utils/validate.response";
import {manageCookie} from "../../../utils/token.management";
import {contextType} from "../../../service/base/interface/contextType";
import {createUser, deleteUserById, findUserByEmail, findUserById, findUserByUsernameOrEmail} from "../../../data_access/user/user.dal";
import {findImagesByUserId} from "../../../data_access/image/image.dal";
import {findParkingsByUserId} from "../../../data_access/parking/parking.dal";
import {findReservationsByUserId} from "../../../data_access/reservation/reservation.dal";
import {UpdateLocation, UpdateUserInput, UserInput} from "./interface/input.mutation.interface";

interface carInput {
    id: string
    name: string
    brand: string
    model: string
    type: 'gas' | 'electric'
    plug: string
}

/**
 * A collection of resolvers for handling GraphQL queries and mutations related to users.
 */
export const resolvers = {
    Query: {
        /**
         * Fetches a user based on the authenticated user ID.
         *
         * @async
         * @param _ - Unused parameter.
         * @param __ - Unused parameter.
         * @param context - The context object which contains information about the current request.
         * @returns An object indicating the success or failure of the operation, along with a message.
         */
        me: async (_: any, __: any, context: contextType) => {
            const userId = verifyAuthenticatedUser(context);
            if (typeof userId !== 'string') return userId;
            try {
                const user = await findUserById(userId);
                if (!user) return respondWithStatus(404, 'User not found!', false, null, context);
                const images = await findImagesByUserId(userId);
                const parking = await findParkingsByUserId(userId);
                const reservations = await findReservationsByUserId(userId);
                const me = {
                    user: user.toJSON(),
                    images: images.map((image) => image.toJSON()) ?? null,
                    parking: parking.map((parking) => parking.toJSON()) ?? null,
                    reservations: reservations.map((reservation) => reservation.toJSON()) ?? null,
                }
                return respondWithStatus(200, 'User datas fetched successfully!', true, me, context);
            } catch (e) {
                return exceptionHandler('finding user', e, context);
            }
        },
    },
    Mutation: {
        /**
         * Sign up a new user.
         *
         * @async
         * @param {Object} _ - Unused parameter.
         * @param {Object} args - The user input.
         * @param context - The context object containing the request and response objects.
         * @param {Object} args.user - The user object containing the user details.
         * @param {string} args.user.email - The email of the user.
         * @param {string} args.user.username - The username of the user.
         * @returns Promise{Object} - The result of the sign-up operation.
         * @throws {Error} - If the user already exists.
         */
        // TODO: use SwissId api to verify user
        signUp: async (_: any, args: { user: UserInput }, context: contextType) => {
            return validateAndResponse(validationSchemas.signUpValidationSchema, args.user, 'sign up user', context, async () => {
                try {
                    const user = await findUserByUsernameOrEmail(args.user.username ?? '', args.user.email ?? '');
                    if (!!user) return respondWithStatus(401, 'User already exists!', false, null, context);
                    verifyPasswordValidity(args.user.password, context);
                    const newUser = await createUser(args.user);
                    // TODO: Send email verification
                    return respondWithStatus(200, 'User created successfully!', true, newUser.toJSON(), context);
                } catch (e) {
                    console.log(`sign up error: ${e}`);
                    return exceptionHandler('creating user', e, context);
                }
            });
        },
        /**
         * Logs in a user with the provided email/username and password.
         *
         * @async
         * @param {Object} _ - The placeholder object.
         * @param {Object} args - The arguments passed to the login function.
         * @param {string} args.email - The user's email (optional).
         * @param {string} args.username - The user's username (optional).
         * @param {string} args.password - The user's password.
         * @param {Object} context - The context object.
         * @returns Promise{Object} - An object indicating the success of the login operation and a message.
         * @throws {Error} - If the provided credentials are invalid or an error occurs during the login process.
         */
        login: async (_: any, args: { email: string | null, username: string | null, password: string }, context: contextType) => {
            const {email, username, password} = args;
            return validateAndResponse(validationSchemas.loginValidationSchema, {email, username, password}, 'login user', context, async () => {
                try {
                    const user = await findUserByUsernameOrEmail(username ?? '', email ?? '');
                    if (!user || !await bcrypt.compare(password, user.password)) return respondWithStatus(401, 'Invalid credentials!', false, null, context);
                    manageCookie(context, generateJwt(user._id.toString()));
                    return respondWithStatus(200, 'User logged in successfully!', true, null, context);
                } catch (e) {
                    return exceptionHandler('logging in user', e, context);
                }
            });
        },
        /**
         * Logs out the authenticated user.
         *
         * @async
         * @param _ - Placeholder for the first argument, not used in the function.
         * @param __ - Placeholder for the second argument, not used in the function.
         * @param context - An object containing the request and response context.
         * @returns An object with a success status and a message indicating the result of the logout operation.
         */
        logout: async (_: any, __: any, context: contextType) => {
            const isUserId = verifyAuthenticatedUser(context);
            if (typeof isUserId !== 'string') return isUserId;
            manageCookie(context, _, 'logout');
            return respondWithStatus(200, 'User logged out successfully!', true, null, context);
        },
        /**
         * Update a user's information.
         *
         * @async
         * @param _ - Unused parameter.
         * @param updateFields - The fields to update for the user.
         * @param context - The context object containing request and response.
         * @returns An object indicating the success of the update and a corresponding message.
         */
        updateUser: async (_: any, {updateFields}: { updateFields: UpdateUserInput }, context: contextType) => {
            return validateAndResponse(validationSchemas.updateValidationSchema, {updateFields}, 'update user', context, async () => {
                const userId = verifyAuthenticatedUser(context);
                if (typeof userId !== 'string') return userId;
                try {
                    const updatedUser = await updateUserFields(userId, updateFields);
                    return respondWithStatus(200, 'User updated successfully!', true, updatedUser.toJSON(), context);
                } catch (e) {
                    return exceptionHandler('updating user', e, context);
                }
            });
        },
        /**
         * Updates the password for the authenticated user.
         *
         * @async
         * @param {any} _ - The placeholder for the root value.
         * @param {Object} params - The parameters for the mutation.
         * @param {string} params.password - The new password to be set.
         * @param {contextType} context - The context object containing the request, response, and other information.
         * @throws {Error} If the password is empty.
         * @throws {Error} If the user associated with the authenticated user ID is not found.
         * @throws {Error} If the new password is the same as the old one.
         * @throws {Error} If the password does not meet the required complexity.
         */
        updatePassword: async (_: any, {password}: { password: string }, context: contextType) => {
            return validateAndResponse(validationSchemas.updatePasswordValidationSchema, {password}, 'update password', context, async () => {
                if (!password) return respondWithStatus(401, 'Password cannot be empty!', false, null, context);
                const userId = verifyAuthenticatedUser(context);
                if (typeof userId !== 'string') return userId;
                try {
                    const user = await findUserById(userId);
                    if (!user) return respondWithStatus(404, 'User not found!', false, null, context);
                    if (await bcrypt.compare(password, user.password)) return respondWithStatus(401, 'New password cannot be the same as the old one!', false, null, context);
                    verifyPasswordValidity(password, context);
                    const salt = await bcrypt.genSalt(10);
                    const hashedPassword = await bcrypt.hash(password, salt);
                    const updatedUser = await updateUserFields(userId, {password: hashedPassword});
                    return respondWithStatus(200, 'Password updated successfully!', true, updatedUser.toJSON(), context);
                } catch (e) {
                    return exceptionHandler('updating password', e, context);
                }
            });
        },
        /**
         * Update the location of a user.
         *
         * @async
         * @param {any} _ - Unused parameter.
         * @param {Object} location - The updated location of the user.
         * @param {Object} context - The context object containing the request and response objects.
         * @throws {Error} - If there is an error updating the location.
         */
        updateLocation: async (_: any, {location}: { location: UpdateLocation }, context: contextType) => {
            return validateAndResponse(validationSchemas.updateLocationValidationSchema, {location}, 'update location', context, async () => {
                const userId = verifyAuthenticatedUser(context);
                if (typeof userId !== 'string') return userId;
                try {
                    const updatedUser = await updateUserFields(userId, {location: location});
                    return respondWithStatus(200, 'Location updated successfully!', true, updatedUser.toJSON(), context);
                } catch (e) {
                    return exceptionHandler('updating location', e, context);
                }
            });
        },
        /**
         * Updates the email of the authenticated user.
         *
         * @async
         * @param _ Unused parameter (can be set to null)
         * @param email The new email to update
         * @param context The context object containing the request and response
         *
         * @returns An object containing the success status and a message
         */
        updateEmail: async (_: any, {email}: { email: string }, context: contextType) => {
            return validateAndResponse(validationSchemas.updateEmailValidationSchema, {email}, 'update email', context, async () => {
                const userId = verifyAuthenticatedUser(context);
                if (typeof userId !== 'string') return userId;
                try {
                    const user = await findUserByEmail(email);
                    if (user) return respondWithStatus(401, 'Email already exists!', false, null, context);
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(email)) return respondWithStatus(401, 'Invalid email!', false, null, context);
                    const updatedUser = await updateUserFields(userId, {email: email});
                    return respondWithStatus(200, 'Email updated successfully!', true, updatedUser.toJSON(), context);
                } catch (e) {
                    return exceptionHandler('updating email', e, context);
                }
            });
        },
        updateCars: async (_: any, {args}: { args: carInput[] }, context: contextType) => {
            const userId = verifyAuthenticatedUser(context);
            if (typeof userId !== 'string') return userId;
            return validateAndResponse(validationSchemas.updateCarsValidationSchema, {args}, 'update cars', context, async () => {
                try {
                    const user = await findUserById(userId);
                    if (!user) return respondWithStatus(404, 'User not found!', false, null, context);
                    const jsonData = user.toJSON();
                    const updatedUser = await updateUserFields(userId, {
                        cars: jsonData.cars?.map((car) => {
                            const newCar = args.find((arg) => arg.id === car.id);
                            if (newCar) {
                                return {
                                    ...car,
                                    ...newCar
                                };
                            }
                            return car;
                        }),
                    });
                    return respondWithStatus(200, 'Cars updated successfully!', true, updatedUser.toJSON(), context);
                } catch (e) {
                    return exceptionHandler('updating cars', e, context);
                }
            });
        },
        /**
         * Updates the active status of a user.
         *
         * @async
         * @param {any} _ - The ignored parameter.
         * @param {any} __ - The ignored parameter.
         * @param {object} context - The context object.
         * @throws {Error} - If there is an error while updating the active status.
         */
        updateActive: async (_: any, __: any, context: contextType) => {
            const userId = verifyAuthenticatedUser(context);
            if (typeof userId !== 'string') return userId;
            return validateAndResponse(null, null, 'updating active status', context, async () => {
                try {
                    const user = await findUserById(userId);
                    const active = !user?.active;
                    try {
                        await updateUserFields(userId, {active: active});
                    } catch (e) {
                        return exceptionHandler('updating active status', e, context);
                    }
                    return respondWithStatus(200, 'Active status updated successfully!', true, null, context);
                } catch (e) {
                    return exceptionHandler('updating active status', e, context);
                }
            });
        },
        /**
         * Deletes a user from the database and logs out the user's session.
         *
         * @async
         * @param _ - The unused input parameter (underscore conventionally represents an unused variable).
         * @param __ - The unused input parameter (underscore conventionally represents an unused variable).
         * @param context - The context object containing the request and response objects.
         * @returns - An object indicating the success of the user deletion and an associated message.
         */
        deleteUser: async (_: any, __: any, context: contextType) => {
            const userId = verifyAuthenticatedUser(context);
            if (typeof userId !== 'string') return userId;
            return validateAndResponse(null, null, 'deleting user', context, async () => {
                const user = await findUserById(userId);
                if (!user) {
                    return respondWithStatus(404, 'User not found!', false, null, context);
                }
                await deleteUserById(userId);
                return respondWithStatus(200, 'User deleted successfully!', true, null, context);
            });
        }
    }
};
