import React, { useState } from 'react';
import { isAxiosError } from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import styles from './LoginPage.module.css';

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = typeof location.state?.from?.pathname === 'string'
    ? location.state.from.pathname
    : '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await authService.login({ email, password });
      onLogin();
      navigate(redirectTo, { replace: true });
    } catch (err) {
      if (isAxiosError(err)) {
        const apiMessage = typeof err.response?.data?.message === 'string'
          ? err.response.data.message
          : null;

        setError(apiMessage ?? 'Nao foi possivel autenticar com a API.');
      } else {
        setError('Ocorreu um erro inesperado ao processar o login.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.eyebrow}>
            <span className="material-symbols-rounded">shield_lock</span>
            Sales System
          </div>
          <h1 className={styles.heroTitle}>Acesso restrito para usuarios autorizados.</h1>
          <p className={styles.heroText}>
            Entre com seu email e senha para acessar o painel. Esta tela e destinada apenas a autenticacao.
          </p>
        </div>
      </section>

      <section className={styles.panel}>
        <div className={styles.card}>
          <div className={styles.header}>
            <h2 className={styles.title}>Login</h2>
            <p className={styles.subtitle}>Use as credenciais para acessar a interface.</p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label htmlFor="email" className={styles.label}>Email</label>
              <div className={styles.inputWrap}>
                <span className={`material-symbols-rounded ${styles.icon}`}>mail</span>
                <input
                  id="email"
                  type="email"
                  className={styles.input}
                  placeholder="seu.email@email.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="password" className={styles.label}>Senha</label>
              <div className={styles.inputWrap}>
                <span className={`material-symbols-rounded ${styles.icon}`}>lock</span>
                <input
                  id="password"
                  type="password"
                  className={styles.input}
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            {error ? <p className={styles.error}>{error}</p> : null}

            <button type="submit" className={styles.submit} disabled={isSubmitting}>
              {isSubmitting ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default LoginPage;
