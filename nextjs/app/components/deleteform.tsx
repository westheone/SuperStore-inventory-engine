
type Prop = {
  onDelete: (formData: FormData) => void
}

export default function DeleteForm({onDelete}: Prop) {

  return(
    <form id="delete-product-form" action={onDelete} className="inventory-form" aria-label="Delete Product"> 
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