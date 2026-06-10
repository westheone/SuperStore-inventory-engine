const express = require("express")
const app = express()
const PORT =  3000

// MIDDLEWARE
// tells Express to serve everything to frontend folder
app.use(express.static("public"))


// parses incoming JSON payloads from POST requests
app.use(express.json())

// Import the inventory router
const inventoryRouter = require('./api/inventory')
app.use('/api/inventory', inventoryRouter)

// app.get('/', (req, res) => {})



// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/storefront.html`);
});