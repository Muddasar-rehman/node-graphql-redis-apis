const { gql } = require('apollo-server-express');
const { resolvers } = require('../controllers/blogController');

const typeDefs = gql`
  type Blog {
    id: ID!
    title: String!
    content: String!
    image: String
    description: String!
    blogUrl: String!
    author: User!
    createdAt: String
    updatedAt: String
  }

  input BlogInput {
    title: String!
    content: String!
    image: String
    description: String!
    blogUrl: String!
  }

  type Query {
    blogs: [Blog]
    blog(id: ID!): Blog
  }

  type Mutation {
    createBlog(input: BlogInput!): Blog
    updateBlog(id: ID!, input: BlogInput!): Blog
    deleteBlog(id: ID!): Blog
  }
`;

module.exports = { typeDefs, resolvers };