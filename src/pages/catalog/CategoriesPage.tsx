import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';

import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import Modal from '../../components/ui/Modal';
import type { Column, TableAction } from '../../types';
import shared from '../../components/ui/shared.module.css';
import CategoryService from '../../services/categoryService';
import ProductService from '../../services/productService';
import type { Category } from '../../types/category';
import type { Product } from '../../types/product';

type CategoryTableRecord = Category & {
  productCount: number;
};

const CategoriesPage: React.FC = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; item?: Category }>({ open: false });

  useEffect(() => {
    void loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setErrorMessage(null);

    try {
      const [categoriesResponse, productsResponse] = await Promise.all([
        CategoryService.findAll(),
        ProductService.findAll(),
      ]);

      setCategories(categoriesResponse);
      setProducts(productsResponse);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
      setErrorMessage(getApiMessage(error, 'Nao foi possivel carregar as categorias.'));
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!deleteModal.item) {
      return;
    }

    try {
      await CategoryService.delete(deleteModal.item.id);
      await loadData();
      setDeleteModal({ open: false });
    } catch (error) {
      console.error('Erro ao excluir categoria:', error);
      setErrorMessage(getApiMessage(error, 'Nao foi possivel excluir a categoria.'));
    }
  }

  const categoryRows: CategoryTableRecord[] = categories.map((category) => ({
    ...category,
    productCount: products.filter((product) => product.categoryId === category.id).length,
  }));

  const columns: Column<CategoryTableRecord>[] = [
    {
      key: 'id',
      label: '#',
      render: (row) => (
        <Link to={`/catalog/categories/${row.id}`} className={shared.tableLink}>
          {row.id}
        </Link>
      ),
    },
    {
      key: 'name',
      label: 'Categoria',
      render: (row) => (
        <Link to={`/catalog/categories/${row.id}`} className={shared.tableLink}>
          {row.name}
        </Link>
      ),
    },
    { key: 'description', label: 'Descricao' },
    { key: 'productCount', label: 'Produtos', render: (row) => <span className={shared.badgeNum}>{row.productCount}</span> },
    { key: 'active', label: 'Status', render: (row) => <StatusBadge value={row.active ? 'Ativo' : 'Inativo'} /> },
  ];

  const actions: TableAction<CategoryTableRecord>[] = [
    { label: 'Editar', icon: 'edit', onClick: (row) => navigate(`/catalog/categories/${row.id}`) },
    { label: 'Excluir', icon: 'delete', onClick: (row) => setDeleteModal({ open: true, item: row }), variant: 'danger' },
  ];

  if (loading) {
    return <p className={shared.feedbackInfo}>Carregando categorias...</p>;
  }

  if (errorMessage) {
    return <div className={shared.feedbackError}>{errorMessage}</div>;
  }

  return (
    <>
      <DataTable
        title="Categorias"
        data={categoryRows}
        columns={columns}
        actions={actions}
        onNew={() => navigate('/catalog/categories/new')}
        newLabel="Nova Categoria"
        searchPlaceholder="Buscar categorias..."
      />

      <Modal open={deleteModal.open} title="Excluir Categoria" onClose={() => setDeleteModal({ open: false })} size="sm">
        <div className={shared.confirmDelete}>
          <span className={`material-symbols-rounded ${shared.confirmIcon}`}>warning</span>
          <p>Excluir <strong>{deleteModal.item?.name}</strong>?</p>
          <div className={shared.confirmActions}>
            <button type="button" className={shared.btnGhost} onClick={() => setDeleteModal({ open: false })}>Cancelar</button>
            <button type="button" className={shared.btnDanger} onClick={() => void handleDelete()}>
              <span className="material-symbols-rounded">delete</span>
              Excluir
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

function getApiMessage(error: unknown, fallback: string) {
  if (isAxiosError(error) && typeof error.response?.data?.message === 'string') {
    return error.response.data.message;
  }

  return fallback;
}

export default CategoriesPage;
