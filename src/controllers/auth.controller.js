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
    return res.status(result.statusCode).json(result);
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

// Export instance để sử dụng
const authController = new AuthController();
export { authController };
