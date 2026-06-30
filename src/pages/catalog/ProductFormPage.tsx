import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { isAxiosError } from 'axios';

import ProductService from '../../services/productService';
import CategoryService from '../../services/categoryService';
import type { Product, ProductPayload } from '../../types/product';
import type { Category } from '../../types/category';

import shared from '../../components/ui/shared.module.css';
import styles from '../shared/EntityFormPage.module.css';

type ProductFormState = {
  id: string;
  name: string;
  description: string;
  price: string;
  stockQuantity: string;
  categoryId: string;
  active: boolean;
};

const INITIAL_FORM: ProductFormState = {
  id: '',
  name: '',
  description: '',
  price: '',
  stockQuantity: '',
  categoryId: '',
  active: true,
};

const ProductFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { productId } = useParams<{ productId: string }>();
  const isNew = !productId;

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [product, setProduct] = useState<ProductFormState>(INITIAL_FORM);

  useEffect(() => {
    void loadCategories();
  }, []);

  useEffect(() => {
    if (!isNew) {
      void loadProduct();
    } else {
      setProduct((current) => ({
        ...current,
        categoryId: current.categoryId || categories[0]?.id || '',
      }));
    }
  }, [productId, isNew, categories]);

  async function loadCategories() {
    try {
      const response = await CategoryService.findAll();
      setCategories(response);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
      setErrorMessage(getApiMessage(error, 'Nao foi possivel carregar as categorias.'));
    }
  }

  async function loadProduct() {
    if (!productId) {
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);

      const response = await ProductService.findById(productId);

      setProduct(mapProductToForm(response));
    } catch (error) {
      console.error('Erro ao carregar produto:', error);
      setErrorMessage(getApiMessage(error, 'Nao foi possivel carregar o produto.'));
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    const parsedPrice = Number(product.price);
    const parsedStockQuantity = Number(product.stockQuantity);

    setErrorMessage(null);

    if (!product.name.trim() || !product.description.trim() || !product.categoryId) {
      setErrorMessage('Preencha nome, descricao e categoria do produto.');
      return;
    }

    if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
      setErrorMessage('Informe um preco valido.');
      return;
    }

    if (!Number.isInteger(parsedStockQuantity) || parsedStockQuantity < 0) {
      setErrorMessage('Informe um estoque valido.');
      return;
    }

    setSubmitting(true);

    try {
      const payload: ProductPayload = {
        name: product.name.trim(),
        description: product.description.trim(),
        price: parsedPrice,
        stockQuantity: parsedStockQuantity,
        categoryId: product.categoryId,
      };

      if (isNew) {
        await ProductService.create(payload);
      } else {
        await ProductService.update(product.id, payload);
      }

      navigate('/catalog/products');
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      setErrorMessage(getApiMessage(error, 'Nao foi possivel salvar o produto.'));
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <p>Carregando produto...</p>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.titleBlock}>
            <h1 className={styles.title}>{isNew ? 'Novo Produto' : 'Cadastro do Produto'}</h1>
            <p className={styles.description}>
              {isNew ? 'Preencha os dados para criar um novo produto.' : `Atualize os dados de ${product.name || 'produto'}.`}
            </p>
          </div>
          <button type="button" className={styles.backButton} onClick={() => navigate('/catalog/products')}>
            <span className="material-symbols-rounded">arrow_back</span>
            Voltar
          </button>
        </div>

        <div className={styles.body}>
          <div className={shared.formGrid}>
            <div className={`${shared.formGroup} ${shared.span2}`}>
              <label>Nome do Produto</label>
              <input type="text" className={shared.input} value={product.name} onChange={(event) => setProduct((current) => ({ ...current, name: event.target.value }))} placeholder="Nome..." />
            </div>
            <div className={`${shared.formGroup} ${shared.span2}`}>
              <label>Descricao</label>
              <textarea className={shared.input} rows={3} value={product.description} onChange={(event) => setProduct((current) => ({ ...current, description: event.target.value }))} placeholder="Descricao..." />
            </div>
            <div className={shared.formGroup}>
              <label>Categoria</label>
              <select className={shared.input} value={product.categoryId} onChange={(event) => setProduct((current) => ({ ...current, categoryId: event.target.value }))}>
                <option value="">Selecione</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className={shared.formGroup}>
              <label>Preco (R$)</label>
              <input type="number" className={shared.input} value={product.price} onChange={(event) => setProduct((current) => ({ ...current, price: event.target.value }))} placeholder="0,00" step="0.01" min="0" />
            </div>
            <div className={shared.formGroup}>
              <label>Estoque</label>
              <input type="number" className={shared.input} value={product.stockQuantity} onChange={(event) => setProduct((current) => ({ ...current, stockQuantity: event.target.value }))} min="0" step="1" />
            </div>
            {!isNew && (
              <div className={shared.formGroup}>
                <label>Status</label>
                <select className={shared.input} value={product.active ? 'Ativo' : 'Inativo'} disabled>
                  <option>Ativo</option>
                  <option>Inativo</option>
                </select>
              </div>
            )}
            {errorMessage && <div className={`${shared.feedbackError} ${shared.span2}`}>{errorMessage}</div>}
          </div>
        </div>

        <div className={styles.footer}>
          <button type="button" className={shared.btnGhost} onClick={() => navigate('/catalog/products')}>Cancelar</button>
          <button type="button" className={shared.btnPrimary} onClick={() => void handleSave()} disabled={submitting}>
            <span className="material-symbols-rounded">save</span>
            {submitting ? 'Salvando...' : isNew ? 'Criar Produto' : 'Salvar'}
          </button>
        </div>
      </div>
    </div>
  );
};

function mapProductToForm(product: Product): ProductFormState {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: String(product.price),
    stockQuantity: String(product.stockQuantity),
    categoryId: product.categoryId,
    active: product.active,
  };
}

function getApiMessage(error: unknown, fallback: string) {
  if (isAxiosError(error) && typeof error.response?.data?.message === 'string') {
    return error.response.data.message;
  }

  return fallback;
}

export default ProductFormPage;
