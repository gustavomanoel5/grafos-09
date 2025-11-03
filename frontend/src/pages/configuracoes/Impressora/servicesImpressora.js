import api from "../../../services/api";

export const getImpressoras = async () => {
  const response = await api.get("/impressora");
  return response.data;
};

export const createImpressora = async (data) => {
  const response = await api.post("/impressora", data);
  return response.data;
};

export const updateImpressora = async (id, data) => {
  const response = await api.put(`/impressora/${id}`, data);
  return response.data;
};

export const deleteImpressora = async (id) => {
  const response = await api.delete(`/impressora/${id}`);
  return response.data;
};

export const getFilamentos = async () => {
  const response = await api.get("/filamento");
  return response.data;
};
