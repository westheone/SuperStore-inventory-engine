import { CartItem } from "../lib/cartitme";

type Props = {
item: CartItem, 
onDeleteItem: (item: CartItem) => void
}

export default function ItemCard({item, onDeleteItem}: Props) {
  return(
    <article className="product-card">
      <h3 className='product-title'>{item.product.name}</h3>
      <div className='two-section-grid'>
        <p className='price-text'>${item.product.price.toFixed(2)}</p>
        <p className='price-text'>Qty: {item.quantity}</p>
      </div>
      <p className='price-text'>Subtotal: ${(item.quantity * item.product.price).toFixed(2)}</p>
      <button className="button-look" onChange={() => onDeleteItem(item)}>- 1</button>
    </article>
  )
}