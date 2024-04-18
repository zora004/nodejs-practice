const path = require('path')

const express = require('express')

const adminController = require('../controllers/admin')
const isAuth = require('../middleware/is_auth')

const router = express.Router()

router.get('/add-product', isAuth, adminController.getAddProduct)
router.get('/products', isAuth, adminController.getProducts)
router.get('/edit-product/:id', isAuth, adminController.getEditProduct)
router.post('/edit-product', isAuth, adminController.postEditProduct)
router.post('/delete-product', isAuth, adminController.postDeleteProduct)
router.post('/add-product', isAuth, adminController.postAddProduct)

// router.get('/user/:id', adminController.getUser)
// router.post('/add-user', adminController.postAddUser)

module.exports = router
