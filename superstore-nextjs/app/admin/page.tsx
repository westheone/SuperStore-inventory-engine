'use client'

import { useState, useEffect } from 'react'
import AddForm from '../components/addform'
import UpdateForm from '../components/updateform'
import DeleteForm from '../components/deteleform'
import AdminTableRow from '../components/admintablerows'
import AdminLowStock from '../components/adminlowstock'

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  stockCount: number;
}


export default function AdminPage() {
  const [inventory, setInventory] = useState<Product[]>([])

  async function fetchInventory() {
    const res  = await fetch('./api/inventory')
    const data = await res.json()
    setInventory(data.inventory)
  }

  useEffect(() => {
    fetchInventory()
  },[])

  async function handleAddProduct (product:{name: string, category: string, price: number, stockCount: number}) {
    const existingProduct = inventory.find((p) => p.name.toLowerCase() === product.name.toLowerCase()  
      && p.category.toLowerCase() === product.category.toLowerCase())

    if (existingProduct) {
      return alert('Product already exists!')
    }

    try{
      await fetch('./api/inventory', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(product)
      })
      fetchInventory()
    } catch (error) {
      console.error("Failed to add product", error)
    }
  }

  async function handleUpdateProduct (product: Product) {
    const existingProduct = inventory.find((p) => p.id === product.id)
    if (!existingProduct) {
      return alert('Product not found!')
    }

    const payload: Partial<Product> & { id: number } = {
      id: product.id,
      ...(product.name && { name: product.name }),
      ...(product.category && { category: product.category }),
      ...(product.price !== undefined && !isNaN(product.price) && { price: product.price }),
      ...(product.stockCount !== undefined && !isNaN(product.stockCount) && { stockCount: product.stockCount })
    }

    try {
      const res = await fetch(`./api/inventory/${product.id}`, {
        method: 'PATCH',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(payload)
      })
      if (!res.ok) {
         const err = await res.json().catch(() => ({}))
        throw new Error(err.message ?? `Server responded with status: ${res.status}`)
        }
      await fetchInventory()
    } catch (error) {
      console.error("Failed to update product", error)
    }
  }

  async function handleDeleteProduct (id: number) {
    const existingProduct = inventory.find((p) => p.id === id)
    if (!existingProduct) {
      return alert('Product not found!')
    }

    try {
      await fetch(`./api/inventory/${id}`, {
        method: 'DELETE',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ id })
       })
       fetchInventory()
    } catch (error) {
      console.error("Failed to delete product", error)
    }
  }

  const lowStockProducts = inventory.filter((p) => p.stockCount <= 3)

  return(
    <main>
      <h1>Admin Panel</h1>
      <p>Manage your inventory and view sales data.</p>

      <div className='admin-container'>
        <section className='admin-form-container' aria-label='Admin Forms'>
          <AddForm onAddProduct={handleAddProduct}/>
          <UpdateForm onUpdateProduct={handleUpdateProduct}/>
          <DeleteForm onDeleteProduct={handleDeleteProduct}/>
        </section>

        <section className='admin-lowstock-container' aria-label='Low Stock Products'>
          <h2>Low and Out of Stock Products</h2>
          <table aria-label="Low Stock Catalog">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Stock Count</th>
              </tr>
            </thead>
            <tbody>
              {lowStockProducts.map((product) => (
                <AdminLowStock key={product.id} product={product}/>
              ))}
            </tbody>
          </table>
        </section>

        <section className='admin-inventory-catalog' aria-label='Inventory Catalog'>
          <h2>Current Inventory</h2>
          <table aria-label="Inventory Catalog">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock Count</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((product) => (
                <AdminTableRow key={product.id} product={product}/>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </main>
  )
}