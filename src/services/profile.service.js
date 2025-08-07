import UserDao from '../dao/user.dao.js';
import httpStatus from 'http-status';
import logger from '../config/logger.js';

class ProfileService {
  constructor() {
    this.userDao = new UserDao();
  }

  async getProfile(userId) {
    try {
      const message = 'Profile retrieved successfully';
      const statusCode = httpStatus.OK;
      const user = await this.userDao.findById(userId);

      if (!user) {
        return {
          statusCode: httpStatus.NOT_FOUND,
          message: 'User not found!',
        };
      }

      // Loại bỏ password khỏi response
      const { password: _password, ...userProfile } = user;

      return {
        statusCode,
        message,
        data: userProfile,
      };
    } catch (e) {
      logger.error(e);
      return {
        statusCode: httpStatus.BAD_GATEWAY,
        message: 'Something Went Wrong!!',
      };
    }
  }

  async updateProfile(userId, profileData) {
    try {
      const message = 'Profile updated successfully';
      const statusCode = httpStatus.OK;

      const existingUser = await this.userDao.findById(userId);
      if (!existingUser) {
        return {
          statusCode: httpStatus.NOT_FOUND,
          message: 'User not found!',
        };
      }

      // Cập nhật profile data
      const updatedUser = await this.userDao.update(userId, profileData);

      // Loại bỏ password khỏi response
      const { password: _password, ...userProfile } = updatedUser;

      return {
        statusCode,
        message,
        data: userProfile,
      };
    } catch (e) {
      logger.error(e);
      return {
        statusCode: httpStatus.BAD_GATEWAY,
        message: 'Something Went Wrong!!',
      };
    }
  }

  async changePassword(userId, oldPassword, newPassword) {
    try {
      const message = 'Password changed successfully';
      const statusCode = httpStatus.OK;

      const user = await this.userDao.findById(userId);
      if (!user) {
        return {
          statusCode: httpStatus.NOT_FOUND,
          message: 'User not found!',
        };
      }

      // Verify old password
      const bcrypt = await import('bcrypt');
      const isOldPasswordValid = await bcrypt.compare(
        oldPassword,
        user.password,
      );

      if (!isOldPasswordValid) {
        return {
          statusCode: httpStatus.BAD_REQUEST,
          message: 'Old password is incorrect!',
        };
      }

      // Hash new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      // Update password
      await this.userDao.update(userId, { password: hashedNewPassword });

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

export default ProfileService;
