import styles from './App.module.css';
import React, { useState } from 'react';
import { Navigate, Route, Routes, matchPath, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';
import HomePage from './pages/home/HomePage';
import UsersListPage from './pages/users/UsersListPage';
import UserFormPage from './pages/users/UserFormPage';
import CustomersListPage from './pages/customers/CustomersListPage';
import CustomerFormPage from './pages/customers/CustomerFormPage';
import ProductsPage from './pages/catalog/ProductsPage';
import CategoriesPage from './pages/catalog/CategoriesPage';
import ProductFormPage from './pages/catalog/ProductFormPage';
import CategoryFormPage from './pages/catalog/CategoryFormPage';
import SalesPage from './pages/sales/SalesPage';
import PaymentMethodsPage from './pages/sales/PaymentMethodsPage';
import SaleFormPage from './pages/sales/SaleFormPage';
import PaymentMethodFormPage from './pages/sales/PaymentMethodFormPage';
import SettingsPage from './pages/settings/SettingsPage';
import LoginPage from './pages/auth/LoginPage';
import authService from './services/authService';
import type { BreadcrumbItem } from './types';

const breadcrumbMatchers: Array<{
  path: string;
  items: BreadcrumbItem[];
}> = [
  { path: '/home', items: [{ label: 'Home' }] },
  { path: '/users', items: [{ label: 'Usuários' }] },
  { path: '/users/new', items: [{ label: 'Usuários', path: '/users' }, { label: 'Novo Usuário' }] },
  { path: '/users/:userId', items: [{ label: 'Usuários', path: '/users' }, { label: 'Editar Usuário' }] },
  { path: '/customers', items: [{ label: 'Clientes' }] },
  { path: '/customers/new', items: [{ label: 'Clientes', path: '/customers' }, { label: 'Novo Cliente' }] },
  { path: '/customers/:customerId', items: [{ label: 'Clientes', path: '/customers' }, { label: 'Cadastro do Cliente' }] },
  { path: '/catalog/products', items: [{ label: 'Catálogo' }, { label: 'Produtos' }] },
  { path: '/catalog/products/new', items: [{ label: 'Catálogo' }, { label: 'Produtos', path: '/catalog/products' }, { label: 'Novo Produto' }] },
  { path: '/catalog/products/:productId', items: [{ label: 'Catálogo' }, { label: 'Produtos', path: '/catalog/products' }, { label: 'Cadastro do Produto' }] },
  { path: '/catalog/categories', items: [{ label: 'Catálogo' }, { label: 'Categorias' }] },
  { path: '/catalog/categories/new', items: [{ label: 'Catálogo' }, { label: 'Categorias', path: '/catalog/categories' }, { label: 'Cadastro da Categoria' }] },
  { path: '/catalog/categories/:categoryId', items: [{ label: 'Catálogo' }, { label: 'Categorias', path: '/catalog/categories' }, { label: 'Cadastro da Categoria' }] },
  { path: '/sales/orders', items: [{ label: 'Vendas' }, { label: 'Vendas' }] },
  { path: '/sales/orders/new', items: [{ label: 'Vendas' }, { label: 'Vendas', path: '/sales/orders' }, { label: 'Nova Venda' }] },
  { path: '/sales/orders/:saleId', items: [{ label: 'Vendas' }, { label: 'Vendas', path: '/sales/orders' }, { label: 'Cadastro da Venda' }] },
  { path: '/sales/payment-methods', items: [{ label: 'Vendas' }, { label: 'Formas de Pagamento' }] },
  { path: '/sales/payment-methods/new', items: [{ label: 'Vendas' }, { label: 'Formas de Pagamento', path: '/sales/payment-methods' }, { label: 'Nova Forma de Pagamento' }] },
  { path: '/sales/payment-methods/:paymentMethodId', items: [{ label: 'Vendas' }, { label: 'Formas de Pagamento', path: '/sales/payment-methods' }, { label: 'Cadastro da Forma de Pagamento' }] },
  { path: '/settings', items: [{ label: 'Configurações' }] },
];

const App: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => authService.isAuthenticated());
  const currentPath = location.pathname;
  const isLoginRoute = currentPath === '/login';

  const handleNavigate = (path: string) => {
    navigate(path);
    setSidebarOpen(false);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setSidebarOpen(false);
    navigate('/login', { replace: true });
  };

  const breadcrumbs =
    breadcrumbMatchers.find((item) => matchPath({ path: item.path, end: true }, currentPath))?.items
    ?? [{ label: 'Home' }];

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="*" element={<Navigate to="/login" replace state={{ from: location }} />} />
      </Routes>
    );
  }

  if (isLoginRoute) {
    return <Navigate to="/home" replace />;
  }

  return (
    <div className={styles.shell}>
      <div
        className={`${styles.overlay} ${sidebarOpen ? styles.overlayVisible : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      <Sidebar
        currentPath={currentPath}
        onNavigate={handleNavigate}
        isOpen={sidebarOpen}
      />

      <div className={styles.mainArea}>
        <Topbar
          breadcrumbs={breadcrumbs}
          onNavigate={handleNavigate}
          onMenuToggle={() => setSidebarOpen(prev => !prev)}
          onLogout={handleLogout}
        />
        <main className={styles.pageContent}>
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/users" element={<UsersListPage />} />
            <Route path="/users/new" element={<UserFormPage />} />
            <Route path="/users/:userId" element={<UserFormPage />} />
            <Route path="/customers" element={<CustomersListPage />} />
            <Route path="/customers/new" element={<CustomerFormPage />} />
            <Route path="/customers/:customerId" element={<CustomerFormPage />} />
            <Route path="/catalog/products" element={<ProductsPage />} />
            <Route path="/catalog/products/new" element={<ProductFormPage />} />
            <Route path="/catalog/products/:productId" element={<ProductFormPage />} />
            <Route path="/catalog/categories" element={<CategoriesPage />} />
            <Route path="/catalog/categories/new" element={<CategoryFormPage />} />
            <Route path="/catalog/categories/:categoryId" element={<CategoryFormPage />} />
            <Route path="/sales/orders" element={<SalesPage />} />
            <Route path="/sales/orders/new" element={<SaleFormPage />} />
            <Route path="/sales/orders/:saleId" element={<SaleFormPage />} />
            <Route path="/sales/payment-methods" element={<PaymentMethodsPage />} />
            <Route path="/sales/payment-methods/new" element={<PaymentMethodFormPage />} />
            <Route path="/sales/payment-methods/:paymentMethodId" element={<PaymentMethodFormPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;
