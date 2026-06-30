import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { isAxiosError } from 'axios';

import CategoryService from '../../services/categoryService';
import type { CategoryPayload } from '../../types/category';

import shared from '../../components/ui/shared.module.css';
import styles from '../shared/EntityFormPage.module.css';

type CategoryFormState = {
  id: string;
  name: string;
  description: string;
  active: boolean;
};

const INITIAL_FORM: CategoryFormState = {
  id: '',
  name: '',
  description: '',
  active: true,
};

const CategoryFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { categoryId } = useParams<{ categoryId: string }>();
  const isNew = !categoryId;

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [category, setCategory] = useState<CategoryFormState>(INITIAL_FORM);

  useEffect(() => {
    if (!isNew) {
      void loadCategory();
    }
  }, [categoryId, isNew]);

  async function loadCategory() {
    if (!categoryId) {
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);

      const response = await CategoryService.findById(categoryId);

      setCategory({
        id: response.id,
        name: response.name,
        description: response.description,
        active: response.active,
      });
    } catch (error) {
      console.error('Erro ao carregar categoria:', error);
      setErrorMessage(getApiMessage(error, 'Nao foi possivel carregar a categoria.'));
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setErrorMessage(null);

    if (!category.name.trim() || !category.description.trim()) {
      setErrorMessage('Preencha nome e descricao da categoria.');
      return;
    }

    setSubmitting(true);

    try {
      const payload: CategoryPayload = {
        name: category.name.trim(),
        description: category.description.trim(),
      };

      if (isNew) {
        await CategoryService.create(payload);
      } else {
        await CategoryService.update(category.id, payload);
      }

      navigate('/catalog/categories');
    } catch (error) {
      console.error('Erro ao salvar categoria:', error);
      setErrorMessage(getApiMessage(error, 'Nao foi possivel salvar a categoria.'));
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <p>Carregando categoria...</p>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.titleBlock}>
            <h1 className={styles.title}>{isNew ? 'Nova Categoria' : 'Cadastro da Categoria'}</h1>
            <p className={styles.description}>
              {isNew ? 'Preencha os dados para criar uma nova categoria.' : `Atualize os dados de ${category.name || 'categoria'}.`}
            </p>
          </div>
          <button type="button" className={styles.backButton} onClick={() => navigate('/catalog/categories')}>
            <span className="material-symbols-rounded">arrow_back</span>
            Voltar
          </button>
        </div>

        <div className={styles.body}>
          <div className={shared.formGrid}>
            <div className={`${shared.formGroup} ${shared.span2}`}>
              <label>Nome da Categoria</label>
              <input type="text" className={shared.input} value={category.name} onChange={(event) => setCategory((current) => ({ ...current, name: event.target.value }))} placeholder="Nome..." />
            </div>
            <div className={`${shared.formGroup} ${shared.span2}`}>
              <label>Descricao</label>
              <textarea className={shared.input} rows={3} value={category.description} onChange={(event) => setCategory((current) => ({ ...current, description: event.target.value }))} placeholder="Descricao..." />
            </div>
            {!isNew && (
              <div className={shared.formGroup}>
                <label>Status</label>
                <select className={shared.input} value={category.active ? 'Ativo' : 'Inativo'} disabled>
                  <option>Ativo</option>
                  <option>Inativo</option>
                </select>
              </div>
            )}
            {errorMessage && <div className={`${shared.feedbackError} ${shared.span2}`}>{errorMessage}</div>}
          </div>
        </div>

        <div className={styles.footer}>
          <button type="button" className={shared.btnGhost} onClick={() => navigate('/catalog/categories')}>Cancelar</button>
          <button type="button" className={shared.btnPrimary} onClick={() => void handleSave()} disabled={submitting}>
            <span className="material-symbols-rounded">save</span>
            {submitting ? 'Salvando...' : isNew ? 'Criar Categoria' : 'Salvar'}
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

export default CategoryFormPage;
