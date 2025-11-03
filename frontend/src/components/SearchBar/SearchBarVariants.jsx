import React from 'react';
import SearchBar from './SearchBar';
import { useSearchBar } from './useSearchBar';

// Componente SearchBar compacto para espaços reduzidos
export const CompactSearchBar = (props) => {
  return (
    <SearchBar
      size="compact"
      variant="outlined"
      enableHistory={false}
      showSuggestions={false}
      {...props}
    />
  );
};

// SearchBar com sugestões e histórico completo
export const FullSearchBar = ({
  onSuggestionsFetch,
  suggestions,
  categories,
  ...props
}) => {
  return (
    <SearchBar
      size="medium"
      variant="outlined"
      enableSuggestions={true}
      enableHistory={true}
      showHistory={true}
      showSuggestions={true}
      onSuggestionsFetch={onSuggestionsFetch}
      suggestions={suggestions}
      categories={categories}
      debounceDelay={300}
      maxResults={10}
      {...props}
    />
  );
};

// SearchBar com filtros avançados
export const FilterableSearchBar = ({
  filters = [],
  activeFilters = [],
  onFilterChange,
  ...props
}) => {
  return (
    <SearchBar
      size="medium"
      variant="outlined"
      enableFilters={true}
      showFilters={true}
      filters={filters}
      activeFilters={activeFilters}
      onFilterChange={onFilterChange}
      icon="filter"
      {...props}
    />
  );
};

// SearchBar premium com todas as funcionalidades
export const PremiumSearchBar = ({
  suggestions,
  onSuggestionsFetch,
  filters = [],
  categories = [],
  ...props
}) => {
  return (
    <SearchBar
      size="large"
      variant="filled"
      enableSuggestions={true}
      enableHistory={true}
      enableFilters={filters.length > 0}
      showHistory={true}
      showSuggestions={true}
      showFilters={filters.length > 0}
      clearable={true}
      debounceDelay={200}
      maxResults={15}
      suggestions={suggestions}
      onSuggestionsFetch={onSuggestionsFetch}
      filters={filters}
      categories={categories}
      {...props}
    />
  );
};

// Hook personalizado para SearchBar com estado completo
export const useAdvancedSearch = ({
  initialFilters = [],
  initialCategories = [],
  onSearch,
  onSuggestionsFetch,
  debounceDelay = 300
} = {}) => {
  const [filters, setFilters] = React.useState(initialFilters);
  const [categories, setCategories] = React.useState(initialCategories);
  const [activeFilters, setActiveFilters] = React.useState([]);
  const [selectedCategory, setSelectedCategory] = React.useState('all');

  const searchHook = useSearchBar({
    onSearch,
    onSuggestionsFetch,
    debounceDelay,
    enableHistory: true,
    enableCache: true
  });

  const handleFilterChange = React.useCallback((filter) => {
    setActiveFilters(prev => {
      const exists = prev.some(f => f.value === filter.value);
      if (exists) {
        return prev.filter(f => f.value !== filter.value);
      } else {
        return [...prev, filter];
      }
    });
  }, []);

  const handleCategoryChange = React.useCallback((category) => {
    setSelectedCategory(category);
  }, []);

  const clearAllFilters = React.useCallback(() => {
    setActiveFilters([]);
    setSelectedCategory('all');
  }, []);

  const getFilteredSuggestions = React.useCallback((suggestions) => {
    if (!suggestions) return [];

    let filtered = [...suggestions];

    // Filtrar por categoria
    if (selectedCategory && selectedCategory !== 'all') {
      filtered = filtered.filter(s => s.category === selectedCategory);
    }

    // Aplicar filtros ativos
    if (activeFilters.length > 0) {
      filtered = filtered.filter(suggestion => {
        return activeFilters.every(filter => {
          return suggestion[filter.key] === filter.value ||
                 suggestion.tags?.includes(filter.value);
        });
      });
    }

    return filtered;
  }, [selectedCategory, activeFilters]);

  return {
    ...searchHook,
    
    // Estados de filtro
    filters,
    categories,
    activeFilters,
    selectedCategory,
    
    // Handlers de filtro
    handleFilterChange,
    handleCategoryChange,
    clearAllFilters,
    setFilters,
    setCategories,
    
    // Utilitários
    getFilteredSuggestions,
    hasActiveFilters: activeFilters.length > 0,
    
    // Props para o componente
    searchBarProps: {
      value: searchHook.value,
      onChange: searchHook.handleChange,
      onKeyDown: searchHook.handleKeyDown,
      onClear: searchHook.handleClear,
      suggestions: getFilteredSuggestions(searchHook.suggestions),
      loading: searchHook.isLoading,
      error: searchHook.error,
      filters,
      activeFilters,
      onFilterChange: handleFilterChange,
      categories,
      selectedCategory,
      onCategoryChange: handleCategoryChange
    }
  };
};

