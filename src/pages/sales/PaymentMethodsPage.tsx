import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';

import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import Modal from '../../components/ui/Modal';
import type { Column, TableAction } from '../../types';
import shared from '../../components/ui/shared.module.css';
import PaymentMethodService from '../../services/paymentMethodService';
import type { PaymentMethod } from '../../types/paymentMethod';

const PaymentMethodsPage: React.FC = () => {
  const navigate = useNavigate();

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; item?: PaymentMethod }>({ open: false });

  useEffect(() => {
    void loadPaymentMethods();
  }, []);

  async function loadPaymentMethods() {
    setLoading(true);
    setErrorMessage(null);

    try {
      const response = await PaymentMethodService.findAll();
      setPaymentMethods(response);
    } catch (error) {
      console.error('Erro ao carregar formas de pagamento:', error);
      setErrorMessage(getApiMessage(error, 'Nao foi possivel carregar as formas de pagamento.'));
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!deleteModal.item) {
      return;
    }

    try {
      await PaymentMethodService.delete(deleteModal.item.id);
      await loadPaymentMethods();
      setDeleteModal({ open: false });
    } catch (error) {
      console.error('Erro ao excluir forma de pagamento:', error);
      setErrorMessage(getApiMessage(error, 'Nao foi possivel excluir a forma de pagamento.'));
    }
  }

  const columns: Column<PaymentMethod>[] = [
    {
      key: 'id',
      label: '#',
      render: (row) => (
        <Link to={`/sales/payment-methods/${row.id}`} className={shared.tableLink}>
          {row.id}
        </Link>
      ),
    },
    {
      key: 'name',
      label: 'Forma de Pagamento',
      render: (row) => (
        <Link to={`/sales/payment-methods/${row.id}`} className={shared.tableLink}>
          {row.name}
        </Link>
      ),
    },
    { key: 'description', label: 'Descricao' },
    { key: 'active', label: 'Status', render: (row) => <StatusBadge value={row.active ? 'Ativo' : 'Inativo'} /> },
  ];

  const actions: TableAction<PaymentMethod>[] = [
    { label: 'Editar', icon: 'edit', onClick: (row) => navigate(`/sales/payment-methods/${row.id}`) },
    { label: 'Excluir', icon: 'delete', onClick: (row) => setDeleteModal({ open: true, item: row }), variant: 'danger' },
  ];

  if (loading) {
    return <p className={shared.feedbackInfo}>Carregando formas de pagamento...</p>;
  }

  if (errorMessage) {
    return <div className={shared.feedbackError}>{errorMessage}</div>;
  }

  return (
    <>
      <DataTable
        title="Formas de Pagamento"
        data={paymentMethods}
        columns={columns}
        actions={actions}
        onNew={() => navigate('/sales/payment-methods/new')}
        newLabel="Nova Forma"
        searchPlaceholder="Buscar..."
      />

      <Modal open={deleteModal.open} title="Excluir Forma de Pagamento" onClose={() => setDeleteModal({ open: false })} size="sm">
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

export default PaymentMethodsPage;
