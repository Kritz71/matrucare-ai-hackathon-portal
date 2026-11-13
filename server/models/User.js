import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true, minlength: 3, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  password: { type: String, required: true, select: false },
  isVerified: { type: Boolean, default: false },
  otpHash: { type: String, select: false },
  otpExpires: { type: Date, select: false }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
