import { forwardRef, useMemo } from "react";
import { useTable, useTableExport, useColumnResize } from "./useTable.js";
import TableHeader from "./TableHeader.jsx";
import TableBody from "./TableBody.jsx";
import TableToolbar from "./TableToolbar.jsx";
import "./Table.css";

const Table = forwardRef(
  (
    {
      // Data
      data = [],
      columns = [],

      // Legacy props (for backward compatibility)
      onEdit,
      onDelete,
      customActions,

      // Enhanced props
      actions,
      loading = false,
      error = null,
      emptyStateMessage = "Nenhum dado disponível",
      emptyStateIcon,

      // Table features
      enableSorting = true,
      enableFiltering = false,
      enableSelection = false,
      enablePagination = false,
      enableVirtualScroll = false,
      enableGlobalSearch = false,
      enableExport = false,
      enableRefresh = false,
      enableColumnResize = false,
      enableRowActions = true,

      // Initial states
      initialSortBy,
      initialSortOrder = "asc",
      initialPageSize = 10,
      initialPage = 1,

      // Callbacks
      onRowClick,
      onRefresh,
      onSelectionChange,

      // Customization
      searchPlaceholder = "Buscar...",
      exportFilename = "dados",
      customToolbarActions,
      className = "",

      // Virtual scroll
      itemHeight = 50,
      containerHeight = 400,

      // Column resize
      minColumnWidth = 50,
      maxColumnWidth = 500,
      defaultColumnWidth = 150,

      ...props
    },
    ref
  ) => {
    // Setup table hook
    const tableConfig = {
      data,
      columns,
      initialSortBy,
      initialSortOrder,
      initialPageSize,
      initialPage,
      enableSorting,
      enableFiltering,
      enableSelection,
      enablePagination,
      enableVirtualScroll,
      itemHeight,
      containerHeight,
    };

    const {
      data: tableData,
      originalData,
      sortBy,
      sortOrder,
      filters,
      globalFilter,
      selectedRowsSet,
      loading: tableLoading,
      error: tableError,
      stats,
      virtualData,
      handleSort,
      handleFilter,
      handleGlobalFilter,
      clearFilters,
      handleRowSelection,
      handleSelectAll,
      clearSelection,
      handleScroll,
      scrollElementRef,
      isRowSelected,
      getRowId,
      ...tableState
    } = useTable(tableConfig);

    // Setup export hook
    const { isExporting, exportToCSV, exportToJSON } = useTableExport({
      data: originalData,
      columns,
      filename: exportFilename,
    });

    // Setup column resize hook
    const { columnWidths, isResizing, getColumnWidth, startResize } =
      useColumnResize({
        columns,
        minWidth: minColumnWidth,
        maxWidth: maxColumnWidth,
        defaultWidth: defaultColumnWidth,
      });

    // Determine final loading and error states
    const finalLoading = loading || tableLoading;
    const finalError = error || tableError;

    // Handle selection change callback
    useMemo(() => {
      if (onSelectionChange && enableSelection) {
        onSelectionChange(Array.from(selectedRowsSet));
      }
    }, [selectedRowsSet, onSelectionChange, enableSelection]);

    // Determine if row is clickable
    const isClickable = Boolean(onRowClick);

    // Table container props
    const containerProps = {
      className: `table-container ${className}`,
      ref,
      ...props,
    };

    // Virtual scroll props
    const virtualScrollProps = enableVirtualScroll
      ? {
          ref: scrollElementRef,
          onScroll: handleScroll,
          style: {
            height: containerHeight,
            overflowY: "auto",
          },
        }
      : {};

    return (
      <div {...containerProps}>
        {/* Toolbar */}
        <TableToolbar
          enableGlobalSearch={enableGlobalSearch}
          globalFilter={globalFilter}
          onGlobalFilterChange={handleGlobalFilter}
          searchPlaceholder={searchPlaceholder}
          enableFiltering={enableFiltering}
          filters={filters}
          onClearFilters={clearFilters}
          enableExport={enableExport}
          onExportCSV={exportToCSV}
          onExportJSON={exportToJSON}
          isExporting={isExporting}
          enableSelection={enableSelection}
          selectedCount={stats.selectedRows}
          totalCount={stats.totalRows}
          onClearSelection={clearSelection}
          enableRefresh={enableRefresh}
          onRefresh={onRefresh}
          isLoading={finalLoading}
          customActions={customToolbarActions}
          stats={stats}
        />

        {/* Table */}
        <div className="table-wrapper" {...virtualScrollProps}>
          <table className="table" role="table" aria-label="Tabela de dados">
            <TableHeader
              columns={columns}
              enableSelection={enableSelection}
              enableSorting={enableSorting}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={handleSort}
              allSelected={stats.allSelected}
              someSelected={stats.someSelected}
              onSelectAll={handleSelectAll}
              columnWidths={columnWidths}
              getColumnWidth={enableColumnResize ? getColumnWidth : undefined}
              isResizing={enableColumnResize ? isResizing : null}
              onStartResize={startResize}
              filters={filters}
              enableRowActions={enableRowActions}
              hasCustomActions={Boolean(customActions)}
            />

            <TableBody
              data={tableData}
              columns={columns}
              loading={finalLoading}
              error={finalError}
              emptyStateMessage={emptyStateMessage}
              emptyStateIcon={emptyStateIcon}
              enableSelection={enableSelection}
              selectedRowsSet={selectedRowsSet}
              onRowSelect={handleRowSelection}
              getRowId={getRowId}
              onEdit={onEdit}
              onDelete={onDelete}
              actions={actions}
              customActions={customActions}
              enableRowActions={enableRowActions}
              onRowClick={onRowClick}
              isClickable={isClickable}
              virtualData={virtualData}
              enableVirtualScroll={enableVirtualScroll}
            />
          </table>
        </div>

        {/* Footer/Pagination would go here if enabled */}
        {/* TODO: Implement pagination component integration */}
      </div>
    );
  }
);

Table.displayName = "Table";

export default Table;
