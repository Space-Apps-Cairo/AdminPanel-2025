// Enhanced interface.ts - Add radio group support
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
  | "command"
  | "dynamicArrayField"
  | "radio"; // Add radio type

export interface Field {
  name: string;
  type: FieldType;
  label?: string;
  placeholder?: string;
  value?: string;
  options?: FieldOption[];
  step?: number;
  
  // Add radio-specific properties
  radioConfig?: {
    orientation?: "horizontal" | "vertical";
    inline?: boolean;
  };

  dynamicArrayFieldsConfig?: {
    fields?: Field[];
    isSimpleArray?: boolean;
    addButtonLabel?: string;
    itemName?: string;
    minItem?: number;
  };

  disabled?: boolean;
  defaultValue?: string | number | string[] | boolean | null | any;
}