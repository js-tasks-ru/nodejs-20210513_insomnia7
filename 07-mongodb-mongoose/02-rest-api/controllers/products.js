const { isValidObjectId } = require('mongoose');
const Product = require('../models/Product');

module.exports.productsBySubcategory = async function productsBySubcategory(
  ctx,
  next,
) {
  const subcategory = ctx.query.subcategory;

  if (subcategory) {
    const products = await Product.find({ subcategory });

    ctx.body = { products };
    return
  }

  await next();
};

module.exports.productList = async function productList(ctx, next) {
  const subcategory = ctx.query.subcategory;

  if (!subcategory) {
    const products = await Product.find({});

    ctx.body = { products };
  }
};

module.exports.productById = async function productById(ctx, next) {
  const id = ctx.params.id;

  const isValid = isValidObjectId(id);

  if (!isValid) {
    ctx.throw(400);
    return;
  }

  const product = await Product.findOne({ _id: id });

  if (!product) {
    ctx.throw(404);
    return;
  }

  ctx.body = { product };
};
