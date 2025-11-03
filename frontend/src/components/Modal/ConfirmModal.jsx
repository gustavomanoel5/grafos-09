import React from 'react';
import Modal from './Modal';
import { IoWarningOutline, IoCheckmarkCircleOutline, IoCloseCircleOutline } from 'react-icons/io5';

export const ConfirmModal = ({
  isOpen = false,
  onClose,
  onConfirm,
  onCancel,
  title = "Confirmar Ação",
  message = "Tem certeza que deseja continuar?",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "warning", // warning, danger, success, info
  size = "small",
  ...props
}) => {
  const getIcon = () => {
    const iconProps = { size: 48, style: { marginBottom: '1rem' } };
    
    switch (variant) {
      case 'danger':
        return <IoCloseCircleOutline {...iconProps} style={{ ...iconProps.style, color: '#ef4444' }} />;
      case 'success':
        return <IoCheckmarkCircleOutline {...iconProps} style={{ ...iconProps.style, color: '#10b981' }} />;
      case 'warning':
      default:
        return <IoWarningOutline {...iconProps} style={{ ...iconProps.style, color: '#f59e0b' }} />;
    }
  };

  const handleConfirm = () => {
    onConfirm?.();
    onClose?.();
  };

  const handleCancel = () => {
    onCancel?.();
    onClose?.();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size={size}
      variant="confirm"
      closeOnOverlayClick={false}
      footerButtons={[
        {
          text: cancelText,
          onClick: handleCancel,
          variant: 'secondary'
        },
        {
          text: confirmText,
          onClick: handleConfirm,
          variant: variant === 'danger' ? 'danger' : 'primary'
        }
      ]}
      {...props}
    >
      <div style={{ textAlign: 'center' }}>
        {getIcon()}
        <p>{message}</p>
      </div>
    </Modal>
  );
};

export const AlertModal = ({
  isOpen = false,
  onClose,
  onConfirm,
  title = "Atenção",
  message = "Informação importante.",
  confirmText = "OK",
  variant = "info",
  size = "small",
  ...props
}) => {
  const getIcon = () => {
    const iconProps = { size: 48, style: { marginBottom: '1rem' } };
    
    switch (variant) {
      case 'danger':
        return <IoCloseCircleOutline {...iconProps} style={{ ...iconProps.style, color: '#ef4444' }} />;
      case 'success':
        return <IoCheckmarkCircleOutline {...iconProps} style={{ ...iconProps.style, color: '#10b981' }} />;
      case 'warning':
        return <IoWarningOutline {...iconProps} style={{ ...iconProps.style, color: '#f59e0b' }} />;
      case 'info':
      default:
        return <IoWarningOutline {...iconProps} style={{ ...iconProps.style, color: '#06b6d4' }} />;
    }
  };

  const handleConfirm = () => {
    onConfirm?.();
    onClose?.();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size={size}
      variant="alert"
      footerButtons={[
        {
          text: confirmText,
          onClick: handleConfirm,
          variant: 'primary'
        }
      ]}
      {...props}
    >
      <div style={{ textAlign: 'center' }}>
        {getIcon()}
        <p>{message}</p>
      </div>
    </Modal>
  );
};

export const FormModal = ({
  isOpen = false,
  onClose,
  onSubmit,
  onCancel,
  title = "Formulário",
  children,
  submitText = "Salvar",
  cancelText = "Cancelar",
  size = "medium",
  isLoading = false,
  isDirty = false,
  ...props
}) => {
  const handleSubmit = (e) => {
    e?.preventDefault();
    onSubmit?.(e);
  };

  const handleCancel = () => {
    if (isDirty) {
      // Pode mostrar um confirm modal aqui
      const shouldCancel = window.confirm('Você possui alterações não salvas. Deseja realmente sair?');
      if (!shouldCancel) return;
    }
    
    onCancel?.();
    onClose?.();
  };

  const handleClose = async (reason) => {
    if (reason === 'escape' && isDirty) {
      const shouldClose = window.confirm('Você possui alterações não salvas. Deseja realmente sair?');
      if (!shouldClose) return false;
    }
    
    onClose?.();
    return true;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={title}
      size={size}
      variant="form"
      closeOnOverlayClick={false}
      footerButtons={[
        {
          text: cancelText,
          onClick: handleCancel,
          variant: 'secondary',
          disabled: isLoading
        },
        {
          text: isLoading ? 'Salvando...' : submitText,
          onClick: handleSubmit,
          variant: 'primary',
          disabled: isLoading,
          type: 'submit'
        }
      ]}
      {...props}
    >
      <form onSubmit={handleSubmit}>
        {children}
      </form>
    </Modal>
  );
};

// Hook para facilitar o uso de modais
export const useConfirmModal = () => {
  const [modalState, setModalState] = React.useState({
    isOpen: false,
    title: '',
    message: '',
    variant: 'warning',
    onConfirm: null,
    onCancel: null
  });

  const showConfirm = React.useCallback((config) => {
    return new Promise((resolve) => {
      setModalState({
        isOpen: true,
        title: config.title || 'Confirmar Ação',
        message: config.message || 'Tem certeza que deseja continuar?',
        variant: config.variant || 'warning',
        onConfirm: () => {
          setModalState(prev => ({ ...prev, isOpen: false }));
          resolve(true);
        },
        onCancel: () => {
          setModalState(prev => ({ ...prev, isOpen: false }));
          resolve(false);
        }
      });
    });
  }, []);

  const closeModal = React.useCallback(() => {
    setModalState(prev => ({ ...prev, isOpen: false }));
  }, []);

  const ConfirmModalComponent = React.useCallback(() => (
    <ConfirmModal
      isOpen={modalState.isOpen}
      onClose={closeModal}
      title={modalState.title}
      message={modalState.message}
      variant={modalState.variant}
      onConfirm={modalState.onConfirm}
      onCancel={modalState.onCancel}
    />
  ), [modalState, closeModal]);

  return { showConfirm, ConfirmModal: ConfirmModalComponent };
};

export const useAlertModal = () => {
  const [modalState, setModalState] = React.useState({
    isOpen: false,
    title: '',
    message: '',
    variant: 'info',
    onConfirm: null
  });

  const showAlert = React.useCallback((config) => {
    return new Promise((resolve) => {
      setModalState({
        isOpen: true,
        title: config.title || 'Atenção',
        message: config.message || 'Informação importante.',
        variant: config.variant || 'info',
        onConfirm: () => {
          setModalState(prev => ({ ...prev, isOpen: false }));
          resolve(true);
        }
      });
    });
  }, []);

  const closeModal = React.useCallback(() => {
    setModalState(prev => ({ ...prev, isOpen: false }));
  }, []);

  const AlertModalComponent = React.useCallback(() => (
    <AlertModal
      isOpen={modalState.isOpen}
      onClose={closeModal}
      title={modalState.title}
      message={modalState.message}
      variant={modalState.variant}
      onConfirm={modalState.onConfirm}
    />
  ), [modalState, closeModal]);

  return { showAlert, AlertModal: AlertModalComponent };
};