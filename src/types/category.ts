export interface Category {
  id: string;
  name: string;
  description: string;
  active: boolean;
}

export interface CategoryPayload {
  name: string;
  description: string;
}
