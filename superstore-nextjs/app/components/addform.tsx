'use client'

import { useState } from 'react'


type Product = {
  name: string;
  category: string;
  price: number;
  stockCount: number;
}

type Props = {
  onAddProduct: (product: Product) => void
}


export default function AddFrom({onAddProduct}: Props) {
  const [name, setName]         = useState('')
  const [category, setCategory] = useState('')
  const [price, setPrice]       = useState('')
  const [stockCount, setStock]  = useState('')

  return(
    <form id="add-product-form" className="inventory-form" aria-label="Add New Product">
      <h2>Add New Product</h2>
        <label htmlFor="product-name">Product Name:</label>
        <input
          type="text"
          id="product-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter product name"
          required
        />

        <label htmlFor="product-category">Category:</label>
        <input
          type="text"
          id="product-category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Enter category"
          required
        />

        <label htmlFor="product-price">Price:</label>
        <input
          type="number"
          id="product-price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          min={0}
          step={0.01}
          placeholder="Enter price 1, 5.50, 10.99 ..."
          required
        />

        <label htmlFor="product-stock">Stock Count:</label>
        <input
          type="number"
          id="product-stock"
          value={stockCount}
          onChange={(e) => setStock(e.target.value)}
          min={0}
          step={1}
          placeholder="Enter stock count 0, 5, 10 ..."
          required
        />

        <button type="submit" onClick={() => onAddProduct({ name: name, category: category, price: parseFloat(price), stockCount: parseInt(stockCount,10)})} >
          Add Product
        </button>
      </form>
    )
  }