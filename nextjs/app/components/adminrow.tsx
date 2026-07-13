import { Product } from "../lib/product";
type Props = {
  product: Product
}

export default function AdminRow({product}:Props) {
  return(
    <tr>
      <td>{product.id}</td>
      <td>{product.name}</td>
      <td>{product.category}</td>
      <td>{product.price.toFixed(2)}</td>
      <td>{product.stockCount}</td>
    </tr>
  )
}