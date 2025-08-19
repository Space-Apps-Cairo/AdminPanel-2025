export interface FieldOption {
  value: string;
  placeholder: string;
}

export interface Field {
  name: string;
  type: string;
  label?: string;
  placeholder?: string;
  defaultValue?: string | number | boolean;
  value?: string;
  options?: FieldOption[];
  step?: number;
  dynamicArrayFieldsConfig?: {
    fields?: Field[];
    isSimpleArray?: boolean; // [1,2,3] , [{},{}]
    addButtonLabel?: string;
    itemName?: string;
  };
  disabled?: boolean; 
}