// Componente para busca com tabs/categorias
export const CategorySearchBar = ({
  categories = [],
  selectedCategory = 'all',
  onCategoryChange,
  ...props
}) => {
  return (
    <div className="category-search-container">
      {categories.length > 0 && (
        <div className="search-categories">
          <button
            className={`category-tab ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => onCategoryChange?.('all')}
          >
            Todos
          </button>
          {categories.map((category, index) => (
            <button
              key={index}
              className={`category-tab ${selectedCategory === category.value ? 'active' : ''}`}
              onClick={() => onCategoryChange?.(category.value)}
            >
              {category.label}
            </button>
          ))}
        </div>
      )}
      
      <SearchBar
        variant="ghost"
        enableSuggestions={true}
        enableHistory={true}
        {...props}
      />
      
      <style jsx>{`
        .category-search-container {
          width: 100%;
        }
        
        .search-categories {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }
        
        .category-tab {
          padding: 0.5rem 1rem;
          border: 1px solid #cbd5e1;
          border-radius: 9999px;
          background: #ffffff;
          color: #475569;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s ease;
          white-space: nowrap;
        }
        
        .category-tab:hover {
          background: #f1f5f9;
          border-color: #94a3b8;
        }
        
        .category-tab.active {
          background: #2563eb;
          border-color: #2563eb;
          color: #ffffff;
        }
      `}</style>
    </div>
  );
};

// Componente para busca global (toda a aplicação)
export const GlobalSearchBar = ({
  placeholder = "Buscar em tudo...",
  shortcuts = true,
  ...props
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');

  // Shortcut Ctrl+K para abrir busca global
  React.useEffect(() => {
    if (!shortcuts) return;

    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);

  if (isOpen) {
    return (
      <div className="global-search-overlay">
        <div className="global-search-modal">
          <SearchBar
            size="large"
            variant="filled"
            placeholder={placeholder}
            value={query}
            onChange={setQuery}
            enableSuggestions={true}
            enableHistory={true}
            autoFocus={true}
            onBlur={() => setIsOpen(false)}
            {...props}
          />
        </div>
        
        <style jsx>{`
          .global-search-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(4px);
            z-index: 2000;
            display: flex;
            align-items: flex-start;
            justify-content: center;
            padding: 10vh 1rem;
          }
          
          .global-search-modal {
            width: 100%;
            max-width: 600px;
            background: #ffffff;
            border-radius: 0.75rem;
            padding: 1.5rem;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          }
        `}</style>
      </div>
    );
  }

  return (
    <button
      className="global-search-trigger"
      onClick={() => setIsOpen(true)}
    >
      <span>{placeholder}</span>
      {shortcuts && <kbd>Ctrl+K</kbd>}
      
      <style jsx>{`
        .global-search-trigger {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid #cbd5e1;
          border-radius: 0.5rem;
          background: #f8fafc;
          color: #64748b;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        
        .global-search-trigger:hover {
          background: #f1f5f9;
          border-color: #94a3b8;
        }
        
        .global-search-trigger kbd {
          padding: 0.25rem 0.5rem;
          background: #e2e8f0;
          border: 1px solid #cbd5e1;
          border-radius: 0.25rem;
          font-size: 0.75rem;
          color: #475569;
        }
      `}</style>
    </button>
  );
};