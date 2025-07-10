// User Service - Business Logic Layer
// Handles all business logic related to users
import userModel from '../models/user.model.js';
import bcrypt from 'bcrypt';

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
  const { name, email, password } = userData;

  // Hash password with bcrypt (salt rounds = 12)
  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash(password.trim(), saltRounds);

  // Call model layer to save user to database
  const newUser = await userModel.createUser({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password: hashedPassword,
  });

  return newUser;
};

/**
 * Verify user password
 * @param {string} plainPassword - Plain text password
 * @param {string} hashedPassword - Hashed password from database
 * @returns {Promise<boolean>} - True if password matches
 */
const verifyPassword = async (plainPassword, hashedPassword) => {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (error) {
    throw new Error(`Password verification error: ${error.message}`);
  }
};

/**
 * Authenticate user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object|null>} - User data if authenticated, null otherwise
 */
const authenticateUser = async (email, password) => {
  try {
    // Get user by email (includes password)
    const user = await userModel.getUserByEmail(email);

    if (!user) return null;

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password);

    if (!isPasswordValid) return null;

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    throw new Error(`Authentication error: ${error.message}`);
  }
};

export {
  getAllUsers,
  getUserById,
  createUser,
  authenticateUser,
  verifyPassword,
};
