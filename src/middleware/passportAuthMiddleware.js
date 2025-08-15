import ApiError from '../helper/apiError.js';
import httpStatus from 'http-status';
import PassportService from '../services/passport.service.js';
import UserDao from '../dao/user.dao.js';
import RedisService from '../services/redis.service.js';

class PassportAuthMiddleware {
  constructor() {
    this.passportService = new PassportService();
  }

  authenticate() {
    return async (req, res, next) => {
      try {
        const token = this.passportService.extractToken(req);

        if (!token) {
          return next(
            new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'),
          );
        }

        const payload = await this.passportService.verifyToken(token);

        if (!payload) {
          return next(new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token'));
        }

        console.log('🔍 Debug - Token payload:', payload);
        console.log('🔍 Debug - User UUID (payload.sub):', payload.sub);

        // Tạm thời bỏ qua việc kiểm tra token trong database
        // Chỉ dựa vào JWT verification đã thực hiện ở trên
        const userDao = new UserDao();
        const redisService = new RedisService();

        console.log(
          '🚀 ~ PassportAuthMiddleware ~ token verified successfully:',
          token,
        );

        // Lấy user information
        let user = await redisService.getUser(payload.sub);
        if (!user) {
          console.log('User Cache Missed!');
          user = await userDao.findOneByWhere({ id: payload.sub });
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
