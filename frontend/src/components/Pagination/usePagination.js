import React, { useState, useMemo, useCallback, useEffect } from 'react';

export const usePagination = ({
  totalItems = 0,
  defaultItemsPerPage = 10,
  defaultCurrentPage = 1,
  maxPageNumbers = 7
} = {}) => {
  const [currentPage, setCurrentPage] = useState(defaultCurrentPage);
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);

  // Cálculos básicos
  const totalPages = useMemo(() => {
    return Math.ceil(totalItems / itemsPerPage);
  }, [totalItems, itemsPerPage]);

  // Navegação
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;
  const canGoFirst = currentPage > 1;
  const canGoLast = currentPage < totalPages;

  // Informações dos itens
  const startItem = useMemo(() => {
    return totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  }, [currentPage, itemsPerPage, totalItems]);

  const endItem = useMemo(() => {
    const calculatedEnd = currentPage * itemsPerPage;
    return Math.min(calculatedEnd, totalItems);
  }, [currentPage, itemsPerPage, totalItems]);

  // Gera array de números de página com truncagem inteligente
  const pageNumbers = useMemo(() => {
    if (totalPages <= maxPageNumbers) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const delta = Math.floor(maxPageNumbers / 2);
    const range = [];
    const rangeWithDots = [];

    // Lógica para mostrar páginas com "..." quando necessário
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  }, [currentPage, totalPages, maxPageNumbers]);

  // Handlers
  const setPage = useCallback((page) => {
    const validPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(validPage);
    return validPage;
  }, [totalPages]);

  const goToFirst = useCallback(() => setPage(1), [setPage]);
  const goToLast = useCallback(() => setPage(totalPages), [setPage, totalPages]);
  const goToPrevious = useCallback(() => setPage(currentPage - 1), [setPage, currentPage]);
  const goToNext = useCallback(() => setPage(currentPage + 1), [setPage, currentPage]);

  const changeItemsPerPage = useCallback((newItemsPerPage) => {
    const newTotalPages = Math.ceil(totalItems / newItemsPerPage);
    const newCurrentPage = Math.min(currentPage, newTotalPages);
    
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(newCurrentPage);
    
    return { newCurrentPage, newTotalPages };
  }, [totalItems, currentPage]);

  const jumpToPage = useCallback((page) => {
    const pageNumber = parseInt(page, 10);
    if (isNaN(pageNumber)) return false;
    
    const validPage = setPage(pageNumber);
    return validPage === pageNumber;
  }, [setPage]);

  // Reset para primeira página quando totalItems muda
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  return {
    // Estados
    currentPage,
    totalPages,
    itemsPerPage,
    totalItems,
    
    // Informações calculadas
    startItem,
    endItem,
    pageNumbers,
    
    // Capacidades de navegação
    canGoPrevious,
    canGoNext,
    canGoFirst,
    canGoLast,
    
    // Handlers de navegação
    setPage,
    goToFirst,
    goToLast,
    goToPrevious,
    goToNext,
    jumpToPage,
    
    // Configurações
    changeItemsPerPage,
    setItemsPerPage
  };
};

export const usePaginationKeyboard = (pagination, isActive = true) => {
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (event) => {
      // Evita conflitos quando estiver em input
      if (event.target.tagName === 'INPUT') return;

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          if (pagination.canGoPrevious) pagination.goToPrevious();
          break;
        case 'ArrowRight':
          event.preventDefault();
          if (pagination.canGoNext) pagination.goToNext();
          break;
        case 'Home':
          event.preventDefault();
          if (pagination.canGoFirst) pagination.goToFirst();
          break;
        case 'End':
          event.preventDefault();
          if (pagination.canGoLast) pagination.goToLast();
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [pagination, isActive]);
};

export const usePaginationUrl = (pagination, urlKey = 'page') => {
  const updateUrl = useCallback((page) => {
    const url = new URL(window.location);
    if (page === 1) {
      url.searchParams.delete(urlKey);
    } else {
      url.searchParams.set(urlKey, page.toString());
    }
    window.history.replaceState({}, '', url);
  }, [urlKey]);

  // Sincroniza com URL ao carregar
  useEffect(() => {
    const url = new URL(window.location);
    const pageFromUrl = parseInt(url.searchParams.get(urlKey) || '1', 10);
    if (pageFromUrl !== pagination.currentPage) {
      pagination.setPage(pageFromUrl);
    }
  }, []);

  // Atualiza URL quando página muda
  useEffect(() => {
    updateUrl(pagination.currentPage);
  }, [pagination.currentPage, updateUrl]);

  return { updateUrl };
};