// ============================================================
// admin.js
// Handles: admin inventory table, low-stock table, and the
// add / update / delete product forms.
// Extracted from app.js — storefront-only code removed.
// ============================================================
/*
// Function to render products on the page
function renderProducts(inventory) {
  console.log('Rendering storefront inventory...');
  const productSection = document.getElementById('product-grid');
  if (!productSection) {
    console.error("Critical Error: Could not find the '#product-grid' element in the HTML DOM.");
    return; 
  }
  

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
*/
// Function to render the admin inventory catalog  and Stock tablr
function renderAdminCatalog(inventory) {
  console.log('Rendering admin catalog...');
  const adminCatalog = document.getElementById('admin-inventory-table-body');

  // Add this guard clause to prevent the error:
  if (!adminCatalog) {
      console.log('Admin catalog table body not found on this page.');
      return; 
  }

  inventory.forEach(product => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${product.id}</td>
      <td>${product.name}</td>
      <td>${product.category}</td>
      <td>$${(product.price ?? 0).toFixed(2)}</td>
      <td>${product.stockCount}</td>
    `;
    adminCatalog.appendChild(row);
  });
}
function renderAdminStock(inventory) {
  console.log('Rendering admin Stcok Table...');
  const adminStock = document.getElementById('admin-lowout-table-body');

  // Add this guard clause to prevent the error:
  if (!adminStock) {
      console.log('Admin Stock table body not found on this page.');
      return; 
    }
  inventory.forEach(product => {
    const row = document.createElement('tr');
    if (product.stockCount <= 3) {
      row.innerHTML = `
      <td>${product.id}</td>
      <td>${product.name}</td>
      <td>${product.stockCount}</td>
      `;
      adminStock.appendChild(row);
    }
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
    // syncStorefront();
    syncAdminPage();

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
    // syncStorefront()
    syncAdminPage()

  } catch (error) {
    console.error("Failed to delete product:", error);
  }
}
// Handler for "Update Product"
const handleUpdateProduct = async (event) => {
  event.preventDefault()
  const form = document.getElementById('update-inventory-form')

  // Extract all input values first for readability
  const nameInput = form.elements['product-name'].value;
  const categoryInput = form.elements['product-category'].value;
  const priceInput = form.elements['product-price'].value;
  const stockInput = form.elements['product-stock'].value;

  const updatedProduct = {
    id: parseInt(form.elements['product-id'].value, 10), // Always required
    ...(nameInput !== '' && { name:       nameInput }),
    ...(categoryInput !== '' && { category:   categoryInput }),
    ...(priceInput !== '' && { price:      parseFloat(priceInput) }),
    ...(stockInput !== '' && { stockCount: parseInt(stockInput, 10) })
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
     console.log(updatedProduct)
    form.reset(); // Clear the form after submission
    // syncStorefront();
    syncAdminPage();

  } catch (error) {
    console.error("Failed to update product:", error);
  }
}

// Fetches fresh data from the server and renders it
async function initAdminPage() {
  // if this page doesn't have the admin table, it's not the admin page
  if (!document.getElementById('admin-inventory-table-body')) return;
    try {
        // Fetch the latest inventory array from backend route
        const response = await fetch('/api/inventory');
        const data = await response.json();
        
        // if server responds with an array directly or an object { inventory: [...] }
        const currentInventory = Array.isArray(data) ? data : data.inventory;

        // Pass that fresh data right into render function
        renderAdminCatalog(currentInventory);
        renderAdminStock(currentInventory);
        
    } catch (error) {
        console.error("Error initializing admin catalog:", error);
    }
}

// Clears the DOM grid and triggers a fresh fetch-and-render
async function syncAdminPage() {
    const adminCatalog = document.getElementById('admin-inventory-table-body');
    const adminStock = document.getElementById('admin-lowout-table-body');
    if (!adminStock || adminCatalog) return;

    // Clear out the old HTML elements
    adminCatalog.innerHTML = '';
    adminStock.innerHTML = '';

    // Wait for initAdminPage to fetch fresh data and redraw them
    await initAdminPage();
}

// Call the initialization function when the page loads
document.addEventListener('DOMContentLoaded', () => {
  initAdminPage();
});