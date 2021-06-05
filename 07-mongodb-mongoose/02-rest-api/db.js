// const mongoose = require('mongoose');
// const connection = require('./libs/connection');
const Category = require('./models/Category');
const Product = require('./models/Product');

(async () => {
  await Category.deleteMany();
  await Product.deleteMany();

  const category = await Category.create({
    title: 'Category1',
    subcategories: [
      {
        title: 'Subcategory1',
      },
      {
        title: 'Subcategory2',
      },
      {
        title: 'Subcategory3',
      },
    ],
  });

  await category.save();

  let product;

  product = await Product.create({
    title: 'Product1',
    description: 'Description1',
    price: 10,
    category: category.id,
    subcategory: category.subcategories[0].id,
    images: ['image1'],
  });

  await product.save();

  product = await Product.create({
    title: 'Product2',
    description: 'Description1',
    price: 10,
    category: category.id,
    subcategory: category.subcategories[1].id,
    images: ['image1'],
  });

  await product.save();

  product = await Product.create({
    title: 'Product3',
    description: 'Description1',
    price: 10,
    category: category.id,
    subcategory: category.subcategories[2].id,
    images: ['image1'],
  });

  await product.save();

  product = await Product.create({
    title: 'Product4',
    description: 'Description1',
    price: 10,
    category: category.id,
    subcategory: category.subcategories[2].id,
    images: ['image1'],
  });

  await product.save();
})();
