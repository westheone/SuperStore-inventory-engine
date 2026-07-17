"use client"

import { Product } from "../lib/product"
import { useState,useEffect } from "react"
import AdminRow from "../components/adminrow"
import LowStockRow from "../components/lowstockrow"
import AddFrom from "../components/addform"
import UpdateFrom from "../components/updateform"
import DeleteForm from "../components/deleteform"


export default function AdminPage() {
  const [inventory, setInventory] = useState<Product[]>([])

  async function getInventory() {
    const res = await fetch('./api/inventory')
    const data = await res.json()
    setInventory(data.inventory)
  }

  async function addProduct(formData: FormData) {
  const product = {
    name: formData.get("name"),
    category: formData.get("category"),
    price: Number(formData.get("price")),
    stockCount: Number(formData.get("stock")),
  }

  try{
      await fetch('./api/inventory', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(product)
      })
      
    } catch (error) {
      console.error("Failed to add product", error)
      alert("Product failed to add")
    }

  }

  async function updateProduct(formData: FormData) {

  const product = {
    id: Number(formData.get("id")),
    price: Number(formData.get("price")),
    stockCount: Number(formData.get("stock")),
  }

  try {
      const res = await fetch(`./api/inventory/${product.id}`, {
        method: 'PATCH',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({price: product.price, stockCount: product.stockCount})
      })
      if (!res.ok) {
         const err = await res.json().catch(() => ({}))
        throw new Error(err.message ?? `Server responded with status: ${res.status}`)
        }

    } catch (error) {
      console.error("Failed to update product", error)
    }
  }

  async function deleteProduct(formData: FormData) {
  const product = {
    id: Number(formData.get("id"))
  }

  try {
    await fetch(`./api/inventory/${product.id}`, {
      method: 'DELETE',
      headers: {'Content-Type':'application/json'}
     })
  } catch (error) {
    console.error("Failed to delete product", error)
  }
  }

  useEffect(() => {
    getInventory()
  },[])

  const lowInventory = inventory.filter((p) => p.stockCount <= 3 )

  return(
    <div className='admin-container'>

      <section className='admin-form-container' aria-label='Admin Forms'>
        <AddFrom onAdd={addProduct}/>
        <UpdateFrom onUpdate={updateProduct}/>
        <DeleteForm onDelete={deleteProduct}/>
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
              {lowInventory.map((p) => 
              <LowStockRow
                key={p.id}
                product={p}
              />
            )}
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
            {inventory.map((p) => 
              <AdminRow
              key={p.id}
              product={p}
              />
            )}
          </tbody>
        </table>
      </section>

    </div>
  )
}