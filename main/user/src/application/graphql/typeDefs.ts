import gql from "graphql-tag";

export const typeDefs = gql`
  input UserInput {
    username: String!
    password: String!
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

  type Query {
    me: User
  }

  type Mutation {
    signUp(user: UserInput!): User
    login(username: String, email: String, password: String!): String
    logout: Boolean
    updateUser(updateFields: UserInput!): User
    updatePassword(password: String!): User
    updateLocation(location: LocationInput!): User
    updateEmail(newEmail: String!): User
    deleteUser: User
  }
`;
