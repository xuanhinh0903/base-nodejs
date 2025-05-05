import User from '../models/user.model.js';

// Simulate database with an array of users
const users = [];
let nextId = 1;

class UserService {
  /**
   * Create a new user
   * @param {Object} userData - User data
   * @returns {User} User object
   */
  async createUser(userData) {
    // Check if email already exists
    const existingUser = users.find(user => user.email === userData.email);
    if (existingUser) {
      throw new Error('Email already exists');
    }

    // Create new user with auto-increment ID
    const newUser = new User({
      ...userData,
      id: nextId++
    });

    // Save to "database"
    users.push(newUser);
    return newUser;
  }

  /**
   * Get user list with pagination
   * @param {Object} options - Pagination options
   * @returns {Object} User list and pagination information
   */
  async getUsers(options = {}) {
    const { page = 1, pageSize = 10, orderBy = 'createdAt', sortBy = 'DESC' } = options;
    
    // Sort
    const sortedUsers = [...users].sort((a, b) => {
      if (sortBy === 'ASC') {
        return a[orderBy] > b[orderBy] ? 1 : -1;
      } else {
        return a[orderBy] < b[orderBy] ? 1 : -1;
      }
    });
    
    // Pagination
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedUsers = sortedUsers.slice(startIndex, endIndex);
    
    // Convert to safe JSON (without password)
    const usersData = paginatedUsers.map(user => user.toJSON());
    
    return {
      data: usersData,
      pagination: {
        page,
        pageSize,
        total: users.length,
        totalPages: Math.ceil(users.length / pageSize)
      }
    };
  }

  /**
   * Get user information by ID
   * @param {number} id - User ID
   * @returns {User} User object
   */
  async getUserById(id) {
    const user = users.find(user => user.id === Number(id));
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  /**
   * Update user information
   * @param {number} id - User ID
   * @param {Object} updateData - Update data
   * @returns {User} Updated user
   */
  async updateUser(id, updateData) {
    const userIndex = users.findIndex(user => user.id === Number(id));
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    // If email changes, check for duplicates
    if (updateData.email && updateData.email !== users[userIndex].email) {
      const existingUser = users.find(user => user.email === updateData.email);
      if (existingUser) {
        throw new Error('Email already exists');
      }
    }

    // Update information
    const updatedUser = {
      ...users[userIndex],
      ...updateData,
      updatedAt: new Date()
    };

    // Save to "database"
    users[userIndex] = new User(updatedUser);
    return users[userIndex];
  }

  /**
   * Delete user
   * @param {number} id - User ID
   * @returns {boolean} Deletion result
   */
  async deleteUser(id) {
    const userIndex = users.findIndex(user => user.id === Number(id));
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    users.splice(userIndex, 1);
    return true;
  }

  /**
   * Get all users without pagination
   * @returns {Array} Array of all users
   */
  async getAllUsers() {
    return users.map(user => user.toJSON());
  }
}

export default new UserService(); 