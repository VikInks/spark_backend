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
    cars: [CarsInput]
    phone: String!
    firstName: String!
    lastName: String!
    location: LocationInput
  }
  
  input CarsInput {
    name: String!
    brand: String!
    model: String!
    type: String!
    plug: String
  }
  
  input CarsUpdateInput {
    id: String!
    name: String
    brand: String
    model: String
    type: String
    plug: String
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
    cars: [Cars]
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
  
  type Cars {
    name: String!
    brand: String!
    model: String!
    type: String!
    plug: String
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
    updateCars(cars: [CarsUpdateInput]!): Response
    updateActive: Response
    deleteUser: Response
  }
`;
