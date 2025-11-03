import { useState, useEffect, useCallback, useMemo, useRef } from 'react';

// Hook principal para gerenciar estado de busca
export const useSearchBar = ({
  initialValue = '',
  onSearch,
  onSuggestionsFetch,
  debounceDelay = 300,
  minSearchLength = 1,
  enableHistory = true,
  historyKey = 'searchHistory',
  maxHistoryItems = 10,
  enableCache = true,
  cacheTimeout = 5 * 60 * 1000, // 5 minutos
} = {}) => {
  const [value, setValue] = useState(initialValue);
  const [debouncedValue, setDebouncedValue] = useState(initialValue);
  const [suggestions, setSuggestions] = useState([]);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const debounceRef = useRef(null);
  const cacheRef = useRef(new Map());
  const abortControllerRef = useRef(null);

  // Carrega histórico do localStorage
  useEffect(() => {
    if (enableHistory) {
      try {
        const savedHistory = localStorage.getItem(historyKey);
        if (savedHistory) {
          setHistory(JSON.parse(savedHistory));
        }
      } catch (error) {
        console.warn('Erro ao carregar histórico de busca:', error);
      }
    }
  }, [enableHistory, historyKey]);

  // Debounce do valor de busca
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, debounceDelay);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [value, debounceDelay]);

  // Executa busca quando valor debounced muda
  useEffect(() => {
    if (debouncedValue.length >= minSearchLength) {
      performSearch(debouncedValue);
    } else {
      setSuggestions([]);
      setIsLoading(false);
      setError(null);
    }
  }, [debouncedValue, minSearchLength]);

  // Função para executar busca
  const performSearch = useCallback(async (searchValue) => {
    if (!searchValue.trim()) return;

    // Cancela busca anterior se existir
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Verifica cache primeiro
    if (enableCache && cacheRef.current.has(searchValue)) {
      const cached = cacheRef.current.get(searchValue);
      if (Date.now() - cached.timestamp < cacheTimeout) {
        setSuggestions(cached.data);
        setError(null);
        return;
      } else {
        cacheRef.current.delete(searchValue);
      }
    }

    setIsLoading(true);
    setError(null);
    
    try {
      abortControllerRef.current = new AbortController();
      
      let results = [];
      
      if (onSuggestionsFetch) {
        results = await onSuggestionsFetch(searchValue, {
          signal: abortControllerRef.current.signal
        });
      }
      
      // Cache dos resultados
      if (enableCache) {
        cacheRef.current.set(searchValue, {
          data: results,
          timestamp: Date.now()
        });
      }
      
      setSuggestions(results || []);
      onSearch?.(searchValue, results);
      
    } catch (error) {
      if (error.name !== 'AbortError') {
        setError(error.message);
        console.error('Erro na busca:', error);
      }
    } finally {
      setIsLoading(false);
    }
  }, [onSearch, onSuggestionsFetch, enableCache, cacheTimeout]);

  // Adiciona item ao histórico
  const addToHistory = useCallback((searchValue) => {
    if (!enableHistory || !searchValue.trim()) return;

    setHistory(prev => {
      const filtered = prev.filter(item => item !== searchValue);
      const newHistory = [searchValue, ...filtered].slice(0, maxHistoryItems);
      
      try {
        localStorage.setItem(historyKey, JSON.stringify(newHistory));
      } catch (error) {
        console.warn('Erro ao salvar histórico:', error);
      }
      
      return newHistory;
    });
  }, [enableHistory, historyKey, maxHistoryItems]);

  // Handlers
  const handleChange = useCallback((newValue) => {
    setValue(newValue);
    setSelectedIndex(-1);
    setIsOpen(newValue.length > 0);
  }, []);

  const handleSubmit = useCallback(() => {
    if (value.trim()) {
      addToHistory(value);
      performSearch(value);
      setIsOpen(false);
      setSelectedIndex(-1);
    }
  }, [value, addToHistory, performSearch]);

  const handleSuggestionClick = useCallback((suggestion, index) => {
    setValue(suggestion.text || suggestion);
    addToHistory(suggestion.text || suggestion);
    onSearch?.(suggestion.text || suggestion, [suggestion]);
    setIsOpen(false);
    setSelectedIndex(-1);
  }, [addToHistory, onSearch]);

  const handleKeyDown = useCallback((event) => {
    const visibleItems = isOpen ? [...suggestions, ...history] : [];
    
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setSelectedIndex(prev => 
          prev < visibleItems.length - 1 ? prev + 1 : -1
        );
        break;
        
      case 'ArrowUp':
        event.preventDefault();
        setSelectedIndex(prev => 
          prev > -1 ? prev - 1 : visibleItems.length - 1
        );
        break;
        
      case 'Enter':
        event.preventDefault();
        if (selectedIndex >= 0 && visibleItems[selectedIndex]) {
          const item = visibleItems[selectedIndex];
          handleSuggestionClick(item, selectedIndex);
        } else {
          handleSubmit();
        }
        break;
        
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
        
      case 'Tab':
        if (selectedIndex >= 0 && visibleItems[selectedIndex]) {
          event.preventDefault();
          const item = visibleItems[selectedIndex];
          setValue(item.text || item);
        }
        break;
        
      default:
        break;
    }
  }, [suggestions, history, isOpen, selectedIndex, handleSuggestionClick, handleSubmit]);

  const handleClear = useCallback(() => {
    setValue('');
    setDebouncedValue('');
    setSuggestions([]);
    setError(null);
    setIsOpen(false);
    setSelectedIndex(-1);
    onSearch?.('', []);
  }, [onSearch]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem(historyKey);
    } catch (error) {
      console.warn('Erro ao limpar histórico:', error);
    }
  }, [historyKey]);

  const clearCache = useCallback(() => {
    cacheRef.current.clear();
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    // Estados
    value,
    debouncedValue,
    suggestions,
    history,
    isLoading,
    error,
    isOpen,
    selectedIndex,
    
    // Handlers
    handleChange,
    handleSubmit,
    handleSuggestionClick,
    handleKeyDown,
    handleClear,
    setValue,
    setIsOpen,
    setSelectedIndex,
    
    // Utilities
    clearHistory,
    clearCache,
    addToHistory,
    
    // Estado computado
    hasValue: value.length > 0,
    hasResults: suggestions.length > 0,
    hasHistory: history.length > 0,
    canSearch: value.length >= minSearchLength
  };
};

