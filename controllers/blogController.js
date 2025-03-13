const blogService = require('../services/blogService');

const resolvers = {
  Query: {
    blogs: async () => blogService.getBlogs(),
    blog: async (_, { id }) => blogService.getBlogById(id),
  },
  Mutation: {
    createBlog: async (_, { input }, { user }) => {
      if (!user || !user._id) {
        throw new Error('Please login to create a blog');
      }

      const blogData = {
        ...input,
        author: user._id,
      };

      return blogService.createBlog(blogData);
    },
    updateBlog: async (_, { id, input }, context) => {
      if (!context.user) {
        throw new Error('Authentication required to update a blog');
      }
      return blogService.updateBlog(id, input);
    },
    deleteBlog: async (_, { id }, context) => {
      if (!context.user) {
        throw new Error('Authentication required to delete a blog');
      }
      return blogService.deleteBlog(id);
    },
  },
};

module.exports = { resolvers };