import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';

// Hook principal para gerenciar estado da tabela
export const useTable = ({
  data = [],
  columns = [],
  initialSortBy,
  initialSortOrder = 'asc',
  initialPageSize = 10,
  initialPage = 1,
  enableSorting = true,
  enableFiltering = false,
  enableSelection = false,
  enablePagination = false,
  enableVirtualScroll = false,
  itemHeight = 50,
  containerHeight = 400
} = {}) => {
  // Estados básicos
  const [sortBy, setSortBy] = useState(initialSortBy);
  const [sortOrder, setSortOrder] = useState(initialSortOrder);
  const [filters, setFilters] = useState({});
  const [globalFilter, setGlobalFilter] = useState('');
  const [selectedRows, setSelectedRows] = useState(new Set());
  
  // Estados de paginação
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  
  // Estados UI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Ref para virtual scrolling
  const scrollElementRef = useRef(null);
  const [scrollTop, setScrollTop] = useState(0);

  // Dados filtrados
  const filteredData = useMemo(() => {
    let filtered = [...data];

    // Filtro global
    if (globalFilter) {
      filtered = filtered.filter(row => {
        return columns.some(column => {
          const value = column.accessor ? row[column.accessor] : '';
          return String(value).toLowerCase().includes(globalFilter.toLowerCase());
        });
      });
    }

    // Filtros por coluna
    Object.keys(filters).forEach(key => {
      const filterValue = filters[key];
      if (filterValue !== undefined && filterValue !== '') {
        filtered = filtered.filter(row => {
          const cellValue = row[key];
          if (typeof filterValue === 'object' && filterValue.type) {
            // Filtros avançados
            switch (filterValue.type) {
              case 'contains':
                return String(cellValue).toLowerCase().includes(String(filterValue.value).toLowerCase());
              case 'equals':
                return cellValue === filterValue.value;
              case 'starts':
                return String(cellValue).toLowerCase().startsWith(String(filterValue.value).toLowerCase());
              case 'ends':
                return String(cellValue).toLowerCase().endsWith(String(filterValue.value).toLowerCase());
              case 'greater':
                return Number(cellValue) > Number(filterValue.value);
              case 'less':
                return Number(cellValue) < Number(filterValue.value);
              case 'between':
                return Number(cellValue) >= Number(filterValue.min) && Number(cellValue) <= Number(filterValue.max);
              default:
                return String(cellValue).toLowerCase().includes(String(filterValue.value).toLowerCase());
            }
          } else {
            // Filtro simples
            return String(cellValue).toLowerCase().includes(String(filterValue).toLowerCase());
          }
        });
      }
    });

    return filtered;
  }, [data, globalFilter, filters, columns]);

  // Dados ordenados
  const sortedData = useMemo(() => {
    if (!enableSorting || !sortBy) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      
      // Handle null/undefined
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return sortOrder === 'asc' ? -1 : 1;
      if (bValue == null) return sortOrder === 'asc' ? 1 : -1;
      
      // Numeric comparison
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      // String comparison
      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();
      
      if (aStr < bStr) return sortOrder === 'asc' ? -1 : 1;
      if (aStr > bStr) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortBy, sortOrder, enableSorting]);

  // Dados paginados
  const paginatedData = useMemo(() => {
    if (!enablePagination) return sortedData;
    
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize, enablePagination]);

  // Dados para virtual scrolling
  const virtualData = useMemo(() => {
    if (!enableVirtualScroll) return paginatedData;

    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 1,
      sortedData.length
    );
    
    return {
      items: sortedData.slice(startIndex, endIndex),
      startIndex,
      endIndex,
      totalHeight: sortedData.length * itemHeight,
      offsetY: startIndex * itemHeight
    };
  }, [sortedData, scrollTop, itemHeight, containerHeight, enableVirtualScroll, paginatedData]);

  // Final data
  const finalData = enableVirtualScroll ? virtualData.items : paginatedData;

  // Handlers
  const handleSort = useCallback((columnKey) => {
    if (!enableSorting) return;
    
    if (sortBy === columnKey) {
      // Toggle sort order
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      // New column
      setSortBy(columnKey);
      setSortOrder('asc');
    }
  }, [sortBy, enableSorting]);

  const handleFilter = useCallback((columnKey, filterValue) => {
    if (!enableFiltering) return;
    
    setFilters(prev => ({
      ...prev,
      [columnKey]: filterValue
    }));
    
    // Reset to first page when filtering
    if (enablePagination) {
      setCurrentPage(1);
    }
  }, [enableFiltering, enablePagination]);

  const handleGlobalFilter = useCallback((filterValue) => {
    setGlobalFilter(filterValue);
    
    // Reset to first page when filtering
    if (enablePagination) {
      setCurrentPage(1);
    }
  }, [enablePagination]);

  const clearFilters = useCallback(() => {
    setFilters({});
    setGlobalFilter('');
    if (enablePagination) {
      setCurrentPage(1);
    }
  }, [enablePagination]);

  const handleRowSelection = useCallback((rowId, isSelected) => {
    if (!enableSelection) return;
    
    setSelectedRows(prev => {
      const newSelected = new Set(prev);
      if (isSelected) {
        newSelected.add(rowId);
      } else {
        newSelected.delete(rowId);
      }
      return newSelected;
    });
  }, [enableSelection]);

  const handleSelectAll = useCallback((isSelected) => {
    if (!enableSelection) return;
    
    if (isSelected) {
      const allIds = finalData.map((row, index) => row.id || index);
      setSelectedRows(new Set(allIds));
    } else {
      setSelectedRows(new Set());
    }
  }, [enableSelection, finalData]);

  const clearSelection = useCallback(() => {
    setSelectedRows(new Set());
  }, []);

  const handlePageChange = useCallback((page) => {
    if (!enablePagination) return;
    setCurrentPage(page);
  }, [enablePagination]);

  const handlePageSizeChange = useCallback((size) => {
    if (!enablePagination) return;
    setPageSize(size);
    setCurrentPage(1); // Reset to first page
  }, [enablePagination]);

  // Virtual scroll handler
  const handleScroll = useCallback((e) => {
    if (!enableVirtualScroll) return;
    setScrollTop(e.target.scrollTop);
  }, [enableVirtualScroll]);

  // Statistics
  const stats = useMemo(() => ({
    totalRows: data.length,
    filteredRows: filteredData.length,
    selectedRows: selectedRows.size,
    currentPageRows: finalData.length,
    totalPages: enablePagination ? Math.ceil(filteredData.length / pageSize) : 1,
    hasFilters: Object.keys(filters).length > 0 || globalFilter.length > 0,
    hasSelection: selectedRows.size > 0,
    allSelected: enableSelection && selectedRows.size === finalData.length && finalData.length > 0,
    someSelected: enableSelection && selectedRows.size > 0 && selectedRows.size < finalData.length
  }), [data, filteredData, selectedRows, finalData, pageSize, filters, globalFilter, enablePagination, enableSelection]);

  return {
    // Data
    data: finalData,
    originalData: data,
    filteredData,
    sortedData,
    virtualData: enableVirtualScroll ? virtualData : null,
    
    // State
    sortBy,
    sortOrder,
    filters,
    globalFilter,
    selectedRows: Array.from(selectedRows),
    selectedRowsSet: selectedRows,
    currentPage,
    pageSize,
    loading,
    error,
    scrollTop,
    
    // Handlers
    handleSort,
    handleFilter,
    handleGlobalFilter,
    clearFilters,
    handleRowSelection,
    handleSelectAll,
    clearSelection,
    handlePageChange,
    handlePageSizeChange,
    handleScroll,
    
    // Setters
    setLoading,
    setError,
    setSortBy,
    setSortOrder,
    setFilters,
    setGlobalFilter,
    setSelectedRows,
    setCurrentPage,
    setPageSize,
    
    // Statistics
    stats,
    
    // Refs
    scrollElementRef,
    
    // Utilities
    isRowSelected: (rowId) => selectedRows.has(rowId),
    getRowId: (row, index) => row.id || index,
    
    // For virtual scrolling
    ...(enableVirtualScroll && {
      containerHeight,
      itemHeight,
      totalHeight: virtualData.totalHeight,
      offsetY: virtualData.offsetY,
      startIndex: virtualData.startIndex,
      endIndex: virtualData.endIndex
    })
  };
};

