import { useEffect, useRef } from 'react';

export const useModalFocus = (isOpen) => {
  const modalRef = useRef(null);
  const previousActiveElement = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    // Salva o elemento ativo antes de abrir o modal
    previousActiveElement.current = document.activeElement;

    // Encontra o primeiro elemento focável no modal
    const findFocusableElements = () => {
      const focusableSelectors = [
        'button:not([disabled])',
        '[href]',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        '[tabindex]:not([tabindex="-1"])'
      ].join(', ');

      return modalRef.current?.querySelectorAll(focusableSelectors) || [];
    };

    const focusableElements = Array.from(findFocusableElements());

    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }

    // Gerencia o foco com Tab
    const handleTabKey = (e) => {
      if (e.key !== 'Tab') return;

      if (focusableElements.length === 0) {
        e.preventDefault();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    // Previne foco fora do modal
    const handleFocusOut = (e) => {
      if (!modalRef.current?.contains(e.target)) {
        e.preventDefault();
        if (focusableElements.length > 0) {
          focusableElements[0].focus();
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);
    document.addEventListener('focusin', handleFocusOut);

    return () => {
      document.removeEventListener('keydown', handleTabKey);
      document.removeEventListener('focusin', handleFocusOut);
    };
  }, [isOpen]);

  // Restaura o foco quando o modal fecha
  useEffect(() => {
    return () => {
      if (!isOpen && previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen]);

  return modalRef;
};

export const useFocusTrap = (containerRef, isActive) => {
  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);

    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }, [containerRef, isActive]);
};