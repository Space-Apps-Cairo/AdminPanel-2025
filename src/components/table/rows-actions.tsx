import React from 'react'
import { Button } from '../ui/button'
import { Eye, SquarePen, Trash } from 'lucide-react'

export default function RowsActions({rowData}) {

    console.log(rowData);

    return <React.Fragment>

        <div className="py-2.5 flex items-center gap-2.5">

            <Button variant="outline" size="sm">
                <Eye size={16} />
            </Button>

            <Button variant="outline" size="sm">
                <SquarePen size={16} />
            </Button>

            <Button variant="outline" size="sm">
                <Trash size={16} />
            </Button>

        </div>

    </React.Fragment>

}
