const Product = require('../models/product')
const Order = require('../models/order')
const fs = require('fs')
const path = require('path')

exports.getProducts = (req, res, next) => {
  Product.find()
    .then(products => {
      res.status(200).json(products)
    })
    .catch(err => {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
}

exports.getProduct = (req, res, next) => {
  const prodId = req.params.id
  Product.findById(prodId)
    .then(product => {
      res.json(product)
    })
    .catch(err => {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
}

exports.getIndex = (req, res, next) => {
  Product.find()
    .then(products => {
      res.status(200).json({ products })
    })
    .catch(err => {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
}

exports.getCart = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .then(user => {
      const products = user.cart.items
      res.status(200).json(products)
    })
    .catch(err => {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
}

exports.postCart = (req, res, next) => {
  const prodId = req.body.id
  Product.findById(prodId)
    .then(product => {
      return req.user.addToCart(product)
    })
    .then(result => {
      res.status(200).json({ message: 'Item successfully added to cart.' })
    })
    .catch(err => {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
}

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.id
  req.user
    .removeFromCart(prodId)
    .then(result => {
      res.status(200).json({ message: 'Item successfully removed from cart.' })
    })
    .catch(err => {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
}

exports.getCheckout = (req, res, next) => {
  res.json({ message: 'This is the checkout page will add some data soon' })
}

exports.postOrder = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .then(user => {
      const products = user.cart.items.map(i => {
        return { quantity: i.quantity, product: { ...i.productId._doc } }
      })
      const total_amount = products.reduce((total, p) => total + (p.quantity * p.product.price), 0)

      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user
        },
        products: products,
        total_amount: total_amount
      })
      order.save()
    })
    .then(result => {
      return req.user.clearCart()
    })
    .then(() => {
      res.json({ message: 'Order successful!' })
    })
    .catch(err => {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })

}

exports.getOrders = (req, res, next) => {
  Order
    .find({ "user.userId": req.user._id })
    .then(orders => {
      res.status(200).json(orders)

    })
    .catch(err => {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
}

exports.downloadInvoice = (req, res, next) => {
  const orderId = req.params.orderId
  const invoiceName = 'invoice-' + orderId + '.pdf'
  const invoicePath = path.join('data', 'invoices', invoiceName)
  fs.readFile(invoicePath, (err, data) => {
    if (err) {
      return next(err)
    }
    res.setHeader('Content-Type', 'application/pdf') // PARA MO VIEW UNA ANG IYA PDF 
    // res.setHeader('Content-Disposition', 'attachment; filename="' + invoiceName + '"') // DOWNLOAD DIRITSU
    res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"') // VIEW UNA
    res.send(data)
  })
}