import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';

import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import Modal from '../../components/ui/Modal';

import UserService from '../../services/userService';
import type { User } from '../../types/user';

import type { Column, TableAction } from '../../types';
import shared from '../../components/ui/shared.module.css';

const UsersListPage: React.FC = () => {
  const navigate = useNavigate();

    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const [deleteModal, setDeleteModal] = useState<{
        open: boolean;
        item?: User;
    }>({
        open: false
    });

    useEffect(() => {
        loadUsers();
    }, []);

    async function loadUsers() {

        setLoading(true);
        setErrorMessage(null);

        try {

            const response = await UserService.findAll();

            setUsers(response);

        } catch (error) {

            console.error("Erro ao buscar usuários:", error);
            setErrorMessage(getApiMessage(error, "Nao foi possivel carregar os usuários."));

        } finally {

            setLoading(false);

        }

    }

    async function handleDelete() {

    if (!deleteModal.item) return;

    try {

        await UserService.delete(deleteModal.item.id);

        await loadUsers();

        setDeleteModal({ open: false });

    } catch (error) {

        console.error("Erro ao excluir usuário:", error);
        setErrorMessage(getApiMessage(error, "Nao foi possivel excluir o usuário."));

    }

}

    const columns: Column<User>[] = [

        {
            key: "id",
            label: "#",
            render: (row) => (
                <Link
                    to={`/users/${row.id}`}
                    className={shared.tableLink}
                >
                    {row.id}
                </Link>
            )
        },

        {
            key: "name",
            label: "Nome",
            render: (row) => (
                <Link
                    to={`/users/${row.id}`}
                    className={shared.tableLink}
                >
                    {row.name}
                </Link>
            )
        },

        {
            key: "email",
            label: "E-mail"
        },

        {
            key: "role",
            label: "Perfil"
        },

        {
            key: "active",
            label: "Status",
            render: (row) => (
                <StatusBadge
                    value={row.active ? "Ativo" : "Inativo"}
                />
            )
        }

    ];

    const actions: TableAction<User>[] = [

        {
            label: "Editar",
            icon: "edit",
            onClick: (row) => navigate(`/users/${row.id}`)
        },

        {
            label: "Excluir",
            icon: "delete",
            variant: "danger",
            onClick: (row) =>
                setDeleteModal({
                    open: true,
                    item: row
                })
        }

    ];

    if (loading) {
        return <p>Carregando usuários...</p>;
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
        title="Usuários"
        data={users}
        columns={columns}
        actions={actions}
        onNew={() => navigate('/users/new')}
        newLabel="Novo Usuário"
        searchPlaceholder="Buscar usuários..."
      />

      <Modal open={deleteModal.open} title="Excluir Usuário" onClose={() => setDeleteModal({ open: false })} size="sm">
        <div className={shared.confirmDelete}>
          <span className={`material-symbols-rounded ${shared.confirmIcon}`}>warning</span>
          <p>Tem certeza que deseja excluir <strong>{deleteModal.item?.name}</strong>? Esta ação não pode ser desfeita.</p>
          <div className={shared.confirmActions}>
            <button type="button" className={shared.btnGhost} onClick={() => setDeleteModal({ open: false })}>Cancelar</button>
            <button type="button" className={shared.btnDanger} onClick={handleDelete}>
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

export default UsersListPage;
