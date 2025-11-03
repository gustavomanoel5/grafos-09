import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  IoCubeOutline,
  IoAlbumsOutline,
  IoCheckmarkCircleOutline,
} from "react-icons/io5";

import Container from "../../components/Container/Container";
import CollapsibleCard from "../../components/CollapsibleCard/CollapsibleCard";
import ModeloForm from "./Componentes/ModeloForm";
import PlacasModelo from "./Componentes/PlacasModelo";

import "./Modelo.css";

const Modelo = () => {
  const { id } = useParams();
  const [idModelo, setIdModelo] = useState(id || null);
  const [modeloData, setModeloData] = useState(null);
  const [currentStep, setCurrentStep] = useState(id ? 2 : 1);

  // 🔹 Quando o modelo é salvo no formulário
  const handleModeloSalvo = (idSalvo, data) => {
    console.log("✅ Modelo salvo com ID:", idSalvo);
    setIdModelo(idSalvo);
    setModeloData(data);
    setCurrentStep(2);
  };

  // 🔹 Quando o cadastro de placas é concluído
  const handlePlacasComplete = () => {
    setCurrentStep(3);
  };

  // 🔹 Passos da etapa
  const steps = [
    {
      id: 1,
      label: "Dados do Modelo",
      icon: IoCubeOutline,
      completed: currentStep > 1,
    },
    {
      id: 2,
      label: "Placas do Modelo",
      icon: IoAlbumsOutline,
      completed: currentStep > 2,
    },
    {
      id: 3,
      label: "Concluído",
      icon: IoCheckmarkCircleOutline,
      completed: currentStep >= 3,
    },
  ];

  return (
    <Container maxWidth="full" padding="small" className="modelo-page">
      {/* 🔹 Barra de progresso */}
      <div className="stepper-container">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = step.completed;
          const isAccessible =
            step.id <= Math.max(currentStep, idModelo ? 2 : 1);

          return (
            <div key={step.id} className="stepper-wrapper">
              <div
                className={`stepper-item ${isActive ? "active" : ""} ${
                  isCompleted ? "completed" : ""
                } ${!isAccessible ? "disabled" : ""}`}
              >
                <div className="stepper-icon">
                  <Icon size={20} />
                </div>
                <span className="stepper-label">{step.label}</span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`stepper-line ${isCompleted ? "completed" : ""}`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* 🔹 Card de cadastro do modelo */}
      <CollapsibleCard
        icon={IoCubeOutline}
        title="Cadastro de Modelo"
        initialOpen={true}
        id="modelo-card"
        className="modelo-card"
      >
        <ModeloForm
          modeloId={idModelo}
          onSave={handleModeloSalvo}
          savedData={modeloData}
        />
      </CollapsibleCard>

      {/* 🔹 Card de placas associadas */}
      <CollapsibleCard
        icon={IoAlbumsOutline}
        title="Placas do Modelo"
        initialOpen={!!idModelo}
        disabled={!idModelo}
        id="placas-card"
        className="modelo-card"
      >
        {idModelo ? (
          <PlacasModelo
            modeloId={idModelo}
            modeloData={modeloData}
            onComplete={handlePlacasComplete}
          />
        ) : (
          <div className="empty-state">
            <IoCubeOutline size={48} className="empty-state-icon" />
            <h4>Cadastre primeiro o Modelo</h4>
            <p>Complete o formulário acima para liberar a gestão de placas.</p>
          </div>
        )}
      </CollapsibleCard>

      {/* 🔹 Card de sucesso final */}
      {currentStep >= 3 && (
        <CollapsibleCard
          icon={IoCheckmarkCircleOutline}
          title="Modelo Cadastrado com Sucesso!"
          initialOpen={true}
          id="success-card"
          className="modelo-card success-card"
        >
          <div className="success-content">
            <IoCheckmarkCircleOutline size={64} className="success-icon" />
            <h3>Modelo "{modeloData?.nome}" cadastrado com sucesso!</h3>
            <p>
              O modelo foi criado e as placas associadas foram registradas com
              sucesso. Você pode visualizar o resumo ou criar um novo modelo.
            </p>

            <div className="success-actions">
              <button className="btn btn--primary">
                <IoCubeOutline size={16} />
                Ver Resumo
              </button>
              <button
                className="btn btn--secondary"
                onClick={() => {
                  setCurrentStep(1);
                  setIdModelo(null);
                  setModeloData(null);
                }}
              >
                Novo Modelo
              </button>
            </div>
          </div>
        </CollapsibleCard>
      )}
    </Container>
  );
};

export default Modelo;
