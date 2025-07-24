import { loginService, registerService } from '../services/auth.service.js';
import { status } from 'http-status';

export const login = async (req, res) => {
  try {
    const token = await loginService(req, res);

    return res
      .status(200)
      .json({ message: 'Login successful', status: status['201_NAME'], token });
  } catch (error) {
    console.error('Error logging in:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const register = async (req, res) => {
  try {
    const newUser = await registerService(req.body);
    if (!newUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    return res.status(201).json({
      message: 'User created successfully',
      status: status['201_NAME'],
      data: newUser,
    });
  } catch (error) {
    console.error('Error registering:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
