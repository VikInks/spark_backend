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
    
    type ImageResponse {
        message: String!
        success: Boolean!
    }
    
    extend type Query {
        images: ImageResponse
        image(id: ID!): ImageResponse
        count_parkingImages: ImageResponse
    }
    
    extend type Mutation {
        addImage(userId: String!, type: String!, name: String!, parkingId: String): ImageResponse
        updateImage(id: ID!, userId: String, type: String, name: String, parkingId: String): ImageResponse
        deleteImage(id: ID!): ImageResponse
    }
`;