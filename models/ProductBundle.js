import mongoose from 'mongoose';

const ProductBundleSchema = new mongoose.Schema({
 name: {
  type: String,
  default: '',
  trim: true,
 },
 /** Ürün ID'leri (sepette bu ürünlerin hepsi varsa paket fiyatı uygulanır) */
 productIds: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Product',
  required: true,
 }],
 /** Paket kampanya fiyatı (TL) */
 bundlePrice: {
  type: Number,
  required: true,
  min: 0,
 },
 /** Admin tarafında gösterim için ürün kodları (serialNumber) - opsiyonel */
 productCodes: [{
  type: String,
  trim: true,
 }],
}, { timestamps: true });

if (mongoose.models.ProductBundle) {
 delete mongoose.models.ProductBundle;
}

export default mongoose.model('ProductBundle', ProductBundleSchema);
