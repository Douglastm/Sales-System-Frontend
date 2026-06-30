export type SaleStatus = 'PENDING' | 'COMPLETED' | 'CANCELED';

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
  status: SaleStatus;
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

export function mapSaleStatus(status: string) {
  if (status === 'PENDING') {
    return 'Pendente';
  }

  if (status === 'COMPLETED') {
    return 'Concluída';
  }

  if (status === 'CANCELED') {
    return 'Cancelada';
  }

  return status;
}

export function canCancelSale(status: string) {
  return status === 'PENDING' || status === 'COMPLETED';
}
