// filterOptions.ts

// Define the shape of each option inside a filter
export interface FilterOptionItem {
  id: string | number;
  label: string;
}

// Define the shape of each filter group
export interface FilterGroup {
  queryKey: string;
  title: string;
  options: FilterOptionItem[];
}

// Define the full structure for all filter groups
export interface FilterOptionsConfig {
  filterOptions: FilterGroup[];
}
