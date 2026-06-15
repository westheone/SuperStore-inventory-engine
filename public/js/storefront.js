// ============================================================
// storefront.js
// Handles: product grid, search, add-to-cart, and the
// cart summary box (cart-detile-section) shown on this page.
// ============================================================

// for filtering the invetntory
let searchInventory = []

// search bar - fillters search inventory
function enableStorefrontSearch() {
    const searchInput = document.getElementById('storefront-search');
    const productSection = document.getElementById('product-grid');

    // if the elements aren't on this current page, stop here
    if (!searchInput || !productSection) return;

    searchInput.addEventListener('input', (event) => {
        const searchTerm = event.target.value.toLowerCase();

        // filter the search inventory by name or category (maybe by price later)
        const filteredResults = searchInventory.filter(product => {
            return product.name.toLowerCase().includes(searchTerm) ||
                   product.category.toLowerCase().includes(searchTerm);
        });

        // clears out of the grid
        productSection.innerHTML = '';

        // render only the matching items
        renderProducts(filteredResults);
    });
}

// EXECUTE IT ONCE WHEN THE PAGE LOADS
enableStorefrontSearch();

// Function to update server data and sync front-end
async function updateProductStock(productId, newCount) {
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

// Fetches fresh data from the server and renders it
async function initStorefront() {
  // if this page doesn't have product-grid, it's not the storefront
  if (!document.getElementById('product-grid')) return;
    try {
        // Fetch the latest inventory array from  backend route
        const response = await fetch('/api/inventory');
        const data = await response.json();

        // Handle if server responds with an array directly or an object { inventory: [...] }
        const currentInventory = Array.isArray(data) ? data : data.inventory;


        // Pass fresh data right into render functions and search inventory
        searchInventory = currentInventory;
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
document.addEventListener('DOMContentLoaded', () => {
  initStorefront();
});