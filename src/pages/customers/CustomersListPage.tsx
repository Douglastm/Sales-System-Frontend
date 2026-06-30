import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';

import DataTable from '../../components/ui/DataTable';
import Modal from '../../components/ui/Modal';

import type { Column, TableAction } from '../../types';

import shared from '../../components/ui/shared.module.css';

import CustomerService from '../../services/customerService';
import type { CustomerRequest } from '../../types/customerRequest';

const CustomersListPage: React.FC = () => {

    const navigate = useNavigate();

    const [customers, setCustomers] = useState<CustomerRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const [deleteModal, setDeleteModal] = useState<{
        open: boolean;
        item?: CustomerRequest;
    }>({
        open: false
    });

    useEffect(() => {
        loadCustomers();
    }, []);

    async function loadCustomers() {

        setLoading(true);
        setErrorMessage(null);

        try {

            const response = await CustomerService.findAll();

            setCustomers(response);

        } catch (error) {

            console.error("Erro ao buscar clientes:", error);
            setErrorMessage(getApiMessage(error, "Nao foi possivel carregar os clientes."));

        } finally {

            setLoading(false);

        }

    }

    async function handleDelete() {

        if (!deleteModal.item) return;

        try {

            await CustomerService.delete(deleteModal.item.id);

            await loadCustomers();

            setDeleteModal({ open: false });

        } catch (error) {

            console.error("Erro ao excluir cliente:", error);
            setErrorMessage(getApiMessage(error, "Nao foi possivel excluir o cliente."));

        }

    }

    const columns: Column<CustomerRequest>[] = [

        {
            key: 'id',
            label: '#',
            render: (row) => (
                <Link
                    to={`/customers/${row.id}`}
                    className={shared.tableLink}
                >
                    {row.id}
                </Link>
            ),
        },

        {
            key: 'name',
            label: 'Nome / Razão Social',
            render: (row) => (
                <Link
                    to={`/customers/${row.id}`}
                    className={shared.tableLink}
                >
                    {row.name}
                </Link>
            ),
        },

        {
            key: 'cpf',
            label: 'CPF'
        },

        {
            key: 'email',
            label: 'E-mail'
        },

        {
            key: 'phone',
            label: 'Telefone'
        },

        {
            key: 'address',
            label: 'Cidade',
            render: (row) => row.address.city
        },

    ];

    const actions: TableAction<CustomerRequest>[] = [

        {
            label: 'Editar',
            icon: 'edit',
            onClick: (row) => navigate(`/customers/${row.id}`)
        },

        {
            label: 'Excluir',
            icon: 'delete',
            variant: 'danger',
            onClick: (row) =>
                setDeleteModal({
                    open: true,
                    item: row
                })
        }

    ];

    if (loading) {
        return <p>Carregando clientes...</p>;
    }

    if (errorMessage) {
        return (
            <div>
                <p>{errorMessage}</p>
            </div>
        );
    }

    return (
        <>
            <DataTable
                title="Clientes"
                data={customers}
                columns={columns}
                actions={actions}
                onNew={() => navigate('/customers/new')}
                newLabel="Novo Cliente"
                searchPlaceholder="Buscar clientes..."
            />

            <Modal
                open={deleteModal.open}
                title="Excluir Cliente"
                onClose={() => setDeleteModal({ open: false })}
                size="sm"
            >
                <div className={shared.confirmDelete}>

                    <span className={`material-symbols-rounded ${shared.confirmIcon}`}>
                        warning
                    </span>

                    <p>

                        Excluir <strong>{deleteModal.item?.name}</strong>?

                        Esta ação não pode ser desfeita.

                    </p>

                    <div className={shared.confirmActions}>

                        <button
                            type="button"
                            className={shared.btnGhost}
                            onClick={() => setDeleteModal({ open: false })}
                        >
                            Cancelar
                        </button>

                        <button
                            type="button"
                            className={shared.btnDanger}
                            onClick={handleDelete}
                        >
                            <span className="material-symbols-rounded">
                                delete
                            </span>

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

export default CustomersListPage;
