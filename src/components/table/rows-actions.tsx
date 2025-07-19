import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Eye, SquarePen, Trash } from 'lucide-react'
import { OperationType, RowsActionsProps } from '@/types/rows-actions';
import CrudForm from '../crud-form';

export default function RowsActions({
    steps,
    fields,
    // rowData,
    isDelete = false,
    isUpdate = true,
    asDialog = true,
    isPreview = true,
    validationSchema,
}: RowsActionsProps) {

    const [isOpen, setIsOpen] = useState(false);
    const [operation, setOperation] = useState<OperationType>("edit");

    // console.log(rowData);

    const handleButtonClick = (operation: OperationType) => {
        setOperation(operation);
        setIsOpen(true);
    }

    return <React.Fragment>

        {isOpen && (
            <CrudForm
                fields={fields}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                operation={operation}
                asDialog={asDialog}
                validationSchema={validationSchema}
                steps={steps}
            />
        )}

        <div className="py-2.5 flex items-center gap-2.5">

            {isPreview && <Button onClick={() => handleButtonClick('preview')} variant="outline" size="sm">
                <Eye size={16} />
            </Button>}

            {isUpdate && <Button onClick={() => handleButtonClick('edit')} variant="outline" size="sm">
                <SquarePen size={16} />
            </Button>}

            {isDelete && <Button variant="outline" size="sm">
                <Trash size={16} />
            </Button>}

        </div>

    </React.Fragment>

}
