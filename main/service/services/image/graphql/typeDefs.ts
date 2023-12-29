import gql from "graphql-tag";

export const typeDefs = gql`
    type Image {
        id: ID!
        userId: String!
        parkingId: String
        type: String!
        name: String!
        createdAt: String!
        updatedAt: String
    }
    
    extend type Query {
        images: Response
        image(id: ID!): Response
        count_parkingImages: Response
    }
    
    extend type Mutation {
        addImage(userId: String!, type: String!, name: String!, parkingId: String): Response
        updateImage(id: ID!, userId: String, type: String, name: String, parkingId: String): Response
        deleteImage(id: ID!): Response
        deleteAllImages: Response
    }
`;