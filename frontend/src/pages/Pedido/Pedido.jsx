import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { IoChevronDownOutline } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";

import Container from "../../components/Container/Container";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import Dropdown from "../../components/Dropdown/Dropdown";
import Loading from "../../components/Loading/Loading";

import { createPedido, updatePedido, getPedido } from "./servicesPedido"; // ✅ serviços específicos

import "./Pedido.css";

const Pedido = () => {
  const [pedido, setPedido] = useState({
    cliente: "",
    data_pedido: "",
    prioridade: "",
    prazo_entrega: "",
  });

  const [collapsed, setCollapsed] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const { id } = useParams();

  const handleChange = (field, value) => {
    setPedido((prev) => ({ ...prev, [field]: value }));
  };

  const carregarPedidoExistente = async () => {
    if (id) {
      try {
        const existente = await getPedido(id);
        setPedido({
          cliente: existente.cliente || "",
          data_pedido: existente.data_pedido || "",
          prioridade: existente.prioridade || "",
          prazo_entrega: existente.prazo_entrega || "",
        });
      } catch (err) {
        console.error("Erro ao carregar pedido:", err);
        toast.error("Erro ao carregar dados do pedido.");
      }
    }
  };

  useEffect(() => {
    const carregarDados = async () => {
      setInitialLoading(true);
      try {
        await carregarPedidoExistente();
      } finally {
        setInitialLoading(false);
      }
    };
    carregarDados();
  }, [id]);

  const validate = () => {
    const newErrors = {};

    if (!pedido.cliente) newErrors.cliente = "O nome do cliente é obrigatório.";
    if (!pedido.data_pedido)
      newErrors.data_pedido = "A data do pedido é obrigatória.";
    if (!pedido.prioridade)
      newErrors.prioridade = "A prioridade é obrigatória.";

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
        await updatePedido(id, pedido);
        toast.success("Pedido atualizado com sucesso!");
      } else {
        await createPedido(pedido);
        toast.success("Pedido criado com sucesso!");
      }

      navigate("/listagem/pedido");
    } catch (error) {
      console.error("Erro ao salvar pedido:", error);
      toast.error("Erro ao salvar o pedido.");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <Loading fullPage message="Carregando dados do pedido..." />;
  }

  return (
    <Container maxWidth="xl" padding="large">
      {loading && <Loading fullPage message="Salvando pedido..." />}

      <div className="pedido-card">
        <div className="card-header" onClick={() => setCollapsed(!collapsed)}>
          <h3>Dados do Pedido</h3>
          <div className={`collapse-icon ${!collapsed ? "expanded" : ""}`}>
            <IoChevronDownOutline size={20} />
          </div>
        </div>

        {!collapsed && (
          <div className="form-content">
            {id && (
              <div className="pedido-info">
                <h4>Editando Pedido #{id}</h4>
                <p>Atualize os campos desejados e clique em salvar.</p>
              </div>
            )}

            <div className="form-grid">
              <Input
                label="Cliente"
                value={pedido.cliente}
                onChange={(e) => handleChange("cliente", e.target.value)}
                error={errors.cliente}
                required
                placeholder="Digite o nome do cliente"
              />

              <Input
                type="date"
                label="Data do Pedido"
                value={pedido.data_pedido}
                onChange={(e) => handleChange("data_pedido", e.target.value)}
                error={errors.data_pedido}
                required
              />

              <Dropdown
                label="Prioridade"
                selectedOption={pedido.prioridade}
                onSelect={(value) => handleChange("prioridade", value)}
                options={[
                  { value: "baixa", label: "Baixa" },
                  { value: "média", label: "Média" },
                  { value: "alta", label: "Alta" },
                ]}
                placeholder="Selecione a prioridade"
                required
                error={errors.prioridade}
              />

              <Input
                type="date"
                label="Prazo de Entrega"
                value={pedido.prazo_entrega}
                onChange={(e) => handleChange("prazo_entrega", e.target.value)}
                error={errors.prazo_entrega}
                placeholder="Opcional"
              />
            </div>

            <div className="form-actions">
              <Button
                variant="secondary"
                onClick={() => navigate("/listagem/pedido")}
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
                {id ? "Atualizar Pedido" : "Salvar Pedido"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
};

export default Pedido;
