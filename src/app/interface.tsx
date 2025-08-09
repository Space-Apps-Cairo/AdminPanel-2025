
// src/app/interface.tsx

export interface Field {
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  options?: { label: string; value: string }[]; // للـ select أو radio
  required?: boolean;
}
