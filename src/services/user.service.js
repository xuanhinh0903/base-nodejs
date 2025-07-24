import { User } from '../models/user.model.js';

export const getUsersService = async () => {
  try {
    const users = await User.findAll();
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};
