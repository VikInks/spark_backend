import {User} from '../../infrastructure/model/user.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UserInterface from "../../domain/interface/model/user.interface";
import {
    loginValidationSchema,
    signUpValidationSchema,
    updateAvatarValidationSchema,
    updateEmailValidationSchema,
    updateLocationValidationSchema,
    updatePasswordValidationSchema,
    updateValidationSchema
} from "../../infrastructure/dataValidation/mutation.validation";
import {ContextType, QueryArgs, UpdateUserInput} from "../../domain/interface/mutation/utils.mutation.interface";

function updateUserFields(userId: string, updateFields: object) {
    return User.findByIdAndUpdate(
        userId,
        {...updateFields, updated: new Date().toISOString()},
        {new: true}
    );
}

function verifyAuthenticatedUser(context: ContextType) {
    if (!context.user) throw new Error('You are not authenticated!');
    return context.user.id
}

export const resolvers = {
    Query: {
        me: async (_: any, __: any, context: ContextType) => {
            const userId = verifyAuthenticatedUser(context);
            return User.findById(userId);
        },
    },
    Mutation: {
        signUp: async (_: any, args: { user: UserInterface }, context: ContextType) => {
            const { error } = signUpValidationSchema.validate(args.user);
            if (error) throw new Error(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
            const newUser = new User({
                ...args.user,
                created: new Date().toISOString(),
                updated: new Date().toISOString(),
            });
            return await newUser.save();
        },
        login: async (_: any, {username, password}: QueryArgs, context: ContextType) => {
            const { error } = loginValidationSchema.validate({username, password});
            if (error) throw new Error(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
            const user = await User.findOne({username});
            if (!user) throw new Error('Invalid credentials!');
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) throw new Error('Invalid credentials!');

            const token = jwt.sign({id: user.id}, process.env.SECRET ?? 'SECRET_KEY', {expiresIn: '1h'});
            context.res.setHeader('Set-Cookie', `jwt=${token}; HttpOnly; Path=/; Max-Age=${60 * 60}`);
            return token;
        },
        logout: (_: any, __: any, {context}: { context: ContextType }) => {
            verifyAuthenticatedUser(context);
            context.res.setHeader('Set-Cookie', 'jwt=; HttpOnly; Path=/; Max-Age=0');
            return true;
        },
        updateUser: (_: any, {updateFields}: { updateFields: UpdateUserInput }, context: ContextType) => {
            const { error } = updateValidationSchema.validate(updateFields);
            if (error) throw new Error(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
            const userId = verifyAuthenticatedUser(context);
            return updateUserFields(userId, updateFields);
        },
        updatePassword: async (_: any, {password}: { password: string }, context: ContextType) => {
            const { error } = updatePasswordValidationSchema.validate({password});
            if (error) throw new Error(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
            const userId = verifyAuthenticatedUser(context);
            if (!password) throw new Error('Password cannot be empty!');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            return updateUserFields(userId, {password: hashedPassword});
        },
        updateAvatar: (_: any, {avatar}: { avatar: string }, {context}: { context: ContextType }) => {
            const { error } = updateAvatarValidationSchema.validate({avatar});
            if (error) throw new Error(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
            const userId = verifyAuthenticatedUser(context);
            return updateUserFields(userId, {avatar: avatar});
        },
        updateLocation: (_: any, {location}: { location: any }, {context}: { context: ContextType }) => {
            const { error } = updateLocationValidationSchema.validate({location});
            if (error) throw new Error(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
            const userId = verifyAuthenticatedUser(context);
            return updateUserFields(userId, {location: location});
        },
        updateEmail: (_: any, {newEmail}: { newEmail: string }, {context}: { context: ContextType }) => {
            const { error } = updateEmailValidationSchema.validate({newEmail});
            if (error) throw new Error(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
            const userId = verifyAuthenticatedUser(context);
            return updateUserFields(userId, {email: newEmail});
        },
        deleteUser: (_: any, __: any, context: ContextType) => {
            const userId = verifyAuthenticatedUser(context);
            return User.findByIdAndDelete(userId);
        },
    }
};
