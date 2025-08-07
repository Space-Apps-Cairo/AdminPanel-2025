"use client";

import { Workshop } from '@/types/workshop';
import React, { useEffect, useState } from 'react';
import { ActionConfig, SearchConfig, StatusConfig } from '@/types/table';
import DataTable from '@/components/table/data-table';
import { getWorkshopsFields, workshopColumns } from './_components/columns';
import Loading from '@/components/loading/loading';
import CrudForm from '@/components/crud-form';
import { workshopValidationSchema } from '@/validations/workshop';

import { useGetAllWorkshopsQuery } from '@/services/workshops';

export default function Workshops() {

    const {data, isLoading, error} = useGetAllWorkshopsQuery();

    console.log('loading: ', isLoading);
    console.log('data: ', data);
    console.log('error: ', error);

    const [workshops, setWorkshops] = useState<Workshop[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (data && data.data && !isLoading && !error) {
            setWorkshops(data.data);
        }
    }, [data, isLoading, error]);

    const searchConfig: SearchConfig = {
        enabled: true,
        placeholder: "Filter by title",
        searchKeys: ["title"],
    };

    const statusConfig: StatusConfig = {
        enabled: false,
    };

    const actionConfig: ActionConfig = {
        enabled: true,
        showAdd: true,
        showDelete: true,
        addButtonText: "Add workshop",
        onAdd: () => {
            setIsOpen(true);
        },
    };

    if (isLoading) return <Loading />;

    return <React.Fragment>

        <div className="container mx-auto py-6">

            <h1 className="text-2xl font-bold mb-6">Workshop</h1>

            <DataTable<Workshop>
                data={workshops}
                columns={workshopColumns}
                searchConfig={searchConfig}
                statusConfig={statusConfig}
                actionConfig={actionConfig}
                onDataChange={setWorkshops}
                allowTrigger={true}
            />

            {isOpen && (
                <CrudForm
                    fields={getWorkshopsFields()}
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    operation={"add"}
                    asDialog={true}
                    validationSchema={workshopValidationSchema}
                    // steps={[1]}
                />
            )}

        </div>

    </React.Fragment>

}
