
async function onUpdateProduct(formData: FormData) {
  const product = {
    id: Number(formData.get("id")),
    price: Number(formData.get("price")),
    stockCount: Number(formData.get("stock")),
  }

  try {
      const res = await fetch(`./api/inventory/${product.id}`, {
        method: 'PATCH',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(product)
      })
      if (!res.ok) {
         const err = await res.json().catch(() => ({}))
        throw new Error(err.message ?? `Server responded with status: ${res.status}`)
        }

    } catch (error) {
      console.error("Failed to update product", error)
    }
}

export default function UpdateFrom() {

  return(
    <form id="update-product-form" action={onUpdateProduct} className="inventory-form" aria-label="Update Product">
      <h2>Update Product</h2>
        <label htmlFor="product-id">Product Id:</label>
        <input 
          type="number"
          id="product-id"
          name="id"
          min={0}
          placeholder="Enter Id number 1, 2, 3 ..."
          required
        />

        <label htmlFor="product-price">Price:</label>
        <input
          type="number"
          id="product-price"
          name="price"
          min={0}
          step={0.01}
          placeholder="Enter new price 1, 5.50, 10.99 ..."
        />

        <label htmlFor="product-stock">Stock Count:</label>
        <input
          type="number"
          id="product-stock"
          name="stock"
          min={0}
          step={1}
          placeholder="Enter new stock count 0, 5, 10 ..."
        />

        <button type="submit" >
          Update Product
        </button>
      </form>
    )
  }