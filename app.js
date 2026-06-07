function getDefaultInventory() {
  const defaultInventory = [
    { id: 1, name: "Premium Wireless Headphones", category: "Electronics", price: 129.99, stockCount: 15, cartid: undefined },
    { id: 2, name: "Ergonomic Office Chair", category: "Furniture", price: 249.99, stockCount: 3, cartid: undefined },
    { id: 3, name: "Stainless Steel Water Bottle", category: "Fitness", price: 24.99, stockCount: 0, cartid: undefined  },
    { id: 4, name: "Smart LED Desk Lamp", category: "Electronics", price: 59.99, stockCount: 8, cartid: undefined  },
    { id: 5, name: "Memory Foam Pillow", category: "Furniture", price: 39.99, stockCount: 12, cartid: undefined },
    { id: 6, name: "Yoga Mat with Carrying Strap", category: "Fitness", price: 29.99, stockCount: 5, cartid: undefined },
    { id: 7, name: "Bluetooth Speaker", category: "Electronics", price: 89.99, stockCount: 2, cartid: undefined },
    { id: 8, name: "Adjustable Standing Desk Converter", category: "Furniture", price: 199.99, stockCount: 4, cartid: undefined },
    { id: 9, name: "Resistance Bands Set", category: "Fitness", price: 19.99, stockCount: 20, cartid: undefined },
    { id: 10, name: "4K Ultra HD Action Camera", category: "Electronics", price: 149.99, stockCount: 7, cartid: undefined },
  ];

  const storedInventory = localStorage.getItem("inventory");
  if (storedInventory) {
    return JSON.parse(storedInventory);
  } else {
    localStorage.setItem("inventory", JSON.stringify(defaultInventory));
    return defaultInventory;
  }
}

const inventory = getDefaultInventory();

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
  addToCartBtn.addEventListener('click', () => handleAddToCart(product.id));
  productCard.appendChild(addToCartBtn);

  productSection.appendChild(productCard);
});

const updateProductDisplay = () => {
  const inventory = JSON.parse(localStorage.getItem("inventory"));
  const productCards = document.querySelectorAll('.product-card');

  productCards.forEach((card, index) => {
    const product = inventory[index];
    const stockText = card.querySelector('.instock-text');
    stockText.textContent = `In Stock: ${product.stockCount}`;
  });
};

const handleAddToCart = (productId) => {
  const inventory = JSON.parse(localStorage.getItem("inventory"));
  const productIndex = inventory.findIndex(p => p.id === productId);
  if (productIndex !== -1 && inventory[productIndex].stockCount > 0) {
    inventory[productIndex].stockCount -= 1;
    inventory[productIndex].cartid = Date.now();
    localStorage.setItem("inventory", JSON.stringify(inventory));
    updateProductDisplay();
  }
};
