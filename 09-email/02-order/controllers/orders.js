const Order = require('../models/Order');
const Product = require('../models/Product');
const sendMail = require('../libs/sendMail');

module.exports.checkout = async function checkout(ctx, next) {
  if (!ctx.user) {
    ctx.throw(401, 'Not authorized');
  }

  const order = new Order({ ...ctx.request.body, user: ctx.user._id });

  await order.save();

  const product = await Product.findById(order.product);

  try {
    await sendMail({
      template: 'order-confirmation',
      to: ctx.user.email,
      subject: 'NodeJS test app. Approve your email.',
      locals: { id: order._id, product },
    });
  } catch (e) {
    console.log('Unable to send e-mail');
    console.log(e);
    ctx.throw(400, 'Unable to send e-mail');
  }

  ctx.status = 201;
  ctx.body = {
    order: order._id,
  };
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
  if (!ctx.user) {
    ctx.throw(401, 'Not authorized');
  }

  const orders = await Order.find({ user: ctx.user._id }).populate('product');

  if (!orders) {
    ctx.throw(404, 'Not found');
  }

  ctx.status = 200;
  ctx.body = { orders };
};
