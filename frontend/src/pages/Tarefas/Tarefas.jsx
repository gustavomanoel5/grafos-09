import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Gantt, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";

import Container from "../../components/Container/Container";
import Loading from "../../components/Loading/Loading";
import { getTarefasByPlano } from "./servicesTarefas"; // ajuste o caminho

const Tarefas = () => {
  const { idPlano } = useParams();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState(ViewMode.Day);

  useEffect(() => {
    const carregarTarefas = async () => {
      console.log("🟢 Carregando tarefas do plano:", idPlano);
      try {
        const response = await getTarefasByPlano(idPlano);
        console.log("📦 Resposta da API:", response);

        const dados = response.data;
        if (!dados || dados.length === 0) {
          console.warn("⚠️ Nenhuma tarefa encontrada!");
          setTasks([]);
          return;
        }

        console.log("📋 Tarefas recebidas:", dados);

        // 🧱 Agrupar tarefas por impressora
        const projetos = [...new Set(dados.map((t) => t.id_impressora))].map(
          (idImp) => {
            const tarefasImp = dados.filter((t) => t.id_impressora === idImp);
            const start = new Date(
              Math.min(...tarefasImp.map((t) => new Date(t.hora_inicio)))
            );
            const end = new Date(
              Math.max(...tarefasImp.map((t) => new Date(t.hora_fim)))
            );

            console.log(`📊 Projeto impressora-${idImp}`, {
              start,
              end,
              tarefasImp,
            });

            return {
              id: `impressora-${idImp}`,
              name: `Impressora ${tarefasImp[0]?.impressora?.nome || idImp}`,
              start,
              end,
              progress: 100,
              type: "project",
            };
          }
        );

        // 🔹 Criar tarefas individuais
        const tarefasFormatadas = dados.map((tarefa) => {
          const start = new Date(tarefa.hora_inicio);
          const end = new Date(tarefa.hora_fim);

          console.log(`🧩 Tarefa ${tarefa.id_tarefa}`, { start, end });

          return {
            id: String(tarefa.id_tarefa),
            name: `Placa ${tarefa.placa?.id_placa} (${tarefa.impressora?.nome})`,
            start,
            end,
            progress: 100,
            type: "task",
            project: `impressora-${tarefa.id_impressora}`,
          };
        });

        const tasksFinal = [...projetos, ...tarefasFormatadas];
        console.log("✅ Tasks finais formatadas:", tasksFinal);

        // 🧠 Validação final
        if (tasksFinal.some((t) => isNaN(t.start) || isNaN(t.end))) {
          console.error("🚨 Erro: há datas inválidas no formato final!");
        }

        setTasks(tasksFinal);
      } catch (error) {
        console.error("❌ Erro ao carregar tarefas:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarTarefas();
  }, [idPlano]);

  if (loading) return <Loading />;

  return (
    <Container>
      <h2 className="text-2xl font-semibold mb-4">
        Plano de Produção #{idPlano} — Gráfico de Gantt
      </h2>

      {tasks.length > 0 ? (
        <>
          <div className="flex gap-2 mb-4">
            <button
              className="px-3 py-1 border rounded hover:bg-gray-100"
              onClick={() => setViewMode(ViewMode.Hour)}
            >
              Hora
            </button>
            <button
              className="px-3 py-1 border rounded hover:bg-gray-100"
              onClick={() => setViewMode(ViewMode.Day)}
            >
              Dia
            </button>
            <button
              className="px-3 py-1 border rounded hover:bg-gray-100"
              onClick={() => setViewMode(ViewMode.Week)}
            >
              Semana
            </button>
            <button
              className="px-3 py-1 border rounded hover:bg-gray-100"
              onClick={() => setViewMode(ViewMode.Month)}
            >
              Mês
            </button>
          </div>

          <div style={{ height: "80vh" }}>
            <Gantt
              tasks={tasks}
              viewMode={viewMode}
              listCellWidth="220px"
              columnWidth={viewMode === ViewMode.Month ? 200 : 60}
            />
          </div>
        </>
      ) : (
        <p>Nenhuma tarefa encontrada.</p>
      )}
    </Container>
  );
};

export default Tarefas;
