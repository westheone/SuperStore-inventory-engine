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

  // adds products
  newProduct.cartid = inventory.length ? inventory[inventory.length - 1].id + 1 : 1; // Auto-increment ID
  inventory.push(newProduct)
  res.status(201).json({ success: true, inventory })

})