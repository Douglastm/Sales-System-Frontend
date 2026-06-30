export interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  active: boolean;
}

export interface PaymentMethodPayload {
  name: string;
  description: string;
}
