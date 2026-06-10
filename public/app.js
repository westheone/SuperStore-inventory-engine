
// Function to update product stock count on the server
async function updateProductStock(id, newStockCount) {
  try {
    // Target endpoint containing the specific items ID
    const response = await fetch(`/api/inventory/${id}`, {
        method: 'PUT', // Use PUT for updates
        headers: {
          'Content-Type': 'application/json' // Tell Express to expect JSON string data
        },
        body: JSON.stringify({
          stockCount: newStockCount // Pass the updated property value
        })
    });

      // Catchs failures early
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Server response:');
    console.log('Updated Object:');

    // RE-SYNC THE UI: Clear existing products & Run layout function to refresh numbers
    syncStorefront();
   syncAdminCatalog();

  } catch (error) {
    console.error("Failed to execute inventory update:", error);
  }
}
// Handler for "Add to Cart" button clicks
const handleAddToCart = (productId, inventory) => {
  const productIndex = inventory.findIndex(p => p.id === productId);
  if (productIndex !== -1 && inventory[productIndex].stockCount > 0) {
    inventory[productIndex].stockCount -= 1;
    updateProductStock(productId, inventory[productIndex].stockCount);
  } else {
    alert('Sorry, this product is out of stock!');
  }
}

// Function to render products on the page
function renderProducts(inventory) {
    const productSection = document.getElementById('product-grid');
  if (!productSection) {
    console.error("Critical Error: Could not find the '#product-grid' element in the HTML DOM.");
    return; 
  }

  // const sectionHeader = document.createElement('h2');
  // sectionHeader.textContent = "Product Catalog";
  // sectionHeader.id = "grid-heading"
  inventory.forEach(product => {
    const productCard = document.createElement('article');
    productCard.classList.add('product-card');

    const categoryTag = document.createElement('span');
    categoryTag.classList.add('category-tag');
    categoryTag.textContent = product.category;
    productCard.appendChild(categoryTag);

    const productTitle = document.createElement('h3');
    productTitle.classList.add('product-title');
    productTitle.textContent = product.name;
    productCard.appendChild(productTitle);

    const priceText = document.createElement('p');
    priceText.classList.add('price-text');
    priceText.textContent = `$${product.price.toFixed(2)}`;
    productCard.appendChild(priceText);

    const stockText = document.createElement('p');
    stockText.classList.add('instock-text');
    stockText.textContent = `In Stock: ${product.stockCount}`;
    productCard.appendChild(stockText);

    const addToCartBtn = document.createElement('button');
    addToCartBtn.classList.add('button-look');
    addToCartBtn.setAttribute('type', 'button');
    addToCartBtn.textContent = 'Add to Cart';
    addToCartBtn.addEventListener('click', () => handleAddToCart(product.id,inventory));
    productCard.appendChild(addToCartBtn);

    productSection.appendChild(productCard);
  });
}
// Function to render the admin inventory catalog 
function renderAdminCatalog(inventory) {
  console.log('Rendering admin catalog...');
  const adminSection = document.getElementById('admin-inventory-table-body');
  inventory.forEach(product => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${product.id}</td>
      <td>${product.name}</td>
      <td>${product.category}</td>
      <td>$${product.price.toFixed(2)}</td>
      <td>${product.stockCount}</td>
    `;
    adminSection.appendChild(row);
  });
}

// Handler for "Add Product" form submission
const handleAddProduct = async (event) => {
  event.preventDefault();
  const form = document.getElementById('add-product-form');
  const newProduct = {
    name: form.elements['product-name'].value,
    category: form.elements['product-category'].value,
    price: parseFloat(form.elements['product-price'].value),
    stockCount: parseInt(form.elements['product-stock'].value, 10)
  };

  try {
    const response = await fetch('/api/inventory', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newProduct)
    });

    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Server response:');
    console.log('Added Product:');
    // RE-SYNC THE UI: Clear existing products & Run layout function to refresh numbers
    form.reset(); // Clear the form after submission
    syncStorefront();
    syncAdminCatalog();

  } catch (error) {
    console.error("Failed to add product:", error);
  }
}
// Handler for "Delete Product" form submission
const handleDeleteProduct = async (event) => {
  event.preventDefault();
  const form = document.getElementById('delete-product-form');
  const deleteProductId = parseInt(form.elements['product-id'].value,10);
  if (isNaN(deleteProductId)) {
    console.error("Invalid Product ID, Can't Find Product")
    return;
  }

  try{
    const response = await fetch(`/api/inventory/${deleteProductId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
    console.log('Product Deleted')
    form.reset();
    syncStorefront()
    syncAdminCatalog()

  } catch (error) {
    console.error("Failed to delete product:", error);
  }
}

const handleUpdateProduct = async (event) => {
  event.preventDefault()
  const form = document.getElementById('update-inventory-form')
  const updatedProduct = {
    id: parseInt(form.elements['product-id'].value,10),
    name: form.elements['product-name'].value,
    category: form.elements['product-category'].value,
    price: parseFloat(form.elements['product-price'].value),
    stockCount: parseInt(form.elements['product-stock'].value, 10)
  }

  if (isNaN(updatedProduct.id)) {
    console.error("Invalid Product ID, Can't Find Product")
    return;
  }

  try {
    const reponse = await fetch(`/api/inventory/${updatedProduct.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedProduct)
    });
    if (!reponse.ok) {
      throw new Error(`Server responded with status: ${reponse.status}`);
    }
    console.log('Product Updated')
    form.reset(); // Clear the form after submission
    syncStorefront();
    syncAdminCatalog();

  } catch (error) {
    console.error("Failed to update product:", error);
  }
}

// Fetches fresh data from the server and renders it
async function initStorefront() {
    try {
        // Fetch the latest inventory array from your backend route
        const response = await fetch('/api/inventory');
        const data = await response.json();
        
        // Handle if server responds with an array directly or an object { inventory: [...] }
        const currentInventory = Array.isArray(data) ? data : data.inventory;

        // Pass that fresh data right into your render function
        renderProducts(currentInventory);
        
    } catch (error) {
        console.error("Error initializing storefront:", error);
    }
}

// Clears the DOM grid and triggers a fresh fetch-and-render
async function syncStorefront() {
    const productSection = document.getElementById('product-grid');
    if (!productSection) return;

    // 1. Clear out the old HTML elements
    productSection.innerHTML = '';

    // 2. Wait for initializeStorefront to fetch fresh data and redraw them
    await initStorefront();
}

// Fetches fresh data from the server and renders it
async function initAdminCatalog() {
    try {
        // 1. Fetch the latest inventory array from your backend route
        const response = await fetch('/api/inventory');
        const data = await response.json();
        
        // Handle if your server responds with an array directly or an object { inventory: [...] }
        const currentInventory = Array.isArray(data) ? data : data.inventory;

        // 2. Pass that fresh data right into your render function
        renderAdminCatalog(currentInventory);
        
    } catch (error) {
        console.error("Error initializing admin catalog:", error);
    }
}

// Clears the DOM grid and triggers a fresh fetch-and-render
async function syncAdminCatalog() {
    const productSection = document.getElementById('product-grid');
    if (!productSection) return;

    // 1. Clear out the old HTML elements
    productSection.innerHTML = '';

    // 2. Wait for initializeStorefront to fetch fresh data and redraw them
    await initAdminCatalog();
}


// Call the initialization function when the page loads
window.addEventListener('DOMContentLoaded', initStorefront);
window.addEventListener('DOMContentLoaded', initAdminCatalog);

