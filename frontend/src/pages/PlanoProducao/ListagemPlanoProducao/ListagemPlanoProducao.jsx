import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  IoAddOutline,
  IoPencilOutline,
  IoTrashOutline,
  IoRefreshOutline,
} from "react-icons/io5";

import Container from "../../../components/Container/Container";
import Button from "../../../components/Button/Button";
import SearchBar from "../../../components/SearchBar/SearchBar";
import Table from "../../../components/Table/Table";
import Loading from "../../../components/Loading/Loading";

import {
  getPlanosProducao,
  deletePlanoProducao,
} from "../servicesPlanoProducao";

import "./ListagemPlanoProducao.css";

const ListagemPlanoProducao = () => {
  const navigate = useNavigate();

  const [dados, setDados] = useState([]);
  const [filtrados, setFiltrados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const carregarDados = useCallback(async () => {
    setLoading(true);
    setErro(null);
    try {
      const data = await getPlanosProducao();
      setDados(data);
    } catch (err) {
      console.error("Erro ao carregar planos de produção:", err);
      setErro("Erro ao carregar planos de produção.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Deseja realmente excluir este plano de produção?")) {
      try {
        await deletePlanoProducao(id);
        toast.success("Plano de produção excluído com sucesso!");
        carregarDados();
      } catch (err) {
        console.error("Erro ao excluir plano de produção:", err);
        toast.error("Erro ao excluir o plano de produção.");
      }
    }
  };

  const formatarData = useCallback((valor) => {
    if (!valor) return "-";
    const data = new Date(valor);
    return isNaN(data.getTime()) ? valor : data.toLocaleDateString("pt-BR");
  }, []);

  const columns = useMemo(
    () => [
      { key: "nome", label: "Nome", accessor: "nome" },
      {
        key: "data",
        label: "Data",
        accessor: (row) => formatarData(row.data),
      },
      { key: "algoritmo", label: "Algoritmo", accessor: "algoritmo" },
      { key: "makespan", label: "Makespan", accessor: "makespan" },
    ],
    [formatarData]
  );

  const getActions = useCallback(
    (row) => [
      {
        icon: IoPencilOutline,
        label: "Editar",
        onClick: () => navigate(`/plano_producao/${row.id}`),
        variant: "primary",
      },
      {
        icon: IoTrashOutline,
        label: "Excluir",
        onClick: () => handleDelete(row.id),
        variant: "danger",
      },
    ],
    [navigate, handleDelete]
  );

  const calcularEstatisticas = useMemo(() => {
    if (!dados.length) return { total: 0, makespanMedio: 0 };

    const makespans = dados.map((p) => parseFloat(p.makespan) || 0);
    const soma = makespans.reduce((acc, v) => acc + v, 0);
    const media = makespans.length ? soma / makespans.length : 0;

    return {
      total: dados.length,
      makespanMedio: media.toFixed(2),
    };
  }, [dados]);

  if (loading) {
    return <Loading fullPage message="Carregando planos de produção..." />;
  }

  return (
    <Container maxWidth="xl" padding="large">
      <div className="lista-planos-content">
        <div className="planos-header">
          <h1>Planos de Produção</h1>
        </div>

        <div className="crud-actions">
          <SearchBar
            value={searchText}
            onChange={setSearchText}
            placeholder="Buscar por qualquer campo"
          />

          <div className="action-buttons">
            <Button
              variant="secondary"
              startIcon={IoRefreshOutline}
              onClick={carregarDados}
            >
              Recarregar
            </Button>

            <Button
              variant="primary"
              startIcon={IoAddOutline}
              onClick={() => navigate("/plano_producao")}
            >
              Novo Plano
            </Button>
          </div>
        </div>

        <div className="planos-stats">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{calcularEstatisticas.total}</div>
              <div className="stat-label">Total de Planos</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">
                {calcularEstatisticas.makespanMedio}
              </div>
              <div className="stat-label">Makespan Médio</div>
            </div>
          </div>
        </div>

        {erro && <div className="error-message">{erro}</div>}

        {filtrados.length > 0 && (
          <div className="table-container">
            <Table
              data={filtrados}
              columns={columns}
              actions={getActions}
              emptyMessage="Nenhum plano de produção encontrado."
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

export default ListagemPlanoProducao;
