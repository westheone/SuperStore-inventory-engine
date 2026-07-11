type CartItem = {
  cartId: number;
  quantity: number;
  productId: number;
  product:{
    price: number;
    name: string;
    category: string;
  }
} 

type Props = {
  item: CartItem;
  onRemoveFromCart: (cartId: number, productId: number, quantity: number) => void;
  onDecrementQuantity: (cartId: number, productId: number) => void;
}

export default function CartItem({item, onRemoveFromCart, onDecrementQuantity}: Props) {

  return (
    <article className="product-card">
      <span className='category-tag'>{item.product.category}</span>
      <h3 className='product-title'>{item.product.name}</h3>
      <div className='two-section-grid'>
        <p className='price-text'>${item.product.price.toFixed(2)}</p>
        <p className='price-text'>Qty: {item.quantity}</p>
      </div>
      <p className='price-text'>Subtotal: ${(item.quantity * item.product.price).toFixed(2)}</p>
      <div className='two-section-grid'>
        <button className='button-look' onClick={() => onDecrementQuantity(item.cartId, item.productId)}>-1</button>
        <button className='button-look' onClick={() => onRemoveFromCart(item.cartId, item.productId, item.quantity)}>Remove All</button>
      </div>
    </article>
  )

}