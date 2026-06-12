// Function to update server data and sync front-end
async function updateProductStock(productId, newCount) {
  // const foundProduct = cartory.find(item => item.id === productId)
  try{
    const response = await fetch(`/api/inventory/${productId}`, {
      method: 'PATCH',
      headers: {'Content-Type': 'application/json'}, // Tell Express to expect JSON string data
      body: JSON.stringify({stockCount: newCount})
    });

    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }

    await syncStorefront();

  } catch (error) {
    console.error("Failed to execute inventory update:", error)
  }
}

async function updateCart(foundProduct) {
  const cartProduct = {
    id: foundProduct.id,
    name: foundProduct.name,
    price: foundProduct.price,
    quantity: 1,
    cartid: null
  };
  try{
    const response = await fetch(`/api/cart`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(cartProduct)
    });

    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }

    await syncCartDetails();

  } catch (error) {
    console.error("Failed to execute cart update:", error)
  }
}

// Function to handle adding to cart
const handleAddToCart = async (productId, inventory) => {
  // finds products
  const foundProduct = inventory.find(item => item.id === productId);
  if (foundProduct && foundProduct.stockCount > 0) {
    foundProduct.stockCount -= 1; // updates the stock count
    // pass updated count to server
    await updateCart(foundProduct)
    await updateProductStock(productId, foundProduct.stockCount)
    
  } else {
    alert('Sorry, this product is out of stock')
  }
}

// Function to render cart detils
function renderCartDetils(cartory) {
  const cartSection = document.getElementById('cart-detile-section');
  // counts the quantity of each product
  const cartCount = cartory.reduce((count, product) => { 
    return count +(product.quantity);
  }, 0); // ) is the starting value for 'count'
  // calculates a total from an array
  const cartTotal = cartory.reduce((total, product) => {
    return total + (product.price * product.quantity);
  }, 0); // 0 is the starting value for 'total'
 
  const cartCounter = document.createElement('h3')
  cartCounter.textContent =`Total Items in Cart: ${cartCount}`; 
  const cartPrice = document.createElement('h3')
  cartPrice.textContent =`Total Cost of Cart: $${cartTotal}`;

  cartSection.appendChild(cartCounter);
  cartSection.appendChild(cartPrice);
}

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
// Function to render the admin inventory catalog 
function renderAdminCatalog(inventory) {
  console.log('Rendering admin catalog...');
  const adminCatalog = document.getElementById('admin-inventory-table-body');
  inventory.forEach(product => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${product.id}</td>
      <td>${product.name}</td>
      <td>${product.category}</td>
      <td>$${product.price.toFixed(2)}</td>
      <td>${product.stockCount}</td>
    `;
    adminCatalog.appendChild(row);
  });
}
function renderAdminStock(inventory) {
  console.log('Rendering admin Stcok Table...');
  const adminStock = document.getElementById('admin-lowout-table-body');
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
        syncCartDetails();
        
    } catch (error) {
        console.error("Error initializing storefront:", error);
    }
}

// Clears the DOM grid and triggers a fresh fetch-and-render
async function syncStorefront() {
    const productSection = document.getElementById('product-grid');
    if (!productSection) return;

    // Clear out the old HTML elements
    productSection.innerHTML = '';

    // Wait for initializeStorefront to fetch fresh data and redraw them
    await initStorefront();
}

// Fetches fresh data from the server and renders it
async function initAdminCatalog() {
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
async function syncAdminCatalog() {
    const productSection = document.getElementById('product-grid');
    if (!productSection) return;

    // Clear out the old HTML elements
    productSection.innerHTML = '';

    // Wait for initAdminCatalog to fetch fresh data and redraw them
    await initAdminCatalog();
}

async function initCartDetils() {
  try{
    // Fetch the latest inventory array from backend route
    const response = await fetch(`/api/cart`);
    const data = await response.json();
    // Check if the server returned a 404 or 500 error first
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }
    // if server responds with an array directly or an object { cart: [...] }
    const currentCart = Array.isArray(data) ? data : data.cart;

    // Pass that fresh data right into render function
    renderCartDetils(currentCart);

  } catch (error) {
    console.error("Error initializing cart", error);
    
  }
}

async function syncCartDetails() {
  const cartDetil = document.getElementById('cart-detile-section');
  if (!cartDetil) return;

  // Clear out the old HTML elements
  cartDetil.innerHTML ='';

  // wait for initCartDetils to fetch fresh data and redraw them
  await initCartDetils();

}

// Call the initialization function when the page loads
window.addEventListener('DOMContentLoaded', initStorefront);
window.addEventListener('DOMContentLoaded', initAdminCatalog);

