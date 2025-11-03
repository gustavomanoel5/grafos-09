// Exportações principais
export { default as Modal } from './Modal';
export { 
  ConfirmModal, 
  AlertModal, 
  FormModal,
  useConfirmModal,
  useAlertModal 
} from './ConfirmModal';

// Hooks utilitários
export { useModalFocus, useFocusTrap } from './useModalFocus';
export { 
  useModalAnimation, 
  useModalState, 
  useClickOutside, 
  useEscapeKey, 
  useScrollLock 
} from './useModalAnimation';

// Para manter compatibilidade com importações antigas
export { default } from './Modal';