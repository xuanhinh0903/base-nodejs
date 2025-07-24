import { User } from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const registerService = async user => {
  try {
    const { email, password, ...rest } = user;
    const findUser = await User.findOne(email);
    if (findUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email,
      password: hashedPassword,
      ...rest,
      role: 'user',
    });
    return newUser;
  } catch (error) {
    console.error('Error registering:', error);
    throw error;
  }
};

export const loginService = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });

    return token;
  } catch (error) {
    console.error('Error logging in:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
