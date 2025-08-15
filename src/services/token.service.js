import moment from 'moment/moment.js';
import TokenDao from '../dao/token.dao.js';
import { tokenTypes } from '../config/tokens.js';
import PassportService from './passport.service.js';

class TokenService {
  constructor() {
    this.tokenDao = new TokenDao();
    this.passportService = new PassportService();
  }

  generateToken(uuid, expires, type, secret = null) {
    // Sử dụng PassportService để tạo token
    // Nếu không truyền secret, PassportService sẽ sử dụng config.jwt.secret
    return this.passportService.generateToken(uuid, expires, type, secret);
  }

  async saveMultipleTokens(tokens) {
    await this.tokenDao.bulkCreate(tokens);
  }

  async generateAuthTokens(user) {
    console.log('🔍 Debug - User object in generateAuthTokens:', user);
    console.log('🔍 Debug - User object keys:', Object.keys(user));
    console.log('🔍 Debug - User ID:', user.id);
    console.log('🔍 Debug - User dataValues:', user.dataValues);

    const accessTokenExpires = moment().add(5, 'minutes');

    const accessToken = await this.generateToken(
      user.id,
      accessTokenExpires,
      tokenTypes.ACCESS,
    );

    const refreshTokenExpires = moment().add(5, 'days');
    const refreshToken = await this.generateToken(
      user.id,
      refreshTokenExpires,
      tokenTypes.REFRESH,
    );

    const authTokens = [];
    authTokens.push({
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    });
    authTokens.push({
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    });

    // Save tokens to database
    // await this.saveMultipleTokens(authTokens);
    // const expiredAccessTokenWhere = {
    //   expires: {
    //     [Op.lt]: moment(),
    //   },
    //   type: tokenTypes.ACCESS,
    // };
    // await this.tokenDao.remove(expiredAccessTokenWhere);
    // const expiredRefreshTokenWhere = {
    //   expires: {
    //     [Op.lt]: moment(),
    //   },
    //   type: tokenTypes.REFRESH,
    // };
    // await this.tokenDao.remove(expiredRefreshTokenWhere);
    // const tokens = {
    //   access: {
    //     token: accessToken,
    //     expires: accessTokenExpires.toDate(),
    //   },
    //   refresh: {
    //     token: refreshToken,
    //     expires: refreshTokenExpires.toDate(),
    //   },
    // };
    // await this.redisService.createTokens(user.uuid, tokens);

    return authTokens;

    // return { accessToken, refreshToken };
  }
}

export default TokenService;
