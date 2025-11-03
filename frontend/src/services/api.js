// src/services/api.js
import axios from "axios";
import { handleApiError } from "./errorHandler";

// 🔧 Configuração base da API
export const API_URL = "http://localhost:8080/api"; // ajuste para seu backend Laravel

const api = axios.create({
  baseURL: API_URL,
  timeout: 200000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// 📤 Interceptor de requisição
api.interceptors.request.use(
  (config) => {
    config.headers["X-Module"] = window.location.pathname;
    config.headers["X-User-Agent"] = navigator.userAgent;
    config.headers["X-Timestamp"] = new Date().toISOString();

    console.log(
      "📤 [API] Requisição:",
      config.method?.toUpperCase(),
      config.url
    );

    return config;
  },
  (error) => {
    console.error("❌ [API] Erro na requisição:", error);
    return Promise.reject(error);
  }
);

// 📥 Interceptor de resposta
api.interceptors.response.use(
  (response) => {
    console.log("📥 [API] Resposta:", response.config.url, response.status);
    return response;
  },
  (error) => {
    handleApiError(error);
    return Promise.reject(error);
  }
);

export default api;
