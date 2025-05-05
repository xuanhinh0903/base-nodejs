import userService from '../servisces/user.service.js';

class UserController {
  /**
   * Tạo người dùng mới
   * @param {Request} req - Express request
   * @param {Response} res - Express response
   */
  async createUser(req, res) {
    try {
      const userData = req.body;
      const user = await userService.createUser(userData);

      res.status(201).json({
        success: true,
        data: user.toJSON(),
        message: 'User created successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to create user'
      });
    }
  }

  /**
   * Lấy danh sách người dùng
   * @param {Request} req - Express request
   * @param {Response} res - Express response
   */
  async getUsers(req, res) {
    try {
      const options = req.validatedQuery || req.query;
      const result = await userService.getUsers(options);

      res.status(200).json({
        success: true,
        ...result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to get users'
      });
    }
  }

  /**
   * Lấy thông tin một người dùng
   * @param {Request} req - Express request
   * @param {Response} res - Express response
   */
  async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(id);

      res.status(200).json({
        success: true,
        data: user.toJSON()
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message || 'User not found'
      });
    }
  }

  /**
   * Cập nhật thông tin người dùng
   * @param {Request} req - Express request
   * @param {Response} res - Express response
   */
  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const updatedUser = await userService.updateUser(id, updateData);

      res.status(200).json({
        success: true,
        data: updatedUser.toJSON(),
        message: 'User updated successfully'
      });
    } catch (error) {
      res.status(error.message === 'User not found' ? 404 : 400).json({
        success: false,
        message: error.message || 'Failed to update user'
      });
    }
  }

  /**
   * Xóa người dùng
   * @param {Request} req - Express request
   * @param {Response} res - Express response
   */
  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      await userService.deleteUser(id);

      res.status(200).json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message || 'Failed to delete user'
      });
    }
  }

  /**
   * Lấy tất cả người dùng không phân trang
   * @param {Request} req - Express request
   * @param {Response} res - Express response
   */
  async getAllUsers(req, res) {
    try {
      const users = await userService.getAllUsers();

      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to get users'
      });
    }
  }
}

export default new UserController(); 