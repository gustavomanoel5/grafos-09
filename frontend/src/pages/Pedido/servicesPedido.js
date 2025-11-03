import api from "../../services/api";

export const getPedidos = async () => {
  const { data } = await api.get("/pedido");
  return data;
};

export const getPedido = async (id) => {
  const { data } = await api.get(`/pedido/${id}`);
  return data;
};

export const createPedido = async (payload) => {
  const { data } = await api.post("/pedido", payload);
  return data;
};

export const updatePedido = async (id, payload) => {
  const { data } = await api.put(`/pedido/${id}`, payload);
  return data;
};

export const deletePedido = async (id) => {
  await api.delete(`/pedido/${id}`);
};
