'use client'

import { useState } from 'react'


type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  stockCount: number;
}

type Props = {
  onUpdateProduct: (product: Product) => void
}


export default function UpdateFrom({onUpdateProduct}: Props) {
  const [id,setId] = useState('')
  const [name, setName]         = useState('')
  const [category, setCategory] = useState('')
  const [price, setPrice]       = useState('')
  const [stockCount, setStock]  = useState('')

  return(
    <form id="update-product-form" className="inventory-form" aria-label="Update Product">
      <h2>Update Product</h2>
        <label htmlFor="product-id">Product Id:</label>
        <input 
          type="number"
          id="product-id"
          value={id}
          onChange={(e) => setId(e.target.value)}
          min={0}
          placeholder="Enter Id number 1, 2, 3 ..."
          required
        />

        <label htmlFor="product-name">Product Name:</label>
        <input
          type="text"
          id="product-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter new product name"
        />

        <label htmlFor="product-category">Category:</label>
        <input
          type="text"
          id="product-category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Enter new category"
        />

        <label htmlFor="product-price">Price:</label>
        <input
          type="number"
          id="product-price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          min={0}
          step={0.01}
          placeholder="Enter new price 1, 5.50, 10.99 ..."
        />

        <label htmlFor="product-stock">Stock Count:</label>
        <input
          type="number"
          id="product-stock"
          value={stockCount}
          onChange={(e) => setStock(e.target.value)}
          min={0}
          step={1}
          placeholder="Enter new stock count 0, 5, 10 ..."
        />

        <button type="submit" onClick={() => onUpdateProduct({id: parseInt(id,10), name: name, category: category, price: parseFloat(price), stockCount: parseInt(stockCount,10)})} >
          Update Product
        </button>
      </form>
    )
  }