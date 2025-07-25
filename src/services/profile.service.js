import { User } from '../repository/user.repo.js';

export const getProfileService = async userId => {
  try {
    const profile = await User.findById(userId);
    if (!profile) {
      return null;
    }
    return profile;
  } catch (error) {
    console.error('Error getting profile:', error);
    throw error;
  }
};