// Hook para export de dados
export const useTableExport = ({
  data = [],
  columns = [],
  filename = 'export'
} = {}) => {
  const [isExporting, setIsExporting] = useState(false);
  
  const exportToCSV = useCallback(async () => {
    setIsExporting(true);
    try {
      // Prepare headers
      const headers = columns.map(col => col.label || col.accessor).join(',');
      
      // Prepare rows
      const csvRows = data.map(row => 
        columns.map(col => {
          const value = col.accessor ? row[col.accessor] : '';
          // Escape commas and quotes
          const escaped = String(value).replace(/"/g, '""');
          return `"${escaped}"`;
        }).join(',')
      );
      
      // Combine
      const csvContent = [headers, ...csvRows].join('\n');
      
      // Download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${filename}.csv`;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Export failed:', error);
      throw error;
    } finally {
      setIsExporting(false);
    }
  }, [data, columns, filename]);

  const exportToJSON = useCallback(async () => {
    setIsExporting(true);
    try {
      const jsonContent = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${filename}.json`;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Export failed:', error);
      throw error;
    } finally {
      setIsExporting(false);
    }
  }, [data, filename]);

  return {
    isExporting,
    exportToCSV,
    exportToJSON
  };
};

// Hook para column resizing
export const useColumnResize = ({
  columns = [],
  minWidth = 50,
  maxWidth = 500,
  defaultWidth = 150
} = {}) => {
  const [columnWidths, setColumnWidths] = useState({});
  const [isResizing, setIsResizing] = useState(null);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);

  const getColumnWidth = useCallback((columnId) => {
    return columnWidths[columnId] || defaultWidth;
  }, [columnWidths, defaultWidth]);

  const startResize = useCallback((e, columnId) => {
    e.preventDefault();
    setIsResizing(columnId);
    setStartX(e.clientX);
    setStartWidth(getColumnWidth(columnId));
    
    // Add global mouse events
    const handleMouseMove = (e) => {
      if (!isResizing) return;
      
      const diff = e.clientX - startX;
      const newWidth = Math.max(minWidth, Math.min(maxWidth, startWidth + diff));
      
      setColumnWidths(prev => ({
        ...prev,
        [columnId]: newWidth
      }));
    };

    const handleMouseUp = () => {
      setIsResizing(null);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [isResizing, startX, startWidth, minWidth, maxWidth, getColumnWidth]);

  const resetColumnWidths = useCallback(() => {
    setColumnWidths({});
  }, []);

  return {
    columnWidths,
    isResizing,
    getColumnWidth,
    startResize,
    resetColumnWidths,
    setColumnWidths
  };
};