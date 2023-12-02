import {ContextType} from "../src/domain/interface/mutation/utils.mutation.interface";
import {User} from "../src/infrastructure/model/user.model";
import {resolvers} from "../src/application/graphql/resolvers";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { mock } from "jest-mock-extended";
import UserInterface from "../src/domain/interface/model/user.interface";


describe('User Authentication and Management', () => {
    const mockContext = mock<ContextType>();
    const mockUser: UserInterface = {
        id: '1',
        firstName: 'test',
        lastName: 'user',
        email: 'test@example.com',
        phone: '+41000000000',
        username: 'testUser',
        password: 'testPassword',
        location: {
            address: 'test 1',
            city: 'test',
            state: 'test',
            zip: '0000',
            country: 'test',
        },
        avatar: '',
        active: true,
        created: new Date(),
        updated: new Date(),
    }
    const mockUserSignup = {
        firstName: 'test',
        lastName: 'user',
        email: 'test@example.com',
        phone: '+41000000000',
        username: 'testUser',
        password: 'testPassword',
        location: {
            address: 'test 1',
            city: 'test',
            state: 'test',
            zip: '0000',
            country: 'test',
        },
        avatar: '',
    };

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
        mockContext.user = mockUser;
    });

    describe('Get current user', () => {
        it('returns user data when authenticated user queries for their own data', async () => {
            jest.spyOn(User, 'findById').mockResolvedValue(mockUser);
            const result = await resolvers.Query.me(null, null, mockContext);
            expect(result).toEqual(mockUser);
        });

        it('throws error when unauthenticated user queries for their own data', async () => {
            mockContext.user = null;
            await expect(resolvers.Query.me(null, null, mockContext)).rejects.toThrow('You are not authenticated!');
        });
    });

    describe('User sign up', () => {
        it('creates a new user with valid data', async () => {
            const userForSignUp = mockUserSignup;
            jest.spyOn(User.prototype, 'save').mockResolvedValue(userForSignUp);
            const result = await resolvers.Mutation.signUp(null, { user: userForSignUp }, mockContext);
            expect(result).toMatchObject(userForSignUp);
        });

        it('throws error when user with invalid data tries to sign up', async () => {
            await expect(resolvers.Mutation.signUp(null, { user: { ...mockUser, username: '' } }, mockContext)).rejects.toThrow();
        });
    });

    describe('User login', () => {
        it('returns a token when user with valid credentials tries to login', async () => {
            jest.spyOn(User, 'findOne').mockResolvedValue(mockUser);
            jest.spyOn(bcrypt, 'compare').mockImplementation(() => { throw new Error("mocked error") });
            jest.spyOn(jwt, 'sign').mockImplementation(() => { /* do nothing */ });
            const result = await resolvers.Mutation.login(null, { username: 'testUser', password: 'testPassword' }, mockContext);
            expect(result).toEqual('token');
        });

        it('throws error when user with invalid credentials tries to login', async () => {
            jest.spyOn(User, 'findOne').mockResolvedValue(null);
            await expect(resolvers.Mutation.login(null, { username: 'testUser', password: 'testPassword' }, mockContext)).rejects.toThrow('Invalid credentials!');
        });
    });

    describe('User logout', () => {
        it('logs out the user when authenticated user tries to logout', async () => {
            const result = await resolvers.Mutation.logout(null, null, { context: mockContext });
            expect(result).toEqual(true);
        });

        it('throws error when unauthenticated user tries to logout', async () => {
            mockContext.user = null;
            await expect(resolvers.Mutation.logout(null, null, {context: mockContext})).rejects.toThrow('You are not authenticated!');
        });
    });

    // Similar tests can be written for updateUser, updatePassword, updateAvatar, updateLocation, updateEmail, and deleteUser mutations
    describe('Update user', () => {
        it('updates user when authenticated user tries to update their own data', async () => {
            jest.spyOn(User, 'findByIdAndUpdate').mockResolvedValue(mockUser);
            const result = await resolvers.Mutation.updateUser(null, { updateFields: { username: 'newUsername' } }, mockContext);
            expect(result).toEqual(mockUser);
        });

        it('throws error when unauthenticated user tries to update their own data', async () => {
            mockContext.user = null;
            await expect(resolvers.Mutation.updateUser(null, { updateFields: { username: 'newUsername' } }, mockContext)).rejects.toThrow('You are not authenticated!');
        });
    });

    describe('Update password', () => {
        it('updates password when authenticated user tries to update their own password', async () => {
            jest.spyOn(User, 'findByIdAndUpdate').mockResolvedValue(mockUser);
            const result = await resolvers.Mutation.updatePassword(null, { password: 'newPassword' }, mockContext);
            expect(result).toEqual(mockUser);
        });

        it('throws error when unauthenticated user tries to update their own password', async () => {
            mockContext.user = null;
            await expect(resolvers.Mutation.updatePassword(null, { password: 'newPassword' }, mockContext)).rejects.toThrow('You are not authenticated!');
        });
    });

    describe('Update email', () => {
        it('updates email when authenticated user tries to update their own email', async () => {
            jest.spyOn(User, 'findByIdAndUpdate').mockResolvedValue(mockUser);
            const result = await resolvers.Mutation.updateEmail(null, { newEmail: 'test@example.com' }, {context: mockContext});
            expect(result).toEqual(mockUser);
        });

        it('throws error when unauthenticated user tries to update their own email', async () => {
            mockContext.user = null;
            await expect(resolvers.Mutation.updateEmail(null, { newEmail: 'newEmail' }, {context: mockContext})).rejects.toThrow('You are not authenticated!');
        });
    });

    describe('Update avatar', () => {
        it('updates avatar when authenticated user tries to update their own avatar', async () => {
            jest.spyOn(User, 'findByIdAndUpdate').mockResolvedValue(mockUser);
            const result = await resolvers.Mutation.updateAvatar(null, { avatar: 'newAvatar' }, {context: mockContext});
            expect(result).toEqual(mockUser);
        });

        it('throws error when unauthenticated user tries to update their own avatar', async () => {
            mockContext.user = null;
            await expect(resolvers.Mutation.updateAvatar(null, { avatar: 'newAvatar' }, {context: mockContext})).rejects.toThrow('You are not authenticated!');
        });
    });

    describe('Update location', () => {
        it('updates location when authenticated user tries to update their own location', async () => {
            jest.spyOn(User, 'findByIdAndUpdate').mockResolvedValue(mockUser);
            const result = await resolvers.Mutation.updateLocation(null, { location: 'newLocation' }, {context: mockContext});
            expect(result).toEqual(mockUser);
        });

        it('throws error when unauthenticated user tries to update their own location', async () => {
            mockContext.user = null;
            await expect(resolvers.Mutation.updateLocation(null, { location: 'newLocation' }, {context: mockContext})).rejects.toThrow('You are not authenticated!');
        });
    });

    describe('Delete user', () => {
        it('deletes user when authenticated user tries to delete their own account', async () => {
            jest.spyOn(User, 'findByIdAndDelete').mockResolvedValue(mockUser);
            const result = await resolvers.Mutation.deleteUser(null, null, mockContext);
            expect(result).toEqual(mockUser);
        });

        it('throws error when unauthenticated user tries to delete their own account', async () => {
            mockContext.user = null;
            await expect(resolvers.Mutation.deleteUser(null, null, mockContext)).rejects.toThrow('You are not authenticated!');
        });
    });
});