import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { isAxiosError } from 'axios';

import CustomerService from '../../services/customerService';
import type { CustomerRequest } from '../../types/customerRequest';

import shared from '../../components/ui/shared.module.css';
import styles from '../shared/EntityFormPage.module.css';

const CustomerFormPage: React.FC = () => {

    const navigate = useNavigate();

    const { customerId } = useParams<{ customerId: string }>();

    const isNew = !customerId;

    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const [customer, setCustomer] = useState<CustomerRequest>({
        id: "",
        name: "",
        cpf: "",
        email: "",
        phone: "",
        address: {
            zipCode: "",
            street: "",
            number: "",
            complement: "",
            district: "",
            city: "",
            state: ""
        }
    });

    useEffect(() => {

        if (!isNew) {

            loadCustomer();

        }

    }, [customerId]);

    const loadCustomer = async () => {

        if (!customerId) return;

        try {

            setLoading(true);
            setErrorMessage(null);

            const response = await CustomerService.findById(customerId);

            setCustomer(response);

        } catch (error) {

            console.error("Erro ao carregar cliente:", error);
            setErrorMessage(getApiMessage(error, "Nao foi possivel carregar o cliente."));

        } finally {

            setLoading(false);

        }

    };

    const handleSave = async () => {
    setErrorMessage(null);

    if (!customer.name.trim() || !customer.cpf.trim() || !customer.email.trim()) {
      setErrorMessage("Preencha nome, CPF e e-mail.");
      return;
    }

    setSubmitting(true);

    try {

        if (isNew) {

            await CustomerService.create(customer);

        } else {

            await CustomerService.update(customer.id, customer);

        }

        navigate("/customers");

        } catch (error) {

            console.error("Erro completo:", error);
            setErrorMessage(getApiMessage(error, "Nao foi possivel salvar o cliente."));

        } finally {

            setSubmitting(false);

        }

    };

    if (loading) {

        return <p>Carregando...</p>;

    }

    return (

        <div className={styles.page}>

            <div className={styles.card}>

                <div className={styles.header}>

                    <div className={styles.titleBlock}>

                        <h1 className={styles.title}>
                            {isNew ? "Novo Cliente" : "Cadastro do Cliente"}
                        </h1>

                        <p className={styles.description}>
                            {
                                isNew
                                    ? "Preencha os dados para criar um novo cliente."
                                    : `Atualize os dados de ${customer.name || "cliente"}.`
                            }
                        </p>

                    </div>

                    <button
                        type="button"
                        className={styles.backButton}
                        onClick={() => navigate("/customers")}
                    >

                        <span className="material-symbols-rounded">
                            arrow_back
                        </span>

                        Voltar

                    </button>

                </div>

                <div className={styles.body}>

                    <div className={shared.formGrid}>

                        <div className={`${shared.formGroup} ${shared.span2}`}>

                            <label>Nome</label>

                            <input
                                type="text"
                                className={shared.input}
                                value={customer.name}
                                placeholder="Nome..."
                                onChange={(e) =>
                                    setCustomer({
                                        ...customer,
                                        name: e.target.value
                                    })
                                }
                            />

                        </div>

                        <div className={shared.formGroup}>

                            <label>CPF</label>

                            <input
                                type="text"
                                className={shared.input}
                                value={customer.cpf}
                                placeholder="000.000.000-00"
                                onChange={(e) =>
                                    setCustomer({
                                        ...customer,
                                        cpf: e.target.value
                                    })
                                }
                            />

                        </div>

                        <div className={shared.formGroup}>

                            <label>E-mail</label>

                            <input
                                type="email"
                                className={shared.input}
                                value={customer.email}
                                placeholder="email@cliente.com"
                                onChange={(e) =>
                                    setCustomer({
                                        ...customer,
                                        email: e.target.value
                                    })
                                }
                            />

                        </div>

                        <div className={shared.formGroup}>

                            <label>Telefone</label>

                            <input
                                type="text"
                                className={shared.input}
                                value={customer.phone}
                                placeholder="(00) 00000-0000"
                                onChange={(e) =>
                                    setCustomer({
                                        ...customer,
                                        phone: e.target.value
                                    })
                                }
                            />

                        </div>

                        <div className={shared.formGroup}>

                            <label>CEP</label>

                            <input
                                type="text"
                                className={shared.input}
                                value={customer.address.zipCode}
                                onChange={(e) =>
                                    setCustomer({
                                        ...customer,
                                        address: {
                                            ...customer.address,
                                            zipCode: e.target.value
                                        }
                                    })
                                }
                            />

                        </div>

                        <div className={`${shared.formGroup} ${shared.span2}`}>

                            <label>Rua</label>

                            <input
                                type="text"
                                className={shared.input}
                                value={customer.address.street}
                                onChange={(e) =>
                                    setCustomer({
                                        ...customer,
                                        address: {
                                            ...customer.address,
                                            street: e.target.value
                                        }
                                    })
                                }
                            />

                        </div>
                                                <div className={shared.formGroup}>

                            <label>Número</label>

                            <input
                                type="text"
                                className={shared.input}
                                value={customer.address.number}
                                onChange={(e) =>
                                    setCustomer({
                                        ...customer,
                                        address: {
                                            ...customer.address,
                                            number: e.target.value
                                        }
                                    })
                                }
                            />

                        </div>

                        <div className={shared.formGroup}>

                            <label>Complemento</label>

                            <input
                                type="text"
                                className={shared.input}
                                value={customer.address.complement}
                                onChange={(e) =>
                                    setCustomer({
                                        ...customer,
                                        address: {
                                            ...customer.address,
                                            complement: e.target.value
                                        }
                                    })
                                }
                            />

                        </div>

                        <div className={`${shared.formGroup} ${shared.span2}`}>

                            <label>Bairro</label>

                            <input
                                type="text"
                                className={shared.input}
                                value={customer.address.district}
                                onChange={(e) =>
                                    setCustomer({
                                        ...customer,
                                        address: {
                                            ...customer.address,
                                            district: e.target.value
                                        }
                                    })
                                }
                            />

                        </div>

                        <div className={shared.formGroup}>

                            <label>Cidade</label>

                            <input
                                type="text"
                                className={shared.input}
                                value={customer.address.city}
                                onChange={(e) =>
                                    setCustomer({
                                        ...customer,
                                        address: {
                                            ...customer.address,
                                            city: e.target.value
                                        }
                                    })
                                }
                            />

                        </div>

                        <div className={shared.formGroup}>

                            <label>Estado</label>

                            <input
                                type="text"
                                className={shared.input}
                                value={customer.address.state}
                                maxLength={2}
                                placeholder="UF"
                                onChange={(e) =>
                                    setCustomer({
                                        ...customer,
                                        address: {
                                            ...customer.address,
                                            state: e.target.value.toUpperCase()
                                        }
                                    })
                                }
                            />

                        </div>

                        {errorMessage && (
                            <div className={`${shared.feedbackError} ${shared.span2}`}>
                                {errorMessage}
                            </div>
                        )}

                    </div>

                </div>

                <div className={styles.footer}>

                    <button
                        type="button"
                        className={shared.btnGhost}
                        onClick={() => navigate("/customers")}
                    >

                        Cancelar

                    </button>

                    <button
                        type="button"
                        className={shared.btnPrimary}
                        onClick={handleSave}
                        disabled={submitting}
                    >
                        <span className="material-symbols-rounded">
                            save
                        </span>

                        {submitting ? "Salvando..." : isNew ? "Criar Cliente" : "Salvar"}
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

export default CustomerFormPage;
