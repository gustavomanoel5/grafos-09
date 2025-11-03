import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { IoEyeOutline, IoRefreshOutline } from "react-icons/io5";

import Container from "../../../components/Container/Container";
import Button from "../../../components/Button/Button";
import SearchBar from "../../../components/SearchBar/SearchBar";
import Table from "../../../components/Table/Table";
import Loading from "../../../components/Loading/Loading";

import { getPlanosProducao } from "../servicesTarefas";

import "./ListagemTarefas.css";

const ListagemTarefas = () => {
  const navigate = useNavigate();

  const [dados, setDados] = useState([]);
  const [filtrados, setFiltrados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  /** Carrega planos de produção da API */
  const carregarDados = useCallback(async () => {
    setLoading(true);
    setErro(null);
    try {
      const data = await getPlanosProducao();
      setDados(data);
    } catch (err) {
      console.error("Erro ao carregar planos de produção:", err);
      toast.error("Erro ao carregar planos de produção.");
      setErro("Erro ao carregar planos de produção.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  /** Atualiza filtro de busca */
  useEffect(() => {
    const query = searchText.toLowerCase();
    const resultado = dados.filter((item) =>
      Object.values(item).some((valor) =>
        String(valor).toLowerCase().includes(query)
      )
    );
    setFiltrados(resultado);
    setPage(0);
  }, [dados, searchText]);

  /** Navegar para detalhes das tarefas */
  const handleVerTarefas = useCallback(
    (idPlano) => {
      navigate(`/tarefas/${idPlano}`);
    },
    [navigate]
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatarData = useCallback((valor) => {
    if (!valor) return "-";
    const data = new Date(valor);
    return isNaN(data.getTime())
      ? valor
      : data.toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
  }, []);

  const columns = useMemo(
    () => [
      { key: "id_plano_producao", label: "ID", accessor: "id_plano_producao" },
      {
        key: "nome",
        label: "Nome do Plano",
        accessor: (row) => row.nome || `Plano ${row.id_plano_producao}`,
      },
      {
        key: "data",
        label: "Data de Criação",
        accessor: (row) => formatarData(row.created_at),
      },
      {
        key: "status",
        label: "Status",
        accessor: (row) => row.status || "Pendente",
      },
    ],
    [formatarData]
  );

  const getActions = useCallback(
    (row) => [
      {
        icon: IoEyeOutline,
        label: "Ver Tarefas",
        onClick: () => handleVerTarefas(row.id_plano_producao),
        variant: "primary",
      },
    ],
    [handleVerTarefas]
  );

  if (loading) {
    return <Loading fullPage message="Carregando planos de produção..." />;
  }

  return (
    <Container maxWidth="xl" padding="large">
      <div className="lista-tarefas-content">
        <div className="tarefas-header">
          <h1>Planos de Produção</h1>
        </div>

        <div className="crud-actions">
          <SearchBar
            value={searchText}
            onChange={setSearchText}
            placeholder="Buscar por qualquer campo"
          />

          <Button
            variant="secondary"
            startIcon={IoRefreshOutline}
            onClick={carregarDados}
          >
            Recarregar
          </Button>
        </div>

        {erro && <div className="error-message">{erro}</div>}

        {filtrados.length > 0 && (
          <div className="table-container">
            <Table
              data={filtrados}
              columns={columns}
              actions={getActions}
              emptyMessage="Nenhum plano encontrado."
              searchable={false}
              pagination={{
                page,
                rowsPerPage,
                total: filtrados.length,
                onPageChange: handleChangePage,
                onRowsPerPageChange: handleChangeRowsPerPage,
              }}
            />
          </div>
        )}

        {!loading && filtrados.length === 0 && !erro && (
          <div className="empty-state">
            <p>Nenhum plano de produção encontrado</p>
          </div>
        )}
      </div>
    </Container>
  );
};

export default ListagemTarefas;
