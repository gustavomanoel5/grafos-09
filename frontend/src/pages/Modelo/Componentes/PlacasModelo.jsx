import React, { useEffect } from "react";
import { IoCubeOutline } from "react-icons/io5";
import Placa from "../Componentes/Placa"; // ajuste conforme sua estrutura
import "./PlacasModelo.css";

const PlacasModelo = ({ modeloId, modeloData, onComplete }) => {
  useEffect(() => {
    if (modeloId) {
      console.log("🧩 Carregando placas vinculadas ao modelo:", modeloId);
    }
  }, [modeloId]);

  // Caso o modelo ainda não tenha sido salvo
  if (!modeloId) {
    return (
      <div className="empty-state">
        <IoCubeOutline size={48} className="empty-state-icon" />
        <h4>Cadastre primeiro o Modelo</h4>
        <p>Finalize o cadastro do modelo antes de gerenciar as placas.</p>
      </div>
    );
  }

  return (
    <div className="placas-modelo-container">
      <h3 className="placas-titulo">
        Placas do Modelo {modeloData?.nome ? `: ${modeloData.nome}` : ""}
      </h3>
      <Placa modeloId={modeloId} onComplete={onComplete} />
    </div>
  );
};

export default PlacasModelo;
