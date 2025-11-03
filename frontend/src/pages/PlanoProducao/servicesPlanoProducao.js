import api from "../../services/api";

export const getPlanosProducao = async () => {
  const { data } = await api.get("/plano-producao");
  return data;
};

export const getPlanoProducao = async (id) => {
  const { data } = await api.get(`/plano-producao/${id}`);
  return data;
};

export const createPlanoProducao = async (payload) => {
  const { data } = await api.post("/plano-producao", payload);
  return data;
};

export const updatePlanoProducao = async (id, payload) => {
  const { data } = await api.put(`/plano-producao/${id}`, payload);
  return data;
};

export const deletePlanoProducao = async (id) => {
  const { data } = await api.delete(`/plano-producao/${id}`);
  return data;
};
