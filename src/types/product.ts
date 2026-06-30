export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  categoryId: string;
  categoryName: string;
  active: boolean;
}

export interface ProductPayload {
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  categoryId: string;
}
