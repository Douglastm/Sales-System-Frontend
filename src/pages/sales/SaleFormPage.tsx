import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { isAxiosError } from 'axios';

import SaleService from '../../services/saleService';
import CustomerService from '../../services/customerService';
import UserService from '../../services/userService';
import ProductService from '../../services/productService';
import PaymentMethodService from '../../services/paymentMethodService';
import type { Sale, SalePayload } from '../../types/sale';
import type { CustomerRequest } from '../../types/customerRequest';
import type { User } from '../../types/user';
import type { Product } from '../../types/product';
import type { PaymentMethod } from '../../types/paymentMethod';

import shared from '../../components/ui/shared.module.css';
import styles from '../shared/EntityFormPage.module.css';

type SaleFormItem = {
  productId: string;
  quantity: string;
};

type SaleFormState = {
  id: string;
  customerId: string;
  sellerId: string;
  paymentMethodId: string;
  saleDate: string;
  status: string;
  items: SaleFormItem[];
};

const EMPTY_ITEM: SaleFormItem = {
  productId: '',
  quantity: '1',
};

const INITIAL_FORM: SaleFormState = {
  id: '',
  customerId: '',
  sellerId: '',
  paymentMethodId: '',
  saleDate: '',
  status: '',
  items: [{ ...EMPTY_ITEM }],
};

const SaleFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { saleId } = useParams<{ saleId: string }>();
  const isNew = !saleId;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [sale, setSale] = useState<SaleFormState>(INITIAL_FORM);
  const [customers, setCustomers] = useState<CustomerRequest[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

  useEffect(() => {
    void loadPage();
  }, [saleId]);

  async function loadPage() {
    setLoading(true);
    setErrorMessage(null);

    try {
      const [customersResponse, usersResponse, productsResponse, paymentMethodsResponse, saleResponse] = await Promise.all([
        CustomerService.findAll(),
        UserService.findAll(),
        ProductService.findAll(),
        PaymentMethodService.findAll(),
        saleId ? SaleService.findById(saleId) : Promise.resolve(null),
      ]);

      setCustomers(customersResponse);
      setUsers(usersResponse);
      setProducts(productsResponse);
      setPaymentMethods(paymentMethodsResponse);

      if (saleResponse) {
        setSale(mapSaleToForm(saleResponse));
      } else {
        setSale({
          ...INITIAL_FORM,
          customerId: customersResponse[0]?.id ?? '',
          sellerId: usersResponse[0]?.id ?? '',
          paymentMethodId: paymentMethodsResponse[0]?.id ?? '',
          items: [{ productId: productsResponse[0]?.id ?? '', quantity: '1' }],
        });
      }
    } catch (error) {
      console.error('Erro ao carregar venda:', error);
      setErrorMessage(getApiMessage(error, 'Nao foi possivel carregar a venda.'));
    } finally {
      setLoading(false);
    }
  }

  function updateFormField(field: keyof Omit<SaleFormState, 'items'>, value: string) {
    setSale((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function updateItem(index: number, field: keyof SaleFormItem, value: string) {
    setSale((current) => ({
      ...current,
      items: current.items.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item),
    }));
  }

  function addItem() {
    setSale((current) => ({
      ...current,
      items: [
        ...current.items,
        { productId: products[0]?.id ?? '', quantity: '1' },
      ],
    }));
  }

  function removeItem(index: number) {
    setSale((current) => ({
      ...current,
      items: current.items.length === 1
        ? [{ ...EMPTY_ITEM }]
        : current.items.filter((_, itemIndex) => itemIndex !== index),
    }));
  }

  const estimatedTotal = useMemo(() => (
    sale.items.reduce((sum, item) => {
      const product = products.find((entry) => entry.id === item.productId);
      const quantity = Number(item.quantity);

      if (!product || !Number.isFinite(quantity) || quantity <= 0) {
        return sum;
      }

      return sum + product.price * quantity;
    }, 0)
  ), [sale.items, products]);

  async function handleSave() {
    setErrorMessage(null);

    if (!sale.customerId || !sale.sellerId || !sale.paymentMethodId) {
      setErrorMessage('Selecione cliente, vendedor e forma de pagamento.');
      return;
    }

    const normalizedItems = sale.items.map((item) => ({
      productId: item.productId,
      quantity: Number(item.quantity),
    }));

    if (normalizedItems.length === 0 || normalizedItems.some((item) => !item.productId || !Number.isInteger(item.quantity) || item.quantity <= 0)) {
      setErrorMessage('Preencha os itens da venda com produto e quantidade valida.');
      return;
    }

    setSubmitting(true);

    try {
      const payload: SalePayload = {
        customerId: sale.customerId,
        sellerId: sale.sellerId,
        paymentMethodId: sale.paymentMethodId,
        items: normalizedItems,
      };

      await SaleService.create(payload);
      navigate('/sales/orders');
    } catch (error) {
      console.error('Erro ao registrar venda:', error);
      setErrorMessage(getApiMessage(error, 'Nao foi possivel registrar a venda.'));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCancelSale() {
    if (!sale.id) {
      return;
    }

    setSubmitting(true);

    try {
      await SaleService.cancel(sale.id);
      navigate('/sales/orders');
    } catch (error) {
      console.error('Erro ao cancelar venda:', error);
      setErrorMessage(getApiMessage(error, 'Nao foi possivel cancelar a venda.'));
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <p>Carregando venda...</p>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.titleBlock}>
            <h1 className={styles.title}>{isNew ? 'Nova Venda' : 'Cadastro da Venda'}</h1>
            <p className={styles.description}>
              {isNew ? 'Preencha os dados para registrar uma nova venda.' : `Consulte os dados da venda ${sale.id}.`}
            </p>
          </div>
          <button type="button" className={styles.backButton} onClick={() => navigate('/sales/orders')}>
            <span className="material-symbols-rounded">arrow_back</span>
            Voltar
          </button>
        </div>

        <div className={styles.body}>
          <div className={shared.formGrid}>
            <div className={`${shared.formGroup} ${shared.span2}`}>
              <label>Cliente</label>
              <select className={shared.input} value={sale.customerId} onChange={(event) => updateFormField('customerId', event.target.value)} disabled={!isNew}>
                <option value="">Selecione</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </div>
            <div className={shared.formGroup}>
              <label>Vendedor</label>
              <select className={shared.input} value={sale.sellerId} onChange={(event) => updateFormField('sellerId', event.target.value)} disabled={!isNew}>
                <option value="">Selecione</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
            <div className={shared.formGroup}>
              <label>Forma de Pagamento</label>
              <select className={shared.input} value={sale.paymentMethodId} onChange={(event) => updateFormField('paymentMethodId', event.target.value)} disabled={!isNew}>
                <option value="">Selecione</option>
                {paymentMethods.map((paymentMethod) => (
                  <option key={paymentMethod.id} value={paymentMethod.id}>
                    {paymentMethod.name}
                  </option>
                ))}
              </select>
            </div>
            {!isNew && (
              <>
                <div className={shared.formGroup}>
                  <label>Data</label>
                  <input type="text" className={shared.input} value={formatDate(sale.saleDate)} disabled />
                </div>
                <div className={shared.formGroup}>
                  <label>Status</label>
                  <input type="text" className={shared.input} value={mapSaleStatus(sale.status)} disabled />
                </div>
              </>
            )}

            <p className={`${shared.sectionTitle} ${shared.span2}`}>Itens da venda</p>

            {sale.items.map((item, index) => (
              <div key={`${index}-${item.productId}`} className={shared.inlineFields}>
                <div className={shared.formGroup}>
                  <label>Produto</label>
                  <select className={shared.input} value={item.productId} onChange={(event) => updateItem(index, 'productId', event.target.value)} disabled={!isNew}>
                    <option value="">Selecione</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={shared.formGroup}>
                  <label>Quantidade</label>
                  <input type="number" className={shared.input} value={item.quantity} min="1" step="1" onChange={(event) => updateItem(index, 'quantity', event.target.value)} disabled={!isNew} />
                </div>
                {isNew && (
                  <button type="button" className={shared.iconButton} onClick={() => removeItem(index)} title="Remover item">
                    <span className="material-symbols-rounded">delete</span>
                  </button>
                )}
              </div>
            ))}

            {isNew && (
              <div className={`${shared.formActions} ${shared.span2}`}>
                <button type="button" className={shared.btnGhost} onClick={addItem}>
                  <span className="material-symbols-rounded">add</span>
                  Adicionar Item
                </button>
              </div>
            )}

            <div className={`${shared.formGroup} ${shared.span2}`}>
              <label>Total</label>
              <input type="text" className={shared.input} value={(isNew ? estimatedTotal : getSaleTotal(sale.items, products)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} disabled />
            </div>

            {errorMessage && <div className={`${shared.feedbackError} ${shared.span2}`}>{errorMessage}</div>}
          </div>
        </div>

        <div className={styles.footer}>
          <button type="button" className={shared.btnGhost} onClick={() => navigate('/sales/orders')}>Fechar</button>
          {!isNew && sale.status !== 'CANCELED' && (
            <button type="button" className={shared.btnDanger} onClick={() => void handleCancelSale()} disabled={submitting}>
              <span className="material-symbols-rounded">close</span>
              {submitting ? 'Cancelando...' : 'Cancelar Venda'}
            </button>
          )}
          {isNew && (
            <button type="button" className={shared.btnPrimary} onClick={() => void handleSave()} disabled={submitting}>
              <span className="material-symbols-rounded">save</span>
              {submitting ? 'Salvando...' : 'Registrar Venda'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

function mapSaleToForm(sale: Sale): SaleFormState {
  return {
    id: sale.id,
    customerId: sale.customerId,
    sellerId: sale.sellerId,
    paymentMethodId: sale.paymentMethodId,
    saleDate: sale.saleDate,
    status: sale.status,
    items: sale.items.map((item) => ({
      productId: item.productId,
      quantity: String(item.quantity),
    })),
  };
}

function getSaleTotal(items: SaleFormItem[], products: Product[]) {
  return items.reduce((sum, item) => {
    const product = products.find((entry) => entry.id === item.productId);
    const quantity = Number(item.quantity);

    if (!product || !Number.isFinite(quantity) || quantity <= 0) {
      return sum;
    }

    return sum + product.price * quantity;
  }, 0);
}

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

export default SaleFormPage;
