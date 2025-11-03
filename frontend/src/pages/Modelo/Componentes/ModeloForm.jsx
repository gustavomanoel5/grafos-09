import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  IoSaveOutline,
  IoCheckmarkOutline,
  IoArrowBackOutline,
} from "react-icons/io5";

import Input from "../../../components/Input/Input";
import Button from "../../../components/Button/Button";
import Loading from "../../../components/Loading/Loading";

import { createModelo, getModeloById, updateModelo } from "../servicesModelo";

import "./ModeloForm.css";

const ModeloForm = ({ modeloId, onSave, savedData }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nome: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(!!modeloId);
  const [successMessage, setSuccessMessage] = useState("");
  const [isEditing, setIsEditing] = useState(true);

  // 🔹 Carrega os dados se estiver em modo edição
  useEffect(() => {
    const carregarModelo = async () => {
      if (modeloId) {
        setIsLoadingData(true);
        try {
          const modelo = await getModeloById(modeloId);
          setFormData({
            nome: modelo?.nome || "",
          });
          setIsEditing(true);
        } catch (err) {
          console.error("Erro ao carregar modelo:", err);
          toast.error("Erro ao carregar os dados do modelo.");
        } finally {
          setIsLoadingData(false);
        }
      } else if (savedData) {
        setFormData(savedData);
        setIsEditing(false);
        setIsLoadingData(false);
      }
    };

    carregarModelo();
  }, [modeloId, savedData]);

  // 🔹 Validação simples
  const validate = () => {
    const newErrors = {};
    if (!formData.nome.trim()) newErrors.nome = "O nome é obrigatório";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🔹 Atualiza campos do formulário
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // 🔹 Enviar formulário
  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    setSuccessMessage("");

    try {
      let savedModelo;

      if (modeloId) {
        savedModelo = await updateModelo(modeloId, formData);
      } else {
        savedModelo = await createModelo(formData);
      }

      const modeloIdSalvo =
        savedModelo?.id_modelo ||
        savedModelo?.id ||
        savedModelo?.data?.id_modelo;

      if (!modeloIdSalvo) {
        toast.error("⚠️ Não foi possível obter o ID do modelo!");
        setLoading(false);
        return;
      }

      const message = `Modelo "${savedModelo.nome}" ${
        modeloId ? "atualizado" : "cadastrado"
      } com sucesso!`;

      toast.success(message);
      setSuccessMessage(message);
      setIsEditing(false);

      if (onSave) onSave(modeloIdSalvo, savedModelo);
    } catch (error) {
      console.error("Erro ao salvar o modelo:", error);
      toast.error("Erro ao salvar o modelo. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Voltar para listagem
  const handleBackToList = () => {
    navigate("/listagem/modelo");
  };

  // 🔹 Descartar alterações
  const handleCancel = () => {
    if (savedData) {
      setFormData(savedData);
      setIsEditing(false);
      setErrors({});
    }
  };

  // 🔹 Entrar em modo de edição novamente
  const handleEditToggle = () => {
    setIsEditing(true);
    setSuccessMessage("");
  };

  if (isLoadingData) {
    return <Loading fullPage={false} message="Carregando dados do Modelo..." />;
  }

  return (
    <div className="modelo-form">
      <div className="form-row">
        <Input
          label="Nome do Modelo"
          name="nome"
          value={formData.nome}
          onChange={(e) => handleChange("nome", e.target.value)}
          error={errors.nome}
          required
          disabled={!isEditing}
        />
      </div>

      <div className="form-actions">
        {!isEditing && savedData ? (
          <div className="saved-state">
            <IoCheckmarkOutline className="success-icon" size={20} />
            <span>{successMessage || "Modelo salvo com sucesso!"}</span>
            <Button variant="secondary" size="small" onClick={handleEditToggle}>
              Editar
            </Button>
          </div>
        ) : (
          <div className="edit-actions">
            <Button
              variant="ghost"
              onClick={handleBackToList}
              disabled={loading}
              startIcon={<IoArrowBackOutline />}
            >
              Voltar
            </Button>

            {savedData && (
              <Button
                variant="secondary"
                onClick={handleCancel}
                disabled={loading}
              >
                Descartar
              </Button>
            )}

            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={loading}
              loading={loading}
              startIcon={!loading && <IoSaveOutline />}
            >
              {loading
                ? "Salvando..."
                : modeloId
                ? "Atualizar Modelo"
                : "Salvar Modelo"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModeloForm;
