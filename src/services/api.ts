import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "https://sales-system-production-77d2.up.railway.app/api";

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Adiciona o token automaticamente
api.interceptors.request.use(
    (config) => {

        const token = localStorage.getItem("access_token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Trata erros globais (401, 403...)
api.interceptors.response.use(
    (response) => response,
    (error) => {

        if (error.response?.status === 401) {

            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            localStorage.removeItem("auth_session");
            localStorage.removeItem("auth_user_email");
            localStorage.removeItem("auth_user_id");
            console.warn("Requisicao nao autorizada (401). Token removido do storage.");
        }

        return Promise.reject(error);
    }
);
