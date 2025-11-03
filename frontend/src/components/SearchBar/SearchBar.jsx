import React, { forwardRef, useCallback, useMemo } from 'react';
import { 
  IoSearchOutline, 
  IoCloseOutline, 
  IoTimeOutline, 
  IoFilterOutline,
  IoChevronDownOutline,
  IoRefreshOutline
} from 'react-icons/io5';
import { useSearchBar, useSearchFocus } from './useSearchBar.js';
import "./SearchBar.css";

const SearchBar = forwardRef(({
  // Props básicas (compatibilidade)
  placeholder = "Buscar...",
  onSearch,
  
  // Props avançadas
  value: externalValue,
  onChange: externalOnChange,
  onSuggestionsFetch,
  suggestions: externalSuggestions,
  
  // Configurações funcionais
  debounceDelay = 300,
  minSearchLength = 1,
  maxResults = 10,
  enableHistory = true,
  enableCache = true,
  enableSuggestions = true,
  enableFilters = false,
  
  // Configurações visuais
  size = "medium", // compact, medium, large
  variant = "outlined", // default, outlined, filled, ghost
  theme = "auto", // light, dark, auto
  
  // Ícones e elementos visuais
  icon = "search", // search, filter, custom, none
  clearable = true,
  showHistory = true,
  showSuggestions = true,
  showFilters = false,
  showResultsCount = false,
  
  // Estados
  loading: externalLoading = false,
  disabled = false,
  error: externalError,
  
  // Filtros e categorias
  filters = [],
  categories = [],
  activeFilters = [],
  onFilterChange,
  onCategoryChange,
  
  // Eventos avançados
  onFocus,
  onBlur,
  onClear,
  onKeyDown: externalOnKeyDown,
  onSubmit,
  onSuggestionClick,
  onHistoryClick,
  
  // Configurações de acessibilidade
  "aria-label": ariaLabel = "Campo de busca",
  "aria-describedby": ariaDescribedby,
  role = "searchbox",
  
  // Estilo customizado
  className = "",
  style = {},
  inputClassName = "",
  
  // Textos customizados
  texts = {
    placeholder: "Buscar...",
    noResults: "Nenhum resultado encontrado",
    searchHistory: "Histórico de busca",
    clearHistory: "Limpar histórico",
    showMore: "Ver mais",
    searching: "Buscando...",
    error: "Erro na busca"
  },
  
  ...restProps
}, ref) => {
  // Estado controlado vs não controlado
  const isControlled = externalValue !== undefined && externalOnChange !== undefined;
  
  // Hook principal de busca (só usado se não controlado)
  const searchHook = useSearchBar({
    initialValue: externalValue || '',
    onSearch: isControlled ? undefined : onSearch,
    onSuggestionsFetch,
    debounceDelay,
    minSearchLength,
    enableHistory,
    enableCache,
    maxHistoryItems: 10
  });

  // Hook de focus
  const focusHook = useSearchFocus();

  // Estados unificados (controlado vs não controlado)
  const value = isControlled ? externalValue : searchHook.value;
  const suggestions = externalSuggestions || searchHook.suggestions;
  const isLoading = externalLoading || searchHook.isLoading;
  const error = externalError || searchHook.error;
  const history = enableHistory ? searchHook.history : [];

  // Handlers unificados
  const handleChange = useCallback((e) => {
    const newValue = e.target.value;
    
    if (isControlled) {
      externalOnChange?.(newValue);
    } else {
      searchHook.handleChange(newValue);
    }
  }, [isControlled, externalOnChange, searchHook.handleChange]);

  const handleKeyDown = useCallback((e) => {
    externalOnKeyDown?.(e);
    if (!isControlled) {
      searchHook.handleKeyDown(e);
    }
  }, [externalOnKeyDown, isControlled, searchHook.handleKeyDown]);

  const handleSubmit = useCallback((e) => {
    e?.preventDefault();
    onSubmit?.(value);
    if (!isControlled) {
      searchHook.handleSubmit();
    }
  }, [onSubmit, value, isControlled, searchHook.handleSubmit]);

  const handleClear = useCallback(() => {
    onClear?.();
    if (!isControlled) {
      searchHook.handleClear();
    }
    focusHook.focus();
  }, [onClear, isControlled, searchHook.handleClear, focusHook.focus]);

  const handleSuggestionClick = useCallback((suggestion, index) => {
    onSuggestionClick?.(suggestion, index);
    if (!isControlled) {
      searchHook.handleSuggestionClick(suggestion, index);
    }
  }, [onSuggestionClick, isControlled, searchHook.handleSuggestionClick]);

  const handleFocus = useCallback((e) => {
    onFocus?.(e);
    focusHook.handleFocus(e);
    if (!isControlled && enableSuggestions && searchHook.setIsOpen) {
      searchHook.setIsOpen(true);
    }
  }, [onFocus, focusHook.handleFocus, isControlled, enableSuggestions, searchHook.setIsOpen]);

  const handleBlur = useCallback((e) => {
    onBlur?.(e);
    focusHook.handleBlur(e);
  }, [onBlur, focusHook.handleBlur]);

  // Classes CSS dinâmicas
  const containerClasses = [
    'search-bar',
    `search-bar-${size}`,
    `search-bar-${variant}`,
    `search-bar-${theme}`,
    disabled ? 'search-bar-disabled' : '',
    error ? 'search-bar-error' : '',
    isLoading ? 'search-bar-loading' : '',
    focusHook.isFocused ? 'search-bar-focused' : '',
    value ? 'search-bar-has-value' : '',
    className
  ].filter(Boolean).join(' ');

  const inputClasses = [
    'search-input',
    inputClassName
  ].filter(Boolean).join(' ');

  // Renderiza ícone
  const renderIcon = () => {
    if (icon === 'none') return null;
    
    const iconProps = {
      className: 'search-icon',
      'aria-hidden': true
    };

    if (isLoading) {
      return <IoRefreshOutline {...iconProps} className={`${iconProps.className} search-icon-loading`} />;
    }

    switch (icon) {
      case 'filter':
        return <IoFilterOutline {...iconProps} />;
      case 'search':
      default:
        return <IoSearchOutline {...iconProps} />;
    }
  };

  // Renderiza botão clear
  const renderClearButton = () => {
    if (!clearable || !value || disabled) return null;

    return (
      <button
        type="button"
        className="search-clear"
        onClick={handleClear}
        aria-label="Limpar busca"
        tabIndex={-1}
      >
        <IoCloseOutline />
      </button>
    );
  };

  // Renderiza sugestões
  const renderSuggestions = () => {
    if (!enableSuggestions || !focusHook.isFocused || disabled) return null;
    
    const hasContent = suggestions.length > 0 || history.length > 0;
    if (!hasContent && !isLoading && !error) return null;

    return (
      <div className="search-dropdown" role="listbox">
        {/* Loading */}
        {isLoading && (
          <div className="search-dropdown-loading">
            <IoRefreshOutline className="search-loading-spinner" />
            <span>{texts.searching}</span>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="search-dropdown-error">
            <span>{texts.error}: {error}</span>
          </div>
        )}

        {/* Sugestões */}
        {suggestions.length > 0 && (
          <div className="search-suggestions">
            {suggestions.slice(0, maxResults).map((suggestion, index) => {
              const text = suggestion.text || suggestion;
              const highlighted = (() => {
                if (!value || !text) return text;
                const regex = new RegExp(`(${value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
                return text.replace(regex, '<mark>$1</mark>');
              })();
              
              return (
                <button
                  key={`suggestion-${index}`}
                  className={`search-suggestion ${searchHook.selectedIndex === index ? 'selected' : ''}`}
                  onClick={() => handleSuggestionClick(suggestion, index)}
                  role="option"
                  aria-selected={searchHook.selectedIndex === index}
                >
                  <IoSearchOutline className="suggestion-icon" />
                  <span 
                    className="suggestion-text"
                    dangerouslySetInnerHTML={{ __html: highlighted }}
                  />
                  {suggestion.category && (
                    <span className="suggestion-category">{suggestion.category}</span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Histórico */}
        {showHistory && history.length > 0 && (
          <div className="search-history">
            <div className="search-history-header">
              <span className="search-history-title">{texts.searchHistory}</span>
              <button 
                className="search-history-clear"
                onClick={searchHook.clearHistory}
                aria-label={texts.clearHistory}
              >
                {texts.clearHistory}
              </button>
            </div>
            {history.slice(0, 5).map((item, index) => (
              <button
                key={`history-${index}`}
                className="search-history-item"
                onClick={() => handleSuggestionClick(item, suggestions.length + index)}
                role="option"
              >
                <IoTimeOutline className="history-icon" />
                <span className="history-text">{item}</span>
              </button>
            ))}
          </div>
        )}

        {/* Sem resultados */}
        {!isLoading && !error && suggestions.length === 0 && value.length >= minSearchLength && (
          <div className="search-no-results">
            <span>{texts.noResults}</span>
          </div>
        )}
      </div>
    );
  };

  // Renderiza filtros (se habilitado)
  const renderFilters = () => {
    if (!enableFilters || !showFilters || filters.length === 0) return null;

    return (
      <div className="search-filters">
        {filters.map((filter, index) => (
          <button
            key={`filter-${index}`}
            className={`search-filter ${activeFilters.includes(filter.value) ? 'active' : ''}`}
            onClick={() => onFilterChange?.(filter)}
          >
            {filter.label}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div 
      className={containerClasses} 
      style={style}
      {...restProps}
    >
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-container">
          {/* Ícone */}
          {renderIcon()}

          {/* Input principal */}
          <input
            ref={ref || focusHook.inputRef}
            type="text"
            className={inputClasses}
            placeholder={placeholder || texts.placeholder}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled}
            aria-label={ariaLabel}
            aria-describedby={ariaDescribedby}
            aria-expanded={focusHook.isFocused && enableSuggestions}
            aria-autocomplete={enableSuggestions ? "list" : "none"}
            role={role}
            autoComplete="off"
            spellCheck="false"
          />

          {/* Botão clear */}
          {renderClearButton()}

          {/* Indicador de loading inline */}
          {isLoading && (
            <div className="search-loading-inline">
              <IoRefreshOutline className="search-loading-spinner" />
            </div>
          )}
        </div>

        {/* Filtros */}
        {renderFilters()}
      </form>

      {/* Dropdown de sugestões */}
      {renderSuggestions()}
    </div>
  );
});

SearchBar.displayName = 'SearchBar';

export default SearchBar;