// Hook para debounce genérico
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Hook para highlight de termos de busca
export const useHighlight = (text, searchTerm) => {
  return useMemo(() => {
    if (!searchTerm || !text) return text;
    
    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }, [text, searchTerm]);
};

// Hook para gerenciar focus
export const useSearchFocus = () => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    // Pequeno delay para permitir clicks em sugestões
    setTimeout(() => setIsFocused(false), 150);
  }, []);

  const focus = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const blur = useCallback(() => {
    inputRef.current?.blur();
  }, []);

  return {
    isFocused,
    inputRef,
    handleFocus,
    handleBlur,
    focus,
    blur
  };
};

// Hook para filtros avançados
export const useSearchFilters = (initialFilters = {}) => {
  const [filters, setFilters] = useState(initialFilters);
  const [activeFilters, setActiveFilters] = useState([]);

  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const clearFilter = useCallback((key) => {
    setFilters(prev => {
      const { [key]: removed, ...rest } = prev;
      return rest;
    });
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters({});
    setActiveFilters([]);
  }, []);

  const toggleFilter = useCallback((key, value) => {
    setActiveFilters(prev => {
      const exists = prev.some(f => f.key === key && f.value === value);
      if (exists) {
        return prev.filter(f => !(f.key === key && f.value === value));
      } else {
        return [...prev, { key, value }];
      }
    });
  }, []);

  const hasActiveFilters = useMemo(() => {
    return activeFilters.length > 0 || Object.keys(filters).length > 0;
  }, [activeFilters, filters]);

  return {
    filters,
    activeFilters,
    updateFilter,
    clearFilter,
    clearAllFilters,
    toggleFilter,
    hasActiveFilters
  };
};