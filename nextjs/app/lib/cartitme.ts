import { Product } from "./product";

export type CartItem = {
  cartId: number;
  quantity: number;
  productId: number;
  product: Pick<Product, "name" | "price"> 
}