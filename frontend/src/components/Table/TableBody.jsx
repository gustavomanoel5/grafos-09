import { 
  IoCheckboxOutline,
  IoCheckbox,
  IoEllipsisVerticalOutline
} from "react-icons/io5";
import { useState, useRef, useEffect } from 'react';

const CheckboxCell = ({ isSelected, onToggle, rowId }) => {
  const Icon = isSelected ? IoCheckbox : IoCheckboxOutline;
  
  return (
    <td className="table__cell table__cell--selection" role="gridcell">
      <button
        className="table__checkbox-button"
        onClick={() => onToggle(rowId, !isSelected)}
        aria-label={isSelected ? "Desmarcar linha" : "Selecionar linha"}
      >
        <Icon className="table__checkbox-icon" />
      </button>
    </td>
  );
};

const ActionsCell = ({ 
  item, 
  actions, 
  onEdit, 
  onDelete, 
  customActions,
  enableRowActions = true 
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isDropdownOpen]);

  if (!enableRowActions) return null;

  if (customActions) {
    return (
      <td className="table__cell table__cell--actions" role="gridcell">
        <div className="table__actions-container">
          {customActions(item)}
        </div>
      </td>
    );
  }

  // Se temos actions definidas como função, usar nova API
  if (typeof actions === 'function') {
    const actionItems = actions(item) || [];
    return (
      <td className="table__cell table__cell--actions" role="gridcell">
        <div className="table__actions-container table__actions-container--direct">
          {actionItems.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <button
                key={action.key || index}
                className={`btn btn--${action.variant || 'secondary'} btn--small table__action-btn`}
                onClick={() => action.onClick(item)}
                title={action.label}
                style={{ fontSize: "12px", padding: "4px 8px" }}
              >
                {IconComponent && <IconComponent size={14} />}
                <span>{action.label}</span>
              </button>
            );
          })}
        </div>
      </td>
    );
  }

  const defaultActions = [
    ...(Array.isArray(actions) ? actions : []),
    ...(onEdit ? [{
      label: 'Editar',
      onClick: () => onEdit(item),
      variant: 'primary',
      icon: 'edit'
    }] : []),
    ...(onDelete ? [{
      label: 'Excluir',
      onClick: () => onDelete(item.id || item),
      variant: 'danger',
      icon: 'delete'
    }] : [])
  ];

  if (defaultActions.length === 0) return null;

  // Se temos actions definidas como array (nova API), renderizar como botões diretos
  if (actions && Array.isArray(actions) && actions.length > 0) {
    return (
      <td className="table__cell table__cell--actions" role="gridcell">
        <div className="table__actions-container table__actions-container--direct">
          {actions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <button
                key={action.key || index}
                className={`btn btn--${action.variant || 'secondary'} btn--small table__action-btn`}
                onClick={() => action.onClick(item)}
                title={action.label}
                style={{ fontSize: "12px", padding: "4px 8px" }}
              >
                {IconComponent && <IconComponent size={14} />}
                <span>{action.label}</span>
              </button>
            );
          })}
        </div>
      </td>
    );
  }

  // Fallback para API antiga (dropdown com três pontinhos)
  return (
    <td className="table__cell table__cell--actions" role="gridcell">
      <div className="table__actions-container" ref={dropdownRef}>
        <button
          className="table__actions-trigger"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          aria-label="Abrir menu de ações"
          aria-expanded={isDropdownOpen}
        >
          <IoEllipsisVerticalOutline />
        </button>
        
        {isDropdownOpen && (
          <div className="table__actions-dropdown">
            {defaultActions.map((action, index) => (
              <button
                key={index}
                className={`table__action-button table__action-button--${action.variant || 'default'}`}
                onClick={() => {
                  action.onClick(item);
                  setIsDropdownOpen(false);
                }}
              >
                {action.icon && <span className={`table__action-icon table__action-icon--${action.icon}`} />}
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </td>
  );
};

const DataCell = ({ column, item, rowIndex, columnIndex }) => {
  let cellValue = '';
  
  if (column.accessor) {
    if (typeof column.accessor === 'function') {
      cellValue = column.accessor(item);
    } else {
      cellValue = item[column.accessor];
    }
  }
  
  const renderedValue = column.render ? column.render(cellValue, item, rowIndex) : cellValue;
  
  return (
    <td 
      key={typeof column.accessor === 'function' ? column.label || columnIndex : column.accessor}
      className={`table__cell ${column.className || ''}`}
      style={{ width: column.width }}
      role="gridcell"
      data-column={typeof column.accessor === 'function' ? column.label : column.accessor}
      aria-describedby={typeof column.accessor === 'function' ? `${column.label || columnIndex}-${rowIndex}` : `${column.accessor}-${rowIndex}`}
    >
      <div className="table__cell-content">
        {renderedValue}
      </div>
    </td>
  );
};

const TableRow = ({ 
  item, 
  rowIndex,
  columns, 
  enableSelection,
  isSelected,
  onRowSelect,
  getRowId,
  onEdit,
  onDelete,
  actions,
  customActions,
  enableRowActions,
  onRowClick,
  isClickable
}) => {
  const rowId = getRowId(item, rowIndex);
  const rowClass = `table__row ${isSelected ? 'table__row--selected' : ''} ${isClickable ? 'table__row--clickable' : ''}`;

  const handleRowClick = (e) => {
    // Don't trigger row click if clicking on interactive elements
    if (e.target.closest('button') || e.target.closest('input') || e.target.closest('select')) {
      return;
    }
    
    if (onRowClick) {
      onRowClick(item, rowIndex);
    }
  };

  return (
    <tr 
      key={rowId}
      className={rowClass}
      role="row"
      onClick={handleRowClick}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={isClickable ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleRowClick(e);
        }
      } : undefined}
    >
      {enableSelection && (
        <CheckboxCell
          isSelected={isSelected}
          onToggle={onRowSelect}
          rowId={rowId}
        />
      )}
      
      {columns.map((column, columnIndex) => (
        <DataCell
          key={typeof column.accessor === 'function' ? column.label || columnIndex : column.accessor}
          column={column}
          item={item}
          rowIndex={rowIndex}
          columnIndex={columnIndex}
        />
      ))}
      
      <ActionsCell
        item={item}
        actions={actions}
        onEdit={onEdit}
        onDelete={onDelete}
        customActions={customActions}
        enableRowActions={enableRowActions}
      />
    </tr>
  );
};

const EmptyState = ({ message = "Nenhum dado disponível", icon }) => (
  <tr className="table__empty-row">
    <td colSpan="100%" className="table__empty-cell">
      <div className="table__empty-state">
        {icon && <div className="table__empty-icon">{icon}</div>}
        <p className="table__empty-message">{message}</p>
      </div>
    </td>
  </tr>
);

const LoadingRows = ({ columns, enableSelection, rowCount = 5 }) => {
  const columnCount = columns.length + (enableSelection ? 1 : 0) + 1; // +1 for actions
  
  return (
    <>
      {Array.from({ length: rowCount }, (_, index) => (
        <tr key={`loading-${index}`} className="table__row table__row--loading">
          {Array.from({ length: columnCount }, (_, cellIndex) => (
            <td key={cellIndex} className="table__cell">
              <div className="table__skeleton" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};

const TableBody = ({
  data,
  columns,
  loading = false,
  error = null,
  emptyStateMessage,
  emptyStateIcon,
  enableSelection = false,
  selectedRowsSet,
  onRowSelect,
  getRowId,
  onEdit,
  onDelete,
  actions,
  customActions,
  enableRowActions = true,
  onRowClick,
  isClickable = false,
  virtualData,
  enableVirtualScroll = false
}) => {
  if (loading) {
    return (
      <tbody className="table__body">
        <LoadingRows 
          columns={columns} 
          enableSelection={enableSelection}
          rowCount={5}
        />
      </tbody>
    );
  }

  if (error) {
    return (
      <tbody className="table__body">
        <EmptyState 
          message={`Erro: ${error}`}
          icon="⚠️"
        />
      </tbody>
    );
  }

  if (!data || data.length === 0) {
    return (
      <tbody className="table__body">
        <EmptyState 
          message={emptyStateMessage}
          icon={emptyStateIcon}
        />
      </tbody>
    );
  }

  const bodyContent = (
    <>
      {data.map((item, index) => {
        const rowId = getRowId(item, index);
        const isSelected = selectedRowsSet?.has(rowId) || false;

        return (
          <TableRow
            key={rowId}
            item={item}
            rowIndex={index}
            columns={columns}
            enableSelection={enableSelection}
            isSelected={isSelected}
            onRowSelect={onRowSelect}
            getRowId={getRowId}
            onEdit={onEdit}
            onDelete={onDelete}
            actions={actions}
            customActions={customActions}
            enableRowActions={enableRowActions}
            onRowClick={onRowClick}
            isClickable={isClickable}
          />
        );
      })}
    </>
  );

  if (enableVirtualScroll && virtualData) {
    return (
      <tbody 
        className="table__body table__body--virtual"
        style={{ 
          transform: `translateY(${virtualData.offsetY}px)`,
          height: virtualData.totalHeight
        }}
      >
        {bodyContent}
      </tbody>
    );
  }

  return (
    <tbody className="table__body">
      {bodyContent}
    </tbody>
  );
};

export default TableBody;