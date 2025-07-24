import { getUsersService } from '../services/user.service.js';

export const getUsers = async (req, res) => {
  try {
    const users = await getUsersService();
    return res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
