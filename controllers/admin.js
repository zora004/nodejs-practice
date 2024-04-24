const mongoose = require('mongoose')
const Product = require("../models/product")
const User = require("../models/user")
const { validationResult } = require('express-validator')

exports.getAddProduct = (req, res, next) => {
    res.status(201).json({ message: 'This is add product page!' })
}

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title
    const image = req.file
    const price = req.body.price
    const description = req.body.description
    const errors = validationResult(req)
    if (!image) {
        return res.status(422).json({ message: 'attached file is not an image.' })
    }
    if (!errors.isEmpty()) {
        return res.status(422).json({ message: errors.array() })
    }
    const product = new Product(
        {
            title: title,
            price: price,
            description: description,
            imageUrl: image.path,
            userId: req.user,
            created_at: Date.now()
        }
    )
    product
        .save()
        .then(result => {
            res.status(201).json({ message: 'Created Product!' })
        })
        .catch(err => {
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
        })
}

exports.getEditProduct = (req, res, next) => {
    const prodId = req.params.id
    Product.findById(prodId)
        .then(product => {
            if (!product) {
                res.status(404).json({ message: 'No product found!' })
            }
            res.json(product)
        })
        .catch(err => {
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
        })
}

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.id
    const updatedTitle = req.body.title
    const updatedPrice = req.body.price
    const image = req.file
    console.log(image)
    const updatedDesc = req.body.description
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({ message: errors.array() })
    }
    Product
        .findById(prodId)
        .then(product => {
            if (product.userId.toString() !== req.user._id.toString()) { // BLOCK OTHER USER TO UPDATE PRODUCT ASIDE FROM HIS OWN
                return res.status(401).json({ message: 'unauthorized access' })
            }
            product.title = updatedTitle
            product.price = updatedPrice
            product.description = updatedDesc
            if (image) {
                product.imageUrl = image.path
            }
            return product
                .save()
                .then(result => {
                    res.status(200).json({ message: 'Product successfully updated!' })
                })
                .catch(err => {
                    const error = new Error(err)
                    error.httpStatusCode = 500
                    return next(error)
                })
        })
        .catch(err => {
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
        })
}

exports.getProducts = (req, res, next) => {
    Product.find({ userId: req.user._id })
        // .select('title price -_id')
        // .populate('userId', 'name')
        .then(products => {
            console.log(req.user)
            res.status(200).json(products)
        })
        .catch(err => {
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
        })
}

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.id
    Product.deleteOne({ _id: prodId, userId: req.user._id })
        .then(result => {
            if (result.deletedCount <= 0) {
                return res.status(200).json({ message: 'no product deleted!' })
            }
            res.status(200).json({ message: 'Product deleted!' })
        })
        .catch(err => {
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
        })
}

exports.getUser = (req, res, next) => {
    const prodId = req.params.id
    User.findById(prodId)
        .then(user => {
            if (!user) {
                res.status(404).json({ message: 'No product found!' })
            }
            res.status(200).json(user)
        })
        .catch(err => {
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
        })
}

exports.postAddUser = (req, res, next) => {
    const name = req.body.name
    const email = req.body.email
    const user = new User(name, email)
    user
        .save()
        .then(result => {
            res.status(201).json({ message: 'User created!' })
        })
        .catch(err => {
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
        })
}