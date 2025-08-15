import AuthService from '../services/auth.service.js';

class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  async login(req, res) {
    const { email, password } = req.body;
    const result = await this.authService.loginWithEmailPassword(
      email,
      password,
    );

    // Nếu login thành công, trả về tokens
    if (result.statusCode === 200) {
      return res.status(result.statusCode).json({
        status: true,
        message: result.message,
        data: result.data.user,
        tokens: {
          access: {
            token: result.data.accessToken,
            expires: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
          },
          refresh: {
            token: result.data.refreshToken,
            expires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days
          },
        },
      });
    }

    return res.status(result.statusCode).json({
      status: false,
      message: result.message,
    });
  }

  async register(req, res) {
    const userData = req.body;
    const result = await this.authService.registerUser(userData);
    return res.status(result.statusCode).json(result);
  }

  async refreshToken(req, res) {
    const { refreshToken } = req.body;
    const result = await this.authService.refreshToken(refreshToken);
    return res.status(result.statusCode).json(result);
  }

  async logout(req, res) {
    const userId = req.user?.id;
    const result = await this.authService.logout(userId);
    return res.status(result.statusCode).json(result);
  }
}

const authController = new AuthController();
export { authController };
