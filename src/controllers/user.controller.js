import {
  getAllUsers as getAllUsersService,
  getUserById as getUserByIdService,
  createUser as createUserService,
} from '../services/user.service.js';
import { handleServiceError } from '../utils/errorHandler.js';
import validateUser from '../validations/user.validation.js';

/**
 * Get all users
 * Controller: Handles HTTP request/response, delegates to service
 */
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;

    const validation = await validateUser.list({
      page: parseInt(page),
      limit: parseInt(limit),
      search: search,
    });

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Invalid query parameters',
        details: validation.errors,
      });
    }

    // Call service layer to get data
    const result = await getAllUsersService(validation.data);

    // Return success response with data and pagination info
    return res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: result.users,
      pagination: result.pagination,
    });
  } catch (error) {
    return handleServiceError(error, res, 'getAllUsers');
  }
};

/**
 * Get user by ID
 * Controller: Handles HTTP request/response, delegates to service
 */
const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    // Validate user ID
    const validation = await validateUser.id(parseInt(userId));

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Invalid user ID',
        data: validation.errors,
      });
    }

    // Call service layer to get user data
    const user = await getUserByIdService(validation.data.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'User not found',
      });
    }

    // Return success response with user data
    return res.status(200).json({
      success: true,
      message: 'User retrieved successfully',
      data: user,
    });
  } catch (error) {
    return handleServiceError(error, res, 'getUserById');
  }
};

/**
 * Get current user profile
 * Controller: Returns profile of authenticated user
 */
const getCurrentUserProfile = async (req, res) => {
  try {
    // User information is available from JWT token
    const { userId } = req.user;

    // Get full user data from database
    const user = await getUserByIdService(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'User profile not found',
      });
    }

    // Return success response with user profile
    return res.status(200).json({
      success: true,
      message: 'User profile retrieved successfully',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      },
    });
  } catch (error) {
    return handleServiceError(error, res, 'getCurrentUserProfile');
  }
};

/**
 * Update current user profile
 * Controller: Updates profile of authenticated user
 */
const updateCurrentUserProfile = async (req, res) => {
  try {
    const { userId: _userId } = req.user;
    const updateData = req.body;

    // Validate update data
    const validation = await validateUser.update(updateData);

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Invalid update data',
        data: validation.errors,
      });
    }

    // TODO: Implement update user service
    // const updatedUser = await updateUserService(userId, validation.data);

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      // user: updatedUser,
    });
  } catch (error) {
    return handleServiceError(error, res, 'updateCurrentUserProfile');
  }
};

/**
 * Create new user
 * Controller: Handles HTTP request/response, delegates to service
 */
const createUser = async (req, res) => {
  try {
    const userData = req.body;

    // Validate user data
    const validation = await validateUser.create(userData);

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Invalid user data',
        data: validation.errors,
      });
    }

    // Call service layer to create user
    const newUser = await createUserService(validation.data);

    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: newUser,
    });
  } catch (error) {
    return handleServiceError(error, res, 'createUser');
  }
};

export {
  getAllUsers,
  getUserById,
  createUser,
  getCurrentUserProfile,
  updateCurrentUserProfile,
};
