import React, { useCallback, forwardRef } from 'react';
import { createPortal } from 'react-dom';
import { IoCloseOutline } from 'react-icons/io5';
import { useModalFocus } from './useModalFocus.js';
import { 
  useModalAnimation, 
  useClickOutside, 
  useEscapeKey, 
  useScrollLock 
} from './useModalAnimation.js';
import "./Modal.css";

const Modal = forwardRef(({
  // Estados básicos
  isOpen = false,
  onClose,
  onOpen,
  onConfirm,
  onCancel,
  
  // Conteúdo
  title,
  children,
  content,
  
  // Configurações visuais
  size = "medium", // small, medium, large, fullscreen, auto
  variant = "default", // default, confirm, alert, form
  theme = "auto", // light, dark, auto
  centered = true,
  
  // Comportamento
  closable = true,
  closeOnOverlayClick = true,
  closeOnEscapeKey = true,
  preventScroll = true,
  persistent = false,
  
  // Animações
  animation = "fade", // fade, slide, scale, none
  animationDuration = 300,
  
  // Botões
  showHeader = true,
  showCloseButton = true,
  showFooter = false,
  footerButtons = [],
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  confirmButtonProps = {},
  cancelButtonProps = {},
  
  // Acessibilidade
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
  "aria-describedby": ariaDescribedby,
  role = "dialog",
  
  // Estilo customizado
  className = "",
  overlayClassName = "",
  contentClassName = "",
  style = {},
  overlayStyle = {},
  
  // Eventos avançados
  onOverlayClick,
  onBeforeClose,
  onAfterOpen,
  onAfterClose,
  
  // Props para compatibilidade
  ...restProps
}, ref) => {
  const modalRef = useModalFocus(isOpen);
  const { isVisible, isAnimating, handleClose } = useModalAnimation(
    isOpen, 
    onClose, 
    animationDuration
  );

  useScrollLock(preventScroll && isOpen);

  // Gerencia fechamento do modal
  const closeModal = useCallback(async (reason = 'user') => {
    if (!closable && reason !== 'force') return;
    
    // Hook antes de fechar
    if (onBeforeClose) {
      const canClose = await onBeforeClose(reason);
      if (canClose === false) return;
    }
    
    handleClose(reason);
    
    // Hook após fechar
    setTimeout(() => {
      onAfterClose?.(reason);
    }, animationDuration);
  }, [closable, onBeforeClose, handleClose, onAfterClose, animationDuration]);

  // Click fora do modal
  const handleOverlayClick = useCallback((e) => {
    if (!closeOnOverlayClick || persistent) return;
    onOverlayClick?.(e);
    closeModal('overlay');
  }, [closeOnOverlayClick, persistent, onOverlayClick, closeModal]);

  useClickOutside(modalRef, handleOverlayClick, isOpen && !persistent);
  useEscapeKey(() => closeModal('escape'), isOpen && closeOnEscapeKey);

  // Handlers dos botões
  const handleConfirm = useCallback((e) => {
    if (onConfirm) {
      onConfirm(e);
    } else {
      closeModal('confirm');
    }
  }, [onConfirm, closeModal]);

  const handleCancel = useCallback((e) => {
    if (onCancel) {
      onCancel(e);
    } else {
      closeModal('cancel');
    }
  }, [onCancel, closeModal]);

  // Hook após abrir
  React.useEffect(() => {
    if (isAnimating && isOpen) {
      onAfterOpen?.();
    }
  }, [isAnimating, isOpen, onAfterOpen]);

  if (!isVisible) return null;

  const modalClasses = [
    'modal-overlay',
    `modal-${animation}`,
    `modal-${theme}`,
    isAnimating ? 'modal-animating' : 'modal-closing',
    overlayClassName
  ].filter(Boolean).join(' ');

  const contentClasses = [
    'modal-content',
    `modal-${size}`,
    `modal-${variant}`,
    centered ? 'modal-centered' : '',
    contentClassName,
    className
  ].filter(Boolean).join(' ');

  const renderHeader = () => {
    if (!showHeader && !title) return null;
    
    return (
      <div className="modal-header">
        <div className="modal-header-content">
          {title && (
            <h2 
              className="modal-title" 
              id="modal-title"
            >
              {title}
            </h2>
          )}
        </div>
        {showCloseButton && closable && (
          <button
            type="button"
            className="modal-close-button"
            onClick={() => closeModal('close-button')}
            aria-label="Fechar modal"
          >
            <IoCloseOutline />
          </button>
        )}
      </div>
    );
  };

  const renderFooter = () => {
    if (!showFooter && variant !== 'confirm' && footerButtons.length === 0) {
      return null;
    }

    const defaultButtons = variant === 'confirm' ? [
      {
        text: cancelText,
        onClick: handleCancel,
        variant: 'secondary',
        ...cancelButtonProps
      },
      {
        text: confirmText,
        onClick: handleConfirm,
        variant: 'primary',
        ...confirmButtonProps
      }
    ] : [];

    const buttons = footerButtons.length > 0 ? footerButtons : defaultButtons;

    return (
      <div className="modal-footer">
        <div className="modal-actions">
          {buttons.map((button, index) => (
            <button
              key={index}
              type={button.type || 'button'}
              className={`modal-button modal-button-${button.variant || 'primary'}`}
              onClick={button.onClick}
              disabled={button.disabled}
              {...button.props}
            >
              {button.icon && <button.icon />}
              {button.text}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const modalContent = (
    <div 
      className={modalClasses}
      style={overlayStyle}
      onClick={handleOverlayClick}
      role="presentation"
    >
      <div
        ref={ref || modalRef}
        className={contentClasses}
        style={style}
        role={role}
        aria-modal="true"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby || (title ? "modal-title" : undefined)}
        aria-describedby={ariaDescribedby}
        onClick={(e) => e.stopPropagation()}
        {...restProps}
      >
        {renderHeader()}
        
        <div className="modal-body">
          {content || children}
        </div>

        {renderFooter()}
      </div>
    </div>
  );

  // Renderiza no portal para garantir z-index correto
  return createPortal(modalContent, document.body);
});

Modal.displayName = 'Modal';

export default Modal;
