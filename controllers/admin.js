const mongodb = require('mongodb')
const Product = require("../models/product")
const User = require("../models/user")

exports.getAddProduct = (req, res, next) => {
    res.status(201).json({ message: 'This is add product page!' })
}

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title
    const imageUrl = req.body.imageUrl
    const price = req.body.price
    const description = req.body.description
    const userId = req.user._id
    const product = new Product(title, price, description, imageUrl, null, userId)
    product.save()
        .then(result => {
            res.status(201).json({ message: 'Created Product!' })
        }).catch(err => {
            console.log(err)
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
            console.log(err)
        })
}

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.id
    const updatedTitle = req.body.title
    const updatedPrice = req.body.price
    const updateImageUrl = req.body.imageUrl
    const updatedDesc = req.body.description

    const product = new Product(
        updatedTitle,
        updatedPrice,
        updatedDesc,
        updateImageUrl,
        prodId
    )

    product
        .save()
        .then(result => {
            res.status(200).json({ message: 'Product successfully updated!' })
        })
        .catch(err => { console.log(err) })
}

exports.getProducts = (req, res, next) => {
    Product.fetchAll()
        .then(products => {
            res.status(200).json(products)
        }).catch(err => {
            console.log(err)
        })
}

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.id
    Product.deleteById(prodId)
        .then(() => {
            console.log('Product deleted!')
            res.status(200).json({ message: 'Product deleted!' })
        })
        .catch(err => {
            console.log(err)
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
            console.log(err)
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
            console.log(err)
        })
}