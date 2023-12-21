import {User} from '../model/user.model';
import bcrypt from 'bcryptjs';
import {validationSchemas} from "./data_validation/mutation.validation";
import {
    UpdateLocation,
    UpdateUserInput,
    UserInput
} from "../model/interface/mutation/utils.mutation.interface";
import {manageCookie} from "../../../utils/token.management";
import {
    generateJwt,
    updateUserFields,
} from "../utils/function.utils.resolvers";
import {SessionWatcher} from "../../../utils/session.watcher";
import {generateUniqueId} from "../../../utils/uuid/generate.unique.id";
import {getRedisClient} from "../../../utils/redis/redis";
import {ContextType} from "../../../base/interface/context.type";
import {validateInput} from "../../../utils/validate.input";
import {verifyAuthenticatedUser} from "../../../utils/verify.authenticated.user";

const exceptionHandler = (operation: string, e: unknown) => {
    if (e instanceof Error) {
        console.log(e);
        return {success: false, message: `Error while ${operation}: ${e.message}`};
    } else {
        console.log(e);
        return {success: false, message: `Error while ${operation}: ${e}`};
    }
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
        me: async (_: any, __: any, context: ContextType) => {
            const userId = verifyAuthenticatedUser(context);
            try {
                const user = await User.findById(userId);
                try {
                    const sessionMiddleware = SessionWatcher(userId, {user: user});
                    await sessionMiddleware(context.req, context.res, () => {
                        console.log('SessionWatcher: ', userId, {user: user});
                    });
                } catch (e) {
                    return exceptionHandler('managing session', e);
                }
                console.log('user', user);
                return {success: true, message: 'User fetched successfully!'};
            } catch (e) {
                return exceptionHandler('fetching user', e);
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
         * @param {Object} args.user - The user object containing the user details.
         * @param {string} args.user.email - The email of the user.
         * @param {string} args.user.username - The username of the user.
         * @returns Promise{Object} - The result of the sign-up operation.
         * @throws {Error} - If the user already exists.
         */
        signUp: async (_: any, args: { user: UserInput }) => {
            validateInput(validationSchemas.signUpValidationSchema, args.user);
            // check if user already exists
            try {
                const user = await User.findOne({$or: [{email: args.user.email}, {username: args.user.username}]});
                if (user) throw new Error(`User already exists! ${user.email === args.user.email ? 'Email' : 'Username'} already used!`);
                const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/;
                if (!passwordRegex.test(args.user.password)) throw new Error(
                    'Password must be at least 8 characters long, and contain at least one uppercase letter, one lowercase letter, one number and one special character!'
                );
                new User({
                    ...args.user,
                    created: new Date().toISOString(),
                    updated: new Date().toISOString()
                });
                return {success: true, message: 'User created successfully!'}
            } catch (e) {
                return exceptionHandler('creating user', e);
            }
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
        login: async (_: any, args: {
            email: string | null,
            username: string | null,
            password: string
        }, context: ContextType) => {
            const {email, username, password} = args;
            validateInput(validationSchemas.loginValidationSchema, {email, username, password});
            try {
                const user = await User.findOne({$or: [{email}, {username}].filter(Boolean)});
                if (!user || !await bcrypt.compare(password, user.password)) throw new Error('Invalid credentials!');
                const token = generateJwt(user._id.toString());
                const sessionId = generateUniqueId();
                try {
                    manageCookie(context, token, sessionId, 'login');
                } catch (e) {
                    return exceptionHandler('managing cookie', e);
                }
                try {
                    await getRedisClient().set(sessionId, JSON.stringify({userId: user._id.toString(), ...user}));
                } catch (e) {
                    return exceptionHandler('setting redis session', e);
                }
                return {success: true, message: 'User logged in successfully!'};
            } catch (e) {
                return exceptionHandler('logging in user', e);
            }
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
        logout: async (_: any, __: any, context: ContextType) => {
            const userId = verifyAuthenticatedUser(context);
            try {
                manageCookie(context, _, _, 'logout');
            } catch (e) {
                return exceptionHandler('managing cookie', e);
            }
            try {
                try {
                    const sessionMiddleware = SessionWatcher(userId, {user: null}, 'delete');
                    await sessionMiddleware(context.req, context.res, () => {
                        console.log('SessionWatcher: ', context, {user: null});
                    });
                } catch (e) {
                    return exceptionHandler('managing session', e);
                }
                return {success: true, message: 'User logged out successfully!'};
            } catch (e) {
                return exceptionHandler('logging out user', e);
            }
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
        updateUser: async (_: any, {updateFields}: { updateFields: UpdateUserInput }, context: ContextType) => {
            validateInput(validationSchemas.updateValidationSchema, updateFields);
            const userId = verifyAuthenticatedUser(context);
            try {
                const updatedSessionData = {user: {...updateFields}};
                await updateUserFields(userId, updateFields);
                try {
                    const sessionMiddleware = SessionWatcher(userId, updatedSessionData);
                    await sessionMiddleware(context.req, context.res, () => {
                        console.log('SessionWatcher: ', userId, updatedSessionData);
                    });
                } catch (e) {
                    return exceptionHandler('managing session', e);
                }
                return {success: true, message: 'User updated successfully!'};
            } catch (e) {
                return exceptionHandler('updating user', e);
            }
        },
        /**
         * Updates the password for the authenticated user.
         *
         * @async
         * @param {any} _ - The placeholder for the root value.
         * @param {Object} params - The parameters for the mutation.
         * @param {string} params.password - The new password to be set.
         * @param {ContextType} context - The context object containing the request, response, and other information.
         * @throws {Error} If the password is empty.
         * @throws {Error} If the user associated with the authenticated user ID is not found.
         * @throws {Error} If the new password is the same as the old one.
         * @throws {Error} If the password does not meet the required complexity.
         */
        updatePassword: async (_: any, {password}: { password: string }, context: ContextType) => {
            validateInput(validationSchemas.updatePasswordValidationSchema, {password});
            if (!password) throw new Error('Password cannot be empty!');
            const userId = verifyAuthenticatedUser(context);
            try {
                const user = await User.findById(userId);
                if (!user) throw new Error('User not found!');
                if (await bcrypt.compare(password, user.password)) throw new Error('New password cannot be the same as the old one!');
                const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/;
                if (!passwordRegex.test(password)) throw new Error(
                    'Password must be at least 8 characters long, and contain at least one uppercase letter, one lowercase letter, one number and one special character!'
                );
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);
                await updateUserFields(userId, {password: hashedPassword});
                try {
                    const sessionMiddleware = SessionWatcher(userId, {user: {password: hashedPassword}});
                    await sessionMiddleware(context.req, context.res, () => {
                        console.log('SessionWatcher: ', userId, {user: {password: hashedPassword}});
                    });
                } catch (e) {
                    return exceptionHandler('managing session', e);
                }
                return {success: true, message: 'Password updated successfully!'};
            } catch (e) {
                return exceptionHandler('updating password', e);
            }
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
        updateLocation: async (_: any, {location}: { location: UpdateLocation }, context: ContextType) => {
            validateInput(validationSchemas.updateLocationValidationSchema, {location});
            const userId = verifyAuthenticatedUser(context);
            try {
                await updateUserFields(userId, {location: location});
                try {
                    const sessionMiddleware = SessionWatcher(userId, {user: {location: location}});
                    await sessionMiddleware(context.req, context.res, () => {
                        console.log('SessionWatcher: ', userId, {user: {location: location}});
                    });
                } catch (e) {
                    return exceptionHandler('managing session', e);
                }
                return {success: true, message: 'Location updated successfully!'};
            } catch (e) {
                return exceptionHandler('updating location', e);
            }
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
        updateEmail: async (_: any, {email}: { email: string }, context: ContextType) => {
            validateInput(validationSchemas.updateEmailValidationSchema, {email})
            const userId = verifyAuthenticatedUser(context);
            try {
                const user = await User.findOne({email});
                if (user) throw new Error('Email already used!');
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) throw new Error('Invalid email!');
                await updateUserFields(userId, {email: email});
                try {
                    const sessionMiddleware = SessionWatcher(userId, {user: {email: email}});
                    await sessionMiddleware(context.req, context.res, () => {
                        console.log('SessionWatcher: ', userId, {user: {email: email}});
                    });
                } catch (e) {
                    return exceptionHandler('managing session', e);
                }
                return {success: true, message: 'Email updated successfully!'};
            } catch (e) {
                return exceptionHandler('updating email', e);
            }
        },
        /**
         * Updates the active status of a user.
         *
         * @async
         * @param {any} _ - The ignored parameter.
         * @param {any} __ - The ignored parameter.
         * @param {object} context - The context object.
         * @returns {object} - The result object containing success and message properties.
         * @throws {Error} - If there is an error while updating the active status.
         */
        updateActive: async (_: any, __: any, context: ContextType) => {
            const userId = verifyAuthenticatedUser(context);
            try {
                const active = !User.findById(userId).get('active');
                await updateUserFields(userId, {active: active});
                try {
                    const sessionMiddleware = SessionWatcher(userId, {user: {active: active}}, !active ? 'delete' : '');
                    await sessionMiddleware(context.req, context.res, () => {
                        console.log('SessionWatcher: ', userId, {user: {active: active}});
                    });
                } catch (e) {
                    return exceptionHandler('managing session', e);
                }
                !active ? manageCookie(context.res, _, _, 'delete') : null;
                return {success: true, message: 'Active status updated successfully!'};
            } catch (e) {
                return exceptionHandler('updating active status', e);
            }
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
        deleteUser: async (_: any, __: any, context: ContextType) => {
            try {
                const userId = verifyAuthenticatedUser(context);
                await User.findByIdAndDelete(userId);
                try {
                    const sessionMiddleware = SessionWatcher(userId, {user: null}, 'delete');
                    await sessionMiddleware(context.req, context.res, () => {
                        console.log('SessionWatcher: ', userId, {user: null});
                    });
                } catch (e) {
                    return exceptionHandler('managing session', e);
                }
                try {
                    manageCookie(context.res, _, _, 'delete');
                } catch (e) {
                    return exceptionHandler('managing cookie', e);
                }
                return {success: true, message: 'User deleted successfully!'};
            } catch (e) {
                return exceptionHandler('deleting user', e);
            }
        },
    }
};
