// import {
//     ContextType,
//     QueryArgs, UpdateLocation,
//     UpdateUserInput,
//     UserInput
// } from "../src/domain/interface/mutation/utils.mutation.interface";
// import {User} from "../src/infrastructure/model/user.model";
// import {resolvers} from "../src/application/graphql/resolvers";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import {mock} from "jest-mock-extended";
// import UserInterface from "../src/domain/interface/model/user.interface";
// import {ServerResponse} from "http";
//
//
// describe('User Authentication and Management', () => {
//     const mockRes = mock<ServerResponse>();
//     mockRes.setHeader.mockImplementation(() => mockRes);
//
//     const mockContext = mock<ContextType>();
//
//     const mockUser: UserInterface = {
//         id: '1',
//         firstName: 'test',
//         lastName: 'user',
//         email: 'test@example.com',
//         phone: '+41000000000',
//         username: 'testUser',
//         password: 'testPassword',
//         location: {
//             address: 'test 1',
//             city: 'test',
//             state: 'test',
//             zip: '0000',
//             country: 'test',
//         },
//         active: true,
//         created: new Date(),
//         updated: new Date(),
//     }
//
//     const mockUserSignup: UserInput = {
//         firstName: 'test',
//         lastName: 'user',
//         email: 'test@example.com',
//         phone: '+41000000000',
//         username: 'testUser',
//         password: 'testPassword',
//         location: {
//             address: 'test 1',
//             city: 'test',
//             state: 'test',
//             zip: '0000',
//             country: 'test',
//         }
//     };
//
//     const mockUserLogin: QueryArgs = {
//         username: 'testUser',
//         email: 'test@example.com',
//         password: 'testPassword',
//     };
//
//     const mockUserUpdateLocation: { location: UpdateLocation } = {
//         location: {
//             address: 'test 1',
//             city: 'test',
//             state: 'test',
//             zip: '0000',
//             country: 'test',
//         }
//     }
//
//     beforeEach(() => {
//         jest.clearAllMocks();
//         mockContext.user = mockUser.id;
//         mockContext.res.setHeader = jest.fn();
//         const mockJwtToken = jwt.sign({id: mockUser.id}, process.env.SECRET ?? 'SECRET_KEY');
//         mockContext.req.headers = {
//             cookie: `jwt=${mockJwtToken}`
//         };
//     });
//
//     describe('Get current user', () => {
//         it('returns user data when authenticated user queries for their own data', async () => {
//             jest.spyOn(User, 'findById').mockResolvedValue(mockUser);
//             const result = await resolvers.Query.me(null, null, mockContext);
//             expect(result).toEqual(mockUser);
//         });
//
//         it('throws error when unauthenticated user queries for their own data', async () => {
//             mockContext.user = null;
//             await expect(resolvers.Query.me(null, null, mockContext)).rejects.toThrow('You are not authenticated!');
//         });
//     });
//
//     describe('User sign up', () => {
//         it('creates a new user with valid data', async () => {
//             const userForSignUp = mockUserSignup;
//             jest.spyOn(User.prototype, 'save').mockResolvedValue(userForSignUp);
//             const result = await resolvers.Mutation.signUp(null, {user: userForSignUp}, mockContext);
//             expect(result).toMatchObject(userForSignUp);
//         });
//
//         it('throws error when user with invalid data tries to sign up', async () => {
//             await expect(resolvers.Mutation.signUp(null, {
//                 user: {
//                     ...mockUser,
//                     username: ''
//                 }
//             }, mockContext)).rejects.toThrow();
//         });
//     });
//
//     describe('User login', () => {
//         it('returns a token when user with valid credentials tries to login', async () => {
//             jest.spyOn(User, 'findOne').mockResolvedValue(mockUser);
//             (jest.spyOn(bcrypt, 'compare') as jest.Mock).mockResolvedValue(true);
//             const expectedToken = jwt.sign({id: mockUser.id}, process.env.SECRET_KEY ?? 'SECRET_KEY');
//             (jest.spyOn(jwt, 'sign') as jest.Mock).mockReturnValue(expectedToken);
//             const result = await resolvers.Mutation.login(null, mockUserLogin, mockContext);
//             expect(result).toEqual(expectedToken);
//         });
//
//         it('throws error when user with invalid credentials tries to login', async () => {
//             jest.spyOn(User, 'findOne').mockResolvedValue(null);
//             await expect(resolvers.Mutation.login(null, mockUserLogin, mockContext)).rejects.toThrow('Invalid credentials!');
//         });
//     });
//
//     describe('User logout', () => {
//         it('logs out the user when authenticated user tries to logout', () => {
//             expect(resolvers.Mutation.logout(null, null, mockContext)).toEqual(true);
//         });
//
//         it('throws error when unauthenticated user tries to logout', () => {
//             mockContext.user = null;
//             expect(() => resolvers.Mutation.logout(null, null, mockContext)).toThrow('You are not authenticated!');
//         });
//     });
//
//     describe('Update user', () => {
//         it('updates user when authenticated user tries to update their own data', async () => {
//             jest.spyOn(User, 'findByIdAndUpdate').mockResolvedValue(mockUser);
//             const result = await resolvers.Mutation.updateUser(null, {updateFields: {username: 'newUsername'}}, mockContext);
//             expect(result).toEqual(mockUser);
//         });
//
//         it('throws error when unauthenticated user tries to update their own data', async () => {
//             mockContext.user = null;
//             await expect(resolvers.Mutation.updateUser(null, {updateFields: {username: 'newUsername'}}, mockContext)).rejects.toThrow('You are not authenticated!');
//         });
//     });
//
//     describe('Update password', () => {
//         it('updates password when authenticated user tries to update their own password', async () => {
//             jest.spyOn(User, 'findByIdAndUpdate').mockResolvedValue(mockUser);
//             const result = await resolvers.Mutation.updatePassword(null, {password: 'newPassword'}, mockContext);
//             expect(result).toEqual(mockUser);
//         });
//
//         it('throws error when unauthenticated user tries to update their own password', async () => {
//             mockContext.user = null;
//             await expect(resolvers.Mutation.updatePassword(null, {password: 'newPassword'}, mockContext)).rejects.toThrow('You are not authenticated!');
//         });
//     });
//
//     describe('Update email', () => {
//         it('updates email when authenticated user tries to update their own email', async () => {
//             jest.spyOn(User, 'findByIdAndUpdate').mockResolvedValue(mockUser);
//             const result = await resolvers.Mutation.updateEmail(null, {email: 'test@example.com'}, mockContext);
//             expect(result).toEqual(mockUser);
//         });
//
//         it('throws error when unauthenticated user tries to update their own email', async () => {
//             mockContext.user = null;
//             await expect(resolvers.Mutation.updateEmail(null, {email: 'newemail@test.com'}, mockContext)).rejects.toThrow('You are not authenticated!');
//         });
//     });
//
//     describe('Update location', () => {
//         it('updates location when authenticated user tries to update their own location', async () => {
//             jest.spyOn(User, 'findByIdAndUpdate').mockResolvedValue(mockUser);
//             const result = await resolvers.Mutation.updateLocation(null, mockUserUpdateLocation, mockContext);
//             expect(result).toEqual(mockUser);
//         });
//
//         it('throws error when unauthenticated user tries to update their own location', async () => {
//             mockContext.user = null;
//             await expect(resolvers.Mutation.updateLocation(null, mockUserUpdateLocation, mockContext)).rejects.toThrow('You are not authenticated!');
//         });
//     });
//
//     describe('Delete user', () => {
//         it('deletes user when authenticated user tries to delete their own account', async () => {
//             jest.spyOn(User, 'findByIdAndDelete').mockResolvedValue(mockUser);
//             const result = await resolvers.Mutation.deleteUser(null, null, mockContext);
//             expect(result).toEqual(mockUser);
//         });
//
//         it('throws error when unauthenticated user tries to delete their own account', async () => {
//             mockContext.user = null;
//             await expect(resolvers.Mutation.deleteUser(null, null, mockContext)).rejects.toThrow('You are not authenticated!');
//         });
//     });
// });