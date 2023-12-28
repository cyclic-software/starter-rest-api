const gql = require('graphql-tag');

const typeDefs = gql`
  type Query {
    users: [User!]!
    getUserById(userId: ID!): User
  }

  type User {
    id: String
    userName: String!
    email: String!
    firstName: String!
    lastName: String!
  }

  type Mutation {
    addUser(
      firstName: String!
      lastName: String!
      email: String!
      userName: String!
    ): String!
  }
`;

module.exports = typeDefs;
