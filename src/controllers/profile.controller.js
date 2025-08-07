import ProfileService from '../services/profile.service.js';

class ProfileController {
  constructor() {
    this.profileService = new ProfileService();
  }

  async getProfile(req, res) {
    const userId = req.user.id; // Lấy user ID từ middleware
    const result = await this.profileService.getProfile(userId);
    return res.status(result.statusCode).json(result);
  }

  async updateProfile(req, res) {
    const userId = req.user.id;
    const profileData = req.body;
    const result = await this.profileService.updateProfile(userId, profileData);
    return res.status(result.statusCode).json(result);
  }

  async changePassword(req, res) {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;
    const result = await this.profileService.changePassword(
      userId,
      oldPassword,
      newPassword,
    );
    return res.status(result.statusCode).json(result);
  }
}

// Export instance để sử dụng
const profileController = new ProfileController();
export { profileController };
