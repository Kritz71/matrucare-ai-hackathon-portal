import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
  memberName: { type: String, required: true, trim: true },
  memberEmail: { type: String, required: true, lowercase: true, trim: true }
}, { _id: false });

const registrationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  fullName: { type: String, required: true, minlength: 3, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  mobile: { type: String, required: true, match: /^[6-9]\d{9}$/ },
  collegeName: { type: String, required: true, trim: true },
  course: { type: String, required: true },
  branch: { type: String, required: true },
  yearOfStudy: { type: String, required: true },
  domain: { type: String, required: true },
  projectName: { type: String, required: true, minlength: 5, trim: true },
  pptLink: { type: String, required: true },
  prototypeLink: { type: String, required: true },
  demoVideoLink: { type: String, default: '' },
  teamSize: { type: Number, required: true, min: 1, max: 5 },
  teamMembers: { type: [memberSchema], default: [] }
}, { timestamps: true });

export default mongoose.model('Registration', registrationSchema);
