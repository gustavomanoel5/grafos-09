// src/components/Menu/MenuProfile.jsx
import React, { useState } from "react";
import { IoPersonOutline, IoSettingsOutline } from "react-icons/io5";

const MenuProfile = () => {
  const [showSettings, setShowSettings] = useState(false);

  const handleOpenSettings = () => {
    setShowSettings(true);
  };

  const handleCloseSettings = () => {
    setShowSettings(false);
  };

  return (
    <>
      <div className="menu-profile">
        <div className="profile-info">
          <div className="profile-avatar">
            <IoPersonOutline />
          </div>
          <div className="profile-details">
            <span className="profile-name">Usuário</span>
          </div>
        </div>

        <div className="profile-actions">
          <button
            className="profile-action"
            title="Configurações"
            onClick={handleOpenSettings}
          >
            <IoSettingsOutline />
          </button>
        </div>
      </div>

      {showSettings && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Configurações</h3>
            <p>Aqui vai o conteúdo do modal (ex: preferências, tema, etc).</p>
            <button onClick={handleCloseSettings}>Fechar</button>
          </div>
        </div>
      )}
    </>
  );
};

export default MenuProfile;
