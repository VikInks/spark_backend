import gql from "graphql-tag";

export const typeDefs = gql`
    type ReservationHistory {
        id: ID!
        userId: String!
        parkingId: String!
        startDate: String!
        endDate: String!
        price: Float!
        status: String!
    }
    
    input ReservationInput {
        userId: String!
        parkingId: String!
        startDate: String!
        endDate: String!
        price: Float!
        status: String!
    }
    
    input ReservationHistoryInput {
        userId: String!
        parkingId: String!
        startDate: String!
        endDate: String!
        price: Float!
        status: String!
    }
    
    extend type Query {
        reservations: [Response]
        reservation(id: ID!): Response
    }
    
    extend type Mutation {
        createReservation(reservation: ReservationInput!): Response
        updateReservation(id: ID!, reservation: ReservationInput!): Response
        deleteReservation(id: ID!): Response
    }
`;