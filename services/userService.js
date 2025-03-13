const User = require('../models/User');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const redis = require('redis');
const client = redis.createClient();
const jwt = require('jsonwebtoken');
require('dotenv').config();
client.connect();

const createUser = async (data) => {
  data.password = await bcrypt.hash(data.password, 10);
  const user = await User.create(data);
  await client.set(`user:${user.email}`, JSON.stringify(user));
  return user;
};

const loginUser = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error('User not found');
  
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Incorrect password');
  
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    return { token };
  };

const getUserByEmail = async (email) => {
  const cachedUser = await client.get(`user:${email}`);
  if (cachedUser) {
    return JSON.parse(cachedUser);
  }
  const user = await User.findOne({ email });
  if (user) {
    await client.set(`user:${email}`, JSON.stringify(user));
  }
  return user;
};

const updateUser = async (id, data) => {
  const updatedUser = await User.findByIdAndUpdate(id, data, { new: true });
  if (updatedUser) {
    await client.set(`user:${updatedUser.email}`, JSON.stringify(updatedUser));
  }
  return updatedUser;
};

const deleteUser = async (id) => {
  const user = await User.findByIdAndDelete(id);
  if (user) {
    await client.del(`user:${user.email}`);
  }
  return user;
};

const generateOTP = () => crypto.randomInt(100000, 999999).toString();

const verifyOTP = async (email, otp) => {
  const user = await getUserByEmail(email);
  return user && user.otp === otp;
};

const updatePassword = async (email, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const updatedUser = await User.findOneAndUpdate(
    { email },
    { password: hashedPassword },
    { new: true }
  );
  if (updatedUser) {
    await client.set(`user:${email}`, JSON.stringify(updatedUser));
  }
  return updatedUser;
};

module.exports = {
  createUser,
  getUserByEmail,
  updateUser,
  deleteUser,
  generateOTP,
  verifyOTP,
  updatePassword,
  loginUser,
};