// Componente principal
export { default as SearchBar } from './SearchBar';
export { default } from './SearchBar';

// Hooks utilitários
export { 
  useSearchBar, 
  useDebounce, 
  useHighlight, 
  useSearchFocus, 
  useSearchFilters 
} from './useSearchBar';

// Componentes especializados
export {
  CompactSearchBar,
  FullSearchBar,
  FilterableSearchBar,
  PremiumSearchBar,
  CategorySearchBar,
  GlobalSearchBar,
  useAdvancedSearch
} from './SearchBarVariants';

// Hook personalizado para uso comum
import { useSearchBar } from './useSearchBar';

export const useSimpleSearch = (onSearch, options = {}) => {
  const {
    debounceDelay = 300,
    minSearchLength = 1,
    enableHistory = false,
    ...restOptions
  } = options;

  const searchHook = useSearchBar({
    onSearch,
    debounceDelay,
    minSearchLength,
    enableHistory,
    ...restOptions
  });

  return {
    value: searchHook.value,
    setValue: searchHook.handleChange,
    handleSubmit: searchHook.handleSubmit,
    handleClear: searchHook.handleClear,
    isLoading: searchHook.isLoading,
    error: searchHook.error,
    
    // Props para o componente
    searchProps: {
      placeholder: "Buscar...",
      value: searchHook.value,
      onChange: (value) => searchHook.handleChange({ target: { value } }),
      onSearch: searchHook.handleSubmit,
      loading: searchHook.isLoading,
      error: searchHook.error,
      clearable: true,
      onClear: searchHook.handleClear
    }
  };
};

// Utilitários para integração
export const searchUtils = {
  // Sanitiza query de busca
  sanitizeQuery: (query) => {
    return query
      .trim()
      .toLowerCase()
      .replace(/[^\w\s-]/gi, '')
      .replace(/\s+/g, ' ');
  },

  // Highlight de termos
  highlightMatches: (text, query) => {
    if (!query || !text) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  },

  // Calcula relevância de resultados
  calculateRelevance: (item, query) => {
    const searchFields = ['title', 'name', 'description', 'content'];
    let score = 0;
    
    searchFields.forEach(field => {
      if (item[field]) {
        const text = item[field].toLowerCase();
        const searchQuery = query.toLowerCase();
        
        // Exact match gets highest score
        if (text === searchQuery) {
          score += 100;
        }
        // Starts with query gets high score
        else if (text.startsWith(searchQuery)) {
          score += 50;
        }
        // Contains query gets medium score
        else if (text.includes(searchQuery)) {
          score += 25;
        }
        
        // Bonus for shorter text (more relevant)
        if (text.length < 50) {
          score += 5;
        }
      }
    });
    
    return score;
  },

  // Ordena resultados por relevância
  sortByRelevance: (results, query) => {
    return results
      .map(item => ({
        ...item,
        _relevance: searchUtils.calculateRelevance(item, query)
      }))
      .sort((a, b) => b._relevance - a._relevance)
      .map(({ _relevance, ...item }) => item);
  },

  // Filtra resultados duplicados
  deduplicateResults: (results, keyField = 'id') => {
    const seen = new Set();
    return results.filter(item => {
      const key = item[keyField];
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  },

  // Agrupa resultados por categoria
  groupByCategory: (results, categoryField = 'category') => {
    const groups = {};
    
    results.forEach(item => {
      const category = item[categoryField] || 'Outros';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(item);
    });
    
    return groups;
  },

  // Formata sugestões para exibição
  formatSuggestions: (results, query) => {
    return results.map(item => ({
      id: item.id,
      text: item.title || item.name || item.text,
      category: item.category,
      description: item.description,
      highlighted: searchUtils.highlightMatches(
        item.title || item.name || item.text, 
        query
      ),
      data: item
    }));
  }
};