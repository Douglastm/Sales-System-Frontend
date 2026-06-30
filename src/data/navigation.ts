import type { NavItem } from '../types';

export const NAV_ITEMS: NavItem[] = [
  {
    key: 'users',
    label: 'Usuários',
    icon: 'manage_accounts',
    path: '/users',
  },
  {
    key: 'customers',
    label: 'Clientes',
    icon: 'groups',
    path: '/customers',
  },
  {
    key: 'products',
    label: 'Catálogo',
    icon: 'inventory_2',
    path: '/catalog',
    children: [
      {
        key: 'products',
        label: 'Produtos',
        icon: 'shopping_bag',
        path: '/catalog/products',
      },
      {
        key: 'categories',
        label: 'Categorias',
        icon: 'category',
        path: '/catalog/categories',
      },
    ],
  },
  {
    key: 'sales',
    label: 'Vendas',
    icon: 'point_of_sale',
    path: '/sales',
    children: [
      {
        key: 'sales',
        label: 'Vendas',
        icon: 'receipt_long',
        path: '/sales/orders',
      },
      {
        key: 'payment-methods',
        label: 'Formas de Pagamento',
        icon: 'payments',
        path: '/sales/payment-methods',
      },
    ],
  },
];
