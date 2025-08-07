import ApiError from '../helper/apiError.js';
import httpStatus from 'http-status';
import PassportService from '../services/passport.service.js';
import UserDao from '../dao/user.dao.js';
import TokenDao from '../dao/token.dao.js';
import RedisService from '../services/redis.service.js';
import { tokenTypes } from '../config/tokens.js';

class PassportAuthMiddleware {
  constructor() {
    this.passportService = new PassportService();
  }

  authenticate() {
    return async (req, res, next) => {
      try {
        // Extract token từ request headers
        const token = this.passportService.extractToken(req);

        if (!token) {
          return next(
            new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'),
          );
        }

        // Verify token sử dụng PassportService
        const payload = await this.passportService.verifyToken(token);

        if (!payload) {
          return next(new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token'));
        }

        // Kiểm tra token trong database/Redis
        const userDao = new UserDao();
        const tokenDao = new TokenDao();
        const redisService = new RedisService();

        let tokenDoc = await redisService.hasToken(token, 'access_token');
        if (!tokenDoc) {
          console.log('Cache Missed!');
          tokenDoc = await tokenDao.findOne({
            token: token,
            type: tokenTypes.ACCESS,
            blacklisted: false,
          });
        }

        if (!tokenDoc) {
          return next(
            new ApiError(
              httpStatus.UNAUTHORIZED,
              'Token not found or blacklisted',
            ),
          );
        }

        // Lấy user information
        let user = await redisService.getUser(payload.sub);
        if (!user) {
          console.log('User Cache Missed!');
          user = await userDao.findOneByWhere({ uuid: payload.sub });
          if (user) {
            redisService.setUser(user);
          }
        }

        if (!user) {
          return next(new ApiError(httpStatus.UNAUTHORIZED, 'User not found'));
        }

        // Set user vào request object
        req.user = user;
        next();
      } catch (error) {
        console.error('Passport Auth Error:', error);
        return next(
          new ApiError(httpStatus.UNAUTHORIZED, 'Authentication failed'),
        );
      }
    };
  }
}

// Export instance để sử dụng
const passportAuthMiddleware = new PassportAuthMiddleware();
export { passportAuthMiddleware };
