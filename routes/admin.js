const path = require('path')

const express = require('express')
const { check } = require('express-validator')

const adminController = require('../controllers/admin')
const isAuth = require('../middleware/is_auth')

const router = express.Router()

router.get('/add-product', isAuth, adminController.getAddProduct)
router.get('/products', isAuth, adminController.getProducts)
router.get('/edit-product/:id', isAuth, adminController.getEditProduct)
router.post('/delete-product', isAuth, adminController.postDeleteProduct)
router.post(
    '/edit-product',
    [
        check('title')
            .isString()
            .isLength({ min: 3 })
            .trim(),
        check('price', 'Please enter a valid amount of your price and is greater than 0.')
            .isFloat({ gt: 0 })
            .isLength({ min: 1 }),
        check('description')
            .isLength({ min: 5, max: 500 })
            .trim()
    ],
    isAuth,
    adminController.postEditProduct
)
router.post(
    '/add-product',
    [
        check('title')
            .isString()
            .isLength({ min: 3 })
            .trim(),
        check('price', 'Please enter a valid amount of your price and is greater than 0.')
            .isFloat({ gt: 0 })
            .isLength({ min: 1 }),
        check('description')
            .isLength({ min: 5, max: 500 })
            .trim()
    ],
    isAuth,
    adminController.postAddProduct
)

module.exports = router
