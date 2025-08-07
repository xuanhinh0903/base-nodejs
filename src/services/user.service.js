import UserDao from '../dao/user.dao.js';
import httpStatus from 'http-status';
import logger from '../config/logger.js';

class UserService {
  constructor() {
    this.userDao = new UserDao();
  }

  async getAllUsers() {
    try {
      const message = 'Users retrieved successfully';
      const statusCode = httpStatus.OK;
      const users = await this.userDao.findAll();

      return {
        statusCode,
        message,
        data: users,
      };
    } catch (e) {
      logger.error(e);
      return {
        statusCode: httpStatus.BAD_GATEWAY,
        message: 'Something Went Wrong!!',
      };
    }
  }

  async getUserById(userId) {
    try {
      const message = 'User retrieved successfully';
      const statusCode = httpStatus.OK;
      const user = await this.userDao.findById(userId);

      if (!user) {
        return {
          statusCode: httpStatus.NOT_FOUND,
          message: 'User not found!',
        };
      }

      return {
        statusCode,
        message,
        data: user,
      };
    } catch (e) {
      logger.error(e);
      return {
        statusCode: httpStatus.BAD_GATEWAY,
        message: 'Something Went Wrong!!',
      };
    }
  }

  async createUser(userData) {
    try {
      const message = 'User created successfully';
      const statusCode = httpStatus.CREATED;

      // Kiểm tra email đã tồn tại
      const existingUser = await this.userDao.findByEmail(userData.email);
      if (existingUser) {
        return {
          statusCode: httpStatus.BAD_REQUEST,
          message: 'Email already exists!',
        };
      }

      const newUser = await this.userDao.create(userData);

      return {
        statusCode,
        message,
        data: newUser,
      };
    } catch (e) {
      logger.error(e);
      return {
        statusCode: httpStatus.BAD_GATEWAY,
        message: 'Something Went Wrong!!',
      };
    }
  }

  async updateUser(userId, userData) {
    try {
      const message = 'User updated successfully';
      const statusCode = httpStatus.OK;

      const existingUser = await this.userDao.findById(userId);
      if (!existingUser) {
        return {
          statusCode: httpStatus.NOT_FOUND,
          message: 'User not found!',
        };
      }

      const updatedUser = await this.userDao.update(userId, userData);

      return {
        statusCode,
        message,
        data: updatedUser,
      };
    } catch (e) {
      logger.error(e);
      return {
        statusCode: httpStatus.BAD_GATEWAY,
        message: 'Something Went Wrong!!',
      };
    }
  }

  async deleteUser(userId) {
    try {
      const message = 'User deleted successfully';
      const statusCode = httpStatus.OK;

      const existingUser = await this.userDao.findById(userId);
      if (!existingUser) {
        return {
          statusCode: httpStatus.NOT_FOUND,
          message: 'User not found!',
        };
      }

      await this.userDao.delete(userId);

      return {
        statusCode,
        message,
        data: null,
      };
    } catch (e) {
      logger.error(e);
      return {
        statusCode: httpStatus.BAD_GATEWAY,
        message: 'Something Went Wrong!!',
      };
    }
  }
}

export default UserService;
