const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true, enum: ['Saree', 'Salwars', 'Nightwear'] },
  subCategory: { type: String, default: '' },
  image: { type: String, required: true },
  description: { type: String, required: true },
  stock: { type: Number, required: true, default: 0 },
  manufacturerPrice: { type: Number, default: 0 },
  bestseller: { type: Boolean, default: false },
  smChoice: { type: Boolean, default: false },
  popular: { type: Boolean, default: false },
  trending: { type: Boolean, default: false }
}, {
  timestamps: true
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
