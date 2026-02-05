// backend/models/MenuItem.js

const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    trim: true,
    default: '/images/placeholder.jpg',
  },
  category: {
    type: String,
    required: true,
    enum: ['breakfast', 'lunch_dinner', 'baked_goods', 'drinks'], // Ensures data integrity
  },
  price: {
    type: Number,
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('MenuItem', menuItemSchema);