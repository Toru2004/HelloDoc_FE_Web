// @type/table.d.ts
// Table component type definitions

/**
 * Column definition for DataTable component
 */
type TableColumn<T = any> = {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (row: T) => string | number;
}

/**
 * Pagination configuration
 */
type TablePagination = {
  currentPage: number;
  pageSize: number;
  total: number;
}
