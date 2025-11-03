import { useEffect, useState, useMemo } from "react";
import {
  IoAddCircleOutline,
  IoCreateOutline,
  IoTrashOutline,
  IoRefreshOutline,
  IoCheckmarkCircleOutline,
  IoCubeOutline,
} from "react-icons/io5";
import { toast } from "react-toastify";

import Container from "../../../components/Container/Container";
import Table from "../../../components/Table/Table";
import Modal from "../../../components/Modal/Modal";
import Button from "../../../components/Button/Button";
import Input from "../../../components/Input/Input";
import Loading from "../../../components/Loading/Loading";
import SearchBar from "../../../components/SearchBar/SearchBar";
import {
  getFilamentos,
  createFilamento,
  updateFilamento,
  deleteFilamento,
} from "./servicesFilamento";
import "./Filamento.css";

const Filamento = () => {
  const [filamentos, setFilamentos] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [formValues, setFormValues] = useState({
    nome: "",
    tempo_troca: "",
    tipo_material: "",
    cor_hex: "#3B82F6",
  });
  const [formErrors, setFormErrors] = useState({});

  const [initialLoading, setInitialLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchFilamentos();
  }, []);

  useEffect(() => {
    const filteredData = filamentos.filter((item) =>
      item.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFiltered(filteredData);
    setCurrentPage(1);
  }, [filamentos, searchTerm]);

  const fetchFilamentos = async (showLoading = true) => {
    if (showLoading) setInitialLoading(true);
    else setRefreshing(true);

    try {
      const response = await getFilamentos();
      setFilamentos(response || []);
      if (!showLoading) toast.success("Lista atualizada!");
    } catch (err) {
      toast.error("Erro ao buscar filamentos");
      console.error("Erro ao buscar filamentos:", err);
    } finally {
      setInitialLoading(false);
      setRefreshing(false);
    }
  };

  const openModal = (data = null) => {
    setEditData(data);
    setFormValues(
      data || {
        nome: "",
        tempo_troca: "",
        tipo_material: "",
        cor_hex: "#3B82F6",
      }
    );
    setFormErrors({});
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditData(null);
    setFormValues({
      nome: "",
      tempo_troca: "",
      tipo_material: "",
      cor_hex: "#3B82F6",
    });
    setFormErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!formValues.nome.trim()) {
      toast.error("O nome é obrigatório");
      return;
    }

    setActionLoading(true);
    try {
      if (editData?.id_filamento) {
        await updateFilamento(editData.id, formValues);
        toast.success(`Filamento "${formValues.nome}" atualizado com sucesso!`);
      } else {
        await createFilamento(formValues);
        toast.success(`Filamento "${formValues.nome}" criado com sucesso!`);
      }
      await fetchFilamentos(false);
      closeModal();
    } catch (error) {
      toast.error(
        editData?.id_filamento ? "Erro ao atualizar" : "Erro ao criar"
      );
      console.error("Erro ao salvar filamento:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (filamento) => {
    const confirmed = window.confirm(
      `Deseja excluir o filamento "${filamento.nome}"?`
    );
    if (!confirmed) return;

    setActionLoading(true);
    try {
      await deleteFilamento(filamento.id_filamento);
      toast.success("Filamento excluído com sucesso!");
      await fetchFilamentos(false);
    } catch (err) {
      toast.error("Erro ao excluir filamento");
      console.error("Erro ao excluir filamento:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSearch = (value) => setSearchTerm(value);
  const handleRefresh = async () => await fetchFilamentos(false);

  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const columns = [
    { key: "nome", label: "Nome", accessor: "nome", sortable: true },
    {
      key: "tipo_material",
      label: "Tipo de Material",
      accessor: "tipo_material",
      sortable: true,
    },
    {
      key: "tempo_troca",
      label: "Tempo de Troca (min)",
      accessor: "tempo_troca",
      sortable: true,
    },
  ];

  const actions = [
    {
      key: "edit",
      label: "Editar",
      icon: IoCreateOutline,
      variant: "warning",
      onClick: (row) => openModal(row),
    },
    {
      key: "delete",
      label: "Excluir",
      icon: IoTrashOutline,
      variant: "danger",
      onClick: handleDelete,
    },
  ];

  const stats = useMemo(() => {
    return {
      total: filamentos.length,
      filtrados: filtered.length,
      materiais: new Set(filamentos.map((f) => f.tipo_material)).size,
    };
  }, [filamentos, filtered]);

  if (initialLoading) {
    return (
      <Container maxWidth="xl" padding="large">
        <Loading size="large" message="Carregando filamentos..." />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" padding="large" className="filamento-container">
      <div className="filamento-header">
        <div className="filamento-title">
          <IoCubeOutline size={32} />
          <div>
            <h1>Gerenciamento de Filamentos</h1>
            <p>Cadastre e gerencie os filamentos disponíveis</p>
          </div>
        </div>
        <div className="filamento-actions">
          <Button onClick={handleRefresh} variant="secondary">
            <IoRefreshOutline size={18} />
            {refreshing ? "Atualizando..." : "Atualizar"}
          </Button>
          <Button onClick={() => openModal()} variant="primary">
            <IoAddCircleOutline size={18} />
            Novo Filamento
          </Button>
        </div>
      </div>

      <div className="filamento-stats">
        <div className="stat-card">
          <span>Total</span>
          <strong>{stats.total}</strong>
        </div>
        <div className="stat-card">
          <span>Filtrados</span>
          <strong>{stats.filtrados}</strong>
        </div>
        <div className="stat-card">
          <span>Materiais únicos</span>
          <strong>{stats.materiais}</strong>
        </div>
      </div>

      <SearchBar
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Buscar por nome..."
      />

      <Table
        data={paginated}
        columns={columns}
        actions={actions}
        emptyStateMessage="Nenhum filamento encontrado"
        enableSorting={true}
      />

      {totalPages > 1 && (
        <div className="pagination">
          <Button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            variant="secondary"
            size="small"
          >
            Anterior
          </Button>
          <span>
            Página {currentPage} de {totalPages}
          </span>
          <Button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            variant="secondary"
            size="small"
          >
            Próximo
          </Button>
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editData ? "Editar Filamento" : "Novo Filamento"}
        size="medium"
      >
        <form onSubmit={handleSave} className="filamento-form">
          <Input
            label="Nome"
            name="nome"
            value={formValues.nome}
            onChange={handleChange}
            required
          />
          <Input
            label="Tempo de Troca (minutos)"
            name="tempo_troca"
            type="number"
            value={formValues.tempo_troca}
            onChange={handleChange}
            required
          />
          <Input
            label="Tipo de Material"
            name="tipo_material"
            value={formValues.tipo_material}
            onChange={handleChange}
            required
          />
          <div className="input-color">
            <label>Cor (Hex)</label>
            <input
              type="color"
              name="cor_hex"
              value={formValues.cor_hex}
              onChange={handleChange}
              style={{ width: "60px", height: "36px", cursor: "pointer" }}
            />
          </div>

          <div className="filamento-form-actions">
            <Button
              type="button"
              onClick={closeModal}
              variant="secondary"
              disabled={actionLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={actionLoading}
              disabled={actionLoading}
            >
              <IoCheckmarkCircleOutline size={18} />
              {editData ? "Atualizar" : "Criar"} Filamento
            </Button>
          </div>
        </form>
      </Modal>
    </Container>
  );
};

export default Filamento;
