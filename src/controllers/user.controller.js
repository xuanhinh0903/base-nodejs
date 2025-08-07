import UserService from '../services/user.service.js';

class UserController {
  constructor() {
    this.userService = new UserService();
  }

  async getUsers(req, res) {
    const result = await this.userService.getAllUsers();
    return res.status(result.statusCode).json(result);
  }

  async getUserById(req, res) {
    const { id } = req.params;
    const result = await this.userService.getUserById(id);
    return res.status(result.statusCode).json(result);
  }

  async createUser(req, res) {
    const userData = req.body;
    const result = await this.userService.createUser(userData);
    return res.status(result.statusCode).json(result);
  }

  async updateUser(req, res) {
    const { id } = req.params;
    const userData = req.body;
    const result = await this.userService.updateUser(id, userData);
    return res.status(result.statusCode).json(result);
  }

  async deleteUser(req, res) {
    const { id } = req.params;
    const result = await this.userService.deleteUser(id);
    return res.status(result.statusCode).json(result);
  }
}

// Export instance để sử dụng
const userController = new UserController();
export { userController };
