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
    updateMutation?: any
    deleteMutation?: any
    onUpdateSuccess?: (result: any) => void
    onUpdateError?: (error: any) => void
    onDeleteSuccess?: (result: any) => void
    onDeleteError?: (error: any) => void
    customPreviewHandler?: (rowData: any) => void;
    customEditHandler?: (rowData: any) => void;
}

export type OperationType = "edit" | "preview";