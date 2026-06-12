const express = require("express")
const router = express.Router()

module.exports = router

// cart (in-memory)
const cart = []

router.route('/').get( (req, res) => { 

  res.status(200).json({ success: true, cart }) // sends the cart inventory JSON response

  // POST - adds product data to invertory
}).post((req, res) => {
  const newProduct = req.body

  // check if product already exists in cart
  const existing = cart.find(item => item.id === newProduct.id)
  if (existing) {
    existing.quantity = (existing.quantity || 1) + 1
    return res.status(200).json({ success: true, cart })
  }
  // adds products
  newProduct.cartid = cart.length ? cart[cart.length - 1].cartid + 1 : 1; // Auto-increment ID
  cart.push(newProduct)
  res.status(201).json({ success: true, cart })

})