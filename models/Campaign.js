import mongoose from 'mongoose';

const CampaignSchema = new mongoose.Schema({
 title: {
  type: String,
  required: [true, 'Kampanya başlığı gereklidir'],
  trim: true,
 },
 description: {
  type: String,
  default: '',
  trim: true,
 },
 image: {
  type: String,
  required: [true, 'Kampanya görseli gereklidir'],
 },
 link: {
  type: String,
  default: '/kategori/indirim',
  trim: true,
 },
 isActive: {
  type: Boolean,
  default: true,
 },
 order: {
  type: Number,
  default: 0,
 },
 endDate: {
  type: Date,
  default: null,
 },
 productCodes: {
  type: [String],
  default: [],
  trim: true,
 },
 campaignPrice: {
  type: Number,
  default: null,
 },
}, {
 timestamps: true,
});

export default mongoose.models.Campaign || mongoose.model('Campaign', CampaignSchema);

