import { getProfileService } from '../services/profile.service.js';
import { status } from 'http-status';

export const getProfile = async (req, res) => {
  try {
    const profile = await getProfileService(req.user.userId);
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    // eslint-disable-next-line no-unused-vars
    const { password, ...userWithoutPassword } = profile;

    return res.status(200).json({
      message: 'Profile fetched successfully',
      status: status['200_NAME'],
      data: userWithoutPassword,
    });
  } catch (error) {
    console.error('Error getting profile:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
