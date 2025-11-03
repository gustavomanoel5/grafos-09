import api from "../../services/api";

export const getTarefasPorPlano = async (idPlanoProducao) => {
  try {
    const { data } = await api.get(`/tarefas/plano/${idPlanoProducao}`);
    return data;
  } catch (error) {
    console.error("Erro ao buscar tarefas:", error);
    throw error;
  }
};

export const getPlanosProducao = async () => {
  try {
    const { data } = await api.get("/plano-producao");
    return data;
  } catch (error) {
    console.error("Erro ao buscar planos de produção:", error);
    throw error;
  }
};
