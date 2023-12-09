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
    
    type Query {
        images: [Image]
        image(id: ID!): Image
        count_parkingImages: Int
    }
    
    type Mutation {
        createImage(userId: String!, type: String!, name: String!): Image
        updateImage(id: ID!, userId: String, type: String, name: String): Image
        deleteImage(id: ID!): Image
    }
`;