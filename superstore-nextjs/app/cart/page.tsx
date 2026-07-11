"use client"

import { useState, useEffect } from 'react'
import CartItem from '../components/cartitme'

type CartItem = {
  cartId: number;
  quantity: number;
  productId: number;
  product:{
    price: number;
    name: string;
    category: string;
  }
} 

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([])

  
  async function fetchCart() {
    const res  = await fetch('./api/cartinventory')
    const data = await res.json()
    setCart(data.cart)
  }

  useEffect(() => {
    fetchCart()
  },[])

  async function reStocking(productId: number, quantity: number) {
    try {
      const getRep = await fetch(`./api/inventory/${productId}`)
      if (!getRep) {
        return alert(`Error finding productId: ${productId}`)
      }
      const product = await getRep.json()
      const newStock = product.stockCount + quantity

      const patchRep = await fetch(`/api/inventory/${productId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stockCount: newStock })
      })
      if (!patchRep.ok) {
        return alert(`Error re-stocking productId: ${productId},error: ${patchRep.status}`)
      }

    } catch (error) {
      console.error('Failed to restock item(s): ',error)
    }    
  }

  // Finish ME
  async function handleRemoveFromCart(cartId: number, productId: number, quantity: number) {
    try {
      const rep = await fetch(`./api/cartinventory/${cartId}`, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'}
      })
      if (!rep.ok) {
        return alert(`Error removing item form cart: ${rep.status}`)
      }
      fetchCart()
      reStocking(productId, quantity)
    } catch (error) {
      console.error('Error removing item form cart: ',error)
    }
  }

 // Finish ME
  async function handleDecrementQuantity(cartId: number, produtId: number) {
    try {
      const rep = await fetch(`./api/cartinventory/${cartId}`, {
        method: 'PATCH',
        headers: {'Constent-Type': 'application/json'}
      })
      if (!rep.ok) {
        return alert(`Error decrementing quantity: ${rep.status}`)
      }

      fetchCart()
      reStocking(produtId, 1)
    } catch (error) {
      console.error('Error decrementing quantity:', error)
    }
  }

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  return (
    <main>
      <section>
        <h1>Your Cart</h1>
        <h2>Total Items: {cartCount}</h2>
        <h2>Total: ${cartTotal.toFixed(2)}</h2>
      </section>

      <section>
        <h1>All Products in Cart</h1>
        <div className='product-grid'>
          {cart.map((item) => (
            <CartItem
              key={item.productId}
              item={item}
              onRemoveFromCart={handleRemoveFromCart}
              onDecrementQuantity={handleDecrementQuantity}
            />
          ))}
        </div>
      </section>


    </main>
  )
}