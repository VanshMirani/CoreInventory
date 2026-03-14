const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const emailService = require('../services/emailService');
const { query } = require('../config/db');

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password required' });
    }
    const existing = await userModel.findByEmail(email);
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const id = await userModel.create(name, email, passwordHash, 'user');
    const user = await userModel.findById(id);
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || 'electrostock-secret',
      { expiresIn: '7d' }
    );
    res.status(201).json({ user, token });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }
    const user = await userModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const { password_hash, ...safeUser } = user;
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || 'electrostock-secret',
      { expiresIn: '7d' }
    );
    res.json({ user: safeUser, token });
  } catch (err) {
    next(err);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email required' });
    }
    const user = await userModel.findByEmail(email);
    if (!user) {
      return res.status(400).json({ message: 'Email not found' });
    }
    const otp = emailService.generateOTP();
    const expires = new Date(Date.now() + 10 * 60 * 1000);
    await userModel.updateResetToken(email, otp, expires);
    await emailService.sendOTPEmail(email, otp);
    res.json({ message: 'OTP sent to your email' });
  } catch (err) {
    next(err);
  }
};

const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP required' });
    }
    const user = await userModel.findByResetToken(otp);
    if (!user || user.email !== email) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
    res.json({ message: 'OTP verified successfully' });
  } catch (err) {
    next(err);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password || password.length < 6) {
      return res.status(400).json({ message: 'Valid email and password (min 6 chars) required' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    await query(
      'UPDATE users SET password_hash = ?, reset_token = NULL, reset_expires = NULL WHERE email = ?',
      [passwordHash, email]
    );
    res.json({ message: 'Password reset successful' });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, getMe, forgotPassword, verifyOtp, resetPassword };

