const express = require("express")
const router = express.Router()
const prisma = require('../prisma/prisma.client');

module.exports = router


  // route to GET and POST for invertory
  // GET - to load the inventory data on the frontend
router.route('/').get(async (req, res) => { 
  try {
    const inventory = await prisma.product.findMany();
    res.status(200).json({success: true, inventory}) // sends the inventory JSON response
  } catch (error) {
    console.error("Failed to GET/load inventory", error);
    res.status(500).json({success:false, message:"Failed to GET/load inventory"})
  }
  
  // POST - adds product data to invertory
}).post( async (req, res) => {
  const {name, category, price, stockCount} = req.body

  if (typeof name !== "string"|| !name) {
    return res.status(400).json({ success: false, message: "Product name is required"});
  }
  if (typeof category !== "string" || !category) {
    return res.status(400).json({ success: false, message: "Product category is required"});
  }
  if(typeof price !== "number" || price < 0) {
    return res.status(400).json({ success: false, message: "Price must be a number greater then 0"});
  }
  if(typeof stockCount !== "number" || stockCount < 0) {
    return res.status(400).json({success: false, message: "Stock count must be a non-negative number"})
  }

  try {
    const newProduct = await prisma.product.create({
    data: {name, category, price, stockCount},
  })
  res.status(201).json({success: true})
  } catch (error) {
    console.error("Faild to POST/add Product");
    res.status(500).json({success:false, message:"Faild to POST/add Product"})
  }
})

router.route('/:id').delete( async (req, res) => {
  try {
    await prisma.product.delete({where: {id: parseInt(req.params.id, 10)}})
  const inventory = await prisma.product.findMany();
  res.status(200).json({success: true, inventory})
  } catch (error) {
    console.error("Failed to DELETE Product");
    res.status(500).json({success:false, message:"Failed to DELETE Product"})
  }
}).patch( async (req,res) => {
  const { name, category, price, stockCount } = req.body

  if (name !== undefined && (typeof name !== "string" || !name)) {
  return res.status(400).json({ success: false, message: "Product name is required"});
  }
  if (price !== undefined && (typeof price !== "number" || price <= 0)) {
  return res.status(400).json({ success: false, message: "Price must be a positive number"});
  }
  if (stockCount !== undefined && (!Number.isInteger(stockCount) || stockCount < 0)) {
  return res.status(400).json({success: false, message: "Stock count must be a non-negative nuber"});
  }

  try {
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
  } catch (error) {
    console.error("Failed to PATCH/update Product", error);
    res.status(500).json({success:false, message:"Failed to PATCH/update Product"})
  }

}).get( async (req,res) => {
  try {
    const product = await prisma.product.findUnique({
    where: { id: parseInt(req.params.id) }
  })
  if (!product) return res.status(404).json({ success: false, message: "Not found" })
  res.status(200).json(product)
  } catch (error) {
    console.error("Failed to GET/load Product", error);
    res.status(500).json({success:false, message:"Failed to GET/load Product"})
  }
})
