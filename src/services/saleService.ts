import { api } from './api';
import type { Sale, SalePayload } from '../types/sale';

class SaleService {
  async findAll(): Promise<Sale[]> {
    const response = await api.get<Sale[]>('/v1/sales');
    return response.data;
  }

  async findById(id: string): Promise<Sale> {
    const response = await api.get<Sale>(`/v1/sales/${id}`);
    return response.data;
  }

  async create(payload: SalePayload): Promise<Sale> {
    const response = await api.post<Sale>('/v1/sales', payload);
    return response.data;
  }

  async cancel(id: string): Promise<void> {
    await api.patch(`/v1/sales/${id}/cancel`);
  }
}

export default new SaleService();
