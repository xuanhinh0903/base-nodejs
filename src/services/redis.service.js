import redis from 'redis';

class RedisService {
  constructor() {
    // Tạo Redis client đơn giản
    this.client = redis.createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
    });

    this.client.on('error', err => {
      console.error('Redis Client Error:', err);
    });

    this.client.connect();
  }

  /**
   * Create access and refresh tokens
   * @param {String} uuid
   * @param {Object} tokens
   * @returns {boolean}
   */
  async createTokens(uuid, tokens) {
    try {
      const accessKey = `access_token:${tokens.access.token}`;
      const refreshKey = `refresh_token:${tokens.refresh.token}`;
      const accessKeyExpires =
        (process.env.JWT_ACCESS_EXPIRATION_MINUTES || 30) * 60;
      const refreshKeyExpires =
        (process.env.JWT_REFRESH_EXPIRATION_DAYS || 7) * 24 * 60 * 60;

      await this.client.setEx(accessKey, accessKeyExpires, uuid);
      await this.client.setEx(refreshKey, refreshKeyExpires, uuid);
      return true;
    } catch (error) {
      console.error('Redis createTokens error:', error);
      return false;
    }
  }

  /**
   * Check if token exists
   * @param {String} token
   * @param {String} type [access_token,refresh_token]
   * @returns {boolean}
   */
  async hasToken(token, type = 'access_token') {
    try {
      const hasToken = await this.client.get(`${type}:${token}`);
      return hasToken !== null;
    } catch (error) {
      console.error('Redis hasToken error:', error);
      return false;
    }
  }

  /**
   * Remove token
   * @param {String} token
   * @param {String} type [access_token,refreshToken]
   * @returns {boolean}
   */
  async removeToken(token, type = 'access_token') {
    try {
      const result = await this.client.del(`${type}:${token}`);
      return result > 0;
    } catch (error) {
      console.error('Redis removeToken error:', error);
      return false;
    }
  }

  /**
   * Get user
   * @param {String} uuid
   * @returns {Object/Boolean}
   */
  async getUser(uuid) {
    try {
      const user = await this.client.get(`user:${uuid}`);
      if (user !== null) {
        return JSON.parse(user);
      }
      return false;
    } catch (error) {
      console.error('Redis getUser error:', error);
      return false;
    }
  }

  /**
   * Set user
   * @param {Object} user
   * @returns {boolean}
   */
  async setUser(user) {
    try {
      const result = await this.client.set(
        `user:${user.uuid}`,
        JSON.stringify(user),
      );
      return result === 'OK';
    } catch (error) {
      console.error('Redis setUser error:', error);
      return false;
    }
  }
}

export default RedisService;
