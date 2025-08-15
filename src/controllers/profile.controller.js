import ProfileService from '../services/profile.service.js';

class ProfileController {
  constructor() {
    this.profileService = new ProfileService();
  }

  async getProfile(req, res) {
    const userId = req.user.id; // Lấy user ID từ middleware
    const result = await this.profileService.getProfile(userId);

    if (result.statusCode === 200) {
      return res.status(result.statusCode).json({
        status: true,
        message: result.message,
        data: result.data,
      });
    }

    return res.status(result.statusCode).json({
      status: false,
      message: result.message,
    });
  }

  async updateProfile(req, res) {
    const userId = req.user.id;
    const profileData = req.body;
    const result = await this.profileService.updateProfile(userId, profileData);

    if (result.statusCode === 200) {
      return res.status(result.statusCode).json({
        status: true,
        message: result.message,
        data: result.data,
      });
    }

    return res.status(result.statusCode).json({
      status: false,
      message: result.message,
    });
  }

  async changePassword(req, res) {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;
    const result = await this.profileService.changePassword(
      userId,
      oldPassword,
      newPassword,
    );

    if (result.statusCode === 200) {
      return res.status(result.statusCode).json({
        status: true,
        message: result.message,
      });
    }

    return res.status(result.statusCode).json({
      status: false,
      message: result.message,
    });
  }
}

// Export instance để sử dụng
const profileController = new ProfileController();
export { profileController };
