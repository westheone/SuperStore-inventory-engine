const express = require("express")
const router = express.Router()
const prisma = require('../prisma/prisma.client');

module.exports = router

// cart (in-memory)
//const cart = []

router.route('/').get( async (req, res) => { 
  const cart = await prisma.cartItem.findMany({
    include: {product: {select: {price: true, name: true, category: true}}}
  })
  res.status(200).json({ success: true, cart }) // sends the cart db JSON response

  // POST - adds product data to cart db
}).post(async (req, res) => {
  const { id, quantity } = req.body

  // Check if product already exists in cart
  const existing = await prisma.cartItem.findFirst({ where: { productId: id } })

  if (existing) {
    await prisma.cartItem.update({
      where: { cartid: existing.cartid },
      data: { quantity: { increment: quantity } }
    })
    return res.status(200).json({ success: true })
  }

  // Product not in cart yet — create a new CartItem
  await prisma.cartItem.create({ data: { productId: id, quantity: quantity } })
  res.status(200).json({ success: true })
})