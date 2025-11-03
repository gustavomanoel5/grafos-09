// src/App.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  // Substitua IoCylinderOutline por IoDiscOutline
  IoDiscOutline,
  IoPrintOutline,
  IoCubeOutline,
  IoClipboardOutline,
  IoListCircleOutline,
} from "react-icons/io5";
import Menu from "./components/Menu/Menu";
import TopBar from "./components/TopBar/TopBar";
import AppRoutes from "./AppRoutes"; // ✅ importando o arquivo separado
import "./App.css";

// =============================
// 🔹 MENU PADRÃO
// =============================
const defaultMenu = [
  {
    name: "Filamento",
    icon: IoDiscOutline, // ✨ NOVO ÍCONE
    path: "/configuracoes/filamento",
  },
  {
    name: "Impressora",
    icon: IoPrintOutline, // Ícone de impressora
    path: "/configuracoes/impressora", // Mantendo o caminho original, mas direto
  },
  {
    name: "Modelo",
    icon: IoCubeOutline, // Ícone de cubo/objeto 3D
    path: "/listagem/modelo", // Mantendo o caminho original, mas direto
  },
  {
    name: "Pedido",
    icon: IoClipboardOutline, // Ícone de prancheta/pedido
    path: "/listagem/pedido", // *Correção: "Pedidos" para "Pedido" (singular)
  },
  {
    name: "Plano de produção",
    icon: IoListCircleOutline, // Ícone de lista/planejamento
    path: "/listagem/plano_producao", // *Correção: "Plano Produção" para "Plano de produção"
  },
  {
    name: "Tarefas",
    icon: IoClipboardOutline,
    path: "/listagem/tarefas",
  },
];

// =============================
// 🔹 COMPONENTE PRINCIPAL
// =============================
const App = () => {
  const [menuOpen, setMenuOpen] = useState(true);
  const [menuItems, setMenuItems] = useState(defaultMenu);

  useEffect(() => {
    setMenuItems(defaultMenu);
  }, []);

  return (
    <Router>
      <AppContent
        menuItems={menuItems}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      />
    </Router>
  );
};

// =============================
// 🔹 CONTEÚDO PRINCIPAL
// =============================
function AppContent({ menuItems, menuOpen, setMenuOpen }) {
  const location = useLocation();

  return (
    <div className="app-layout">
      {/* 🔸 Menu lateral */}
      <Menu menuItems={menuItems} isOpen={menuOpen} />

      {/* 🔸 Área principal */}
      <div className={`main-content ${menuOpen ? "content-pushed" : ""}`}>
        <div className="app-container">
          <TopBar
            onMenuToggle={() => setMenuOpen(!menuOpen)}
            isMenuOpen={menuOpen}
          />

          <div className="content-container">
            {/* 🔹 ROTAS VINDAS DO ARQUIVO SEPARADO */}
            <AppRoutes />

            {/* 🔹 Toasts globais */}
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={true}
              closeOnClick
              pauseOnHover
              draggable
              theme="colored"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
