export default function Loading() {
  // loading skeleton component
  return (
     <div>
          <div className='cart-search-grid'>
            <section className='search-container' style={{gridArea: 'search-container'}} aria-label='Product Search'>
              <h1>Search Here</h1>
              <label htmlFor='search-bar'>Search: Name or Category</label>
              <input
                className='search-bar'
                id='search-bar'
                type="search"
                placeholder="Looking for a product..."
                aria-label='search bar'
                value={''}
                readOnly
              />
            </section>
    
            <section className='cart-details' style={{gridArea: 'cart-details'}} aria-label='Cart Summary'>
                <h1>Your Cart</h1>
                <h2>Total Items: ...Loading....</h2>
                <h2>Total Cost: $...Loading...</h2>
            </section>
          </div>
    
          <div aria-label='Product grid'>
            <h1>All Avaliable Products</h1>
            <section className='product-grid'>
              <h1>...Loading...</h1>
            </section>
          </div>
    
        </div>
  )
}