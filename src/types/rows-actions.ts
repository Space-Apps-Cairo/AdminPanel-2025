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
<<<<<<< HEAD
    updateMutation?: any
    deleteMutation?: any
    onUpdateSuccess?: (result: any) => void
    onUpdateError?: (error: any) => void
    onDeleteSuccess?: (result: any) => void
    onDeleteError?: (error: any) => void
=======
>>>>>>> 5b0490d00324e886d65979efd1577e3af36f4623
}

export type OperationType = "edit" | "preview";