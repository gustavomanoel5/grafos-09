// src/services/axios.js
import api from "./api";

// Intercepta requisições (por exemplo, para incluir tokens)
api.interceptors.request.use(
  (config) => {
    // Exemplo: incluir token do localStorage
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepta respostas (por exemplo, para tratar erros 401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Não autorizado — talvez o token tenha expirado");
    }
    return Promise.reject(error);
  }
);

export default api;
