export interface SaleItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Sale {
  id: string;
  customerId: string;
  customerName: string;
  sellerId: string;
  sellerName: string;
  paymentMethodId: string;
  paymentMethod: string;
  saleDate: string;
  totalAmount: number;
  status: string;
  items: SaleItem[];
}

export interface SalePayloadItem {
  productId: string;
  quantity: number;
}

export interface SalePayload {
  customerId: string;
  sellerId: string;
  paymentMethodId: string;
  items: SalePayloadItem[];
}
