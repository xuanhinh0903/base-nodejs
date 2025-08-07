import TokenDao from '../dao/token.dao.js';
import UserDao from '../dao/user.dao.js';
import httpStatus from 'http-status';
import bcrypt from 'bcrypt';
import logger from '../config/logger.js';
import PassportService from './passport.service.js';

class AuthService {
  constructor() {
    this.userDao = new UserDao();
    this.tokenDao = new TokenDao();
    this.passportService = new PassportService();
  }

  async loginWithEmailPassword(email, password) {
    try {
      const message = 'Login Successful';
      const statusCode = httpStatus.OK;
      let user = await this.userDao.findByEmail(email);
      if (!user) {
        return {
          statusCode: httpStatus.BAD_REQUEST,
          message: 'Invalid Email Address!',
        };
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      user = user.toJSON();
      delete user.password;

      if (!isPasswordValid) {
        return {
          statusCode: httpStatus.BAD_REQUEST,
          message: 'Wrong Password!',
        };
      }

      // Tạo access token và refresh token sử dụng PassportService
      const accessToken = this.passportService.generateAccessToken(user.uuid);
      const refreshToken = this.passportService.generateRefreshToken(user.uuid);

      return {
        statusCode,
        message,
        data: {
          user,
          accessToken,
          refreshToken,
        },
      };
    } catch (e) {
      logger.error(e);
      return {
        statusCode: httpStatus.BAD_GATEWAY,
        message: 'Something Went Wrong!!',
      };
    }
  }

  async registerUser(userData) {
    try {
      const message = 'Registration Successful';
      const statusCode = httpStatus.CREATED;

      // Kiểm tra email đã tồn tại
      const existingUser = await this.userDao.findByEmail(userData.email);
      if (existingUser) {
        return {
          statusCode: httpStatus.BAD_REQUEST,
          message: 'Email already exists!',
        };
      }

      // Tạo user mới
      const newUser = await this.userDao.create(userData);

      // Tạo access token và refresh token
      const accessToken = this.passportService.generateAccessToken(
        newUser.uuid,
      );
      const refreshToken = this.passportService.generateRefreshToken(
        newUser.uuid,
      );

      return {
        statusCode,
        message,
        data: {
          user: newUser,
          accessToken,
          refreshToken,
        },
      };
    } catch (e) {
      logger.error(e);
      return {
        statusCode: httpStatus.BAD_GATEWAY,
        message: 'Something Went Wrong!!',
      };
    }
  }

  async refreshToken(refreshToken) {
    try {
      const message = 'Token refreshed successfully';
      const statusCode = httpStatus.OK;

      // Verify refresh token
      const payload =
        await this.passportService.verifyRefreshToken(refreshToken);

      if (!payload) {
        return {
          statusCode: httpStatus.UNAUTHORIZED,
          message: 'Invalid refresh token!',
        };
      }

      // Lấy user từ database
      const user = await this.userDao.findOneByWhere({ uuid: payload.sub });
      if (!user) {
        return {
          statusCode: httpStatus.NOT_FOUND,
          message: 'User not found!',
        };
      }

      // Tạo access token mới
      const newAccessToken = this.passportService.generateAccessToken(
        user.uuid,
      );
      const newRefreshToken = this.passportService.generateRefreshToken(
        user.uuid,
      );

      return {
        statusCode,
        message,
        data: {
          user,
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        },
      };
    } catch (e) {
      logger.error(e);
      return {
        statusCode: httpStatus.UNAUTHORIZED,
        message: 'Invalid refresh token!',
      };
    }
  }

  async logout(_userId) {
    try {
      const message = 'Logout successful';
      const statusCode = httpStatus.OK;

      // Có thể thêm logic để blacklist tokens ở đây
      // await this.tokenDao.blacklistUserTokens(userId);

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

export default AuthService;
