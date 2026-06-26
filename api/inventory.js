const express = require("express")
const router = express.Router()
const prisma = require('../prisma/prisma.client');

module.exports = router


  // route to GET and POST for invertory
  // GET - to load the inventory data on the frontend
router.route('/').get(async (req, res) => { 
  // console.log('Inventory requested')
  const inventory = await prisma.product.findMany();
  res.status(200).json({success: true, inventory}) // sends the inventory JSON response
  // POST - adds product data to invertory
}).post( async (req, res) => {
  const {name, category, price, stockCount} = req.body
  const newProduct = await prisma.product.create({
    data: {name, category, price, stockCount},
  })
  res.status(201).json({success: true})
})

router.route('/:id').delete( async (req, res) => {
  await prisma.product.delete({where: {id: parseInt(req.params.id, 10)}})
  const inventory = await prisma.product.findMany();
  res.status(200).json({success: true, inventory})
}).patch( async (req,res) => {
  const { name, category, price, stockCount } = req.body
  const updated = await prisma.product.update({
    where: { id: parseInt(req.params.id) },
    data: {
      ...(name       && { name }),
      ...(category   && { category }),
      ...(price      && { price: parseFloat(price) }),
      ...(stockCount !== undefined && { stockCount: parseInt(stockCount) })
    }
  })
  res.status(200).json({ success: true, updatedProduct: updated })

}).get( async (req,res) => {
  const product = await prisma.product.findUnique({
    where: { id: parseInt(req.params.id) }
  })
  if (!product) return res.status(404).json({ success: false, message: "Not found" })
  res.status(200).json(product)
})
