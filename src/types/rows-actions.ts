import { Field } from "@/app/interface";

export type RowsActionsProps = {
    steps?: number[];
    fields: Field[];
    rowData?: any;
    isDelete?: boolean;
    isUpdate?: boolean;
    asDialog?: boolean;
    isPreview?: boolean;
    validationSchema: any;
}

export type OperationType = "edit" | "preview";