import { api } from "./api";
import type { CustomerRequest } from "../types/customerRequest";

class CustomerService {

    async findAll(): Promise<CustomerRequest[]> {

        const response = await api.get<CustomerRequest[]>("/v1/customers");

        return response.data;

    }

    async findById(id: string): Promise<CustomerRequest> {

        const response = await api.get<CustomerRequest>(`/v1/customers/${id}`);

        return response.data;

    }

    async create(customer: Partial<CustomerRequest>): Promise<CustomerRequest> {

        const response = await api.post<CustomerRequest>("/v1/customers", customer);

        return response.data;

    }

    async update(id: string, customer: Partial<CustomerRequest>): Promise<CustomerRequest> {

        const response = await api.put<CustomerRequest>(`/v1/customers/${id}`, customer);

        return response.data;

    }

    async delete(id: string): Promise<void> {

        await api.delete(`/v1/customers/${id}`);

    }

}

export default new CustomerService();