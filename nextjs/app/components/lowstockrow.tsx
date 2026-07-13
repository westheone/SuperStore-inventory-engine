import { Product } from "../lib/product";

type Props = {
  product: Product
}

export default function LowStockRow({product}:Props) {
  return(
    <tr>
      <td>{product.id}</td>
      <td>{product.name}</td>
      <td>{product.stockCount}</td>
    </tr>
  )
}