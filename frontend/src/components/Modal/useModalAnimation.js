import { useState, useEffect, useCallback } from 'react';

export const useModalAnimation = (isOpen, onClose, animationDuration = 300) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Força reflow para animação suave
      requestAnimationFrame(() => {
        setIsAnimating(true);
      });
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, animationDuration);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, animationDuration]);

  const handleClose = useCallback((reason = 'user') => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose?.(reason);
    }, animationDuration);
  }, [onClose, animationDuration]);

  return {
    isVisible,
    isAnimating,
    handleClose
  };
};

export const useModalState = (initialOpen = false) => {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [data, setData] = useState(null);

  const openModal = useCallback((modalData = null) => {
    setData(modalData);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setData(null);
  }, []);

  const toggleModal = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  return {
    isOpen,
    data,
    openModal,
    closeModal,
    toggleModal
  };
};

export const useClickOutside = (ref, callback, isActive = true) => {
  useEffect(() => {
    if (!isActive) return;

    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback(event);
      }
    };

    // Adiciona um pequeno delay para evitar fechamento imediato
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, callback, isActive]);
};

export const useEscapeKey = (callback, isActive = true) => {
  useEffect(() => {
    if (!isActive) return;

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        callback(event);
      }
    };

    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [callback, isActive]);
};

export const useScrollLock = (isLocked) => {
  useEffect(() => {
    if (!isLocked) return;

    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    
    // Previne scroll na página de fundo em dispositivos móveis
    const preventScroll = (e) => {
      if (e.target === document.body) {
        e.preventDefault();
      }
    };

    document.addEventListener('touchmove', preventScroll, { passive: false });

    return () => {
      document.body.style.overflow = originalStyle;
      document.removeEventListener('touchmove', preventScroll);
    };
  }, [isLocked]);
};