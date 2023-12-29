import gql from "graphql-tag";

/**
 * GraphQL base type definitions.
 *
 * @type {import('graphql').DocumentNode}
 */
export const baseTypeDefs = gql`
    scalar JSON

    type Response {
        success: Boolean!
        message: String
        data: JSON
    }
    
    type Query {
        _empty: String
    }

    type Mutation {
        _empty: String
    }
`;
