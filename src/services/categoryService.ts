import { api } from './api';
import type { Category, CategoryPayload } from '../types/category';

class CategoryService {
  async findAll(): Promise<Category[]> {
    const response = await api.get<Category[]>('/v1/categories');
    return response.data;
  }

  async findById(id: string): Promise<Category> {
    const response = await api.get<Category>(`/v1/categories/${id}`);
    return response.data;
  }

  async create(payload: CategoryPayload): Promise<Category> {
    const response = await api.post<Category>('/v1/categories', payload);
    return response.data;
  }

  async update(id: string, payload: CategoryPayload): Promise<Category> {
    const response = await api.put<Category>(`/v1/categories/${id}`, payload);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await api.delete(`/v1/categories/${id}`);
  }
}

export default new CategoryService();
