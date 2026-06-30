import { api } from "./api";
import type { User } from "../types/user";

class UserService {

    async findAll(): Promise<User[]> {
    
            const response = await api.get<User[]>("/v1/users");
    
            return response.data;
    
        }
    
        async findById(id: string): Promise<User> {
    
            const response = await api.get<User>(`/v1/users/${id}`);
    
            return response.data;
    
        }
    
        async create(customer: Partial<User>): Promise<User> {
    
            const response = await api.post<User>("/v1/users", customer);
    
            return response.data;
    
        }
    
        async update(id: string, customer: Partial<User>): Promise<User> {
    
            const response = await api.put<User>(`/v1/users/${id}`, customer);
    
            return response.data;
    
        }
    
        async delete(id: string): Promise<void> {
    
            await api.delete(`/v1/users/${id}`);
    
        }
    
    }
    
    export default new UserService();