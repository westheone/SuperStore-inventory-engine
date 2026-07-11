import { CartItem } from "../lib/cartitme";

export default function ItemCard(item: CartItem, onDeleteItem: (item: CartItem) => void) {
  return(
    <article className="product-card">
      <h3 className='product-title'>{item.product.name}</h3>
      <div className='two-section-grid'>
        <p className='price-text'>${item.product.price.toFixed(2)}</p>
        <p className='price-text'>Qty: {item.quantity}</p>
      </div>
      <p className='price-text'>Subtotal: ${(item.quantity * item.product.price).toFixed(2)}</p>
      <button 
      className="button-look" 
      >- 1</button>
    </article>
  )
}