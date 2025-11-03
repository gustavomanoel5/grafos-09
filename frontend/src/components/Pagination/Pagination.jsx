import React, { useState, useCallback, forwardRef } from 'react';
import { 
  IoChevronBackOutline, 
  IoChevronForwardOutline,
  IoPlayBackOutline,
  IoPlayForwardOutline,
  IoEllipsisHorizontalOutline
} from 'react-icons/io5';
import { usePagination, usePaginationKeyboard } from './usePagination';
import "./Pagination.css";

const Pagination = forwardRef(({
  // Props básicas (compatibilidade)
  currentPage: externalCurrentPage,
  totalPages: externalTotalPages,
  onPageChange,
  
  // Props avançadas
  totalItems = 0,
  itemsPerPage = 10,
  onItemsPerPageChange,
  
  // Configurações visuais
  size = "medium", // compact, medium, large
  variant = "default", // default, minimal, outlined, filled
  theme = "auto", // light, dark, auto
  
  // Funcionalidades
  showFirstLast = true,
  showPageNumbers = true,
  showItemsPerPage = true,
  showItemsInfo = true,
  showJumpToPage = false,
  maxPageNumbers = 7,
  itemsPerPageOptions = [10, 20, 50, 100],
  
  // Comportamento
  disabled = false,
  keyboardNavigation = true,
  responsive = true,
  
  // Textos customizados
  texts = {
    first: "Primeira",
    previous: "Anterior", 
    next: "Próxima",
    last: "Última",
    page: "Página",
    of: "de",
    items: "itens",
    showing: "Mostrando",
    to: "até",
    itemsPerPage: "itens por página",
    jumpToPage: "Ir para página"
  },
  
  // Acessibilidade
  "aria-label": ariaLabel = "Navegação de páginas",
  
  // Estilo customizado
  className = "",
  style = {},
  
  // Eventos
  onFirstPage,
  onLastPage,
  onPreviousPage,
  onNextPage,
  onJumpToPage,
  
  ...restProps
}, ref) => {
  // Estado interno para jump input
  const [jumpValue, setJumpValue] = useState('');
  const [isJumpActive, setIsJumpActive] = useState(false);

  // Determina se está em modo controlado ou não controlado
  const isControlled = externalCurrentPage !== undefined && externalTotalPages !== undefined;
  
  // Hook de paginação para modo não controlado
  const internalPagination = usePagination({
    totalItems,
    defaultItemsPerPage: itemsPerPage,
    defaultCurrentPage: externalCurrentPage || 1,
    maxPageNumbers
  });

  // Usa valores externos se controlado, senão usa valores internos
  const currentPage = isControlled ? externalCurrentPage : internalPagination.currentPage;
  const totalPages = isControlled ? externalTotalPages : internalPagination.totalPages;
  const pageNumbers = isControlled ? 
    generatePageNumbers(currentPage, totalPages, maxPageNumbers) : 
    internalPagination.pageNumbers;

  // Navegação por teclado
  usePaginationKeyboard(
    isControlled ? 
    { 
      canGoPrevious: currentPage > 1,
      canGoNext: currentPage < totalPages,
      canGoFirst: currentPage > 1,
      canGoLast: currentPage < totalPages,
      goToPrevious: () => handlePageChange(currentPage - 1),
      goToNext: () => handlePageChange(currentPage + 1),
      goToFirst: () => handlePageChange(1),
      goToLast: () => handlePageChange(totalPages)
    } : internalPagination,
    keyboardNavigation && !disabled
  );

  // Handler unificado para mudança de página
  const handlePageChange = useCallback((newPage) => {
    if (disabled || newPage < 1 || newPage > totalPages) return;
    
    if (isControlled) {
      onPageChange?.(newPage);
    } else {
      internalPagination.setPage(newPage);
      onPageChange?.(newPage);
    }
  }, [disabled, totalPages, isControlled, onPageChange, internalPagination]);

  // Handlers específicos
  const handleFirst = useCallback(() => {
    handlePageChange(1);
    onFirstPage?.(1);
  }, [handlePageChange, onFirstPage]);

  const handleLast = useCallback(() => {
    handlePageChange(totalPages);
    onLastPage?.(totalPages);
  }, [handlePageChange, onLastPage, totalPages]);

  const handlePrevious = useCallback(() => {
    const newPage = currentPage - 1;
    handlePageChange(newPage);
    onPreviousPage?.(newPage);
  }, [handlePageChange, onPreviousPage, currentPage]);

  const handleNext = useCallback(() => {
    const newPage = currentPage + 1;
    handlePageChange(newPage);
    onNextPage?.(newPage);
  }, [handlePageChange, onNextPage, currentPage]);

  // Handler para mudança de itens por página
  const handleItemsPerPageChange = useCallback((newItemsPerPage) => {
    if (isControlled) {
      onItemsPerPageChange?.(newItemsPerPage);
    } else {
      internalPagination.changeItemsPerPage(newItemsPerPage);
      onItemsPerPageChange?.(newItemsPerPage);
    }
  }, [isControlled, onItemsPerPageChange, internalPagination]);

  // Handler para jump to page
  const handleJumpToPage = useCallback(() => {
    const pageNum = parseInt(jumpValue, 10);
    if (isNaN(pageNum) || pageNum < 1 || pageNum > totalPages) {
      setJumpValue('');
      return;
    }
    
    handlePageChange(pageNum);
    onJumpToPage?.(pageNum);
    setJumpValue('');
    setIsJumpActive(false);
  }, [jumpValue, totalPages, handlePageChange, onJumpToPage]);

  // Classes CSS dinâmicas
  const paginationClasses = [
    'pagination',
    `pagination-${size}`,
    `pagination-${variant}`,
    `pagination-${theme}`,
    disabled ? 'pagination-disabled' : '',
    responsive ? 'pagination-responsive' : '',
    className
  ].filter(Boolean).join(' ');

  // Se não há páginas, não renderiza
  if (totalPages <= 1 && !showItemsInfo && !showItemsPerPage) {
    return null;
  }

  const renderPageButton = (pageNum, isActive = false) => {
    if (pageNum === '...') {
      return (
        <span key="ellipsis" className="pagination-ellipsis" aria-hidden="true">
          <IoEllipsisHorizontalOutline />
        </span>
      );
    }

    return (
      <button
        key={pageNum}
        className={`pagination-page ${isActive ? 'pagination-page-active' : ''}`}
        onClick={() => handlePageChange(pageNum)}
        disabled={disabled}
        aria-current={isActive ? 'page' : undefined}
        aria-label={`${texts.page} ${pageNum}`}
      >
        {pageNum}
      </button>
    );
  };

  const renderItemsInfo = () => {
    if (!showItemsInfo || !totalItems) return null;
    
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);
    
    return (
      <div className="pagination-info">
        <span className="pagination-info-text">
          {texts.showing} {startItem} {texts.to} {endItem} {texts.of} {totalItems} {texts.items}
        </span>
      </div>
    );
  };

  const renderItemsPerPageSelector = () => {
    if (!showItemsPerPage || itemsPerPageOptions.length <= 1) return null;

    return (
      <div className="pagination-items-per-page">
        <label htmlFor="items-per-page-select" className="pagination-label">
          {texts.itemsPerPage}:
        </label>
        <select
          id="items-per-page-select"
          value={itemsPerPage}
          onChange={(e) => handleItemsPerPageChange(parseInt(e.target.value, 10))}
          className="pagination-select"
          disabled={disabled}
        >
          {itemsPerPageOptions.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    );
  };

  const renderJumpToPage = () => {
    if (!showJumpToPage) return null;

    return (
      <div className="pagination-jump">
        {!isJumpActive ? (
          <button
            className="pagination-jump-trigger"
            onClick={() => setIsJumpActive(true)}
            disabled={disabled}
            aria-label={texts.jumpToPage}
          >
            {texts.jumpToPage}
          </button>
        ) : (
          <div className="pagination-jump-input">
            <input
              type="number"
              min="1"
              max={totalPages}
              value={jumpValue}
              onChange={(e) => setJumpValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleJumpToPage();
                if (e.key === 'Escape') setIsJumpActive(false);
              }}
              onBlur={() => setIsJumpActive(false)}
              placeholder={`1-${totalPages}`}
              className="pagination-jump-field"
              autoFocus
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <nav
      ref={ref}
      className={paginationClasses}
      style={style}
      aria-label={ariaLabel}
      role="navigation"
      {...restProps}
    >
      {/* Informações e controles superiores */}
      <div className="pagination-top">
        {renderItemsInfo()}
        {renderItemsPerPageSelector()}
        {renderJumpToPage()}
      </div>

      {/* Navegação principal */}
      <div className="pagination-navigation">
        {/* Primeira página */}
        {showFirstLast && (
          <button
            className="pagination-nav pagination-first"
            onClick={handleFirst}
            disabled={disabled || currentPage === 1}
            aria-label={texts.first}
          >
            <IoPlayBackOutline />
            <span className="pagination-nav-text">{texts.first}</span>
          </button>
        )}

        {/* Página anterior */}
        <button
          className="pagination-nav pagination-previous"
          onClick={handlePrevious}
          disabled={disabled || currentPage === 1}
          aria-label={texts.previous}
        >
          <IoChevronBackOutline />
          <span className="pagination-nav-text">{texts.previous}</span>
        </button>

        {/* Números das páginas */}
        {showPageNumbers && (
          <div className="pagination-pages">
            {pageNumbers.map(pageNum => 
              renderPageButton(pageNum, pageNum === currentPage)
            )}
          </div>
        )}

        {/* Indicador simples quando não mostra números */}
        {!showPageNumbers && (
          <div className="pagination-indicator">
            <span className="pagination-indicator-text">
              {texts.page} {currentPage} {texts.of} {totalPages}
            </span>
          </div>
        )}

        {/* Próxima página */}
        <button
          className="pagination-nav pagination-next"
          onClick={handleNext}
          disabled={disabled || currentPage === totalPages}
          aria-label={texts.next}
        >
          <span className="pagination-nav-text">{texts.next}</span>
          <IoChevronForwardOutline />
        </button>

        {/* Última página */}
        {showFirstLast && (
          <button
            className="pagination-nav pagination-last"
            onClick={handleLast}
            disabled={disabled || currentPage === totalPages}
            aria-label={texts.last}
          >
            <span className="pagination-nav-text">{texts.last}</span>
            <IoPlayForwardOutline />
          </button>
        )}
      </div>
    </nav>
  );
});

// Função auxiliar para gerar números de página (modo controlado)
function generatePageNumbers(currentPage, totalPages, maxPageNumbers) {
  if (totalPages <= maxPageNumbers) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const delta = Math.floor(maxPageNumbers / 2);
  const range = [];
  const rangeWithDots = [];

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
}

Pagination.displayName = 'Pagination';

export default Pagination;
