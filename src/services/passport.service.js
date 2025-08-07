import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
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
    const payload = {
      sub: uuid,
      iat: moment().unix(),
      exp: expires.unix(),
      type,
    };

    // Sử dụng jsonwebtoken để tạo token (passport-jwt chỉ verify, không tạo)
    return jwt.sign(payload, secret);
  }

  // Verify JWT token sử dụng passport-jwt strategy
  verifyToken(token) {
    return new Promise((resolve, reject) => {
      const strategy = new JwtStrategy(this.jwtOptions, (payload, done) => {
        try {
          // Cho phép cả access và refresh tokens
          if (
            payload.type !== tokenTypes.ACCESS &&
            payload.type !== tokenTypes.REFRESH
          ) {
            return done(new Error('Invalid token type'), false);
          }
          done(null, payload);
        } catch (error) {
          done(error, false);
        }
      });

      strategy.authenticate(
        { headers: { authorization: `Bearer ${token}` } },
        (err, payload) => {
          if (err) {
            reject(err);
          } else {
            resolve(payload);
          }
        },
      );
    });
  }

  // Verify chỉ access token
  verifyAccessToken(token) {
    return new Promise((resolve, reject) => {
      const strategy = new JwtStrategy(this.jwtOptions, (payload, done) => {
        try {
          if (payload.type !== tokenTypes.ACCESS) {
            return done(new Error('Invalid token type'), false);
          }
          done(null, payload);
        } catch (error) {
          done(error, false);
        }
      });

      strategy.authenticate(
        { headers: { authorization: `Bearer ${token}` } },
        (err, payload) => {
          if (err) {
            reject(err);
          } else {
            resolve(payload);
          }
        },
      );
    });
  }

  // Verify chỉ refresh token
  verifyRefreshToken(token) {
    return new Promise((resolve, reject) => {
      const strategy = new JwtStrategy(this.jwtOptions, (payload, done) => {
        try {
          if (payload.type !== tokenTypes.REFRESH) {
            return done(new Error('Invalid token type'), false);
          }
          done(null, payload);
        } catch (error) {
          done(error, false);
        }
      });

      strategy.authenticate(
        { headers: { authorization: `Bearer ${token}` } },
        (err, payload) => {
          if (err) {
            reject(err);
          } else {
            resolve(payload);
          }
        },
      );
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
