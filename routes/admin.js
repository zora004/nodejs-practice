const path = require('path')

const express = require('express')

const adminController = require('../controllers/admin')

const router = express.Router()

router.get('/add-product', adminController.getAddProduct)
router.get('/products', adminController.getProducts)
router.get('/edit-product/:id', adminController.getEditProduct)
router.post('/edit-product', adminController.postEditProduct)
router.post('/delete-product', adminController.postDeleteProduct)
router.post('/add-product', adminController.postAddProduct)

router.get('/user/:id', adminController.getUser)
router.post('/add-user', adminController.postAddUser)

module.exports = router
