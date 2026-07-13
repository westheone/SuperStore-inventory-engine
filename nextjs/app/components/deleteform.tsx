async function onDeleteProduct(formData: FormData) {
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

export default function DeleteForm() {

  return(
    <form id="delete-product-form" action={onDeleteProduct} className="inventory-form" aria-label="Delete Product"> 
       <h2>Delete Product</h2>
        <label htmlFor="product-id">Product Id:</label>
        <input 
          type="number"
          id="product-id"
          name="id"
          min={0}
          step={1}
          placeholder="Enter Id number 1, 2, 3 ..."
          required
        />

        <button type="submit">
          Delete Product
        </button>
    </form>
  )
}