const CategoriesModel = require('../models/categories');
const CartModel = require('../models/carts');

module.exports = async (req, res, next) => {
  res.locals.categories = await CategoriesModel.find()
  res.locals.formatPrice = formatPrice
  res.locals.nameLogin = req.session.admin
  res.locals.quantityCart = await quantityCart(req.session.userId)
  next()
}

function formatPrice(price) {
  const isFormatted = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price)
  return isFormatted
}

async function quantityCart(userId) {
  const amount = await CartModel.countDocuments({
    user_id: userId,
  })
  return amount
}