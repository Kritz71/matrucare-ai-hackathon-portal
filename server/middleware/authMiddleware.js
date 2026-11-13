import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const protect = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Authentication required' });
  let payload;
  try { payload = jwt.verify(token, process.env.JWT_SECRET); }
  catch { return res.status(401).json({ message: 'Session expired. Please log in again.' }); }
  const user = await User.findById(payload.id);
  if (!user || !user.isVerified) return res.status(401).json({ message: 'Account unavailable' });
  req.user = user;
  next();
});
