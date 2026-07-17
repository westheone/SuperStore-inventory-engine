
type Prop = {
  onUpdate: (formdata:FormData) => void
}

export default function UpdateFrom({onUpdate}:Prop ) {

  return(
    <form id="update-product-form" action={onUpdate} className="inventory-form" aria-label="Update Product">
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