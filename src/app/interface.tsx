export interface FieldOption {
  value: string;
  label: string;
}

export type FieldType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "tel"
  | "time"
  | "textArea"
  | "file"
  | "select"
  | "date"
  | "checkbox"
  | "dynamicArrayField";
export interface Field {
  name: string;
  type: FieldType;
  label?: string;
  placeholder?: string;
  defaultValue?: string | number | boolean;
  value?: string;
  options?: FieldOption[];
  step?: number;
  dependsOn?: {
    name: string;
    data: (value: string | undefined) => FieldOption[];
  };
  dynamicArrayFieldsConfig?: {
    fields?: Field[];
    isSimpleArray?: boolean; // [1,2,3] , [{},{}]
    addButtonLabel?: string;
    itemName?: string;
  };
  disabled?: boolean;
}
