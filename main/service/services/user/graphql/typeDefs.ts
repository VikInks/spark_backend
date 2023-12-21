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

  extend type Query {
    me: Boolean
  }

  extend type Mutation {
    signUp(user: UserInput!): Boolean
    login(email: String, username: String, password: String!): Boolean 
    logout: Boolean
    updateUser(updateFields: UserInput!): Boolean
    updatePassword(password: String!): Boolean
    updateLocation(location: LocationInput!): Boolean
    updateEmail(newEmail: String!): Boolean
    updateActive: Boolean
    deleteUser: Boolean
  }
`;
