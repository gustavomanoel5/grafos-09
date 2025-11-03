// src/AppRoutes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Filamento from "./pages/configuracoes/Filamento/Filamento";
import Impressora from "./pages/configuracoes/Impressora/Impressora";

import ListagemModelo from "./pages/Modelo/ListagemModelo/ListagemModelo";
import ListagemPedido from "./pages/Pedido/ListagemPedido/ListagemPedido";
import ListagemPlanoProducao from "./pages/PlanoProducao/ListagemPlanoProducao/ListagemPlanoProducao";
import ListagemTarefas from "./pages/Tarefas/ListagemTarefas/ListagemTarefas";

import Modelo from "./pages/Modelo/Modelo";
import Pedido from "./pages/Pedido/Pedido";
import PlanoProducao from "./pages/PlanoProducao/PlanoProducao";
import Tarefas from "./pages/Tarefas/Tarefas";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Página inicial temporária */}
      <Route path="/" element={<h2>Bem-vindo ao Painel 🎯</h2>} />

      {/* Rota da página de Filamentos */}
      <Route path="/configuracoes/filamento" element={<Filamento />} />
      <Route path="/configuracoes/impressora" element={<Impressora />} />

      <Route path="/listagem/modelo" element={<ListagemModelo />} />
      <Route path="/listagem/pedido" element={<ListagemPedido />} />
      <Route
        path="/listagem/plano_producao"
        element={<ListagemPlanoProducao />}
      />
      <Route path="/listagem/tarefas" element={<ListagemTarefas />} />

      <Route path="/modelo" element={<Modelo />} />
      <Route path="/pedido" element={<Pedido />} />
      <Route path="/plano_producao" element={<PlanoProducao />} />
      <Route path="/tarefas/:idPlano" element={<Tarefas />} />

      {/* Caso nenhuma rota seja encontrada */}
      <Route
        path="*"
        element={
          <h2>Trabalho da Diciplina de Introdução a Teoria dos Grafos</h2>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
