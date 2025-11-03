import { useEffect, useState, useMemo } from "react";
import {
  IoAddCircleOutline,
  IoCreateOutline,
  IoTrashOutline,
  IoRefreshOutline,
  IoCheckmarkCircleOutline,
  IoPrintOutline,
} from "react-icons/io5";
import { toast } from "react-toastify";

import Dropdown from "../../../components/Dropdown/Dropdown";
import Container from "../../../components/Container/Container";
import Table from "../../../components/Table/Table";
import Modal from "../../../components/Modal/Modal";
import Button from "../../../components/Button/Button";
import Input from "../../../components/Input/Input";
import Loading from "../../../components/Loading/Loading";
import SearchBar from "../../../components/SearchBar/SearchBar";

import {
  getImpressoras,
  createImpressora,
  updateImpressora,
  deleteImpressora,
} from "./servicesImpressora";
import { getFilamentos } from "../Filamento/servicesFilamento"; // 🔹 importe o serviço

import "./Impressora.css";

const Impressora = () => {
  const [impressoras, setImpressoras] = useState([]);
  const [filamentos, setFilamentos] = useState([]); // 🔹 lista de filamentos
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [formValues, setFormValues] = useState({
    nome: "",
    status: "",
    velocidade: "",
    id_filamento: "", // 🔹 substitui cor_atual
    tempo_troca_filamento: "",
    modelo: "",
  });
  const [formErrors, setFormErrors] = useState({});

  const [initialLoading, setInitialLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchImpressoras();
    fetchFilamentos(); // 🔹 carrega os filamentos
  }, []);

  const fetchFilamentos = async () => {
    try {
      const response = await getFilamentos();
      setFilamentos(response || []);
    } catch (err) {
      toast.error("Erro ao buscar filamentos");
      console.error("Erro ao buscar filamentos:", err);
    }
  };

  const fetchImpressoras = async (showLoading = true) => {
    if (showLoading) setInitialLoading(true);
    else setRefreshing(true);

    try {
      const response = await getImpressoras();
      setImpressoras(response || []);
      if (!showLoading) toast.success("Lista atualizada!");
    } catch (err) {
      toast.error("Erro ao buscar impressoras");
      console.error("Erro ao buscar impressoras:", err);
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
        status: "",
        velocidade: "",
        id_filamento: "", // 🔹 inicia vazio
        tempo_troca_filamento: "",
        modelo: "",
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
      status: "",
      velocidade: "",
      id_filamento: "",
      tempo_troca_filamento: "",
      modelo: "",
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

    if (!formValues.id_filamento) {
      toast.error("Selecione um filamento");
      return;
    }

    setActionLoading(true);
    try {
      if (editData?.id_impressora) {
        await updateImpressora(editData.id_impressora, formValues);
        toast.success(
          `Impressora "${formValues.nome}" atualizada com sucesso!`
        );
      } else {
        await createImpressora(formValues);
        toast.success(`Impressora "${formValues.nome}" criada com sucesso!`);
      }
      await fetchImpressoras(false);
      closeModal();
    } catch (error) {
      toast.error(editData ? "Erro ao atualizar" : "Erro ao criar");
      console.error("Erro ao salvar impressora:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (impressora) => {
    const confirmed = window.confirm(
      `Deseja excluir a impressora "${impressora.nome}"?`
    );
    if (!confirmed) return;

    setActionLoading(true);
    try {
      await deleteImpressora(impressora.id_impressora);
      toast.success("Impressora excluída com sucesso!");
      await fetchImpressoras(false);
    } catch (err) {
      toast.error("Erro ao excluir impressora");
      console.error("Erro ao excluir impressora:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSearch = (value) => setSearchTerm(value);
  const handleRefresh = async () => await fetchImpressoras(false);

  const filteredData = impressoras.filter((item) =>
    item.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginated = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const columns = [
    { key: "nome", label: "Nome", accessor: "nome", sortable: true },
    { key: "status", label: "Status", accessor: "status", sortable: true },
    {
      key: "velocidade",
      label: "Velocidade (mm/s)",
      accessor: "velocidade",
      sortable: true,
    },
    {
      key: "modelo",
      label: "Modelo",
      accessor: "modelo",
      sortable: true,
    },
    {
      key: "filamento",
      label: "Filamento",
      accessor: (row) => row.filamento?.nome || "—", // 🔹 exibe o nome
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

  if (initialLoading) {
    return (
      <Container maxWidth="xl" padding="large">
        <Loading size="large" message="Carregando impressoras..." />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" padding="large" className="impressora-container">
      <div className="impressora-header">
        <div className="impressora-title">
          <IoPrintOutline size={32} />
          <div>
            <h1>Gerenciamento de Impressoras</h1>
            <p>Cadastre e gerencie as impressoras disponíveis</p>
          </div>
        </div>
        <div className="impressora-actions">
          <Button onClick={handleRefresh} variant="secondary">
            <IoRefreshOutline size={18} />
            {refreshing ? "Atualizando..." : "Atualizar"}
          </Button>
          <Button onClick={() => openModal()} variant="primary">
            <IoAddCircleOutline size={18} />
            Nova Impressora
          </Button>
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
        emptyStateMessage="Nenhuma impressora encontrada"
      />

      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editData ? "Editar Impressora" : "Nova Impressora"}
        size="medium"
      >
        <form onSubmit={handleSave} className="impressora-form">
          <Input
            label="Nome"
            name="nome"
            value={formValues.nome}
            onChange={handleChange}
            required
          />
          <Input
            label="Status"
            name="status"
            value={formValues.status}
            onChange={handleChange}
            required
          />
          <Input
            label="Velocidade (mm/s)"
            name="velocidade"
            type="number"
            value={formValues.velocidade}
            onChange={handleChange}
            required
          />
          <Input
            label="Modelo"
            name="modelo"
            value={formValues.modelo}
            onChange={handleChange}
            required
          />
          <Input
            label="Tempo de Troca de Filamento (min)"
            name="tempo_troca_filamento"
            type="number"
            value={formValues.tempo_troca_filamento}
            onChange={handleChange}
            required
          />

          <Dropdown
            label="Filamento"
            options={filamentos.map((f) => ({
              label: f.nome,
              value: f.id_filamento,
            }))}
            selectedOption={
              filamentos.find((f) => f.id_filamento === formValues.id_filamento)
                ? {
                    label: filamentos.find(
                      (f) => f.id_filamento === formValues.id_filamento
                    ).nome,
                    value: formValues.id_filamento,
                  }
                : null
            }
            onSelect={(option) => {
              // se o Dropdown retorna {label, value}
              if (option?.value) {
                setFormValues((prev) => ({
                  ...prev,
                  id_filamento: option.value,
                }));
              }
              // se o Dropdown retorna apenas o valor direto
              else {
                setFormValues((prev) => ({
                  ...prev,
                  id_filamento: option,
                }));
              }
            }}
            placeholder="Selecione um filamento"
            required
          />

          <div className="impressora-form-actions">
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
              {editData ? "Atualizar" : "Criar"} Impressora
            </Button>
          </div>
        </form>
      </Modal>
    </Container>
  );
};

export default Impressora;
