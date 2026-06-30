import React, { useEffect, useState } from 'react';
import { isAxiosError } from 'axios';
import shared from '../../components/ui/shared.module.css';
import styles from './SettingsPage.module.css';
import authService from '../../services/authService';
import UserService from '../../services/userService';
import type { User } from '../../types/user';

const SettingsPage: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    void loadCurrentUser();
  }, []);

  async function loadCurrentUser() {
    setLoading(true);
    setErrorMessage(null);

    try {
      const currentUserId = authService.getCurrentUserId();

      if (currentUserId) {
        const user = await UserService.findById(currentUserId);
        setCurrentUser(user);
        return;
      }

      const currentUserEmail = authService.getCurrentUserEmail();

      if (!currentUserEmail) {
        setErrorMessage('Nao foi possivel identificar o usuario autenticado.');
        return;
      }

      const users = await UserService.findAll();
      const matchedUser = users.find((user) => user.email.toLowerCase() === currentUserEmail.toLowerCase());

      if (!matchedUser) {
        setErrorMessage('Usuario autenticado nao encontrado na API.');
        return;
      }

      setCurrentUser(matchedUser);
    } catch (error) {
      console.error('Erro ao carregar usuario autenticado:', error);
      setErrorMessage(getApiMessage(error, 'Nao foi possivel carregar os dados do usuario.'));
    } finally {
      setLoading(false);
    }
  }

  async function handleChangePassword() {
    setSuccessMessage(null);
    setErrorMessage(null);

    if (!currentUser) {
      setErrorMessage('Usuario autenticado nao encontrado.');
      return;
    }

    if (!currentPassword.trim() || !newPassword.trim()) {
      setErrorMessage('Preencha a senha atual e a nova senha.');
      return;
    }

    setSubmitting(true);

    try {
      await UserService.update(currentUser.id, {
        name: currentUser.name,
        email: currentUser.email,
        password: newPassword,
        role: currentUser.role,
      });

      setCurrentPassword('');
      setNewPassword('');
      setSuccessMessage('Senha alterada com sucesso.');
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      setErrorMessage(getApiMessage(error, 'Nao foi possivel alterar a senha.'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>
          <span className="material-symbols-rounded">lock</span>
          Seguranca
        </h3>
        <div className={shared.formGrid}>
          {loading && <p className={shared.feedbackInfo}>Carregando usuario autenticado...</p>}

          {!loading && currentUser && (
            <>
              <div className={`${shared.formGroup} ${shared.span2}`}>
                <label>Usuario</label>
                <input type="text" className={shared.input} value={`${currentUser.name} (${currentUser.email})`} readOnly />
              </div>
              <div className={shared.formGroup}>
                <label>Senha atual</label>
                <input
                  type="password"
                  className={shared.input}
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                />
              </div>
              <div className={shared.formGroup}>
                <label>Nova senha</label>
                <input
                  type="password"
                  className={shared.input}
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                />
              </div>
            </>
          )}

          {errorMessage && <div className={`${shared.feedbackError} ${shared.span2}`}>{errorMessage}</div>}
          {successMessage && <div className={`${shared.feedbackInfo} ${shared.span2}`}>{successMessage}</div>}

          <div className={`${shared.formGroup} ${shared.span2}`}>
            <div className={shared.formActions}>
              <button
                type="button"
                className={shared.btnPrimary}
                onClick={() => void handleChangePassword()}
                disabled={loading || submitting || !currentUser}
              >
                <span className="material-symbols-rounded">key</span>
                {submitting ? 'Salvando...' : 'Alterar Senha'}
              </button>
            </div>
          </div>
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

export default SettingsPage;
