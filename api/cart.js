const express = require("express")
const router = express.Router()
const prisma = require('../prisma/prisma.client');

module.exports = router


router.route('/').get( async (req, res) => { 
  try{
    const cart = await prisma.cartItem.findMany({
    include: {product: {select: {price: true, name: true, category: true}}}
  })
  res.status(200).json({ success: true, cart }) // sends the cart db JSON response
  } catch (error) {
    console.error("Failed to GET/load Cartitmes", error)
    res.status(500).json({success:false, message:"Failed to GET/load Cartitmes"})
  }
  // POST - adds product data to cart db
}).post(async (req, res) => {
  const { id, quantity } = req.body

  if(typeof id !== "number" || id <= 0) {
    return res.status(400).json({success:false, message:"Id must be a number greater then 0"})
  }
  if(typeof quantity !== "number" || quantity < 1) {
    return res.status(400).json({success: false, message:"Quantity must 1 or greater number"})
  }

  try {
  // Check if product already exists in cart
    const productIN = await prisma.product.findUnique({where: {id: id}})
    if ((!productIN || productIN.stockCount <= 0)) {
      return res.status(500).json({success:false ,message:"Out of Stock, Sorry"})
    }

    const existing = await prisma.cartItem.findUnique({ where: { productId: id } })

  if (existing) {
    await prisma.cartItem.update({
      where: { cartid: existing.cartid },
      data: { quantity: { increment: quantity } }
    })
    return res.status(201).json({ success: true })
  }

  // Product not in cart yet — create a new CartItem
  await prisma.cartItem.create({ data: { productId: id, quantity: quantity } })
  res.status(200).json({ success: true })
  } catch (error) {
    console.error("Failed to POST/add Cartitem", error);
    res.status(500).json({success:false, message:"Failed to POST/add Cartitem"})
  }
})

// PATCH /api/cart/:cartid — decrement quantity by 1, delete if would reach 0
router.route('/:cartid').patch(async (req, res) => {
  const cartid = parseInt(req.params.cartid, 10)

  try{
    const item = await prisma.cartItem.findUnique({ where: { cartid } })
  if (!item) {
    return res.status(500).json({ success: false, message: "Out of stock or product not found" });
  }

  if (item.quantity <= 1) {
    // Deleting would bring it to 0 — remove the record
    await prisma.cartItem.delete({ where: { cartid } })
  } else {
    await prisma.cartItem.update({
      where: { cartid },
      data: { quantity: { decrement: 1 } }
    })
  }

  const cart = await prisma.cartItem.findMany({
    include: { product: { select: { price: true, name: true, category: true } } }
  })
  res.status(200).json({ success: true, cart })
  } catch (error) {
    console.error("Failed to PATCH/update Cartitem", error);
    res.status(500).json({success:false, message:"Failed to PATCH/update Cartitem"})
  }
  

// DELETE /api/cart/:cartid — remove cart item entirely
}).delete(async (req, res) => {
  const cartid = parseInt(req.params.cartid, 10)

  try{
    await prisma.cartItem.delete({ where: { cartid } })

    const cart = await prisma.cartItem.findMany({
    include: { product: { select: { price: true, name: true, category: true } } }
  })
  res.status(200).json({ success: true, cart })
  } catch (error) {
    console.error("Failed to DELETE Cartitem", error);
    res.status(500).json({success:false, message:"Failed to DELETE Cartitem"})
  }
})
