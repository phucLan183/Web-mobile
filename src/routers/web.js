const express = require('express');
const router = express.Router();
const AuthController = require('../apps/controllers/Auth');
const AdminController = require('../apps/controllers/Admin');
const UserController = require('../apps/controllers/Users');
const CategoriesController = require('../apps/controllers/Category');
const ProductController = require('../apps/controllers/Product');
const AuthMiddleware = require('../apps/middlerware/auth');
const LocalController = require('../apps/controllers/Local');


//GET

//ADMIN
router.get('/admin/dashboard', AuthMiddleware.checkAdmin, AdminController.getDashboard)

router.get('/admin/login', AuthMiddleware.checkLogin, AuthController.getLogin)
router.get('/admin/logout', AuthController.getLogout)

router.get('/admin/user', AuthMiddleware.checkAdmin, UserController.indexUsers)
router.get('/admin/user/?page=:page', AuthMiddleware.checkAdmin, UserController.indexUsers)
router.get('/admin/user/add', AuthMiddleware.checkAdmin, UserController.addUsers)
router.get('/admin/user/edit/:id', AuthMiddleware.checkAdmin, UserController.editUsers)
router.get('/admin/user/delete/:id', AuthMiddleware.checkAdmin, UserController.deleteUsers)

router.get('/admin/category', AuthMiddleware.checkAdmin, CategoriesController.indexCategory)
router.get('/admin/category/?page=:page', AuthMiddleware.checkAdmin, CategoriesController.indexCategory)
router.get('/admin/category/add', AuthMiddleware.checkAdmin, CategoriesController.addCategory)
router.get('/admin/category/edit/:id', AuthMiddleware.checkAdmin, CategoriesController.editCategory)
router.get('/admin/category/delete/:id', AuthMiddleware.checkAdmin, CategoriesController.deleteCategory)

router.get('/admin/product', AuthMiddleware.checkAdmin, ProductController.indexProduct)
router.get('/admin/product/?page=:page', AuthMiddleware.checkAdmin, ProductController.indexProduct)
router.get('/admin/product/add', AuthMiddleware.checkAdmin, ProductController.addProduct)
router.get('/admin/product/edit/:id', AuthMiddleware.checkAdmin, ProductController.editProduct)
router.get('/admin/product/delete/:id', AuthMiddleware.checkAdmin, ProductController.deleteProduct)

//LOCAL
router.get('/', LocalController.indexLocal)
router.get('/cart', LocalController.cartLocal)
router.get('/cart-payment', LocalController.payCartLocal)
router.get('/cart-delete', LocalController.deleteCartLocal)
router.get('/category/:catName/:id', LocalController.categoryLocal)
router.get('/category/:catName/:id?page=:page', LocalController.categoryLocal)
router.get('/product/:id', LocalController.productLocal)
router.get('/product/add-cart/:id', LocalController.addProductLocal)
router.get('/search', LocalController.searchLocal)
router.get('/search?:keyword&page=:page', LocalController.searchLocal)
router.get('/login', AuthMiddleware.isLoginLocal, AuthController.loginLocal) 
router.get('/register', AuthController.registerLocal)
router.get('/logout', AuthMiddleware.noneLoginLocal, AuthController.logoutLocal)

//POST

//ADMIN
router.post('/admin/login',  AuthController.postLogin)

router.post('/admin/user/add', AuthMiddleware.checkAdmin, UserController.newUsers)
router.post('/admin/user/edit/:id', AuthMiddleware.checkAdmin, UserController.updateUsers)

router.post('/admin/category/add', AuthMiddleware.checkAdmin, CategoriesController.newCategory)
router.post('/admin/category/edit/:id', AuthMiddleware.checkAdmin, CategoriesController.updateCategory)

router.post('/admin/product/add', AuthMiddleware.checkAdmin, ProductController.newProduct)
router.post('/admin/product/edit/:id', AuthMiddleware.checkAdmin, ProductController.updateProduct)

//LOCAL
router.post('/login', AuthController.postLoginLocal)
router.post('/register', AuthController.postRegisterLocal)
router.post('/cart-reload', LocalController.cartReloadLocal)
router.post('/product/:id', LocalController.commentPrdLocal)
module.exports = router