export type ModuleKey =
  | 'dashboard'
  | 'users'
  | 'customers'
  | 'products'
  | 'categories'
  | 'sales'
  | 'payment-methods'
  | 'settings';

export interface NavItem {
  key: ModuleKey;
  label: string;
  icon: string;
  path: string;
  children?: NavItem[];
}

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

export interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
}

export interface TableAction<T> {
  label: string;
  icon: string;
  onClick: (row: T) => void;
  variant?: 'default' | 'danger';
}
