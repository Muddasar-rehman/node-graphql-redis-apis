const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { typeDefs: userTypeDefs, resolvers: userResolvers } = require('./routes/userRoutes');
const { typeDefs: blogTypeDefs, resolvers: blogResolvers } = require('./routes/blogRoutes');
const { typeDefs: serviceTypeDefs, resolvers: serviceResolvers } = require('./routes/servicesRoutes');

const authMiddleware = require('./middleware/authMiddleware');

dotenv.config();

const app = express();

const server = new ApolloServer({
  typeDefs: [userTypeDefs, blogTypeDefs , serviceTypeDefs],
  resolvers: [userResolvers, blogResolvers , serviceResolvers],
  context: async ({ req }) => {
    const user = await authMiddleware(req);
    return { user };
  },
});

const startServer = async () => {
  await server.start();
  server.applyMiddleware({ app });

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }

  app.listen(4000, () =>
    console.log(`Server running on http://localhost:4000${server.graphqlPath}`)
  );
};

startServer();