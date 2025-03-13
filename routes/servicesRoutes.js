const { gql } = require('apollo-server-express');
const serviceController = require('../controllers/serviceController');

const typeDefs = gql`
  type Service {
    id: ID!
    serviceName: String!
    description: String!
    portfolio: String
    education: String
    city: String
    designation: String
    user: User!
    createdAt: String
    updatedAt: String
  }

  input ServiceInput {
    serviceName: String!
    description: String!
    portfolio: String
    education: String
    city: String
    designation: String
  }

  type Query {
    services: [Service]
    service(id: ID!): Service
  }

  type Mutation {
    createService(input: ServiceInput!): Service
    updateService(id: ID!, input: ServiceInput!): Service
    deleteService(id: ID!): Service
  }
`;

const resolvers = {
  Query: {
    services: serviceController.getServicesByUser,
    service: serviceController.getServiceById,
  },
  Mutation: {
    createService: serviceController.createService,
    updateService: serviceController.updateService,
    deleteService: serviceController.deleteService,
  },
};

module.exports = { typeDefs, resolvers };
