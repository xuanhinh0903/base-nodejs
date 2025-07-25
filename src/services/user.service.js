import { User } from '../repository/user.repo.js';

export const getUsersService = async () => {
  try {
    const users = await User.findAll();
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};
