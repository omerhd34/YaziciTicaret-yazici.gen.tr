import mongoose from 'mongoose';

const ContactSchema = new mongoose.Schema({
 name: {
  type: String,
  required: [true, 'İsim gereklidir'],
  trim: true,
 },
 email: {
  type: String,
  required: [true, 'E-posta gereklidir'],
  trim: true,
  lowercase: true,
 },
 phone: {
  type: String,
  default: '',
  trim: true,
 },
 subject: {
  type: String,
  required: [true, 'Konu gereklidir'],
  trim: true,
 },
 message: {
  type: String,
  required: [true, 'Mesaj gereklidir'],
  trim: true,
 },
 read: {
  type: Boolean,
  default: false,
 },
}, {
 timestamps: true,
});

export default mongoose.models.Contact || mongoose.model('Contact', ContactSchema);

