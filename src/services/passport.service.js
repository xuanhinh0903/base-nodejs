import { ExtractJwt } from 'passport-jwt';
import jwt from 'jsonwebtoken';
import moment from 'moment/moment.js';
import { tokenTypes } from '../config/tokens.js';
import config from '../config/config.js';

class PassportService {
  constructor() {
    this.jwtOptions = {
      secretOrKey: config.jwt.secret,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      passReqToCallback: true,
    };
  }

  // Tạo JWT token sử dụng passport-jwt
  generateToken(uuid, expires, type, secret = config.jwt.secret) {
    console.log('🔍 Debug - Generating token with uuid:', uuid);
    console.log('🔍 Debug - Token type:', type);

    const payload = {
      sub: uuid,
      iat: moment().unix(),
      exp: expires.unix(),
      type,
    };

    console.log('🔍 Debug - Token payload:', payload);

    // Sử dụng jsonwebtoken để tạo token (passport-jwt chỉ verify, không tạo)
    return jwt.sign(payload, secret);
  }

  verifyToken(token) {
    return new Promise((resolve, reject) => {
      try {
        console.log('🔍 Debug - Token to verify:', token);
        console.log('🔍 Debug - JWT Secret:', config.jwt.secret);

        // Sử dụng jsonwebtoken.verify trực tiếp thay vì passport-jwt strategy
        const payload = jwt.verify(token, config.jwt.secret);

        // Kiểm tra token type
        if (
          payload.type !== tokenTypes.ACCESS &&
          payload.type !== tokenTypes.REFRESH
        ) {
          return reject(new Error('Invalid token type'));
        }

        console.log('🔍 Debug - Token verified successfully:', payload);
        resolve(payload);
      } catch (error) {
        console.error('🔍 Debug - Token verification failed:', error.message);
        reject(error);
      }
    });
  }

  // Verify chỉ access token
  verifyAccessToken(token) {
    return new Promise((resolve, reject) => {
      try {
        const payload = jwt.verify(token, config.jwt.secret);

        if (payload.type !== tokenTypes.ACCESS) {
          return reject(new Error('Invalid token type'));
        }

        resolve(payload);
      } catch (error) {
        reject(error);
      }
    });
  }

  // Verify chỉ refresh token
  verifyRefreshToken(token) {
    return new Promise((resolve, reject) => {
      try {
        const payload = jwt.verify(token, config.jwt.secret);

        if (payload.type !== tokenTypes.REFRESH) {
          return reject(new Error('Invalid token type'));
        }

        resolve(payload);
      } catch (error) {
        reject(error);
      }
    });
  }

  // Extract token từ request headers
  extractToken(req) {
    return ExtractJwt.fromAuthHeaderAsBearerToken()(req);
  }

  // Tạo access token
  generateAccessToken(uuid) {
    const expires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
    return this.generateToken(uuid, expires, tokenTypes.ACCESS);
  }

  // Tạo refresh token
  generateRefreshToken(uuid) {
    const expires = moment().add(config.jwt.refreshExpirationDays, 'days');
    return this.generateToken(uuid, expires, tokenTypes.REFRESH);
  }
}

export default PassportService;
