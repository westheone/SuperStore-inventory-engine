const express = require("express")
const router = express.Router()

module.exports = router

// database simulation (in-memory)
// old fromat { id: 10, name: "4K Ultra HD Action Camera", category: "Electronics", price: 149.99, stockCount: 7, cartid: undefined }
const inventory = [
  { id: 1, name: "Premium Wireless Headphones", category: "Electronics", price: 129.99, stockCount: 15 },
  { id: 2, name: "Ergonomic Office Chair", category: "Furniture", price: 249.99, stockCount: 3 },
  { id: 3, name: "Stainless Steel Water Bottle", category: "Fitness", price: 24.99, stockCount: 0  },
  { id: 4, name: "Smart LED Desk Lamp", category: "Electronics", price: 59.99, stockCount: 8  },
  { id: 5, name: "Memory Foam Pillow", category: "Furniture", price: 39.99, stockCount: 12 },
  { id: 6, name: "Yoga Mat with Carrying Strap", category: "Fitness", price: 29.99, stockCount: 5 },
  { id: 7, name: "Bluetooth Speaker", category: "Electronics", price: 89.99, stockCount: 2 },
  { id: 8, name: "Adjustable Standing Desk Converter", category: "Furniture", price: 199.99, stockCount: 4 },
  { id: 9, name: "Resistance Bands Set", category: "Fitness", price: 19.99, stockCount: 20 },
  { id: 10, name: "4K Ultra HD Action Camera", category: "Electronics", price: 149.99, stockCount: 7 },
]

  // route to GET and POST for invertory
  // GET - to load the inventory data on the frontend
router.route('/').get( (req, res) => { 
  // console.log('Inventory requested')
  res.status(200).json({ success: true, inventory }) // sends the inventory JSON response

  // POST - adds product data to invertory
}).post((req, res) => {
  const newProduct = req.body

  // adds products
  newProduct.id = inventory.length ? inventory[inventory.length - 1].id + 1 : 1; // Auto-increment ID
  inventory.push(newProduct)
  res.status(201).json({ success: true, inventory })
})

router.route('/:id').delete((req, res) => {
  const deleteProductId = parseInt(req.params.id, 10);
    
    // Find the index of the product with the matching ID
  const productIndex = inventory.findIndex(product => product.id === deleteProductId);
    
    // If the product doesn't exist, return a 404 status
  if (productIndex === -1) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }
    
    // Remove the product from in-memory array
  inventory.splice(productIndex, 1);
    
    // Respond back with the updated inventory array
  res.status(200).json({ success: true, inventory });
}).patch((req,res) => {
  const productId = parseInt(req.params.id, 10);
  const product= inventory.find(item => item.id === productId)
  // If the product doesn't exist, return a 404 status
  if (!product) {
    res.status(404).json({ success: false, message: "Product not found"})
  } 
  const { name, category, price, stockCount } = req.body;

  // updates fields with data in it only
  if (name !== undefined && name.trim() !== "") { product.name = name; } 
  if (category !== undefined && category.trim() !== "") {product.category = category; }
  if (price !== undefined) { product.price = parseFloat(price); } 
  if (stockCount !== undefined) {product.stockCount = parseInt(stockCount, 10); } 

  console.log(`Product ID ${productId} successfully patched!`);

  // Return status 200 and hand back the updated data set
  res.status(200).json({ 
    success: true, 
    message: "Product updated successfully!", 
    updatedProduct: product
  })

}).get((req,res) => {
  const  productId  = parseInt(req.params.id, 10);
  const foundProduct = inventory.find((item) => item.id === productId);

  res.send(foundProduct);
})
// PUT not needed ??
/* .put((req,res) => {
  const productId = parseInt(req.params.id, 10);
  const product= inventory.find(item => item.id === productId)
// If the product doesn't exist, return a 404 status
  if (!product) {
    res.status(404).json({ success: false, message: "Product not found"})}
// Extract the property from req.body
  const newStockCount = req.body.stockCount;
  product.stockCount = parseInt(newStockCount, 10);
// Send a response back to the client so the fetch() resolves
  res.status(200).json({ success: true, updatedProduct: product });
})
*/