import AddFrom from "../components/addform"
import DeleteForm from "../components/deleteform"
import UpdateFrom from "../components/updateform"


export default function Loading() {
return (
      <div className='admin-container'>
  
        <section className='admin-form-container' aria-label='Admin Forms'>
          <form><h2>Add New Product</h2><h2>...Loading...</h2></form>
          <form><h2>Update Product</h2><h2>...Loading...</h2></form>
          <form><h2>Delete Product</h2><h2>...Loading...</h2></form>
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
                <tr>
                <th>...Loading...</th>
                <th>...Loading...</th>
                <th>...Loading...</th>
              </tr>
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
              <tr>
                <th>...Loading...</th>
                <th>...Loading...</th>
                <th>...Loading...</th>
                <th>...Loading...</th>
                <th>...Loading...</th>
              </tr>
            </tbody>
          </table>
        </section>
  
      </div>
)
}