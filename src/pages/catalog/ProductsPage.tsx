import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';

import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import Modal from '../../components/ui/Modal';
import type { Column, TableAction } from '../../types';
import shared from '../../components/ui/shared.module.css';
import ProductService from '../../services/productService';
import type { Product } from '../../types/product';

const ProductsPage: React.FC = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; item?: Product }>({ open: false });

  useEffect(() => {
    void loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setErrorMessage(null);

    try {
      const productsResponse = await ProductService.findAll();
      setProducts(productsResponse);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      setErrorMessage(getApiMessage(error, 'Nao foi possivel carregar os produtos.'));
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!deleteModal.item) {
      return;
    }

    try {
      await ProductService.delete(deleteModal.item.id);
      await loadData();
      setDeleteModal({ open: false });
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      setErrorMessage(getApiMessage(error, 'Nao foi possivel excluir o produto.'));
    }
  }

  const columns: Column<Product>[] = [
    {
      key: 'id',
      label: '#',
      render: (row) => (
        <Link to={`/catalog/products/${row.id}`} className={shared.tableLink}>
          {row.id}
        </Link>
      ),
    },
    {
      key: 'name',
      label: 'Produto',
      render: (row) => (
        <Link to={`/catalog/products/${row.id}`} className={shared.tableLink}>
          {row.name}
        </Link>
      ),
    },
    { key: 'categoryName', label: 'Categoria' },
    {
      key: 'price',
      label: 'Preco',
      render: (row) => <span className={shared.priceCell}>{row.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>,
    },
    {
      key: 'stockQuantity',
      label: 'Estoque',
      render: (row) => (
        <span className={`${shared.stockCell} ${row.stockQuantity === 0 ? shared.stockOut : row.stockQuantity < 10 ? shared.stockLow : ''}`}>
          {row.stockQuantity === 0 ? 'Sem estoque' : `${row.stockQuantity} un.`}
        </span>
      ),
    },
    { key: 'active', label: 'Status', render: (row) => <StatusBadge value={row.active ? 'Ativo' : 'Inativo'} /> },
  ];

  const actions: TableAction<Product>[] = [
    { label: 'Editar', icon: 'edit', onClick: (row) => navigate(`/catalog/products/${row.id}`) },
    { label: 'Excluir', icon: 'delete', onClick: (row) => setDeleteModal({ open: true, item: row }), variant: 'danger' },
  ];

  if (loading) {
    return <p className={shared.feedbackInfo}>Carregando produtos...</p>;
  }

  if (errorMessage) {
    return <div className={shared.feedbackError}>{errorMessage}</div>;
  }

  return (
    <>
      <DataTable
        title="Produtos"
        data={products}
        columns={columns}
        actions={actions}
        onNew={() => navigate('/catalog/products/new')}
        newLabel="Novo Produto"
        searchPlaceholder="Buscar produtos..."
      />

      <Modal open={deleteModal.open} title="Excluir Produto" onClose={() => setDeleteModal({ open: false })} size="sm">
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

export default ProductsPage;
