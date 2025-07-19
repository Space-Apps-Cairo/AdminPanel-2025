export type RowsActionsProps = {
    steps?: number[]
    fields: any[]
    // rowData: TActions
    isPreview?: boolean
    isUpdate?: boolean
    isDelete?: boolean
    asDialog?: boolean
    validationSchema: any
}

export type OperationType = "edit" | "preview";