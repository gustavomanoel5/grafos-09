import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Gantt } from "@svar-ui/react-gantt";

import Container from "../../components/Container/Container";
import Loading from "../../components/Loading/Loading";
import { getTarefasPorPlano } from "./servicesTarefas";

const Tarefas = () => {
  const { id } = useParams();
  const [tarefas, setTarefas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarTarefas = async () => {
      try {
        const data = await getTarefasPorPlano(id);
        setTarefas(data);
      } catch (error) {
        console.error("Erro ao buscar tarefas:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarTarefas();
  }, [id]);

  if (loading) return <Loading />;

  const ganttData = {
    tasks: tarefas.map((t) => ({
      id: t.id_tarefa,
      text: `Placa ${t.id_placa} - Impressora ${t.id_impressora}`,
      start_date: t.hora_inicio,
      end_date: t.hora_fim,
      resource: `Impressora ${t.id_impressora}`,
      progress: 1,
    })),
    links: [],
  };

  return (
    <Container>
      <h2 className="text-2xl font-semibold mb-4">
        Plano de Produção #{id} — Mapa de Gantt
      </h2>

      <div style={{ height: "500px" }}>
        <Gantt data={ganttData} />
      </div>
    </Container>
  );
};

export default Tarefas;
