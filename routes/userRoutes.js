const { gql } = require('apollo-server-express');
const { resolvers } = require('../controllers/userController');

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    gender: String
    dob: String
  }

  type AuthPayload {
    token: String!
  }

  input UserInput {
    name: String!
    email: String!
    password: String!
    gender: String
    dob: String
  }

  type Query {
    getUser(email: String!): User
  }

  type Mutation {
    createUser(input: UserInput!): User
    loginUser(email: String!, password: String!): AuthPayload
    updateUser(id: ID!, input: UserInput!): User
    deleteUser(id: ID!): String
    forgotPassword(email: String!): String
    verifyOtp(email: String!, otp: String!): Boolean
    updatePassword(email: String!, password: String!): User
  }
`;

module.exports = { typeDefs, resolvers };
