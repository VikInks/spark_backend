import gql from "graphql-tag";

export const typeDefs = gql`
    type Parking {
        id: ID!
        name: String!
        address: String!
        price: String!
        userId: String!
        image: String!
        status: String!
    }

    input ParkingInput {
        name: String!
        address: String!
        price: String!
        userId: String!
        image: String!
        status: String!
    }

    input GeoLocation {
        coordinates: [Float]
        radius: Float
    }
    
    input Evaluation {
        userId: String
        rating: Int
    }
    
    input Filter {
        userId: String
        price: Int
        geoLocation: GeoLocation
        evaluation: Evaluation
        capacity: Int
    }
    
    extend type Query {
        getParking(ID: String!): Response
        getParkings(filter: Filter): Response
        getAllParkingHistory: Response
    }

    extend type Mutation {
        createParking(parking: ParkingInput!): Response
        updateParking(id: String!, parking: ParkingInput!): Response
        deleteParking(id: String!): Response
        recoverParking(id: String!): Response
    }
`;