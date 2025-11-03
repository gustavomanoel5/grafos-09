import api from "../../../services/api";

export const getFilamentos = async () => {
  try {
    const response = await api.get("/filamento");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar Filamentos:", error);
    return [];
  }
};

export const createFilamento = async (data) => {
  try {
    const response = await api.post("/filamento", data);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar Filamento:", error);
  }
};

export const updateFilamento = async (id, data) => {
  try {
    const response = await api.put(`/filamento/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar Filamento:", error);
  }
};

export const deleteFilamento = async (id) => {
  try {
    await api.delete(`/filamento/${id}`);
  } catch (error) {
    console.error("Erro ao excluir Filamento:", error);
  }
};
