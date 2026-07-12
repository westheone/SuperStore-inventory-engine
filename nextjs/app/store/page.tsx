"use client"

import ProductCard from "../components/productcard"
import { Product } from "../lib/product"
import { CartItem } from "../lib/cartitme"
import { useState,useEffect } from "react"

const [inventory, setInventory] = useState<Product[]>([])
const [cart, setCart] = useState<CartItem[]>([])
const [searchTerm, setSearch] = useState<string>("")


export async function getInventory() {
  const res = await fetch("../api/inventory/route")
  const data = await res.json()
  setInventory(data.inventory)
}

export async function getCart() {
  const res = await fetch("../api/cart/route")
  const data = await res.json()
  setCart(data.cart)
}

async function updateCart(id:number) {
  const cartItem = {
      productId: id,
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

    //getCart()

  } catch (error) {
    console.error('Error updating cart:', error)
  }
}

async function updateInv(id:number, stock:number) {
  try {
      const rep = await fetch(`./api/inventory/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stockCount: stock }),
      })

      if (!rep.ok) {
        return alert(`Error updating inventory: ${rep.status}`)
      }

      //getInventory()

    } catch (error) {
      console.error('Error updating inventory:', error)
    }
}

async function handleAddToCart(id:number) {
  const found = inventory.find((p) => p.id === id)
  if (found && found.stockCount > 0) {
    found.stockCount -= 1

    await updateCart(found.id)
    await updateInv(found.id, found.stockCount)
  } else {
    return alert('Out of stock!')
  }
}

export default function StorePage() {
  useEffect(() =>{
    getInventory()
    getCart()
  },[handleAddToCart])

  const cartCount = cart.reduce((sum, item) => sum + item.quantity,0)
  const cartTotal = cart.reduce((sum, item) => sum + (item.quantity * item.product.price),0)
  const filtered  = inventory.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div>
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
            onChange={e => setSearch(e.target.value)}
          />
        </section>
      </div>

      <div aria-label='Product grid'>
        <h1>All Avaliable Products</h1>
        <section className='product-grid'>
          {filtered.map(product => (
            <ProductCard
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
            />
          ))}
        </section>
      </div>

    </div>

  )
}