import React, { useEffect, useState } from "react";
import Container from "../../../components/Container/Container";
import Loading from "../../../components/Loading/Loading";
import Button from "../../../components/Button/Button";
import { IoCubeOutline } from "react-icons/io5";
import { getPlacasByModelo } from "../servicesModelo";

const ListagemPlacasModelo = ({ idModelo, onClose }) => {
  const [placas, setPlacas] = useState([]);
  const [loading, setLoading] = useState(false);

  console.log("🧩 Renderizando ListagemPlacasModelo para modelo:", idModelo);

  useEffect(() => {
    if (!idModelo) return;

    const carregarPlacas = async () => {
      console.log("🔍 Iniciando carregamento de placas do modelo:", idModelo);
      setLoading(true);
      try {
        const response = await getPlacasByModelo(idModelo);
        console.log("✅ Placas carregadas:", response);
        setPlacas(response || []);
      } catch (error) {
        console.error("❌ Erro ao carregar placas:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarPlacas();
  }, [idModelo]);

  if (loading) {
    return <Loading message="Carregando placas do modelo..." />;
  }

  if (!placas || placas.length === 0) {
    return (
      <div className="empty-state-container">
        <div className="empty-state">
          <IoCubeOutline className="empty-state-icon" size={48} />
          <p className="empty-state-message">
            Nenhuma placa vinculada a este modelo.
          </p>
        </div>
      </div>
    );
  }

  return (
    <Container>
      <div className="grid gap-4">
        {placas.map((placa) => (
          <div
            key={placa.id_placa}
            className="bg-white shadow-md rounded-xl p-4 border border-gray-200"
          >
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-lg font-semibold text-gray-800">
                Placa #{placa.id_placa}
              </h4>
              <span
                className={`text-sm px-2 py-1 rounded-full ${
                  placa.status === "concluída"
                    ? "bg-green-100 text-green-700"
                    : placa.status === "em_andamento"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {placa.status}
              </span>
            </div>

            {/* Dados principais */}
            <div className="text-sm text-gray-700 mb-2">
              <p>
                <b>Tempo estimado:</b> {placa.tempo_estimado} min
              </p>
              {placa.filamento && (
                <p>
                  <b>Filamento:</b> {placa.filamento.nome}
                </p>
              )}
              {placa.modelo && (
                <p>
                  <b>Modelo:</b> {placa.modelo.nome}
                </p>
              )}
              {placa.arquivo && (
                <p>
                  <b>Arquivo:</b>{" "}
                  <a
                    href={placa.arquivo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Ver arquivo
                  </a>
                </p>
              )}
            </div>

            {/* Status adicional ou detalhes */}
            <div className="mt-2 border-t border-gray-200 pt-2">
              <p className="text-xs text-gray-500 italic">
                Última atualização:{" "}
                {placa.updated_at
                  ? new Date(placa.updated_at).toLocaleString("pt-BR")
                  : "Desconhecida"}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Botão Fechar */}
      <div className="flex justify-end mt-4">
        <Button onClick={onClose}>Fechar</Button>
      </div>
    </Container>
  );
};

export default ListagemPlacasModelo;
