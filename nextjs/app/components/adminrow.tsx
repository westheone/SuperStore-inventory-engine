import { Product } from "../lib/product";

export default function AdminRow(product: Product) {
  return(
    <tr>
      <td>{product.id}</td>
      <td>{product.name}</td>
      <td>{product.category}</td>
      <td>{product.price}</td>
      <td>{product.stockCount}</td>
    </tr>
  )
}