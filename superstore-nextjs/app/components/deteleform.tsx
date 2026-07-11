'use client'

import { useState } from 'react'

type Props = {
  onDeleteProduct: (id: number) => void
}

export default function DeleteForm({onDeleteProduct}: Props) {
  const [id, setId] = useState('')

  return(
    <form id="delete-product-form" className="inventory-form" aria-label="Delete Product"> 
       <h2>Delete Product</h2>
        <label htmlFor="product-id">Product Id:</label>
        <input 
          type="number"
          id="product-id"
          value={id}
          onChange={(e) => setId(e.target.value)}
          min={0}
          step={1}
          placeholder="Enter Id number 1, 2, 3 ..."
          required
        />

        <button type="submit" onClick={() => onDeleteProduct(parseInt(id, 10))}>
          Delete Product
        </button>
    </form>
  )
}