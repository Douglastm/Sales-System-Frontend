import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';

import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import Modal from '../../components/ui/Modal';
import type { Column, TableAction } from '../../types';
import shared from '../../components/ui/shared.module.css';
import SaleService from '../../services/saleService';
import type { Sale } from '../../types/sale';

const SalesPage: React.FC = () => {
  const navigate = useNavigate();

  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [cancelModal, setCancelModal] = useState<{ open: boolean; item?: Sale }>({ open: false });

  useEffect(() => {
    void loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setErrorMessage(null);

    try {
      const salesResponse = await SaleService.findAll();
      setSales(salesResponse);
    } catch (error) {
      console.error('Erro ao carregar vendas:', error);
      setErrorMessage(getApiMessage(error, 'Nao foi possivel carregar as vendas.'));
    } finally {
      setLoading(false);
    }
  }

  async function handleCancelSale() {
    if (!cancelModal.item) {
      return;
    }

    try {
      await SaleService.cancel(cancelModal.item.id);
      await loadData();
      setCancelModal({ open: false });
    } catch (error) {
      console.error('Erro ao cancelar venda:', error);
      setErrorMessage(getApiMessage(error, 'Nao foi possivel cancelar a venda.'));
    }
  }

  const columns: Column<Sale>[] = [
    {
      key: 'id',
      label: 'Nº Venda',
      render: (row) => (
        <Link to={`/sales/orders/${row.id}`} className={shared.tableLink}>
          {row.id}
        </Link>
      ),
    },
    { key: 'saleDate', label: 'Data', render: (row) => formatDate(row.saleDate) },
    {
      key: 'customerName',
      label: 'Cliente',
      render: (row) => (
        <Link to={`/sales/orders/${row.id}`} className={shared.tableLink}>
          {row.customerName}
        </Link>
      ),
    },
    { key: 'sellerName', label: 'Vendedor' },
    { key: 'paymentMethod', label: 'Pagamento' },
    {
      key: 'totalAmount',
      label: 'Total',
      render: (row) => <strong className={shared.priceCell}>{row.totalAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>,
    },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge value={mapSaleStatus(row.status)} /> },
  ];

  const actions: TableAction<Sale>[] = [
    { label: 'Abrir', icon: 'open_in_new', onClick: (row) => navigate(`/sales/orders/${row.id}`) },
    {
      label: 'Cancelar',
      icon: 'close',
      variant: 'danger',
      onClick: (row) => setCancelModal({ open: true, item: row }),
    },
  ];

  if (loading) {
    return <p className={shared.feedbackInfo}>Carregando vendas...</p>;
  }

  if (errorMessage) {
    return <div className={shared.feedbackError}>{errorMessage}</div>;
  }

  return (
    <>
      <DataTable
        title="Vendas"
        data={sales}
        columns={columns}
        actions={actions}
        onNew={() => navigate('/sales/orders/new')}
        newLabel="Nova Venda"
        searchPlaceholder="Buscar vendas..."
      />

      <Modal open={cancelModal.open} title="Cancelar Venda" onClose={() => setCancelModal({ open: false })} size="sm">
        <div className={shared.confirmDelete}>
          <span className={`material-symbols-rounded ${shared.confirmIcon}`}>warning</span>
          <p>Cancelar a venda <strong>{cancelModal.item?.id}</strong>?</p>
          <div className={shared.confirmActions}>
            <button type="button" className={shared.btnGhost} onClick={() => setCancelModal({ open: false })}>Fechar</button>
            <button type="button" className={shared.btnDanger} onClick={() => void handleCancelSale()}>
              <span className="material-symbols-rounded">close</span>
              Cancelar Venda
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

function mapSaleStatus(status: string) {
  if (status === 'CONFIRMED') {
    return 'Confirmada';
  }

  if (status === 'CANCELED') {
    return 'Cancelada';
  }

  return status;
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString('pt-BR');
}

function getApiMessage(error: unknown, fallback: string) {
  if (isAxiosError(error) && typeof error.response?.data?.message === 'string') {
    return error.response.data.message;
  }

  return fallback;
}

export default SalesPage;
