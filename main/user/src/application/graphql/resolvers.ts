import {User} from '../../infrastructure/model/user.model';
import bcrypt from 'bcryptjs';
import jwt, {JwtPayload} from 'jsonwebtoken';
import {validationSchemas} from "../../infrastructure/dataValidation/mutation.validation";
import {
    ContextType,
    UpdateLocation,
    UpdateUserInput,
    UserInput
} from "../../domain/interface/mutation/utils.mutation.interface";
import Joi from "joi";

// Fonctions auxiliaires
function verifyAuthenticatedUser(context: ContextType) {
    if (!context.userId) throw new Error('You are not authenticated!');
    return context.userId;
}

function generateJwt(userId: string) {
    return jwt.sign({id: userId}, process.env.SECRET_KEY ?? 'SECRET_KEY', {expiresIn: '1h'});
}

function manageJwtCookie(context: ContextType, token?: string) {
    const cookieValue = token ? `jwt=${token}; HttpOnly; Path=/; Max-Age=${60 * 60}` : 'jwt=; HttpOnly; Path=/; Max-Age=0';
    context.res.setHeader('Set-Cookie', cookieValue);
}

function validateInput(schema: Joi.ObjectSchema<any>, data: any) {
    const {error} = schema.validate(data);
    if (error) throw new Error(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
}

function updateUserFields(userId: string, updateFields: object) {
    return User.findByIdAndUpdate(userId, {...updateFields, updated: new Date().toISOString()}, {new: true});
}

export const resolvers = {
    Query: {
        me: async (_: any, __: any, context: ContextType) => {
            const userId = verifyAuthenticatedUser(context);
            return User.findById(userId);
        },
    },
    Mutation: {
        signUp: async (_: any, args: { user: UserInput }) => {
            validateInput(validationSchemas.signUpValidationSchema, args.user);
            const newUser = new User({
                ...args.user,
                created: new Date().toISOString(),
                updated: new Date().toISOString()
            });
            return newUser.save();
        },
        login: async (_: any, args: { email: string | null, username: string | null, password: string }, context: ContextType) => {
            const {email, username, password} = args;
            validateInput(validationSchemas.loginValidationSchema, {email, password});
            const user = await User.findOne({$or: [{email}, {username}].filter(Boolean)});
            if (!user || !await bcrypt.compare(password, user.password)) throw new Error('Invalid credentials!');

            const token = generateJwt(user._id.toString());
            manageJwtCookie(context, token);

            return user;
        },
        logout: (_: any, __: any, context: ContextType) => {
            manageJwtCookie(context);
            return true;
        },
        updateUser: async (_: any, {updateFields}: { updateFields: UpdateUserInput }, context: ContextType) => {
            validateInput(validationSchemas.updateValidationSchema, updateFields);
            const userId = verifyAuthenticatedUser(context);
            return await updateUserFields(userId, updateFields);
        },
        updatePassword: async (_: any, {password}: { password: string }, context: ContextType) => {
            validateInput(validationSchemas.updatePasswordValidationSchema, {password})
            const userId = verifyAuthenticatedUser(context);
            if (!password) throw new Error('Password cannot be empty!');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            return await updateUserFields(userId, {password: hashedPassword});
        },
        updateLocation: async (_: any, {location}: { location: UpdateLocation }, context: ContextType) => {
            validateInput(validationSchemas.updateLocationValidationSchema, {location});
            const userId = verifyAuthenticatedUser(context);
            return await updateUserFields(userId, {location: location});
        },
        updateEmail: async (_: any, {email}: { email: string }, context: ContextType) => {
            validateInput(validationSchemas.updateEmailValidationSchema, {email})
            const userId = verifyAuthenticatedUser(context);
            return await updateUserFields(userId, {email: email});
        },
        deleteUser: async (_: any, __: any, context: ContextType) => {
            const userId = verifyAuthenticatedUser(context);
            return await User.findByIdAndDelete(userId);
        },
    }
};
