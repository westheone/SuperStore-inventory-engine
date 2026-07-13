
async function onAddProduct(formData: FormData) {
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



export default function AddFrom() {

  return(
    <form id="add-product-form" action={onAddProduct} className="inventory-form" aria-label="Add New Product">
      <h2>Add New Product</h2>
        <label htmlFor="product-name">Product Name:</label>
        <input
          type="text"
          id="product-name"
          name="name"
          placeholder="Enter product name"
          required
        />

        <label htmlFor="product-category">Category:</label>
        <input
          type="text"
          id="product-category"
          name="category"
          placeholder="Enter category"
          required
        />

        <label htmlFor="product-price">Price:</label>
        <input
          type="number"
          id="product-price"
          name="price"
          min={0}
          step={0.01}
          placeholder="Enter price 1, 5.50, 10.99 ..."
          required
        />

        <label htmlFor="product-stock">Stock Count:</label>
        <input
          type="number"
          id="product-stock"
          name="stock"
          min={0}
          step={1}
          placeholder="Enter stock count 0, 5, 10 ..."
          required
        />

        <button type="submit" >
          Add Product
        </button>
      </form>
    )
  }