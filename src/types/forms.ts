export type Form ={
  id: number;
  title: string;
  description: string;
  formable_type_id: string;
  formable_id: string;
  is_active: string;
  [key: string]: any;
}
 export type FormsResponse = {
  success: boolean;
  data: Form[];
};
//formable type
export type FormableItem= {
  formable_id: number | string;
  name_en: string;
  uuid: string;
  email: string;
}

export type FormableType ={
  formable_type_id: number | string;
  name: string;
  data: FormableItem[];
}
