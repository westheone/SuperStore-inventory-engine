"use client"

import { CartItem } from "../lib/cartitme";
import { useState, useEffect } from 'react';
import ItemCard from "../components/itemcard";

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([])

  async function getCart() {
  const res = await fetch('./api/cart')
  const data = await res.json()
  setCart(data.cart)
  }

  async function reStocking(productId: number, quantity: number) {
    try {
      const getRes = await fetch(`./api/inventory/${productId}`)
      if (!getRes) {
        return alert(`Error finding productId: ${productId}`)
      }
      const data = await getRes.json()
      const product = data.product
      const newStock = product.stockCount + quantity

      const update = {
        id: product.id,
        price: product.price,
        stockCount: newStock
      }

      const patchRep = await fetch(`/api/inventory/${productId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(update)
      })
      if (!patchRep.ok) {
        return alert(`Error re-stocking productId: ${productId},error: ${patchRep.status}`)
      }

    } catch (error) {
      console.error('Failed to restock item(s): ',error)
    }    
  }

  async function handleDec(cartId: number, produtId: number) {
    try {
      const rep = await fetch(`./api/cart/${cartId}`, {
        method: 'PATCH',
        headers: {'Constent-Type': 'application/json'},
        body: JSON.stringify(produtId)
      })
      if (!rep.ok) {
        return alert(`Error decrementing quantity: ${rep.status}`)
      }

      // getCart()
      reStocking(produtId, 1)
    } catch (error) {
      console.error('Error decrementing quantity:', error)
    }
  }

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  useEffect(() =>{
    getCart()
  },[])


  return(
    <div>
      <section>
        <h1>Your Cart</h1>
        <h2>Total Items: {cartCount}</h2>
        <h2>Total: ${cartTotal.toFixed(2)}</h2>
      </section>

     <section>
        <h1>All Products in Cart</h1>
        <div className='product-grid'>
          {cart.map((item) => (
            <ItemCard
            key={item.productId}
            item={item} 
            onDeleteItem={handleDec}
            />
          ))}
        </div>
      </section>
    </div>
  )
}