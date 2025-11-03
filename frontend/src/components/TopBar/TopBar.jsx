import "./TopBar.css";
import { IoMenuOutline, IoNotificationsOutline, IoPersonOutline } from "react-icons/io5";
import { useTopBar } from "./useTopBar.js";

const MenuButton = ({ onClick, isMenuOpen }) => (
  <button 
    className="top-bar__menu-button" 
    onClick={onClick}
    aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
  >
    <IoMenuOutline size={24} />
  </button>
);

const NotificationButton = ({ unreadCount, onClick }) => (
  <button 
    className="top-bar__notification-button" 
    onClick={onClick}
    aria-label={`Notificações${unreadCount > 0 ? ` (${unreadCount} não lidas)` : ''}`}
  >
    <IoNotificationsOutline size={24} />
    {unreadCount > 0 && (
      <span className="top-bar__notification-badge" aria-hidden="true">
        {unreadCount > 99 ? '99+' : unreadCount}
      </span>
    )}
  </button>
);

const UserProfile = ({ user }) => (
  <div className="top-bar__user-profile">
    {user?.avatar ? (
      <img
        src={user.avatar}
        alt={`Perfil de ${user.name}`}
        className="top-bar__user-avatar"
        loading="lazy"
      />
    ) : (
      <div className="top-bar__user-avatar-placeholder">
        <IoPersonOutline size={20} />
      </div>
    )}
  </div>
);

export default function TopBar({ onMenuToggle, isMenuOpen }) {
  const { unreadCount, user } = useTopBar();

  const handleNotificationClick = () => {
    // TODO: Implementar modal/dropdown de notificações
    console.log('Abrir notificações');
  };

  return (
    <header className={`top-bar ${isMenuOpen ? "top-bar--menu-open" : ""}`}>
      <MenuButton onClick={onMenuToggle} isMenuOpen={isMenuOpen} />

      <div className="top-bar__right-section">
        <NotificationButton 
          unreadCount={unreadCount} 
          onClick={handleNotificationClick} 
        />
        <UserProfile user={user} />
      </div>
    </header>
  );
}
