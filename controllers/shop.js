const Product = require('../models/product')

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
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
  Product.fetchAll()
    .then(products => {
      res.status(200).json({ products })
    })
    .catch(err => {
      console.log(err)
    })
}

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then(cart => {
      return cart
        .getProducts()
        .then(products => {
          res.status(200).json(products)
        })
        .catch(err => {
          console.log(err)
        })
      console.log(cart)
    }).catch(err => {
      console.log(err)
    })
}

exports.postCart = (req, res, next) => {
  const prodId = req.body.id
  let fetchedCart
  let newQuantity = 1
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart
      return cart.getProducts({ where: { id: prodId } })
    })
    .then(products => {
      let product
      if (products.length > 0) {
        product = products[0]
      }
      if (product) {
        const oldQuantity = product.cart_item.quantity
        newQuantity = oldQuantity + 1
        return product
      }
      return Product.findByPk(prodId)
    })
    .then(product => {
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity }
      })
    })
    .then(() => {
      res.status(200).json({ message: 'Item successfully added to cart.' })
    })
    .catch(err => {
      console.log(err)
    })
}

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.id
  req.user
    .getCart()
    .then(cart => {
      return cart.getProducts({ where: { id: prodId } })
    })
    .then(products => {
      const product = products[0]
      return product.cart_item.destroy()
    })
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
  let fetchedCart
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart
      return cart.getProducts()
    })
    .then(products => {
      req.user
        .createOrder()
        .then(order => {
          return order.addProduct(products.map(product => {
            product.order_item = { quantity: product.cart_item.quantity }
            return product
          }))
        })
        .catch(err => {
          console.log(err)
        })
      console.log(products)
    })
    .then(result => {
      return fetchedCart.setProducts(null)
    }).then(result => {
      res.json({ message: 'Order successful!' })
    })
    .catch(err => {
      console.log(err)
    })
}

exports.getOrders = (req, res, next) => {
  req.user.getOrders({include: ['products']})
    .then(orders => {
      res.status(200).json(orders)
    })
    .catch(err => {
      console.log(err)
    })
}