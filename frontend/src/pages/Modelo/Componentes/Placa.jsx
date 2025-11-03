import { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import {
  IoAddOutline,
  IoTrashOutline,
  IoCreateOutline,
  IoSaveOutline,
  IoSearchOutline,
  IoDocumentAttachOutline,
} from "react-icons/io5";

import Table from "../../../components/Table/Table";
import Button from "../../../components/Button/Button";
import Input from "../../../components/Input/Input";
import Modal from "../../../components/Modal/Modal";
import Dropdown from "../../../components/Dropdown/Dropdown";

import {
  getPlacas,
  createPlaca,
  updatePlaca,
  deletePlaca,
  getModelos,
  getFilamentos,
} from "../servicesModelo";

import "./Placa.css";

const Placa = ({ modeloId }) => {
  const [placas, setPlacas] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [filamentos, setFilamentos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingPlaca, setEditingPlaca] = useState(null);

  const [formData, setFormData] = useState({
    id_modelo: modeloId || "",
    id_filamento: "",
    status: "",
    tempo_estimado: "",
    arquivo: "",
  });

  // Atualiza o id_modelo quando o prop muda
  useEffect(() => {
    if (modeloId) {
      setFormData((prev) => ({ ...prev, id_modelo: modeloId }));
    }
  }, [modeloId]);

  // Carrega listas iniciais
  useEffect(() => {
    carregarPlacas();
    if (!modeloId) carregarModelos();
    carregarFilamentos();
  }, []);

  const carregarPlacas = async () => {
    setIsLoading(true);
    try {
      const lista = await getPlacas();
      const filtradas = modeloId
        ? lista.filter((p) => p.id_modelo === Number(modeloId))
        : lista;
      setPlacas(Array.isArray(filtradas) ? filtradas : []);
    } catch (err) {
      toast.error("Erro ao carregar placas");
    } finally {
      setIsLoading(false);
    }
  };

  const carregarModelos = async () => {
    try {
      const lista = await getModelos();
      setModelos(Array.isArray(lista) ? lista : []);
    } catch (err) {
      toast.error("Erro ao carregar modelos");
    }
  };

  const carregarFilamentos = async () => {
    try {
      const lista = await getFilamentos();
      setFilamentos(Array.isArray(lista) ? lista : []);
    } catch (err) {
      toast.error("Erro ao carregar filamentos");
    }
  };

  // === AÇÕES ===
  const handleAdd = async () => {
    if (filamentos.length === 0) await carregarFilamentos();

    setEditingPlaca(null);
    setFormData({
      id_modelo: modeloId || "",
      id_filamento: "",
      status: "",
      tempo_estimado: "",
      arquivo: "",
    });
    setShowModal(true);
  };

  const handleEdit = async (placa) => {
    if (filamentos.length === 0) await carregarFilamentos();

    setEditingPlaca(placa);
    setFormData({
      id_modelo: placa.id_modelo || modeloId || "",
      id_filamento: placa.id_filamento ? String(placa.id_filamento) : "",
      status: placa.status || "",
      tempo_estimado: placa.tempo_estimado || "",
      arquivo: placa.arquivo || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (placa) => {
    if (!window.confirm("Tem certeza que deseja excluir esta placa?")) return;

    try {
      await deletePlaca(placa.id_placa);
      toast.success("Placa excluída com sucesso!");
      carregarPlacas();
    } catch (err) {
      console.error("Erro ao excluir placa:", err);
      toast.error("Erro ao excluir placa");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, arquivo: file }));
    }
  };

  const validate = (data) => {
    if (!data.id_modelo) return "Selecione um modelo.";
    if (!data.id_filamento) return "Selecione um filamento.";
    if (!data.status.trim()) return "Informe o status da placa.";
    if (!data.tempo_estimado) return "Informe o tempo estimado.";
    if (!data.arquivo) return "Envie um arquivo da placa.";
    return null;
  };

  const handleSave = async () => {
    const dataToValidate = {
      ...formData,
      id_modelo: modeloId || formData.id_modelo,
      id_filamento: Number(formData.id_filamento),
    };

    const errorMsg = validate(dataToValidate);
    if (errorMsg) {
      toast.error(errorMsg);
      return;
    }

    setIsLoading(true);
    try {
      const payload = new FormData();
      payload.append("id_modelo", dataToValidate.id_modelo);
      payload.append("id_filamento", dataToValidate.id_filamento);
      payload.append("status", dataToValidate.status);
      payload.append("tempo_estimado", dataToValidate.tempo_estimado);
      payload.append("arquivo", dataToValidate.arquivo);

      if (editingPlaca) {
        await updatePlaca(editingPlaca.id_placa, payload);
        toast.success("Placa atualizada com sucesso!");
      } else {
        await createPlaca(payload);
        toast.success("Placa cadastrada com sucesso!");
      }

      setShowModal(false);
      carregarPlacas();
    } catch (err) {
      console.error("Erro ao salvar placa:", err);
      toast.error("Erro ao salvar placa");
    } finally {
      setIsLoading(false);
    }
  };

  // === TABELA ===
  const columns = useMemo(() => {
    const baseColumns = [
      {
        accessor: "id_filamento",
        label: "Filamento",
        render: (value, item) =>
          filamentos.find((f) => f.id_filamento === item.id_filamento)?.nome ||
          "-",
      },
      { accessor: "status", label: "Status" },
      { accessor: "tempo_estimado", label: "Tempo Estimado (h)" },
      {
        accessor: "arquivo",
        label: "Arquivo",
        render: (value) =>
          value ? (
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="arquivo-link"
            >
              <IoDocumentAttachOutline /> Ver arquivo
            </a>
          ) : (
            "-"
          ),
      },
    ];

    if (!modeloId) {
      baseColumns.unshift({
        accessor: "id_modelo",
        label: "Modelo",
        render: (value, item) =>
          modelos.find((m) => m.id_modelo === item.id_modelo)?.nome || "-",
      });
    }

    return baseColumns;
  }, [modelos, filamentos, modeloId]);

  return (
    <div className="placa-container">
      <div className="placa-header">
        <div>
          <h4>Gerenciamento de Placas</h4>
          <p>{placas.length} placas cadastradas</p>
        </div>
        <Button
          variant="primary"
          startIcon={<IoAddOutline />}
          onClick={handleAdd}
        >
          Nova Placa
        </Button>
      </div>

      <Table
        data={placas}
        columns={columns}
        actions={[
          {
            key: "edit",
            label: "Editar",
            icon: IoCreateOutline,
            variant: "warning",
            onClick: handleEdit,
          },
          {
            key: "delete",
            label: "Excluir",
            icon: IoTrashOutline,
            variant: "danger",
            onClick: handleDelete,
          },
        ]}
        loading={isLoading}
        enableSorting
        enableGlobalSearch
        searchPlaceholder="Buscar placas..."
        emptyStateMessage="Nenhuma placa cadastrada ainda"
        emptyStateIcon={<IoSearchOutline size={48} />}
      />

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingPlaca ? "Editar Placa" : "Nova Placa"}
        size="large"
        variant="form"
        showFooter={false}
      >
        <div className="placa-form">
          <div className="form-row">
            {/* ✅ Só mostra o dropdown de modelo se não vier via prop */}
            {!modeloId && (
              <Dropdown
                label="Modelo"
                options={modelos.map((m) => ({
                  value: String(m.id_modelo),
                  label: m.nome,
                }))}
                selectedOption={String(formData.id_modelo)}
                onSelect={(val) =>
                  setFormData({ ...formData, id_modelo: String(val) })
                }
                required
              />
            )}

            <Dropdown
              label="Filamento"
              options={filamentos.map((f) => ({
                value: String(f.id_filamento),
                label: f.nome,
              }))}
              selectedOption={String(formData.id_filamento)}
              onSelect={(val) =>
                setFormData({ ...formData, id_filamento: String(val) })
              }
              required
            />
          </div>

          <div className="form-row">
            <Input
              label="Status"
              name="status"
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              required
            />

            <Input
              label="Tempo Estimado (h)"
              name="tempo_estimado"
              type="number"
              min="0"
              step="0.1"
              value={formData.tempo_estimado}
              onChange={(e) =>
                setFormData({ ...formData, tempo_estimado: e.target.value })
              }
              required
            />
          </div>

          <div className="form-row">
            <div className="input-container">
              <label className="input-label required">Arquivo</label>

              {/* 🔹 Campo de texto manual */}
              <Input
                label="Nome ou URL do Arquivo"
                name="arquivo_texto"
                placeholder="Digite o nome ou URL do arquivo..."
                value={
                  typeof formData.arquivo === "string" ? formData.arquivo : ""
                }
                onChange={(e) =>
                  setFormData({ ...formData, arquivo: e.target.value })
                }
              />

              {/* 🔹 Ou upload de arquivo */}
              <div style={{ marginTop: "0.5rem" }}>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="file-input"
                />
                {formData.arquivo && typeof formData.arquivo !== "string" && (
                  <span className="file-name">
                    {formData.arquivo.name || formData.arquivo}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="modal-actions">
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
              loading={isLoading}
              startIcon={!isLoading && <IoSaveOutline />}
            >
              {isLoading
                ? "Salvando..."
                : editingPlaca
                ? "Atualizar"
                : "Salvar"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Placa;
