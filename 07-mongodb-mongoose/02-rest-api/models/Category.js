const mongoose = require('mongoose');
const connection = require('../libs/connection');
const transformer = require('../utils/transformer');

const subCategorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
});

subCategorySchema.set('toJSON', transformer);

const categorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  subcategories: [subCategorySchema],
});

categorySchema.set('toJSON', transformer);

module.exports = connection.model('Category', categorySchema);
