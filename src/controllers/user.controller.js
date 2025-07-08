import {
  getAllUsers as getAllUsersService,
  getUserById as getUserByIdService,
  createUser as createUserService,
} from '../services/user.service.js';
import {
  handleServiceError,
  sendSuccessResponse,
} from '../utils/errorHandler.js';

/**
 * Get all users
 * Controller: Handles HTTP request/response, delegates to service
 */
const getAllUsers = async (req, res) => {
  try {
    // Extract query parameters (already validated by middleware)
    const { page = 1, limit = 10, search = '' } = req.query;

    // Call service layer to get data
    const result = await getAllUsersService({
      page: parseInt(page),
      limit: parseInt(limit),
      search: search,
    });

    // Return success response with data and pagination info
    return sendSuccessResponse(res, 200, 'Users retrieved successfully', {
      users: result.users,
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

    // Call service layer to get user data
    const user = await getUserByIdService(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'User not found',
      });
    }

    // Return success response with user data
    return sendSuccessResponse(res, 200, 'User retrieved successfully', user);
  } catch (error) {
    return handleServiceError(error, res, 'getUserById');
  }
};

/**
 * Create new user
 * Controller: Handles HTTP request/response, delegates to service
 */
const createUser = async (req, res) => {
  try {
    const userData = req.body;

    // Call service layer to create user
    const newUser = await createUserService(userData);

    return sendSuccessResponse(res, 201, 'User created successfully', newUser);
  } catch (error) {
    return handleServiceError(error, res, 'createUser');
  }
};

export { getAllUsers, getUserById, createUser };
