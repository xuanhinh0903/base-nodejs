import { authenticateUser } from '../services/user.service.js';
import { JWT_SECRET } from '../utils/crypto.js';
import { handleServiceError } from '../utils/errorHandler.js';
import validateUser from '../validations/user.validation.js';
import jwt from 'jsonwebtoken';

/**
 * User login
 * Controller: Handles authentication with email and password
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate login data
    const validation = await validateUser.login({ email, password });

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Invalid login data',
        details: validation.errors,
      });
    }

    // Authenticate user
    const user = await authenticateUser(email, password);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication Failed',
        message: 'Invalid email or password',
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role || 'user',
        address: user.wallet_address,
      },
      JWT_SECRET,
      { expiresIn: '24h' },
    );

    // Return success response with user data
    return res.status(200).json({
      success: true,
      message: 'Login successfully',
      token,
    });
  } catch (error) {
    return handleServiceError(error, res, 'login');
  }
};

export { login };
