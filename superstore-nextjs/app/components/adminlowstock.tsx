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

export default function AdminLowStock({product}: Props) {
  const { id, name, stockCount } = product

  return (
    <tr>
      <td>{id}</td>
      <td>{name}</td>
      <td>{stockCount}</td>
    </tr>
  )
}