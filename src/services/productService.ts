import { api } from './api';
import type { Product, ProductPayload } from '../types/product';

class ProductService {
  async findAll(): Promise<Product[]> {
    const response = await api.get<Product[]>('/v1/products');
    return response.data;
  }

  async findById(id: string): Promise<Product> {
    const response = await api.get<Product>(`/v1/products/${id}`);
    return response.data;
  }

  async create(payload: ProductPayload): Promise<Product> {
    const response = await api.post<Product>('/v1/products', payload);
    return response.data;
  }

  async update(id: string, payload: ProductPayload): Promise<Product> {
    const response = await api.put<Product>(`/v1/products/${id}`, payload);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await api.delete(`/v1/products/${id}`);
  }
}

export default new ProductService();
