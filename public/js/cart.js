// ============================================================
// cart.js
// Handles: cart item display, decrement/remove buttons, and
// the cart summary box (cart-detile-section) on cart.html.
// ============================================================

// ─── Cart summary (copied from storefront.js) ───

/** Render the count/total summary box in #cart-detile-section */
function renderCartDetils(cartory) {
  const cartSection = document.getElementById('cart-detile-section');
  cartSection.innerHTML = '';

  const cartCount = cartory.reduce((count, item) => {
    return count + item.quantity;
  }, 0);

  const cartTotal = cartory.reduce((total, item) => {
    return total + (item.product.price * item.quantity);
  }, 0);

  const cartCounter = document.createElement('h3');
  cartCounter.textContent = `Total Items in Cart: ${cartCount}`;

  const cartPrice = document.createElement('h3');
  cartPrice.textContent = `Total Cost of Cart: $${cartTotal.toFixed(2)}`;

  cartSection.appendChild(cartCounter);
  cartSection.appendChild(cartPrice);
}

async function initCartDetils() {
  try {
    const response = await fetch('/api/cart');
    const data = await response.json();
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }
    const currentCart = Array.isArray(data) ? data : data.cart;
    renderCartDetils(currentCart);
  } catch (error) {
    console.error('Error initializing cart', error);
  }
}

async function syncCartDetails() {
  const cartDetil = document.getElementById('cart-detile-section');
  if (!cartDetil) return;

  cartDetil.innerHTML = '';
  await initCartDetils();
}

// ─── Restocking ───

/** Add stockCount units back to the product's inventory stock level. */
async function reStocking(productId, stockCount = 1) {
  try {
    // Fetch current stock from inventory
    const getResp = await fetch(`/api/inventory/${productId}`);
    if (!getResp.ok) {
      throw new Error(`Failed to fetch product ${productId}: ${getResp.status}`);
    }
    const product = await getResp.json();

    const newStock = product.stockCount + stockCount;

    const patchResp = await fetch(`/api/inventory/${productId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stockCount: newStock })
    });
    if (!patchResp.ok) {
      throw new Error(`Server responded with status: ${patchResp.status}`);
    }
    console.log(`Restocked ${stockCount} of product ${productId} (now ${newStock})`);
  } catch (error) {
    console.error('Failed to restock item(s):', error);
  }
}

// ─── Cart item card rendering ───

async function handleDecrement(cartid, productId) {
  try {
    const response = await fetch(`/api/cart/${cartid}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
    const data = await response.json();
    renderCartItemsList(data.cart);
    renderCartDetils(data.cart);

    // Restock 1 unit back to inventory
    await reStocking(productId, 1);
  } catch (error) {
    console.error('Failed to decrement cart item:', error);
  }
}

async function handleRemove(cartid, productId, quantity) {
  try {
    const response = await fetch(`/api/cart/${cartid}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
    const data = await response.json();
    renderCartItemsList(data.cart);
    renderCartDetils(data.cart);

    // Restock all units back to inventory
    await reStocking(productId, quantity);
  } catch (error) {
    console.error('Failed to remove cart item:', error);
  }
}

function renderCartItemsList(cart) {
  const container = document.getElementById('cart-items-container');
  if (!container) return;

  container.innerHTML = '';

  if (!cart || cart.length === 0) {
    const emptyMsg = document.createElement('p');
    emptyMsg.textContent = 'Your cart is empty. Start shopping!';
    container.appendChild(emptyMsg);
    return;
  }

  cart.forEach(item => {
    const card = document.createElement('article');
    card.classList.add('product-card');

    // Category tag
    const categoryTag = document.createElement('span');
    categoryTag.classList.add('category-tag');
    categoryTag.textContent = item.product.category;
    card.appendChild(categoryTag);

    // Product name
    const title = document.createElement('h3');
    title.classList.add('product-title');
    title.textContent = item.product.name;
    card.appendChild(title);

    // Price per unit
    const priceText = document.createElement('p');
    priceText.classList.add('price-text');
    priceText.textContent = `$${item.product.price.toFixed(2)} each`;
    card.appendChild(priceText);

    // Quantity badge
    const quantityText = document.createElement('p');
    quantityText.classList.add('instock-text');
    quantityText.textContent = `Qty: ${item.quantity}`;
    card.appendChild(quantityText);

    // Subtotal
    const subtotal = document.createElement('p');
    subtotal.classList.add('price-text');
    subtotal.textContent = `Subtotal: $${(item.product.price * item.quantity).toFixed(2)}`;
    card.appendChild(subtotal);

    // Button row
    const btnGroup = document.createElement('div');
    btnGroup.style.display = 'flex';
    btnGroup.style.gap = '8px';
    btnGroup.style.justifyContent = 'center';
    btnGroup.style.marginTop = '8px';

    // Decrement (−) button — removes 1 from cart, restocks 1
    const decBtn = document.createElement('button');
    decBtn.classList.add('button-look');
    decBtn.setAttribute('type', 'button');
    decBtn.textContent = '\u2212';
    decBtn.addEventListener('click', () => handleDecrement(item.cartid, item.productId));
    btnGroup.appendChild(decBtn);

    // Remove button — removes entire item from cart, restocks full quantity
    const removeBtn = document.createElement('button');
    removeBtn.classList.add('button-look');
    removeBtn.setAttribute('type', 'button');
    removeBtn.textContent = 'Remove';
    removeBtn.addEventListener('click', () => handleRemove(item.cartid, item.productId, item.quantity));
    btnGroup.appendChild(removeBtn);

    card.appendChild(btnGroup);
    container.appendChild(card);
  });
}

async function initCartPage() {
  try {
    const response = await fetch('/api/cart');
    const data = await response.json();
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }
    const currentCart = Array.isArray(data) ? data : data.cart;
    renderCartItemsList(currentCart);
    renderCartDetils(currentCart);
  } catch (error) {
    console.error('Error rendering cart items:', error);
  }
}

// ─── Init ───
document.addEventListener('DOMContentLoaded', () => {
  initCartPage();
});
