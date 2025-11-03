import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { IoAddOutline, IoPencilOutline, IoTrashOutline } from "react-icons/io5";

import Container from "../../../components/Container/Container";
import Button from "../../../components/Button/Button";
import SearchBar from "../../../components/SearchBar/SearchBar";
import Table from "../../../components/Table/Table";
import Loading from "../../../components/Loading/Loading";
import "./ListagemPedido.css";

import { getPedidos, deletePedido } from "../servicesPedido";

const ListagemPedido = () => {
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
      const data = await getPedidos();
      setDados(data);
    } catch (err) {
      console.error(err);
      setErro("Erro ao carregar pedidos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  // 🔍 Filtro de busca
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

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este pedido?")) {
      try {
        await deletePedido(id);
        toast.success("Pedido excluído com sucesso!");
        carregarDados();
      } catch (err) {
        console.error("Erro ao excluir pedido:", err);
        toast.error("Erro ao excluir o pedido.");
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
      { key: "cliente", label: "Cliente", accessor: "cliente" },
      {
        key: "data_pedido",
        label: "Data do Pedido",
        accessor: (row) => formatarData(row.data_pedido),
      },
      {
        key: "prioridade",
        label: "Prioridade",
        accessor: (row) =>
          row.prioridade ? (
            <span
              className={`prioridade-tag prioridade-${row.prioridade.toLowerCase()}`}
            >
              {row.prioridade}
            </span>
          ) : (
            "-"
          ),
      },
      {
        key: "prazo_entrega",
        label: "Prazo de Entrega",
        accessor: (row) => formatarData(row.prazo_entrega),
      },
    ],
    [formatarData]
  );

  const getActions = useCallback(
    (row) => [
      {
        icon: IoPencilOutline,
        label: "Editar",
        onClick: () => navigate(`/pedidos/${row.id}`),
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
    if (!dados.length) return { total: 0, prioridadeAlta: 0 };

    const prioridadeAlta = dados.filter(
      (p) => p.prioridade?.toLowerCase() === "alta"
    ).length;

    return {
      total: dados.length,
      prioridadeAlta,
    };
  }, [dados]);

  if (loading) {
    return <Loading fullPage message="Carregando pedidos..." />;
  }

  return (
    <Container maxWidth="xl" padding="large">
      <div className="lista-pedidos-content">
        <div className="pedidos-header">
          <h1>Listagem de Pedidos</h1>
        </div>

        <div className="crud-actions">
          <SearchBar
            value={searchText}
            onChange={setSearchText}
            placeholder="Buscar por cliente, prioridade ou data"
          />
          <Button
            variant="primary"
            startIcon={IoAddOutline}
            onClick={() => navigate("/pedido")}
          >
            Novo Pedido
          </Button>
        </div>

        <div className="pedidos-stats">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{calcularEstatisticas.total}</div>
              <div className="stat-label">Total de Pedidos</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">
                {calcularEstatisticas.prioridadeAlta}
              </div>
              <div className="stat-label">Pedidos de Alta Prioridade</div>
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
              emptyMessage="Nenhum pedido encontrado."
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
            <p>Nenhum pedido encontrado</p>
          </div>
        )}
      </div>
    </Container>
  );
};

export default ListagemPedido;
