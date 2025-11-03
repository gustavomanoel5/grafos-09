import api from "../../services/api"; // ✅ seu axios configurado

export const getModeloById = async (id) => {
  try {
    const response = await api.get(`/modelo/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar Modelo:", error);
  }
};

export const createModelo = async (data) => {
  try {
    const response = await api.post("/modelo", data);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar Modelo:", error);
  }
};

export const updateModelo = async (id, data) => {
  try {
    const response = await api.put(`/modelo/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar Modelo:", error);
  }
};

export const getModelos = async () => {
  try {
    const response = await api.get("/modelo");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar Modelos:", error);
  }
};

export const getPlacas = async () => {
  try {
    const response = await api.get("/placa");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar Placas:", error);
  }
};

export const createPlaca = async (data) => {
  try {
    const response = await api.post("/placa", data);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar Placa:", error);
  }
};

export const updatePlaca = async (id, data) => {
  try {
    const response = await api.post(`/placa/${id}?_method=PUT`, data);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar Placa:", error);
  }
};

export const deletePlaca = async (id) => {
  try {
    const response = await api.delete(`/placa/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao deletar Placa:", error);
  }
};

export const getFilamentos = async () => {
  try {
    const response = await api.get("/filamento");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar Filamentos:", error);
  }
};

/* 🧩 Nova função: Buscar placas vinculadas a um modelo */
export const getPlacasByModelo = async (idModelo) => {
  try {
    const response = await api.get(`/modelo/${idModelo}/placas`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar placas do Modelo:", error);
  }
};
export const deleteModelo = async (idModelo) => {
  await api.delete(`/modelo/${idModelo}`);
};
