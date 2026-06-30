import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { isAxiosError } from 'axios';

import PaymentMethodService from '../../services/paymentMethodService';
import type { PaymentMethod, PaymentMethodPayload } from '../../types/paymentMethod';

import shared from '../../components/ui/shared.module.css';
import styles from '../shared/EntityFormPage.module.css';

type PaymentMethodFormState = PaymentMethod & {
  description: string;
};

const INITIAL_FORM: PaymentMethodFormState = {
  id: '',
  name: '',
  description: '',
  active: true,
};

const PaymentMethodFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { paymentMethodId } = useParams<{ paymentMethodId: string }>();
  const isNew = !paymentMethodId;

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodFormState>(INITIAL_FORM);

  useEffect(() => {
    if (!isNew) {
      void loadPaymentMethod();
    }
  }, [paymentMethodId, isNew]);

  async function loadPaymentMethod() {
    if (!paymentMethodId) {
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);

      const response = await PaymentMethodService.findById(paymentMethodId);
      setPaymentMethod(response);
    } catch (error) {
      console.error('Erro ao carregar forma de pagamento:', error);
      setErrorMessage(getApiMessage(error, 'Nao foi possivel carregar a forma de pagamento.'));
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setErrorMessage(null);

    if (!paymentMethod.name.trim() || !paymentMethod.description.trim()) {
      setErrorMessage('Preencha nome e descricao da forma de pagamento.');
      return;
    }

    setSubmitting(true);

    try {
      const payload: PaymentMethodPayload = {
        name: paymentMethod.name.trim(),
        description: paymentMethod.description.trim(),
      };

      if (isNew) {
        await PaymentMethodService.create(payload);
      } else {
        await PaymentMethodService.update(paymentMethod.id, payload);
      }

      navigate('/sales/payment-methods');
    } catch (error) {
      console.error('Erro ao salvar forma de pagamento:', error);
      setErrorMessage(getApiMessage(error, 'Nao foi possivel salvar a forma de pagamento.'));
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <p>Carregando forma de pagamento...</p>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.titleBlock}>
            <h1 className={styles.title}>{isNew ? 'Nova Forma de Pagamento' : 'Cadastro da Forma de Pagamento'}</h1>
            <p className={styles.description}>
              {isNew ? 'Preencha os dados para criar uma nova forma de pagamento.' : `Atualize os dados de ${paymentMethod.name || 'forma de pagamento'}.`}
            </p>
          </div>
          <button type="button" className={styles.backButton} onClick={() => navigate('/sales/payment-methods')}>
            <span className="material-symbols-rounded">arrow_back</span>
            Voltar
          </button>
        </div>

        <div className={styles.body}>
          <div className={shared.formGrid}>
            <div className={`${shared.formGroup} ${shared.span2}`}>
              <label>Nome</label>
              <input type="text" className={shared.input} value={paymentMethod.name} onChange={(event) => setPaymentMethod((current) => ({ ...current, name: event.target.value }))} placeholder="Ex: PIX" />
            </div>
            <div className={`${shared.formGroup} ${shared.span2}`}>
              <label>Descricao</label>
              <textarea className={shared.input} rows={3} value={paymentMethod.description} onChange={(event) => setPaymentMethod((current) => ({ ...current, description: event.target.value }))} placeholder="Descricao..." />
            </div>
            {!isNew && (
              <div className={shared.formGroup}>
                <label>Status</label>
                <select className={shared.input} value={paymentMethod.active ? 'Ativo' : 'Inativo'} disabled>
                  <option>Ativo</option>
                  <option>Inativo</option>
                </select>
              </div>
            )}
            {errorMessage && <div className={`${shared.feedbackError} ${shared.span2}`}>{errorMessage}</div>}
          </div>
        </div>

        <div className={styles.footer}>
          <button type="button" className={shared.btnGhost} onClick={() => navigate('/sales/payment-methods')}>Cancelar</button>
          <button type="button" className={shared.btnPrimary} onClick={() => void handleSave()} disabled={submitting}>
            <span className="material-symbols-rounded">save</span>
            {submitting ? 'Salvando...' : isNew ? 'Criar Forma' : 'Salvar'}
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

export default PaymentMethodFormPage;
