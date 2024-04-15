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
    const product = new Product(
        {
            title: title,
            price: price,
            description: description,
            imageUrl: imageUrl,
            userId: req.user
        }
    )
    product
        .save()
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
    const updatedImageUrl = req.body.imageUrl
    const updatedDesc = req.body.description

    Product
        .findById(prodId)
        .then(product => {
            product.title = updatedTitle
            product.price = updatedPrice
            product.description = updatedDesc
            product.imageUrl = updatedImageUrl
            return product.save()
        })
        .then(result => {
            res.status(200).json({ message: 'Product successfully updated!' })
        })
        .catch(err => { console.log(err) })
}

exports.getProducts = (req, res, next) => {
    Product.find()  
        // .select('title price -_id')
        // .populate('userId', 'name')
        .then(products => {
            res.status(200).json(products)
        }).catch(err => {
            console.log(err)
        })
}

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.id
    Product.findByIdAndDelete(prodId)
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