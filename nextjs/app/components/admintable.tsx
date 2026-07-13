"use client"

import { useState, useEffect } from "react"
import { Product } from "../lib/product"
import AdminRow from "./adminrow"



export default function AdminTable() {
  const [inventory, setInventory] = useState<Product[]>([])

  async function getInventory() {
  const res = await fetch('./api/inventory')
  const data = await res.json()
  setInventory(data.inventory)
  }

  useEffect(() => {
      getInventory()
    },[])

  return(
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
  )
}