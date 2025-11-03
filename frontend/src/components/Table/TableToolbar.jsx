import { 
  IoSearchOutline,
  IoFunnelOutline,
  IoCloseOutline,
  IoDownloadOutline,
  IoRefreshOutline,
  IoSettingsOutline
} from "react-icons/io5";
import { useState, useRef, useEffect } from 'react';

const SearchInput = ({ value, onChange, placeholder = "Buscar..." }) => {
  return (
    <div className="table__search-container">
      <IoSearchOutline className="table__search-icon" />
      <input
        type="text"
        className="table__search-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Buscar na tabela"
      />
      {value && (
        <button
          className="table__search-clear"
          onClick={() => onChange('')}
          aria-label="Limpar busca"
        >
          <IoCloseOutline />
        </button>
      )}
    </div>
  );
};

const FilterDropdown = ({ 
  isOpen, 
  onToggle, 
  filters, 
  onClearFilters, 
  hasActiveFilters 
}) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onToggle(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onToggle]);

  return (
    <div className="table__filter-container" ref={dropdownRef}>
      <button
        className={`table__filter-button ${hasActiveFilters ? 'table__filter-button--active' : ''}`}
        onClick={() => onToggle(!isOpen)}
        aria-label="Filtros"
        aria-expanded={isOpen}
      >
        <IoFunnelOutline />
        {hasActiveFilters && <span className="table__filter-badge" />}
      </button>
      
      {isOpen && (
        <div className="table__filter-dropdown">
          <div className="table__filter-header">
            <h4>Filtros</h4>
            {hasActiveFilters && (
              <button
                className="table__filter-clear"
                onClick={onClearFilters}
              >
                Limpar todos
              </button>
            )}
          </div>
          <div className="table__filter-content">
            {/* Filter content will be implemented based on column types */}
            <p className="table__filter-placeholder">
              Filtros avançados em desenvolvimento
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const ExportDropdown = ({ 
  isOpen, 
  onToggle, 
  onExportCSV, 
  onExportJSON,
  isExporting 
}) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onToggle(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onToggle]);

  return (
    <div className="table__export-container" ref={dropdownRef}>
      <button
        className="table__export-button"
        onClick={() => onToggle(!isOpen)}
        disabled={isExporting}
        aria-label="Exportar dados"
        aria-expanded={isOpen}
      >
        <IoDownloadOutline />
      </button>
      
      {isOpen && (
        <div className="table__export-dropdown">
          <button
            className="table__export-option"
            onClick={() => {
              onExportCSV();
              onToggle(false);
            }}
            disabled={isExporting}
          >
            Exportar CSV
          </button>
          <button
            className="table__export-option"
            onClick={() => {
              onExportJSON();
              onToggle(false);
            }}
            disabled={isExporting}
          >
            Exportar JSON
          </button>
        </div>
      )}
    </div>
  );
};

const SelectionInfo = ({ selectedCount, totalCount, onClearSelection }) => {
  if (selectedCount === 0) return null;

  return (
    <div className="table__selection-info">
      <span className="table__selection-text">
        {selectedCount} de {totalCount} item{selectedCount !== 1 ? 's' : ''} selecionado{selectedCount !== 1 ? 's' : ''}
      </span>
      <button
        className="table__selection-clear"
        onClick={onClearSelection}
        aria-label="Limpar seleção"
      >
        <IoCloseOutline />
      </button>
    </div>
  );
};

const TableToolbar = ({
  // Search
  enableGlobalSearch = false,
  globalFilter = '',
  onGlobalFilterChange,
  searchPlaceholder,
  
  // Filters
  enableFiltering = false,
  filters = {},
  onClearFilters,
  
  // Export
  enableExport = false,
  onExportCSV,
  onExportJSON,
  isExporting = false,
  
  // Selection
  enableSelection = false,
  selectedCount = 0,
  totalCount = 0,
  onClearSelection,
  
  // Refresh
  enableRefresh = false,
  onRefresh,
  isLoading = false,
  
  // Custom actions
  customActions,
  
  // Statistics
  stats = {}
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  
  const hasActiveFilters = Object.keys(filters).some(key => 
    filters[key] !== undefined && filters[key] !== ''
  ) || globalFilter.length > 0;

  // Don't render toolbar if no features are enabled
  const hasFeatures = enableGlobalSearch || enableFiltering || enableExport || 
                     enableRefresh || customActions || enableSelection;
                     
  if (!hasFeatures) return null;

  return (
    <div className="table__toolbar">
      <div className="table__toolbar-left">
        {enableGlobalSearch && (
          <SearchInput
            value={globalFilter}
            onChange={onGlobalFilterChange}
            placeholder={searchPlaceholder}
          />
        )}
        
        {enableSelection && (
          <SelectionInfo
            selectedCount={selectedCount}
            totalCount={totalCount}
            onClearSelection={onClearSelection}
          />
        )}
      </div>
      
      <div className="table__toolbar-right">
        {stats.totalRows > 0 && (
          <div className="table__stats">
            <span className="table__stats-text">
              {stats.filteredRows !== stats.totalRows 
                ? `${stats.filteredRows} de ${stats.totalRows}` 
                : `${stats.totalRows}`
              } registro{stats.filteredRows !== 1 ? 's' : ''}
            </span>
          </div>
        )}
        
        {customActions && (
          <div className="table__custom-actions">
            {customActions}
          </div>
        )}
        
        {enableFiltering && (
          <FilterDropdown
            isOpen={isFilterOpen}
            onToggle={setIsFilterOpen}
            filters={filters}
            onClearFilters={onClearFilters}
            hasActiveFilters={hasActiveFilters}
          />
        )}
        
        {enableExport && (
          <ExportDropdown
            isOpen={isExportOpen}
            onToggle={setIsExportOpen}
            onExportCSV={onExportCSV}
            onExportJSON={onExportJSON}
            isExporting={isExporting}
          />
        )}
        
        {enableRefresh && (
          <button
            className={`table__refresh-button ${isLoading ? 'table__refresh-button--loading' : ''}`}
            onClick={onRefresh}
            disabled={isLoading}
            aria-label="Recarregar dados"
          >
            <IoRefreshOutline />
          </button>
        )}
      </div>
    </div>
  );
};

export default TableToolbar;