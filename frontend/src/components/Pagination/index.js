// Componente principal
export { default as Pagination } from './Pagination';
export { default } from './Pagination';

// Hooks utilitários
export { 
  usePagination, 
  usePaginationKeyboard, 
  usePaginationUrl 
} from './usePagination';

// Componentes auxiliares
export {
  PaginationInfo,
  PaginationSizeSelector,
  PaginationJump,
  SimplePagination
} from './PaginationInfo';

// Hook personalizado para uso comum
import { usePagination } from './usePagination';

export const usePaginationState = (config = {}) => {
  const pagination = usePagination(config);
  
  return {
    ...pagination,
    // Propriedades calculadas para facilitar o uso
    isEmpty: pagination.totalItems === 0,
    hasMultiplePages: pagination.totalPages > 1,
    isFirstPage: pagination.currentPage === 1,
    isLastPage: pagination.currentPage === pagination.totalPages,
    
    // Helpers para renderização condicional
    shouldShowPagination: pagination.totalPages > 1,
    shouldShowInfo: pagination.totalItems > 0,
    
    // Dados para componentes auxiliares
    infoProps: {
      currentPage: pagination.currentPage,
      totalPages: pagination.totalPages,
      totalItems: pagination.totalItems,
      itemsPerPage: pagination.itemsPerPage,
      startItem: pagination.startItem,
      endItem: pagination.endItem
    },
    
    sizeSelectorProps: {
      value: pagination.itemsPerPage,
      onChange: pagination.changeItemsPerPage
    },
    
    jumpProps: {
      currentPage: pagination.currentPage,
      totalPages: pagination.totalPages,
      onJump: pagination.setPage
    }
  };
};