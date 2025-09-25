import { useState, useCallback } from 'react';
import { StatusConfig } from '@/types/table';

export interface TableFilters {
  [queryKey: string]: string[];
}

export interface UseTableFiltersReturn {
  filters: TableFilters;
  updateFilter: (queryKey: string, value: string, checked: boolean) => void;
  clearFilters: () => void;
  getFilterCount: () => number;
  isFilterActive: (queryKey: string, value: string) => boolean;
}

export function useTableFilters(config: StatusConfig): UseTableFiltersReturn {
  const [filters, setFilters] = useState<TableFilters>({});
  console.log(config);
  const updateFilter = useCallback((queryKey: string, value: string, checked: boolean) => {
    setFilters(prev => {
      const currentValues = prev[queryKey] || [];
      
      if (checked) {
        // Add value if not already present
        if (!currentValues.includes(value)) {
          return {
            ...prev,
            [queryKey]: [...currentValues, value]
          };
        }
      } else {
        // Remove value
        return {
          ...prev,
          [queryKey]: currentValues.filter(v => v !== value)
        };
      }
      
      return prev;
    });
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  const getFilterCount = useCallback(() => {
    return Object.values(filters).reduce((total, values) => total + values.length, 0);
  }, [filters]);

  const isFilterActive = useCallback((queryKey: string, value: string) => {
    return filters[queryKey]?.includes(value) || false;
  }, [filters]);

  return {
    filters,
    updateFilter,
    clearFilters,
    getFilterCount,
    isFilterActive
  };
}
