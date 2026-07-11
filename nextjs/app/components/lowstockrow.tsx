import { Product } from "../lib/product";

export default function LowStockRow(product: Product) {
  return(
    <tr>
      <td>{product.id}</td>
      <td>{product.name}</td>
      <td>{product.stockCount}</td>
    </tr>
  )
}