import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { IoChevronDownOutline } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";

import Container from "../../components/Container/Container";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import Loading from "../../components/Loading/Loading";

import {
  createPlanoProducao,
  updatePlanoProducao,
  getPlanoProducao,
} from "./servicesPlanoProducao";

import "./PlanoProducao.css";

const PlanoProducao = () => {
  const [plano, setPlano] = useState({
    nome: "",
    data: "",
    algoritmo: "0",
    makespan: 0,
  });

  const [collapsed, setCollapsed] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const { id } = useParams();

  const handleChange = (field, value) => {
    setPlano((prev) => ({ ...prev, [field]: value }));
  };

  const carregarPlanoExistente = async () => {
    if (id) {
      try {
        const existente = await getPlanoProducao(id);
        setPlano({
          nome: existente.nome || "",
          data: existente.data || "",
          algoritmo: existente.algoritmo || "0",
          makespan: existente.makespan || 0,
        });
      } catch (err) {
        console.error("Erro ao carregar plano de produção:", err);
        toast.error("Erro ao carregar o plano de produção.");
      }
    }
  };

  useEffect(() => {
    const carregar = async () => {
      setInitialLoading(true);
      try {
        await carregarPlanoExistente();
      } finally {
        setInitialLoading(false);
      }
    };
    carregar();
  }, [id]);

  const validate = () => {
    const newErrors = {};
    if (!plano.nome) newErrors.nome = "O nome é obrigatório.";
    if (!plano.data) newErrors.data = "A data é obrigatória.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      toast.error("Corrija os erros antes de salvar.");
      return;
    }

    setLoading(true);
    try {
      if (id) {
        await updatePlanoProducao(id, plano);
        toast.success("Plano de produção atualizado com sucesso!");
      } else {
        await createPlanoProducao(plano);
        toast.success("Plano de produção criado com sucesso!");
      }

      navigate("/listagem/plano_producao");
    } catch (error) {
      console.error("Erro ao salvar plano de produção:", error);
      toast.error("Erro ao salvar o plano de produção.");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <Loading fullPage message="Carregando dados do plano de produção..." />
    );
  }

  return (
    <Container maxWidth="xl" padding="large">
      {loading && <Loading fullPage message="Salvando plano de produção..." />}

      <div className="plano-card">
        <div className="card-header" onClick={() => setCollapsed(!collapsed)}>
          <h3>Dados do Plano de Produção</h3>
          <div className={`collapse-icon ${!collapsed ? "expanded" : ""}`}>
            <IoChevronDownOutline size={20} />
          </div>
        </div>

        {!collapsed && (
          <div className="form-content">
            {id && (
              <div className="plano-info">
                <h4>Editando Plano #{id}</h4>
                <p>Atualize os campos desejados e clique em salvar.</p>
              </div>
            )}

            <div className="form-grid">
              <Input
                label="Nome"
                value={plano.nome}
                onChange={(e) => handleChange("nome", e.target.value)}
                error={errors.nome}
                required
                placeholder="Digite o nome do plano de produção"
              />

              <Input
                type="date"
                label="Data"
                value={plano.data}
                onChange={(e) => handleChange("data", e.target.value)}
                error={errors.data}
                required
              />

              <Input
                label="Algoritmo"
                value={plano.algoritmo}
                disabled
                placeholder="0 (definido automaticamente)"
              />

              <Input
                label="Makespan"
                value={plano.makespan}
                disabled
                placeholder="0 (definido automaticamente)"
              />
            </div>

            <div className="form-actions">
              <Button
                variant="secondary"
                onClick={() => navigate("/listagem/plano_producao")}
                disabled={loading}
              >
                Cancelar
              </Button>

              <Button
                variant="primary"
                onClick={handleSave}
                disabled={loading}
                loading={loading}
              >
                {id ? "Atualizar Plano" : "Salvar Plano"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
};

export default PlanoProducao;
