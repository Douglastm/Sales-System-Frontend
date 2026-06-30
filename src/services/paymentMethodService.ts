import { api } from './api';
import type { PaymentMethod, PaymentMethodPayload } from '../types/paymentMethod';

class PaymentMethodService {
  async findAll(): Promise<PaymentMethod[]> {
    const response = await api.get<PaymentMethod[]>('/v1/payment-methods');
    return response.data;
  }

  async findById(id: string): Promise<PaymentMethod> {
    const response = await api.get<PaymentMethod>(`/v1/payment-methods/${id}`);
    return response.data;
  }

  async create(payload: PaymentMethodPayload): Promise<PaymentMethod> {
    const response = await api.post<PaymentMethod>('/v1/payment-methods', payload);
    return response.data;
  }

  async update(id: string, payload: PaymentMethodPayload): Promise<PaymentMethod> {
    const response = await api.put<PaymentMethod>(`/v1/payment-methods/${id}`, payload);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await api.delete(`/v1/payment-methods/${id}`);
  }
}

export default new PaymentMethodService();
