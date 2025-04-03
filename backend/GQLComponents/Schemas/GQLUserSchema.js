const { gql } = require('apollo-server-express');

const userSchema = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    createdAt: String!
    updatedAt: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    _empty: String
  }

  type Mutation {
    signup(
      username: String!
      email: String!
      password: String!
    ): User

    login(
      email: String!
      password: String!
    ): AuthPayload
  }
`;

module.exports = userSchema;
