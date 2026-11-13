import Registration from '../models/Registration.js';
import { sendConfirmationEmail } from '../utils/sendEmail.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const validUrl = (value) => { try { const u = new URL(value); return ['http:', 'https:'].includes(u.protocol); } catch { return false; } };

export const createRegistration = asyncHandler(async (req, res) => {
  const fields = ['fullName','email','mobile','collegeName','course','branch','yearOfStudy','domain','projectName','pptLink','prototypeLink','teamSize'];
  const missing = fields.filter((key) => req.body[key] === undefined || req.body[key] === null || String(req.body[key]).trim() === '');
  if (missing.length) return res.status(400).json({ message: `Please complete: ${missing.join(', ')}` });
  const data = { ...req.body };
  data.fullName = String(data.fullName).trim();
  data.email = String(data.email).toLowerCase().trim();
  data.mobile = String(data.mobile).trim();
  data.teamSize = Number(data.teamSize);
  if (data.fullName.length < 3 || !/^[\p{L}][\p{L}\s.'-]+$/u.test(data.fullName)) return res.status(400).json({ message: 'Enter a valid full name.' });
  if (data.email !== req.user.email) return res.status(400).json({ message: 'Registration email must match your signed-in account.' });
  if (!/^[6-9]\d{9}$/.test(data.mobile)) return res.status(400).json({ message: 'Enter a valid 10-digit Indian mobile number.' });
  if (data.projectName.length < 5) return res.status(400).json({ message: 'Project name must be at least 5 characters.' });
  if (!Number.isInteger(data.teamSize) || data.teamSize < 1 || data.teamSize > 5) return res.status(400).json({ message: 'Team size must be between 1 and 5.' });
  if (!validUrl(data.pptLink) || !validUrl(data.prototypeLink) || (data.demoVideoLink && !validUrl(data.demoVideoLink))) return res.status(400).json({ message: 'Enter valid http(s) links.' });
  const members = Array.isArray(data.teamMembers) ? data.teamMembers : [];
  if (members.length !== (data.teamSize === 1 ? 0 : data.teamSize)) return res.status(400).json({ message: 'Team member entries must match the selected team size (solo teams need zero extra entries).' });
  for (const m of members) {
    if (!String(m.memberName || '').trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m.memberEmail || '')) return res.status(400).json({ message: 'Each team member needs a name and valid email.' });
  }
  if (await Registration.exists({ userId: req.user._id })) return res.status(409).json({ message: 'You have already registered.' });
  const registration = await Registration.create({ ...data, userId: req.user._id });
  let emailSent = true;
  try { await sendConfirmationEmail(registration.email, registration); }
  catch (error) { emailSent = false; console.error('Confirmation email failed:', error.message); }
  res.status(201).json({ message: emailSent ? 'Registration completed. Confirmation email sent.' : 'Registration saved, but confirmation email could not be sent. Please contact support.', emailSent, registration });
});

export const getMyEntry = asyncHandler(async (req, res) => {
  const registration = await Registration.findOne({ userId: req.user._id });
  res.json({ registration });
});

export const deleteMyEntry = asyncHandler(async (req, res) => {
  const deleted = await Registration.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  if (!deleted) return res.status(404).json({ message: 'Registration not found.' });
  res.json({ message: 'Registration withdrawn.' });
});
