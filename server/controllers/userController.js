import { asyncHandler } from '../utils/asyncHandler.js';

export const getMe = asyncHandler(async (req, res) => {
  res.json({ user: { id: req.user._id, fullName: req.user.fullName, email: req.user.email, createdAt: req.user.createdAt } });
});

export const updateMe = asyncHandler(async (req, res) => {
  const fullName = String(req.body.fullName || '').trim();
  if (!/^[\p{L}][\p{L}\s.'-]{1,78}$/u.test(fullName)) return res.status(400).json({ message: 'Enter a valid full name.' });
  req.user.fullName = fullName;
  await req.user.save();
  res.json({ user: { id: req.user._id, fullName: req.user.fullName, email: req.user.email } });
});
