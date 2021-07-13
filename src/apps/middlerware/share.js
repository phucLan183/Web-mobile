const CategoriesModel = require('../models/categories');

module.exports = async (req, res, next) => {
  res.locals.categories = await CategoriesModel.find()
  res.locals.formatPrice = formatPrice
  res.locals.nameLogin = req.session.admin
  next()
}

function formatPrice(price) {
  const isFormatted = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price)
  return isFormatted
}

