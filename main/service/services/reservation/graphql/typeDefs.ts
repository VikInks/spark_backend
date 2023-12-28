import gql from "graphql-tag";

export const reservationTypeDefs = gql`
    type Reservation {
        id: ID!
        userId: String!
        parkingId: String!
        startDate: String!
        endDate: String!
        price: Float!
        status: String!
    }
    
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
        reservations: [Reservation]
        reservation(id: ID!): Reservation
    }
    
    extend type Mutation {
        createReservation(reservation: ReservationInput!): Reservation
        updateReservation(id: ID!, reservation: ReservationInput!): Reservation
        deleteReservation(id: ID!): Reservation
    }
`;