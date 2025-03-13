const Blog = require('../models/Blog');
const redis = require('redis');
const client = redis.createClient({
  url: process.env.REDIS_URL
});

client.connect().then(() => console.log('Redis connected in blog service'));

const BLOG_CACHE_KEY = 'blogs:all';
const BLOG_KEY_PREFIX = 'blog:';

const createBlog = async (blogData) => {
  try {
    const blog = await Blog.create(blogData);
    const populatedBlog = await blog.populate('author');
    
    // Invalidate the all blogs cache
    await client.del(BLOG_CACHE_KEY);
    // Cache the new blog
    await client.set(
      `${BLOG_KEY_PREFIX}${blog.id}`, 
      JSON.stringify(populatedBlog)
    );
    
    return populatedBlog;
  } catch (error) {
    console.error('Blog creation error:', error);
    throw new Error('Failed to create blog');
  }
};

const getBlogs = async () => {
  // Try to get from cache first
  const cachedBlogs = await client.get(BLOG_CACHE_KEY);
  if (cachedBlogs) {
    return JSON.parse(cachedBlogs);
  }

  // If not in cache, get from DB and cache it
  const blogs = await Blog.find().populate('author');
  await client.set(BLOG_CACHE_KEY, JSON.stringify(blogs));
  return blogs;
};

const getBlogById = async (id) => {
  // Try to get from cache first
  const cachedBlog = await client.get(`${BLOG_KEY_PREFIX}${id}`);
  if (cachedBlog) {
    return JSON.parse(cachedBlog);
  }

  // If not in cache, get from DB and cache it
  const blog = await Blog.findById(id).populate('author');
  if (blog) {
    await client.set(`${BLOG_KEY_PREFIX}${id}`, JSON.stringify(blog));
  }
  return blog;
};

const updateBlog = async (id, data) => {
  const updatedBlog = await Blog.findByIdAndUpdate(
    id, 
    data, 
    { new: true }
  ).populate('author');

  if (updatedBlog) {
    // Update the blog in cache
    await client.set(
      `${BLOG_KEY_PREFIX}${id}`, 
      JSON.stringify(updatedBlog)
    );
    // Invalidate the all blogs cache
    await client.del(BLOG_CACHE_KEY);
  }

  return updatedBlog;
};

const deleteBlog = async (id) => {
  const blog = await Blog.findByIdAndDelete(id);
  
  if (blog) {
    // Remove blog from cache
    await client.del(`${BLOG_KEY_PREFIX}${id}`);
    // Invalidate the all blogs cache
    await client.del(BLOG_CACHE_KEY);
  }

  return blog;
};

module.exports = {
  createBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
};