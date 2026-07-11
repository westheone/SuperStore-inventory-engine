
import { Product } from '@prisma/client'

type Props = {
  product: Product,
  onAddToCart: (product: Product) => void
}

export default function ProductCard({product, onAddToCart}: Props){
  const stockStatus =
  product.stockCount === 0 ? "outofstock" :
  product.stockCount <= 3 ? "lowstock" :
  "instock";

  const stockLabel =
  stockStatus === "outofstock" ? "Out of Stock" :
  stockStatus === "lowstock" ? `Low Stock: ${product.stockCount}` :
  `In Stock: ${product.stockCount}`;  

  return (
    <article className="product-card">
      <span className="category-tag">{product.category}</span>
      <h3 className="product-title">{product.name}</h3>
      <p className="price-text">${product.price.toFixed(2)}</p>
      <p className={`${stockStatus}-text`}>{stockLabel}</p>
      <button
        className="button-look"
        disabled={product.stockCount === 0}
        onClick={() => onAddToCart(product)}
      >
        Add to Cart
      </button>
    </article>
  );

}