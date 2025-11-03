import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  IoChevronDownOutline, 
  IoChevronUpOutline,
  IoChevronForwardOutline 
} from "react-icons/io5";
import "./MenuItem.css";

const MenuItem = ({ 
  icon: Icon, 
  name, 
  dropdown = [], 
  path, 
  badge,
  isCollapsed = false,
  searchTerm = "",
  isExpanded = false,
  onToggleExpanded,
  disabled = false
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const location = useLocation();
  const itemRef = useRef(null);
  const tooltipRef = useRef(null);

  const isDirectLink = path && dropdown.length === 0;
  const hasDropdown = dropdown.length > 0;

  // Estados ativos
  const isActive = location.pathname === path ||
    dropdown.some(sub => location.pathname === sub.path);
  const isSubActive = dropdown.some(sub => location.pathname === sub.path);

  // Highlight do termo de busca
  const highlightText = (text, term) => {
    if (!term) return text;
    const regex = new RegExp(`(${term})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  };

  // Animação de expansão
  const handleToggle = () => {
    if (disabled || !hasDropdown) return;
    setIsAnimating(true);
    onToggleExpanded();
    setTimeout(() => setIsAnimating(false), 300);
  };

  // Tooltip para versão colapsada
  useEffect(() => {
    if (!isCollapsed) return;
    
    const item = itemRef.current;
    const tooltip = tooltipRef.current;
    
    if (!item || !tooltip) return;

    const showTooltipHandler = () => {
      setShowTooltip(true);
      const rect = item.getBoundingClientRect();
      tooltip.style.top = `${rect.top}px`;
      tooltip.style.left = `${rect.right + 8}px`;
    };

    const hideTooltipHandler = () => setShowTooltip(false);

    item.addEventListener('mouseenter', showTooltipHandler);
    item.addEventListener('mouseleave', hideTooltipHandler);

    return () => {
      item.removeEventListener('mouseenter', showTooltipHandler);
      item.removeEventListener('mouseleave', hideTooltipHandler);
    };
  }, [isCollapsed]);

  const itemClasses = `
    menu-item 
    ${isActive ? 'active' : ''} 
    ${isSubActive ? 'has-active-sub' : ''}
    ${isExpanded ? 'expanded' : ''}
    ${isAnimating ? 'animating' : ''}
    ${disabled ? 'disabled' : ''}
    ${isCollapsed ? 'collapsed' : ''}
  `.trim();

  return (
    <>
      <li 
        ref={itemRef}
        className={itemClasses}
        role="menuitem"
        aria-expanded={hasDropdown ? isExpanded : undefined}
        aria-disabled={disabled}
      >
        {isDirectLink ? (
          <Link 
            to={path} 
            className="menu-link"
            aria-current={isActive ? 'page' : undefined}
            tabIndex={disabled ? -1 : 0}
          >
            <div className="menu-content">
              <div className="menu-icon-wrapper">
                {Icon && <Icon className="menu-icon" />}
                {isActive && <div className="active-indicator" />}
              </div>
              
              {!isCollapsed && (
                <>
                  <span 
                    className="menu-label"
                    dangerouslySetInnerHTML={{ 
                      __html: highlightText(name, searchTerm) 
                    }}
                  />
                  {badge && (
                    <span className={`menu-badge ${badge.type || 'primary'}`}>
                      {badge.text}
                    </span>
                  )}
                </>
              )}
            </div>
          </Link>
        ) : (
          <button
            className="menu-button"
            onClick={handleToggle}
            disabled={disabled}
            aria-label={`${name} ${hasDropdown ? (isExpanded ? '(expandido)' : '(recolhido)') : ''}`}
          >
            <div className="menu-content">
              <div className="menu-icon-wrapper">
                {Icon && <Icon className="menu-icon" />}
                {isSubActive && <div className="active-indicator" />}
              </div>
              
              {!isCollapsed && (
                <>
                  <span 
                    className="menu-label"
                    dangerouslySetInnerHTML={{ 
                      __html: highlightText(name, searchTerm) 
                    }}
                  />
                  {badge && (
                    <span className={`menu-badge ${badge.type || 'primary'}`}>
                      {badge.text}
                    </span>
                  )}
                  {hasDropdown && (
                    <div className="menu-arrow">
                      {isExpanded ? (
                        <IoChevronUpOutline />
                      ) : (
                        <IoChevronDownOutline />
                      )}
                    </div>
                  )}
                </>
              )}
              
              {isCollapsed && hasDropdown && (
                <IoChevronForwardOutline className="menu-arrow-collapsed" />
              )}
            </div>
          </button>
        )}

        {/* Submenu */}
        {hasDropdown && isExpanded && !isCollapsed && (
          <ul className="submenu" role="menu">
            {dropdown.map((subItem, subIndex) => {
              const isSubItemActive = location.pathname === subItem.path;
              return (
                <li key={subItem.id || subIndex} role="none">
                  <Link
                    to={subItem.path}
                    className={`submenu-link ${isSubItemActive ? 'active' : ''}`}
                    role="menuitem"
                    aria-current={isSubItemActive ? 'page' : undefined}
                  >
                    <span className="submenu-indicator" />
                    <span 
                      className="submenu-label"
                      dangerouslySetInnerHTML={{ 
                        __html: highlightText(subItem.name, searchTerm) 
                      }}
                    />
                    {subItem.badge && (
                      <span className={`menu-badge ${subItem.badge.type || 'primary'}`}>
                        {subItem.badge.text}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </li>

      {/* Tooltip para versão colapsada */}
      {isCollapsed && showTooltip && (
        <div ref={tooltipRef} className="menu-tooltip">
          <div className="tooltip-content">
            <span className="tooltip-title">{name}</span>
            {hasDropdown && dropdown.length > 0 && (
              <div className="tooltip-submenu">
                {dropdown.map((sub, idx) => (
                  <span key={idx} className="tooltip-sub-item">
                    {sub.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default MenuItem;
