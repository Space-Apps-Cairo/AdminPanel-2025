export interface FieldOption {
  value: string;
  label: string;
  searchableText?: string; // For command input filtering
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
  | "command" // New command input type
  | "dynamicArrayField";
export interface Field {
  name: string;
  type: FieldType;
  label?: string;
  placeholder?: string;

  value?: string;
  options?: FieldOption[];
  step?: number;

  // لو في dynamic fields (زي array of objects)
  dynamicArrayFieldsConfig?: {
    fields?: Field[];
    isSimpleArray?: boolean; // [1,2,3] , [{},{}]
    addButtonLabel?: string;
    itemName?: string;
    minItem?: number;
  };

  disabled?: boolean;
  defaultValue?: string | number | string[] | boolean | null | any;

  //  إضافات جديدة للتوافق مع columns.tsx

}
