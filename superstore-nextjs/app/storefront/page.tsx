'use client'

import { useState, useEffect } from 'react'
import ProductCard from '../components/productcard'
type Product = {
  id: number;
  name: string;
  category: string | null;
  price: number;
  stockCount: number;
}

type CartItem = {
  cartid: number;
  quantity: number;
  productId: number;
  product: {
    price: number;
  }
}

export default function StoreFrontPage() {
  const [inventory, setInventory] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchInventory()
    fetchCart()
  }, []) 

  async function fetchInventory() {
    const res  = await fetch('./api/inventory')
    const data = await res.json()
    setInventory(data.inventory)
  }

  async function fetchCart() {
    const res  = await fetch('./api/cartinventory')
    const data = await res.json()
    setCart(data.cart)
  }

  async function updateCart(foundProduct: Product) {
    const cartItem = {
      productId: foundProduct.id,
      quantity: 1
    }
    try {const rep = await fetch('./api/cartinventory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cartItem),
      })

      if (!rep.ok) {
        return alert(`Error updating inventory: ${rep.status}`)
      }

      fetchCart()

    } catch (error) {
      console.error('Error updating cart:', error)
    }

  }

  async function updateInventory(productid: number, newStockCount: number) {
    try {
      const rep = await fetch(`./api/inventory/${productid}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stockCount: newStockCount }),
      })

      if (!rep.ok) {
        return alert(`Error updating inventory: ${rep.status}`)
      }

      fetchInventory()

    } catch (error) {
      console.error('Error updating inventory:', error)
    }
  }

  async function handleAddToCart(product: Product) {
    const foundProduct = inventory.find(p => p.id === product.id)
    if (foundProduct && foundProduct.stockCount > 0) { 
      foundProduct.stockCount -= 1

      await updateCart(foundProduct)
      await updateInventory(foundProduct.id, foundProduct.stockCount)

    } else {
      return alert('Out of stock!')
    }
  }

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const filtered  = inventory.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return(
    <main>
      <div className='cart-search-grid'>
        <section className='cart-details' style={{gridArea: 'cart-details'}} aria-label='Cart Summary'>
          <h1>Your Cart</h1>
          <h2>Total Items: {cartCount}</h2>
          <h2>Total Cost: ${cartTotal.toFixed(2)}</h2>
        </section>

        <section className='search-container' style={{gridArea: 'search-container'}} aria-label='Product Search'>
          <h1>Search Inventory Here</h1>
          <label htmlFor='search-bar'>Search: Name or Category</label>
          <input
            className='search-bar'
            id='search-bar'
            type="search"
            placeholder="Looking for a product..."
            aria-label='search bar'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </section>
      </div>

      <div aria-label='Product grid'>
        <h1>All Avaliable Products</h1>
        <div className='product-grid'>
          {filtered.map(product => (
            <ProductCard
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </div>
    </main>
  )

}

