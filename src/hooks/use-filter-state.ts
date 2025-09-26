import { useState, useCallback } from 'react';

export const useFilterState = () => {
  const [filters, setFilters] = useState<Record<string, string[]>>({});

  const updateFilter = useCallback((key: string, values: string[]) => {
    setFilters(prev => ({
      ...prev,
      [key]: values
    }));
  }, []);

  const clearFilter = useCallback((key: string) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters({});
  }, []);

  return {
    filters,
    updateFilter,
    clearFilter,
    clearAllFilters
  };
};