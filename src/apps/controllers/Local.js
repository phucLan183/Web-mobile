const ProductsModel = require('../models/products');
const CategoriesModel = require('../models/categories');
const UsersModel = require('../models/users');
const CartModel = require('../models/carts');
const CommentModel = require('../models/comments');

const indexLocal = async (req, res) => {
    const userId = req.session.userId
    const featuredPrd = await ProductsModel.find({
        featured: true,
        is_stock: false
    }).limit(6)

    const statusPrd = await ProductsModel.find({
        status: "Máy Mới 100%",
        is_stock: true
    }).limit(6)

    if (userId) {
        const result = await checkCart(userId)
        res.render('local/index', {
            featuredPrds: featuredPrd,
            statusPrds: statusPrd,
            cartPrds: result,
        })
    } else {
        res.render('local/index', {
            featuredPrds: featuredPrd,
            statusPrds: statusPrd,
        })
    }

}

const categoryLocal = async (req, res) => {
    try {
        const idCategory = req.params.id
        const categoryName = req.params.catName
        const userId = req.session.userId
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
        if (userId) {
            const result = await checkCart(userId)
            res.render('local/category', {
                products: limitPrd,
                total: dataPrds,
                current: pagination.page,
                title: titleCategory[0],
                pages: Math.ceil(dataPrds / pagination.perPage),
                url: `/category/${categoryName}/${idCategory}?`,
                cartPrds: result,
            })
        } else {
            res.render('local/category', {
                products: limitPrd,
                total: dataPrds,
                current: pagination.page,
                title: titleCategory[0],
                pages: Math.ceil(dataPrds / pagination.perPage),
                url: `/category/${categoryName}/${idCategory}?`,
            })
        }
    } catch (error) {
        console.log(error);
    }
}

const productLocal = async (req, res) => {
    const idPrd = req.params.id
    const userId = req.session.userId
    const dataPrd = await ProductsModel.findById({
        _id: idPrd
    })
    const dataComment = await CommentModel.find({
        prd_id: idPrd
    }).populate({
        path: 'user_id',
        select: 'full_name',
    })

    try {
        if (userId) {
            const result = await checkCart(userId)
            res.render('local/product', {
                product: dataPrd,
                cartPrds: result,
                comments: dataComment
            })
        } else {
            res.render('local/product', {
                product: dataPrd,
                comments: dataComment
            })
        }
    } catch (error) {
        res.render('local/product', {
            product: "Không có thiết bị này",
            cartPrds: null,
        })
    }
}

const addProductLocal = async (req, res) => {
    const userId = req.session.userId
    if (userId) {
        const idPrd = req.params.id
        const dataPrd = await ProductsModel.findById({
            _id: idPrd
        })
        const addCart = await CartModel.create({
            user_id: userId,
            items: dataPrd
        })
        if (addCart) {
            const result = await checkCart(userId)
            res.render('local/success', {
                message: "Sản phẩm đã được thêm vào giỏ hàng",
                cartPrds: result
            })
        }
    } else {
        res.redirect('/login')
    }
}

const commentPrdLocal = async (req, res) => {
    const userId = req.session.userId
    if (userId) {
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
    } else {
        res.redirect('/login')
    }
}

const cartLocal = async (req, res) => {
    const userId = req.session.userId
    if (userId) {
        const dataCart = await CartModel.find({
            user_id: userId
        })
        const result = await checkCart(userId)
        let totalMoney = 0
        for (let doc of dataCart) {
            totalMoney += doc.items.price
        }
        if (dataCart) {
            res.render('local/cart', {
                dataCart: dataCart,
                totalMoney: totalMoney,
                cartPrds: result,
            })
        }
    } else {
        res.redirect('/login')
    }
}

const deleteCartLocal = async (req, res) => {
    const userId = req.session.userId
    if (userId) {
        const dataCart = await CartModel.deleteOne({
            user_id: userId
        })
        if (dataCart) {
            res.redirect('/cart')
        }
    } else {
        res.redirect('/login')
    }
}

const cartReloadLocal = (req, res) => {
    res.redirect('/cart')
}

const payCartLocal = async (req, res) => {
    const userId = req.session.userId
    if (userId) {
        const delCart = await CartModel.deleteMany()
        const result = await checkCart(userId)
        res.render('local/success', {
            message: "Sản phẩm đã được mua thành công",
            cartPrds: result
        })
    } else {
        res.redirect('/login')
    }
}

const searchLocal = async (req, res) => {
    const keyword = req.query.keyword
    if (keyword) {
        const regex = new RegExp(escapeRegex(keyword), 'gi')
        const userId = req.session.userId
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

        if (userId) {
            const result = await checkCart(userId)

            res.render('local/search', {
                cartPrds: result,
                dataPrd: dataPrd,
                search: keyword,
                current: pagination.page,
                pages: Math.ceil(length / pagination.perPage),
                url: `/search?keyword=${keyword}&`,
                length: length
            })
        } else {
            res.render('local/search', {
                dataPrd: dataPrd,
                search: keyword,
                current: pagination.page,
                pages: Math.ceil(length / pagination.perPage),
                url: `/search?keyword=${keyword}&`,
                length: length
            })
        }
    } else {
        res.redirect('/')
    }
}

async function checkCart(idUser) {
    const amountCart = await CartModel.countDocuments({
        user_id: idUser
    })
    return amountCart
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