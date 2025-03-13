const userService = require('../services/userService');

const resolvers = {
  Query: {
    getUser: async (_, { email }) => userService.getUserByEmail(email),
  },
  Mutation: {
    createUser: async (_, { input }) => userService.createUser(input),
    loginUser: async (_, { email, password }) => userService.loginUser(email, password),
    updateUser: async (_, { id, input }) => userService.updateUser(id, input),
    deleteUser: async (_, { id }) => userService.deleteUser(id),
    forgotPassword: async (_, { email }) => {
      const otp = userService.generateOTP();
      await userService.updateUser(email, { otp });
      return otp;
    },
    verifyOtp: async (_, { email, otp }) => userService.verifyOTP(email, otp),
    updatePassword: async (_, { email, password }) => userService.updatePassword(email, password),
  },
};

module.exports = { resolvers };
