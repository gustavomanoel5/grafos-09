import { 
  IoCaretUpOutline, 
  IoCaretDownOutline, 
  IoReorderTwoOutline,
  IoCheckboxOutline,
  IoCheckbox,
  IoSquareOutline,
  IoFunnelOutline
} from "react-icons/io5";

const SortIndicator = ({ sortBy, sortOrder, columnKey }) => {
  if (sortBy !== columnKey) {
    return <IoReorderTwoOutline className="table__sort-indicator table__sort-indicator--inactive" />;
  }
  
  return sortOrder === 'asc' 
    ? <IoCaretUpOutline className="table__sort-indicator table__sort-indicator--asc" />
    : <IoCaretDownOutline className="table__sort-indicator table__sort-indicator--desc" />;
};

const CheckboxHeader = ({ allSelected, someSelected, onSelectAll }) => {
  const Icon = allSelected ? IoCheckbox : (someSelected ? IoSquareOutline : IoCheckboxOutline);
  
  return (
    <button
      className="table__checkbox-button"
      onClick={() => onSelectAll(!allSelected)}
      aria-label={allSelected ? "Desmarcar todos" : "Selecionar todos"}
    >
      <Icon className="table__checkbox-icon" />
    </button>
  );
};

const ColumnHeader = ({ 
  column, 
  sortBy, 
  sortOrder, 
  enableSorting, 
  onSort,
  onStartResize,
  hasFilter,
  columnWidth,
  isResizing
}) => {
  const isSortable = enableSorting && column.sortable !== false;
  const isCurrentSort = sortBy === column.accessor;

  return (
    <th 
      key={column.accessor}
      className={`table__header-cell ${isSortable ? 'table__header-cell--sortable' : ''} ${isCurrentSort ? 'table__header-cell--sorted' : ''}`}
      data-accessor={column.accessor}
      style={{ width: columnWidth || column.width }}
      role="columnheader"
      aria-sort={
        isCurrentSort 
          ? (sortOrder === 'asc' ? 'ascending' : 'descending')
          : isSortable ? 'none' : undefined
      }
    >
      <div className="table__header-content">
        {isSortable ? (
          <button
            className="table__sort-button"
            onClick={() => onSort(column.accessor)}
            aria-label={`Ordenar por ${column.label}`}
          >
            <span className="table__header-text">{column.label}</span>
            <SortIndicator 
              sortBy={sortBy} 
              sortOrder={sortOrder} 
              columnKey={column.accessor} 
            />
          </button>
        ) : (
          <span className="table__header-text">{column.label}</span>
        )}
        
        {hasFilter && (
          <IoFunnelOutline className="table__filter-indicator" />
        )}
      </div>
      
      {column.resizable !== false && (
        <div
          className={`table__resize-handle ${isResizing ? 'table__resize-handle--active' : ''}`}
          onMouseDown={(e) => onStartResize(e, column.accessor)}
          aria-label={`Redimensionar coluna ${column.label}`}
        />
      )}
    </th>
  );
};

const TableHeader = ({
  columns,
  enableSelection,
  enableSorting,
  sortBy,
  sortOrder,
  onSort,
  allSelected,
  someSelected,
  onSelectAll,
  columnWidths,
  getColumnWidth,
  onStartResize,
  isResizing,
  filters,
  enableRowActions = true,
  hasCustomActions = false
}) => {
  return (
    <thead className="table__header">
      <tr className="table__header-row" role="row">
        {enableSelection && (
          <th 
            className="table__header-cell table__header-cell--selection"
            style={{ width: '48px' }}
            role="columnheader"
          >
            <CheckboxHeader
              allSelected={allSelected}
              someSelected={someSelected}
              onSelectAll={onSelectAll}
            />
          </th>
        )}
        
        {columns.map((column) => (
          <ColumnHeader
            key={column.accessor}
            column={column}
            sortBy={sortBy}
            sortOrder={sortOrder}
            enableSorting={enableSorting}
            onSort={onSort}
            onStartResize={onStartResize}
            hasFilter={filters[column.accessor]}
            columnWidth={getColumnWidth?.(column.accessor)}
            isResizing={isResizing === column.accessor}
          />
        ))}
        
        {(enableRowActions || hasCustomActions) && (
          <th 
            className="table__header-cell table__header-cell--actions"
            data-accessor="actions"
            style={{ width: '180px' }}
            role="columnheader"
          >
            <span className="table__header-text">Ações</span>
          </th>
        )}
      </tr>
    </thead>
  );
};

export default TableHeader;