// src/services/errorHandler.js
import { toast } from "react-toastify";

export const handleApiError = (error) => {
  if (!error.response) {
    toast.error("Servidor indisponível. Verifique sua conexão.");
    console.error("🚫 [API] Erro sem resposta (provável desconexão):", error);
    return;
  }

  const { status, data, config } = error.response;

  console.error(`❌ [API] Erro ${status} em ${config.url}:`, data);

  switch (status) {
    case 400:
      toast.warn(data.message || "Requisição inválida (400).");
      break;
    case 404:
      toast.error("Recurso não encontrado (404).");
      break;
    case 500:
      toast.error("Erro interno no servidor (500).");
      break;
    case 422:
      toast.warn("Dados inválidos. Verifique os campos.");
      break;
    default:
      toast.error(data.message || "Ocorreu um erro inesperado.");
  }
};
