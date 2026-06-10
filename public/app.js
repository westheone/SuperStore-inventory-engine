
async function syncInventory() {
  try {
    const response = await fetch('/api/inventory');
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
  const inventoryData = await response.json();
  return inventoryData;
  console.log('Synchronized:')

  } catch (error) {
    console.error('Failed to fetch inventory:', error);
    return [];
  }

}
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
    resyncStorefront();
    resyncAdmin();

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
    resyncStorefront();
    resyncAdmin();

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
    resyncStorefront()
    resyncAdmin()

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
    resyncStorefront();
    resyncAdmin();

  } catch (error) {
    console.error("Failed to update product:", error);
  }
}


// Function to initialize storefront current inventory data
function initializeStorefront() {
  syncInventory().then(inventory => {
    renderProducts(inventory);
  }).catch(error => {
    console.error('Error initializing storefront:', error);
  });
}
// Function to re-sync storefront after updates
function resyncStorefront() {
  const productSection = document.getElementById('product-grid');
    productSection.innerHTML = '';
    initializeStorefront();
}
// Function to initialize admin panel current inventory data
function initializeAdmin() {
  syncInventory().then(inventory => {
    renderAdminCatalog(inventory);
  }).catch(error => {
    console.error('Error initializing admin panel:', error);
  });
}
// Function to re-sync admin panel after updates
function resyncAdmin() {
  const adminSection = document.getElementById('admin-inventory-table-body');
    adminSection.innerHTML = '';
    initializeAdmin();
}


// Call the initialization function when the page loads
window.addEventListener('DOMContentLoaded', initializeStorefront);
window.addEventListener('DOMContentLoaded', initializeAdmin);



// const updateProductDisplay = () => {
//   const inventory = JSON.parse(localStorage.getItem("inventory"));
//   const productCards = document.querySelectorAll('.product-card');

//   productCards.forEach((card, index) => {
//     const product = inventory[index];
//     const stockText = card.querySelector('.instock-text');
//     stockText.textContent = `In Stock: ${product.stockCount}`;
//   });
// };

// const handleAddToCart = (productId) => {
//   // const inventory = JSON.parse(localStorage.getItem("inventory"));
//   const inventory = syncInventory();
//   const productIndex = inventory.findIndex(p => p.id === productId);
//   if (productIndex !== -1 && inventory[productIndex].stockCount > 0) {
//     inventory[productIndex].stockCount -= 1;
//     inventory[productIndex].cartid = Date.now();

//     //localStorage.setItem("inventory", JSON.stringify(inventory));
//     updateProductDisplay();
//   }
// };
