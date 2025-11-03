import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Services
import { getModelos, deleteModelo } from "../servicesModelo";

// Componentes customizados
import Button from "../../../components/Button/Button";
import SearchBar from "../../../components/SearchBar/SearchBar";
import Table from "../../../components/Table/Table";
import Loading from "../../../components/Loading/Loading";
import Pagination from "../../../components/Pagination/Pagination";
import Modal from "../../../components/Modal/Modal";
import ListagemPlacasModelo from "./ListagemPlacasModelo"; // novo componente modal

// Ícones
import {
  IoAddOutline,
  IoPencilOutline,
  IoTrashOutline,
  IoCubeOutline,
  IoListOutline,
} from "react-icons/io5";

const ListagemModelo = () => {
  const [modelos, setModelos] = useState([]);
  const [initialLoading, setInitialLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Modal para visualizar placas do modelo
  const [showPlacasModal, setShowPlacasModal] = useState(false);
  const [selectedModeloId, setSelectedModeloId] = useState(null);

  const navigate = useNavigate();

  /** 🔄 Carrega todos os modelos */
  const carregarModelos = useCallback(async () => {
    setInitialLoading(true);
    try {
      const data = await getModelos();
      setModelos(data);
    } catch (err) {
      console.error("Erro ao carregar modelos:", err);
      toast.error("Erro ao carregar modelos. Por favor, tente novamente.");
    } finally {
      setInitialLoading(false);
    }
  }, []);

  /** 🗑️ Exclui um modelo */
  const handleDelete = useCallback(
    async (id) => {
      if (!window.confirm("Deseja realmente excluir este modelo?")) return;

      setLoading(true);
      try {
        await deleteModelo(id);
        toast.success("Modelo excluído com sucesso!");
        await carregarModelos();
      } catch (err) {
        console.error("Erro ao excluir modelo:", err);
        toast.error("Erro ao excluir modelo. Por favor, tente novamente.");
      } finally {
        setLoading(false);
      }
    },
    [carregarModelos]
  );

  useEffect(() => {
    carregarModelos();
  }, [carregarModelos]);

  /** 🔍 Filtro de busca */
  const filteredModelos = useMemo(() => {
    if (!searchTerm.trim()) return modelos;
    return modelos.filter((modelo) =>
      Object.values(modelo).some((valor) =>
        String(valor).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [modelos, searchTerm]);

  /** 📄 Paginação */
  const paginatedModelos = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredModelos.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredModelos, currentPage, itemsPerPage]);

  /** 🧾 Colunas da tabela */
  const columns = useMemo(() => [{ label: "Nome", accessor: "nome" }], []);

  if (initialLoading) {
    return <Loading fullPage message="Carregando modelos..." />;
  }

  return (
    <div className="app-container">
      <h2>Gerenciamento de Modelos</h2>

      {/* 🔧 Barra de ações */}
      <div className="crud-actions">
        <SearchBar
          placeholder="Buscar por nome do modelo"
          onSearch={setSearchTerm}
          icon="none"
          clearable={false}
        />
        <Button
          variant="primary"
          startIcon={<IoAddOutline />}
          onClick={() => navigate("/modelo")}
          disabled={loading}
        >
          Novo Modelo
        </Button>
      </div>

      {loading && <Loading message="Processando..." />}

      {/* 📋 Estado vazio */}
      {filteredModelos.length === 0 ? (
        <div className="empty-state-container">
          <div className="empty-state">
            <IoCubeOutline className="empty-state-icon" size={48} />
            <p className="empty-state-message">Nenhum modelo disponível</p>
          </div>
        </div>
      ) : (
        <Table
          data={paginatedModelos}
          columns={columns}
          customActions={(item) => (
            <div style={{ display: "flex", gap: "0.25rem" }}>
              <Button
                variant="info"
                size="small"
                startIcon={<IoListOutline />}
                onClick={() => {
                  setSelectedModeloId(item.id_modelo);
                  setShowPlacasModal(true);
                }}
              >
                Ver Placas
              </Button>

              <Button
                variant="warning"
                size="small"
                startIcon={<IoPencilOutline />}
                onClick={() => navigate(`/modelo/editar/${item.id_modelo}`)}
                disabled={loading}
              >
                Editar
              </Button>

              <Button
                variant="danger"
                size="small"
                startIcon={<IoTrashOutline />}
                onClick={() => handleDelete(item.id_modelo)}
                disabled={loading}
              >
                Excluir
              </Button>
            </div>
          )}
        />
      )}

      {/* 📄 Paginação */}
      {filteredModelos.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredModelos.length / itemsPerPage)}
          totalItems={filteredModelos.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          showItemsInfo
          showItemsPerPage={false}
        />
      )}

      {/* 🧩 Modal com as placas do modelo */}
      <Modal
        title="Placas do Modelo"
        isOpen={showPlacasModal}
        onClose={() => {
          setShowPlacasModal(false);
          setSelectedModeloId(null);
        }}
        size="lg"
      >
        {selectedModeloId ? (
          <ListagemPlacasModelo idModelo={selectedModeloId} />
        ) : (
          <Loading message="Carregando informações do modelo..." />
        )}
      </Modal>
    </div>
  );
};

export default ListagemModelo;
