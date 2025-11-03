import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import "./CollapsibleCard.css";
import { IoChevronDownOutline } from "react-icons/io5";

const CollapsibleCard = ({
  icon: Icon,
  title,
  children,
  initialOpen = true,
  disabled = false,
  size = "md",
  loading = false,
  onToggle,
  className = "",
  ariaLabel,
  id
}) => {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const contentRef = useRef(null);

  // Controle externo do estado
  useEffect(() => {
    setIsOpen(initialOpen);
  }, [initialOpen]);

  const handleToggle = () => {
    if (disabled || loading) return;
    
    const newState = !isOpen;
    setIsOpen(newState);
    
    if (onToggle) {
      onToggle(newState);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleToggle();
    }
  };

  const cardClasses = [
    "collapsible-card",
    `size-${size}`,
    disabled && "disabled",
    loading && "loading",
    className
  ].filter(Boolean).join(" ");

  const headerClasses = [
    "card-header",
    disabled && "disabled"
  ].filter(Boolean).join(" ");

  const contentClasses = [
    "card-content",
    isOpen ? "expanded" : "collapsed"
  ].join(" ");

  const toggleIconClasses = [
    "card-toggle-icon",
    !isOpen && "rotated"
  ].filter(Boolean).join(" ");

  return (
    <article 
      className={cardClasses}
      id={id}
      aria-label={ariaLabel}
    >
      <header
        className={headerClasses}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-expanded={isOpen}
        aria-controls={`${id || 'collapsible'}-content`}
        aria-disabled={disabled}
        aria-label={`${disabled ? 'Desabilitado: ' : ''}${isOpen ? 'Recolher' : 'Expandir'} ${title}`}
      >
        <div className="card-icon-title">
          {Icon && (
            <Icon 
              size={20} 
              className="card-icon"
              aria-hidden="true"
            />
          )}
          <h3 className="card-title">{title}</h3>
        </div>
        
        {!disabled && (
          <IoChevronDownOutline 
            size={20} 
            className={toggleIconClasses}
            aria-hidden="true"
          />
        )}
      </header>
      
      <section
        ref={contentRef}
        className={contentClasses}
        id={`${id || 'collapsible'}-content`}
        aria-hidden={!isOpen}
      >
        <div className="card-content-inner">
          {children}
        </div>
      </section>
    </article>
  );
};

CollapsibleCard.propTypes = {
  icon: PropTypes.elementType,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  initialOpen: PropTypes.bool,
  disabled: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  loading: PropTypes.bool,
  onToggle: PropTypes.func,
  className: PropTypes.string,
  ariaLabel: PropTypes.string,
  id: PropTypes.string
};

export default CollapsibleCard;
