import React from 'react';

export const PaginationInfo = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  startItem,
  endItem,
  texts = {
    showing: "Mostrando",
    to: "até",
    of: "de",
    items: "itens",
    page: "Página",
    pages: "páginas"
  },
  format = "items", // "items", "pages", "both"
  className = "",
  style = {}
}) => {
  const calculatedStartItem = startItem || (totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1);
  const calculatedEndItem = endItem || Math.min(currentPage * itemsPerPage, totalItems);

  const renderItemsInfo = () => (
    <span>
      {texts.showing} {calculatedStartItem} {texts.to} {calculatedEndItem} {texts.of} {totalItems} {texts.items}
    </span>
  );

  const renderPagesInfo = () => (
    <span>
      {texts.page} {currentPage} {texts.of} {totalPages} {texts.pages}
    </span>
  );

  const renderBothInfo = () => (
    <span>
      {renderItemsInfo()} ({renderPagesInfo()})
    </span>
  );

  const renderContent = () => {
    switch (format) {
      case "pages":
        return renderPagesInfo();
      case "both":
        return renderBothInfo();
      case "items":
      default:
        return renderItemsInfo();
    }
  };

  return (
    <div className={`pagination-info ${className}`} style={style}>
      <span className="pagination-info-text">
        {renderContent()}
      </span>
    </div>
  );
};

export const PaginationSizeSelector = ({
  value,
  options = [10, 20, 50, 100],
  onChange,
  disabled = false,
  texts = {
    itemsPerPage: "itens por página"
  },
  className = "",
  style = {}
}) => {
  return (
    <div className={`pagination-items-per-page ${className}`} style={style}>
      <label htmlFor="pagination-size-select" className="pagination-label">
        {texts.itemsPerPage}:
      </label>
      <select
        id="pagination-size-select"
        value={value}
        onChange={(e) => onChange?.(parseInt(e.target.value, 10))}
        className="pagination-select"
        disabled={disabled}
      >
        {options.map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export const PaginationJump = ({
  currentPage,
  totalPages,
  onJump,
  disabled = false,
  texts = {
    jumpToPage: "Ir para página",
    go: "Ir"
  },
  className = "",
  style = {}
}) => {
  const [value, setValue] = React.useState('');
  const [isActive, setIsActive] = React.useState(false);

  const handleSubmit = React.useCallback(() => {
    const pageNum = parseInt(value, 10);
    if (isNaN(pageNum) || pageNum < 1 || pageNum > totalPages) {
      setValue('');
      return;
    }
    
    onJump?.(pageNum);
    setValue('');
    setIsActive(false);
  }, [value, totalPages, onJump]);

  const handleKeyDown = React.useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === 'Escape') {
      setValue('');
      setIsActive(false);
    }
  }, [handleSubmit]);

  return (
    <div className={`pagination-jump ${className}`} style={style}>
      {!isActive ? (
        <button
          className="pagination-jump-trigger"
          onClick={() => setIsActive(true)}
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
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => {
              setTimeout(() => setIsActive(false), 150); // Pequeno delay para permitir click no botão
            }}
            placeholder={`1-${totalPages}`}
            className="pagination-jump-field"
            autoFocus
            aria-label={`${texts.jumpToPage} (1-${totalPages})`}
          />
          <button
            className="pagination-jump-go"
            onClick={handleSubmit}
            disabled={disabled}
            style={{
              marginLeft: '0.5rem',
              padding: '0.5rem 1rem',
              border: '1px solid #cbd5e1',
              borderRadius: '0.5rem',
              background: '#ffffff',
              color: '#475569',
              fontSize: '0.875rem',
              cursor: 'pointer'
            }}
          >
            {texts.go}
          </button>
        </div>
      )}
    </div>
  );
};

export const SimplePagination = ({
  currentPage,
  totalPages,
  onPageChange,
  disabled = false,
  showInfo = true,
  texts = {
    previous: "Anterior",
    next: "Próxima",
    page: "Página",
    of: "de"
  },
  className = "",
  style = {}
}) => {
  return (
    <div className={`pagination-simple ${className}`} style={style}>
      <button
        className="pagination-nav pagination-previous"
        onClick={() => onPageChange?.(currentPage - 1)}
        disabled={disabled || currentPage === 1}
        aria-label={texts.previous}
      >
        {texts.previous}
      </button>

      {showInfo && (
        <div className="pagination-indicator">
          <span className="pagination-indicator-text">
            {texts.page} {currentPage} {texts.of} {totalPages}
          </span>
        </div>
      )}

      <button
        className="pagination-nav pagination-next"
        onClick={() => onPageChange?.(currentPage + 1)}
        disabled={disabled || currentPage === totalPages}
        aria-label={texts.next}
      >
        {texts.next}
      </button>
    </div>
  );
};