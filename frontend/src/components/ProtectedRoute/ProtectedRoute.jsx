// src/components/ProtectedRoute/ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import Loading from "../Loading/Loading";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const token = localStorage.getItem("token");

  console.log("🛡️ [ProtectedRoute] Verificando acesso...", {
    rota: location.pathname,
    token,
    user,
    loading,
  });

  // ⏳ 1. Espera o AuthContext terminar de carregar
  if (loading) {
    console.log("⏳ [ProtectedRoute] Aguardando contexto de autenticação...");
    return <Loading fullpage message="Verificando acesso..." />;
  }

  // 🚫 2. Se não há token ou user, redireciona pro login
  if (!token || !user) {
    console.warn(
      "🚫 [ProtectedRoute] Usuário não autenticado, indo para /login"
    );
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 🏠 3. Dashboard é sempre acessível se autenticado
  if (location.pathname === "/dashboard") {
    console.log("🏠 [ProtectedRoute] Acesso liberado ao dashboard.");
    return children;
  }

  // ⚙️ 4. Verifica permissões — só se user.permissoes existir
  const permissoes = user?.permissoes || [];
  const temPermissao = permissoes.some((p) =>
    location.pathname.startsWith(p.rota.replace(/:\w+/, ""))
  );

  console.log("🔒 [ProtectedRoute] Permissão para esta rota:", temPermissao);

  if (!temPermissao) {
    console.error("❌ [ProtectedRoute] Acesso negado para:", location.pathname);
    return <Navigate to="/acesso-negado" replace />;
  }

  // ✅ 5. Autenticado + autorizado → renderiza
  return children;
};

export default ProtectedRoute;
