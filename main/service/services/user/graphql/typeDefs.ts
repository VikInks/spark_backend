import gql from "graphql-tag";


/**
 * The variable "typeDefs" contains the GraphQL type definitions for a user management system.
 *
 * The type definitions include input types, object types, query and mutation types.
 *
 * @type {string}
 */
export const typeDefs = gql`
  input UserInput {
    username: String!
    email: String!
    password: String!
    phone: String!
    firstName: String!
    lastName: String!
    location: LocationInput
  }

  input LocationInput {
    address: String!
    city: String!
    state: String!
    zip: String!
    country: String!
  }

  type User {
    id: ID!
    username: String!
    email: String!
    phone: String!
    password: String!
    firstName: String!
    lastName: String!
    active: Boolean
    location: Location
    created: String
    updated: String
  }

  type Location {
    address: String!
    city: String!
    state: String!
    zip: String!
    country: String!
  }
  
  type Response {
    success: Boolean!
    message: String
  }

  extend type Query {
    me: Response
  }

  extend type Mutation {
    signUp(user: UserInput!): Response
    login(email: String, username: String, password: String!): Response 
    logout: Response
    updateUser(updateFields: UserInput!): Response
    updatePassword(password: String!): Response
    updateLocation(location: LocationInput!): Response
    updateEmail(newEmail: String!): Response
    updateActive: Response
    deleteUser: Response
  }
`;
