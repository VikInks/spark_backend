import gql from "graphql-tag";

/**
 * GraphQL base type definitions.
 *
 * @type {import('graphql').DocumentNode}
 */
export const baseTypeDefs = gql`
    type Query {
        _empty: String
    }

    type Mutation {
        _empty: String
    }
`;
