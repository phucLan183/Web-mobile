const ProductsModel = require('../models/products');
const UsersModel = require('../models/users');
const CartModel = require('../models/carts');
const CommentModel = require('../models/comments');

const indexLocal = async (req, res) => {
    const featuredPrd = await ProductsModel.find({
        featured: true,
        is_stock: false
    }).limit(6)

    const statusPrd = await ProductsModel.find({
        status: "Máy Mới 100%",
        is_stock: true
    }).limit(6)

    res.render('local/index', {
        featuredPrds: featuredPrd,
        statusPrds: statusPrd,
    })
}

const categoryLocal = async (req, res) => {
    try {
        const idCategory = req.params.id
        const categoryName = req.params.catName
        const pagination = {
            page: Number(req.query.page) || 1,
            perPage: 9,
        }
        const noPage = (pagination.perPage * pagination.page) - pagination.perPage

        const limitPrd = await ProductsModel.find({
            cat_id: idCategory
        }).populate({
            path: 'cat_id',
            select: 'title'
        }).skip(noPage).limit(pagination.perPage)

        const titleCategory = await limitPrd.map(e => {
            return e.cat_id.title
        })
        const dataPrds = await ProductsModel.countDocuments({
            cat_id: idCategory
        })

        res.render('local/category', {
            products: limitPrd,
            total: dataPrds,
            current: pagination.page,
            title: titleCategory[0],
            pages: Math.ceil(dataPrds / pagination.perPage),
            url: `/category/${categoryName}/${idCategory}?`,
        })
    } catch (error) {
        console.log(error);
    }
}

const productLocal = async (req, res) => {
    try {
        const idPrd = req.params.id
        const dataPrd = await ProductsModel.findById({
            _id: idPrd
        })
        const dataComment = await CommentModel.find({
            prd_id: idPrd
        }).populate({
            path: 'user_id',
            select: 'full_name',
        })

        res.render('local/product', {
            product: dataPrd,
            comments: dataComment
        })
    } catch (error) {
        res.render('local/product', {
            product: "Không có thiết bị này",
        })
    }
}

const addProductLocal = async (req, res) => {
    try {
        const productId = req.params.id
        const quantity = req.body.quantity
        const userId = req.session.userId

        const hasProductId = await CartModel.findOne({
            prd_id: productId
        })
        if (!hasProductId) {
            const createCart = new CartModel({
                user_id: userId,
                quantity: quantity,
                prd_id: productId
            })
            const saveData = await createCart.save()
            if (saveData) {
                return res.render('local/success', {
                    message: "Sản phẩm đã được thêm vào giỏ hàng",
                })
            }
        }

        const updateCart = await CartModel.updateOne({
            prd_id: productId
        }, {
            $set: {
                quantity: parseInt(quantity) + hasProductId.quantity
            }
        })
        if (updateCart) {
            res.redirect('/cart')
        }
    } catch (error) {
        console.error(error);
    }
}

const commentPrdLocal = async (req, res) => {
    try {
        const userId = req.session.userId
        const prdId = req.params.id
        const content = req.body.comm_details
        const comment = await CommentModel.create({
            user_id: userId,
            prd_id: prdId,
            body: content
        })
        if (comment) {
            res.redirect(`/product/${prdId}`)
        }
    } catch (error) {
        console.error(error);
    }
}

const cartLocal = async (req, res) => {
    try {
        const userId = req.session.userId
        const dataCart = await CartModel.find({
            user_id: userId
        }).populate({
            path: 'prd_id'
        })
        const dataUser = await UsersModel.findById(userId)
        const totalMoney = dataCart.reduce((total, item) => {
            return total + item.prd_id.price * item.quantity
        }, 0)
        if (dataCart) {
            res.render('local/cart', {
                dataUser,
                dataCart: dataCart,
                totalMoney: totalMoney,
            })
        }
    } catch (error) {
        console.error(error);
    }
}

const deleteCartLocal = async (req, res) => {
    try {
        const productId = req.params.id
        const dataCart = await CartModel.deleteOne({
            prd_id: productId,
        })
        if (dataCart) {
            res.redirect('/cart')
        }
    } catch (error) {
        console.error(error);
    }
}

const cartReloadLocal = async (req, res) => {
    try {
        const products = req.body.products
        const userId = req.session.userId
        const dataCart = await CartModel.find({
            user_id: userId
        })
        dataCart.forEach((item) => {
            CartModel.updateOne({
                prd_id: item.prd_id
            }, {
                quantity: parseInt(products[item.prd_id]["quantity"])
            }, (err, result) => {
                if (err) {
                    console.error(err);
                }
                return result;
            })
        })
        res.redirect('/cart')
    } catch (error) {
        console.error(error);
    }
}

const payCartLocal = async (req, res) => {
    try {
        const userId = req.session.userId
        const delCart = await CartModel.deleteMany({
            user_id: userId
        })
        res.render('local/success', {
            message: "Sản phẩm đã được mua thành công",
        })
    } catch (error) {
        console.error(error);
    }
}

const searchLocal = async (req, res) => {
    try {
        const keyword = req.query.keyword
        if (keyword) {
            const regex = new RegExp(escapeRegex(keyword), 'gi')
            const pagination = {
                page: Number(req.query.page) || 1,
                perPage: 9,
            }
            const noPage = (pagination.perPage * pagination.page) - pagination.perPage

            const dataPrd = await ProductsModel.find({
                name: regex
            }).skip(noPage).limit(pagination.perPage)
            const length = await ProductsModel.countDocuments({
                name: regex
            })
            res.render('local/search', {
                dataPrd: dataPrd,
                search: keyword,
                current: pagination.page,
                pages: Math.ceil(length / pagination.perPage),
                url: `/search?keyword=${keyword}&`,
                length: length
            })
        } else {
            res.redirect('/')
        }
    } catch (error) {
        console.error(error);
    }
}

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")
}

module.exports = {
    indexLocal: indexLocal,
    categoryLocal: categoryLocal,
    productLocal: productLocal,
    addProductLocal: addProductLocal,
    cartLocal: cartLocal,
    cartReloadLocal: cartReloadLocal,
    deleteCartLocal: deleteCartLocal,
    payCartLocal: payCartLocal,
    searchLocal: searchLocal,
    commentPrdLocal: commentPrdLocal,
}