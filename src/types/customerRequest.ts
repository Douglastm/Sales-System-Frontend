import type { Address } from "./address";

export interface CustomerRequest {

    id: string;
    name: string;
    cpf: string;
    email: string;
    phone: string;
    address: Address;

}