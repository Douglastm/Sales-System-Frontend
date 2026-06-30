import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { isAxiosError } from 'axios';

import UserService from '../../services/userService';
import type { User } from '../../types/user';

import shared from '../../components/ui/shared.module.css';
import styles from '../shared/EntityFormPage.module.css';

const UserFormPage: React.FC = () => {
  const navigate = useNavigate();

  const { userId } = useParams<{ userId: string }>();

  const isNew = !userId;

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [user, setUser] = useState<User>({
      id: "",
      name: "",
      email: "",
      password: undefined,
      role: "USER",
      active: true
  });

  useEffect(() => {

      if (!isNew) {

          loadUser();

      }

  }, [userId]);

  const loadUser = async () => {

    if (!userId) return;

    try {

        setLoading(true);
        setErrorMessage(null);

        const response = await UserService.findById(userId);

        setUser({
          ...response,
          password: undefined,
        });

    } catch (error) {

        console.error("Erro ao carregar usuário:", error);
        setErrorMessage(getApiMessage(error, "Nao foi possivel carregar o usuário."));

    } finally {

        setLoading(false);

    }

  };

  const handleSave = async () => {
    setErrorMessage(null);

    if (!user.name.trim() || !user.email.trim() || !user.role.trim()) {
      setErrorMessage("Preencha nome, e-mail e perfil.");
      return;
    }

    if (isNew && !user.password?.trim()) {
      setErrorMessage("Informe a senha temporária.");
      return;
    }

    setSubmitting(true);

    try {

        if (isNew) {

            await UserService.create({
              name: user.name.trim(),
              email: user.email.trim(),
              password: user.password?.trim(),
              role: user.role,
            });

        } else {

            await UserService.update(user.id, {
              name: user.name.trim(),
              email: user.email.trim(),
              role: user.role,
              active: user.active,
              ...(user.password?.trim() ? { password: user.password.trim() } : {}),
            });

        }

        navigate("/users");

    } catch (error) {

        console.error(error);
        setErrorMessage(getApiMessage(error, "Nao foi possivel salvar o usuário."));

    } finally {

        setSubmitting(false);

    }

};

  if (loading) {

    return <p>Carregando usuário...</p>;

  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.titleBlock}>
            <h1 className={styles.title}>{isNew ? 'Novo Usuário' : 'Editar Usuário'}</h1>
            <p className={styles.description}>
              {isNew ? 'Cadastre um novo usuário em uma página dedicada.' : `Atualize os dados de ${user.name ?? 'usuário'}.`}
            </p>
          </div>
          <button type="button" className={styles.backButton} onClick={() => navigate('/users')}>
            <span className="material-symbols-rounded">arrow_back</span>
            Voltar
          </button>
        </div>

        <div className={styles.body}>
          <div className={shared.formGrid}>
            <div className={`${shared.formGroup} ${shared.span2}`}>
              <label>Nome completo</label>
              <input type="text" className={shared.input} value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} placeholder="Digite o nome..." />
            </div>
            <div className={`${shared.formGroup} ${shared.span2}`}>
              <label>E-mail</label>
              <input type="email" className={shared.input} value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} placeholder="email@empresa.com" />
            </div>
            <div className={shared.formGroup}>
              <label>Perfil</label>
              <select className={shared.input} value={user.role} onChange={(e) => setUser({ ...user, role: e.target.value })}>
                <option>ADMIN</option>
                <option>MANAGER</option>
                <option>SELLER</option>
              </select>
            </div>
            <div className={shared.formGroup}>
              <label>Status</label>
              <select className={shared.input} value={user.active ? "Ativo" : "Inativo"} onChange={(e) => setUser({ ...user, active: e.target.value === "Ativo" })}>
                <option>Ativo</option>
                <option>Inativo</option>
              </select>
            </div>
            {isNew && (
              <div className={`${shared.formGroup} ${shared.span2}`}>
                <label>Senha temporária</label>
                <input type="password" className={shared.input} value={user.password ?? ''} onChange={(e) => setUser({ ...user, password: e.target.value })}/>
              </div>
            )}
            {!isNew && (
              <div className={`${shared.formGroup} ${shared.span2}`}>
                <label>Nova senha</label>
                <input type="password" className={shared.input} value={user.password ?? ''} placeholder="Preencha apenas se quiser alterar" onChange={(e) => setUser({ ...user, password: e.target.value })}/>
              </div>
            )}
            {errorMessage && (
              <div className={`${shared.feedbackError} ${shared.span2}`}>{errorMessage}</div>
            )}
          </div>
        </div>

        <div className={styles.footer}>
          <button type="button" className={shared.btnGhost} onClick={() => navigate('/users')}>Cancelar</button>
          <button type="button" className={shared.btnPrimary} onClick={handleSave} disabled={submitting}>
            <span className="material-symbols-rounded">save</span>
            {submitting ? 'Salvando...' : isNew ? 'Criar Usuário' : 'Salvar'}
          </button>
        </div>
      </div>
    </div>
  );
};

function getApiMessage(error: unknown, fallback: string) {
  if (isAxiosError(error) && typeof error.response?.data?.message === 'string') {
    return error.response.data.message;
  }

  return fallback;
}

export default UserFormPage;
