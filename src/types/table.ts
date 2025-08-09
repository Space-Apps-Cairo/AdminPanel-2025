// src/types/table.ts
import { ColumnDef } from "@tanstack/react-table";

export interface DataTableRow {
  id: number | string;
  [key: string]: any;
}

export interface Participant extends DataTableRow {
  id: number;
  name: string;
  email: string;
  phone: string;
  gender: "male" | "female";
  status: "active" | "inactive";
  // 
}

export interface ActionConfig {
  enabled?: boolean;
  showAdd?: boolean;
  showDelete?: boolean;
  showExport?: boolean;
  addButtonText?: string;
  onAdd?: () => void;
  customActions?: React.ReactNode;
}

export interface DataTableProps<TData extends DataTableRow> {
  data: TData[];
  columns: ColumnDef<TData>[];
  searchConfig?: { enabled?: boolean; searchKeys?: string[]; placeholder?: string };
  statusConfig?: { enabled?: boolean; columnKey?: string; title?: string };
  actionConfig?: ActionConfig;
  onDataChange?: (data: TData[]) => void;
  error?: string | null;
  pageSize?: number;
  enableColumnVisibility?: boolean;
  enableSorting?: boolean;
  enableSelection?: boolean;
  className?: string;
  isLoading?: boolean;

}export interface StatusConfig {
  enabled?: boolean;
  columnKey?: string; // 
  title?: string;
}

export interface SearchConfig {
  enabled?: boolean;
  searchKeys?: string[]; // أي أعمدة نبحث فيها
  placeholder?: string;
}

