type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  stockCount: number;
}

type Props = {
  product: Product;
}

export default function AdminTableRow({product}: Props) {
  const { id, name, category, price, stockCount } = product

  return (
    <tr>
      <td>{id}</td>
      <td>{name}</td>
      <td>{category}</td>
      <td>${price.toFixed(2)}</td>
      <td>{stockCount}</td>
    </tr>
  )
}