import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sendOtpEmail } from '../utils/sendEmail.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const namePattern = /^[\p{L}][\p{L}\s.'-]{1,78}$/u;
const createOtp = () => String(crypto.randomInt(100000, 1000000));
const hashOtp = (otp) => crypto.createHash('sha256').update(otp).digest('hex');

export const signup = asyncHandler(async (req, res) => {
  const { fullName, email, password, confirmPassword } = req.body;
  if (!namePattern.test(fullName || '')) return res.status(400).json({ message: 'Enter a valid full name (letters only).' });
  if (!emailPattern.test(email || '')) return res.status(400).json({ message: 'Enter a valid email address.' });
  if (typeof password !== 'string' || password.length < 8) return res.status(400).json({ message: 'Password must contain at least 8 characters.' });
  if (password !== confirmPassword) return res.status(400).json({ message: 'Passwords do not match.' });
  const normalizedEmail = email.toLowerCase().trim();
  let user = await User.findOne({ email: normalizedEmail }).select('+password +otpHash +otpExpires');
  if (user?.isVerified) return res.status(409).json({ message: 'An account with this email already exists. Please log in.' });
  const otp = createOtp();
  const passwordHash = await bcrypt.hash(password, 12);
  if (!user) user = new User({ fullName: fullName.trim(), email: normalizedEmail, password: passwordHash });
  else { user.fullName = fullName.trim(); user.password = passwordHash; }
  user.otpHash = hashOtp(otp);
  user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
  await user.save();
  await sendOtpEmail(user.email, otp);
  res.status(201).json({ message: 'Verification code sent. Check your inbox.', email: user.email });
});

export const verifyOtp = asyncHandler(async (req, res) => {
  const email = String(req.body.email || '').toLowerCase().trim();
  const otp = String(req.body.otp || '');
  if (!/^\d{6}$/.test(otp)) return res.status(400).json({ message: 'Enter the 6-digit verification code.' });
  const user = await User.findOne({ email }).select('+otpHash +otpExpires');
  if (!user || user.isVerified || !user.otpHash || !user.otpExpires || user.otpExpires <= new Date() || user.otpHash !== hashOtp(otp)) {
    return res.status(400).json({ message: 'Invalid or expired verification code. Request a new one.' });
  }
  user.isVerified = true; user.otpHash = undefined; user.otpExpires = undefined;
  await user.save();
  res.json({ message: 'Email verified successfully. You can now log in.' });
});

export const resendOtp = asyncHandler(async (req, res) => {
  const email = String(req.body.email || '').toLowerCase().trim();
  const user = await User.findOne({ email }).select('+otpHash +otpExpires');
  if (!user || user.isVerified) return res.status(404).json({ message: 'Pending verification account not found.' });
  const otp = createOtp();
  user.otpHash = hashOtp(otp); user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
  await user.save();
  await sendOtpEmail(email, otp);
  res.json({ message: 'A new verification code has been sent.' });
});

export const login = asyncHandler(async (req, res) => {
  const email = String(req.body.email || '').toLowerCase().trim();
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await bcrypt.compare(req.body.password || '', user.password))) return res.status(401).json({ message: 'Invalid email or password.' });
  if (!user.isVerified) return res.status(403).json({ message: 'Please verify your email before logging in.' });
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) throw new Error('JWT_SECRET must be at least 32 characters');
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user._id, fullName: user.fullName, email: user.email } });
});
