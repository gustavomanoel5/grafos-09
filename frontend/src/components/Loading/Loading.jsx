import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import "./Loading.css";

const Loading = ({
  fullPage = false,
  message = "Carregando...",
  size = "medium", // small, medium, large
  variant = "dots", // dots, spinner, pulse, bars
  color = "primary", // primary, secondary, white
  overlay = true,
  delay = 0, // delay em ms antes de mostrar
  className = "",
  "aria-label": ariaLabel,
  testId,
}) => {
  const [shouldRender, setShouldRender] = useState(delay === 0);

  // Delay para evitar flash em carregamentos rápidos
  useEffect(() => {
    if (delay > 0) {
      const timer = setTimeout(() => setShouldRender(true), delay);
      return () => clearTimeout(timer);
    }
  }, [delay]);

  if (!shouldRender) return null;

  const containerClasses = `
    loading-container 
    ${fullPage ? 'full-page' : ''} 
    ${size} 
    ${color}
    ${!overlay && fullPage ? 'no-overlay' : ''}
    ${className}
  `.trim();

  const renderSpinner = () => {
    switch (variant) {
      case 'spinner':
        return (
          <div className="loading-spinner-circular">
            <div className="spinner-ring"></div>
          </div>
        );
      
      case 'pulse':
        return (
          <div className="loading-pulse">
            <div className="pulse-circle"></div>
          </div>
        );
      
      case 'bars':
        return (
          <div className="loading-bars">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bar" style={{ animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>
        );
      
      case 'dots':
      default:
        return (
          <div className="loading-dots">
            {[...Array(4)].map((_, i) => (
              <div 
                key={i} 
                className="dot" 
                style={{ animationDelay: `${i * 0.16}s` }} 
              />
            ))}
          </div>
        );
    }
  };

  const loadingContent = (
    <div 
      className={containerClasses}
      role="status" 
      aria-live="polite"
      aria-label={ariaLabel || message}
      data-testid={testId}
    >
      <div className="loading-content">
        <div className="loading-animation">
          {renderSpinner()}
        </div>
        {message && (
          <p className="loading-text">
            {message}
          </p>
        )}
      </div>
    </div>
  );

  // Use portal para fullPage para melhor isolamento
  if (fullPage && typeof document !== 'undefined') {
    return createPortal(loadingContent, document.body);
  }

  return loadingContent;
};

// Componente de conveniência para loading inline
export const InlineLoading = (props) => (
  <Loading {...props} fullPage={false} />
);

// Componente de conveniência para loading de página
export const PageLoading = (props) => (
  <Loading {...props} fullPage={true} />
);

// Hook para controlar loading state
export const useLoading = (initialState = false) => {
  const [isLoading, setIsLoading] = useState(initialState);
  
  const startLoading = () => setIsLoading(true);
  const stopLoading = () => setIsLoading(false);
  const toggleLoading = () => setIsLoading(prev => !prev);
  
  return {
    isLoading,
    startLoading,
    stopLoading,
    toggleLoading,
    setIsLoading
  };
};

export default Loading;
