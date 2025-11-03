import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useLocation } from "react-router-dom";
import MenuItem from "../MenuItem/MenuItem";
import MenuSearch from "./MenuSearch.jsx";
import MenuProfile from "./MenuProfile.jsx";
import "./Menu.css";
import {
  IoSearchOutline,
  IoSettingsOutline,
  IoLogOutOutline,
} from "react-icons/io5";

const Menu = ({
  menuItems = [],
  isOpen = false,
  onToggle,
  user,
  logo,
  className = "",
  searchable = true,
  collapsible = true,
  showProfile = true,
  theme = "dark", // dark, light, auto
  variant = "sidebar", // sidebar, overlay, mini
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState(new Set());
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const location = useLocation();

  // Filtrar itens do menu baseado na pesquisa
  const filteredMenuItems = useMemo(() => {
    if (!searchTerm.trim()) return menuItems;

    const filterItems = (items) => {
      return items.reduce((acc, item) => {
        const matchesName = item.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const filteredDropdown = item.dropdown
          ? item.dropdown.filter((subItem) =>
              subItem.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
          : [];

        if (matchesName || filteredDropdown.length > 0) {
          acc.push({
            ...item,
            dropdown: filteredDropdown,
          });
        }
        return acc;
      }, []);
    };

    return filterItems(menuItems);
  }, [menuItems, searchTerm]);

  // Auto-expandir grupos com itens ativos
  useEffect(() => {
    const activeGroups = new Set();
    menuItems.forEach((item, index) => {
      if (item.dropdown?.some((sub) => location.pathname === sub.path)) {
        activeGroups.add(index);
      }
    });
    setExpandedGroups(activeGroups);
  }, [location.pathname, menuItems]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape" && isSearchFocused) {
        setSearchTerm("");
        setIsSearchFocused(false);
      }
      if (e.key === "/" && e.ctrlKey) {
        e.preventDefault();
        setIsSearchFocused(true);
      }
    },
    [isSearchFocused]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  const menuClasses = `
    menu-container
    ${isOpen ? "menu-open" : "menu-closed"}
    ${isCollapsed ? "menu-collapsed" : ""}
    ${theme}
    ${variant}
    ${className}
  `.trim();

  return (
    <aside
      className={menuClasses}
      role="navigation"
      aria-label="Menu principal"
      data-testid="main-menu"
    >
      {/* Header do Menu */}
      <div className="menu-header">
        <div className="menu-logo-section">
          {logo ? (
            <img src={logo} alt="Logo" className="menu-logo" />
          ) : (
            <div className="menu-logo-placeholder">
              <div className="logo-circle">GUS</div>
            </div>
          )}

          {!isCollapsed && (
            <div className="menu-title-section">
              <h2 className="menu-system-title">Trabalho de Grafos</h2>
              <p className="menu-system-subtitle">2025</p>
            </div>
          )}
        </div>
      </div>

      {/* Busca */}
      {searchable && !isCollapsed && (
        <MenuSearch
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          isSearchFocused={isSearchFocused}
          setIsSearchFocused={setIsSearchFocused}
        />
      )}

      {/* Lista de Itens do Menu */}
      <nav className="menu-navigation">
        <ul className="menu-options" role="menubar">
          {filteredMenuItems.map((item, index) => (
            <MenuItem
              key={item.id || index}
              {...item}
              isCollapsed={isCollapsed}
              searchTerm={searchTerm}
              isExpanded={expandedGroups.has(index)}
              onToggleExpanded={() => {
                const newExpanded = new Set(expandedGroups);
                if (newExpanded.has(index)) {
                  newExpanded.delete(index);
                } else {
                  newExpanded.add(index);
                }
                setExpandedGroups(newExpanded);
              }}
            />
          ))}
        </ul>
      </nav>

      {/* Footer do Menu - Profile/Settings */}
      {showProfile && !isCollapsed && <MenuProfile user={user} />}

      {/* Versão colapsada - botões rápidos */}
      {isCollapsed && (
        <div className="menu-collapsed-actions">
          {searchable && (
            <button
              className="menu-collapsed-btn"
              onClick={() => setIsCollapsed(false)}
              title="Buscar (Ctrl + /)"
            >
              <IoSearchOutline />
            </button>
          )}
          <button className="menu-collapsed-btn" title="Configurações">
            <IoSettingsOutline />
          </button>
          <button className="menu-collapsed-btn" title="Sair">
            <IoLogOutOutline />
          </button>
        </div>
      )}

      {/* Overlay para mobile */}
      {isOpen && variant === "overlay" && (
        <div className="menu-overlay" onClick={onToggle} aria-hidden="true" />
      )}
    </aside>
  );
};

export default Menu;
