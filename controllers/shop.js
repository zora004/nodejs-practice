const Product = require('../models/product')
const Order = require('../models/order')

exports.getProducts = (req, res, next) => {
  Product.find()
    .then(products => {
      res.status(200).json(products)
    })
    .catch(err => {
      console.log(err)
    })
}

exports.getProduct = (req, res, next) => {
  const prodId = req.params.id
  Product.findById(prodId)
    .then(product => {
      res.json(product)
    }).catch(err => {
      console.log(err)
    })
}

exports.getIndex = (req, res, next) => {
  Product.find()
    .then(products => {
      res.status(200).json({ products })
    })
    .catch(err => {
      console.log(err)
    })
}

exports.getCart = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .then(user => {
      const products = user.cart.items
      res.status(200).json(products)
    }).catch(err => {
      console.log(err)
    })
}

exports.postCart = (req, res, next) => {
  const prodId = req.body.id
  Product.findById(prodId)
    .then(product => {
      return req.user.addToCart(product)
    }).then(result => {
      res.status(200).json({ message: 'Item successfully added to cart.' })
    }).catch(err => {
      console.log(err)
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
      console.log(err)
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
      const order = new Order({
        user: {
          name: req.user.name,
          userId: req.user
        },
        products: products
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
      console.log(err)
    })

}

exports.getOrders = (req, res, next) => {
  Order
    .find({ "user.userId": req.user._id })
    .then(orders => {
      res.status(200).json(orders)

    })
    .catch(err => {
      console.log(err)
    })

}