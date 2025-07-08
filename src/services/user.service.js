// User Service - Business Logic Layer
// Handles all business logic related to users
import userModel from '../models/user.model.js';

const getAllUsers = async (options = {}) => {
  // Extract pagination and search options
  const { page = 1, limit = 10, search = '' } = options;

  // Business logic: Validate pagination parameters
  const validatedLimit = Math.min(Math.max(limit, 1), 100);
  const validatedPage = Math.max(page, 1);

  // Call model layer to get data from database
  const users = await userModel.getAllUsers({
    page: validatedPage,
    limit: validatedLimit,
    search: search.trim(),
  });

  return users;
};

const getUserById = async id => {
  // Call model layer to get user from database
  const user = await userModel.getUserById(id);
  return user;
};

const createUser = async userData => {
  // Business logic: Validate required fields
  const { name, email } = userData;

  if (!name || !email) {
    throw new Error('Name and email are required');
  }

  // Business logic: Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('Invalid email format');
  }

  // Call model layer to save user to database
  const newUser = await userModel.createUser({
    name: name.trim(),
    email: email.toLowerCase().trim(),
  });

  return newUser;
};

export { getAllUsers, getUserById, createUser };
