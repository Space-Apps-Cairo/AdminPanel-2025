import { ColumnDef } from "@tanstack/react-table";

// Generic type for table data
export type DataTableRow = {
  id: number | string;
  [key: string]: unknown;
};

// Configuration for search filters
export interface SearchConfig {
  enabled: boolean;
  placeholder?: string;
  searchKeys?: string[];
}

// Filter option interface
export interface FilterOption {
  id: number | string;
  label: string;
}

// Individual filter configuration
export interface FilterConfig {
  columnKey?: string; // for static filter
  queryKey?: string; // for backend filter
  options: FilterOption[];
  title?: string;
}

// Configuration for status filters - updated to support multiple filters
export interface StatusConfig {
  enabled: boolean;
  columnKey?: string; // Legacy support
  title?: string; // Legacy support
  // New: Support for multiple filter options
  filterOptions?: FilterConfig[];
}

// Configuration for actions
export interface ActionConfig {
  enabled: boolean;
  showAdd?: boolean;
  showDelete?: boolean;
  showExport?: boolean;
  addButtonText?: string;
  onAdd?: () => void;
  onExport?: (type: "pdf" | "excel" | "csv") => void;
  customActions?: React.ReactNode;
}

export interface ColumnVisibilityConfig {
  enableColumnVisibility?: boolean;
  invisibleColumns?: string[];
}

// Backend pagination configuration
export interface BackendPaginationConfig {
  enabled: boolean;
  totalCount?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  onSearchChange?: (query: string) => void;
  onSortChange?: (sort: { field: string; direction: 'asc' | 'desc' } | null) => void;
  onFilterChange?: (filters: Record<string, unknown>) => void;
  loading?: boolean;
}

// Props for the DataTable component
export interface DataTableProps<TData extends DataTableRow> {
  columns: ColumnDef<TData>[];
  data: TData[];
  searchConfig?: SearchConfig;
  statusConfig?: StatusConfig;
  actionConfig?: ActionConfig;
  // Legacy callback for backward compatibility
  onDeleteRows?: (data: TData[]) => void;
  enableBulkEmail?: boolean;
  // Single delete mutation hook for bulk operations
  bulkDeleteMutation?: (id: string | number) => { unwrap: () => Promise<unknown> };
  error?: string;
  pageSize?: number;
  columnVisibilityConfig?: ColumnVisibilityConfig;
  enableSorting?: boolean;
  enableSelection?: boolean;
  className?: string;
  allowTrigger?: boolean;
  // Backend pagination configuration
  backendPagination?: BackendPaginationConfig;
}
