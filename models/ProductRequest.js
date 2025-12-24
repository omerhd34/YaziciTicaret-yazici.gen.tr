import mongoose from 'mongoose';

const ProductRequestSchema = new mongoose.Schema({
 userId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
  required: false,
 },
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
 productName: {
  type: String,
  required: [true, 'Ürün adı gereklidir'],
  trim: true,
 },
 productDescription: {
  type: String,
  default: '',
  trim: true,
 },
 brand: {
  type: String,
  default: '',
  trim: true,
 },
 model: {
  type: String,
  default: '',
  trim: true,
 },
 status: {
  type: String,
  enum: ['Beklemede', 'Onaylandı', 'Reddedildi', 'İptal Edildi'],
  default: 'Beklemede',
  required: true,
 },
 adminResponse: {
  type: String,
  default: '',
  trim: true,
 },
 respondedAt: {
  type: Date,
 },
 respondedBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Admin',
 },
}, {
 timestamps: true,
});

if (mongoose.models.ProductRequest) {
 delete mongoose.models.ProductRequest;
}

export default mongoose.model('ProductRequest', ProductRequestSchema);

