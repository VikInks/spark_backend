import gql from "graphql-tag";

export const typeDefs = gql`
  input UserInput {
    username: String!
    password: String!
    email: String!
    phone: String!
    firstName: String!
    lastName: String!
    avatar: String
    active: Boolean
    location: LocationInput
  }

  input LocationInput {
    address: String!
    city: String!
    state: String!
    zip: String!
    country: String!
  }
  
  type Location {
    address: String!
    city: String!
    state: String!
    zip: String!
    country: String!
    created: String
    updated: String
  }

  type User {
    id: ID!
    username: String!
    password: String!
    email: String!
    phone: String!
    firstName: String!
    lastName: String!
    avatar: String
    active: Boolean
    location: Location
    created: String
    updated: String
  }

  type Query {
    me: User
  }

  type Mutation {
    signUp(user: UserInput!): User
    login(username: String!, password: String!): String
    logout: Boolean
    updateUser(updateFields: UserInput!): User
    deleteUser: User
    updatePassword(password: String!): User
    updateAvatar(avatar: String!): User
    updateLocation(location: LocationInput!): User
    updateEmail(newEmail: String!): User
  }
`;
