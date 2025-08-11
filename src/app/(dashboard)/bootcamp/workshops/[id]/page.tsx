"use client";

import Loading from '@/components/loading/loading';
import DataTable from '@/components/table/data-table';
import {useAddNewScheduleMutation, useGetWorkshopScheduleQuery } from '@/service/Api/workshops';
import { ActionConfig, SearchConfig, StatusConfig } from '@/types/table';
import { Schedule } from '@/types/workshop';
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { getScheduleFields, scheduleColumns } from './_components/columns';
import CrudForm from '@/components/crud-form';
import { scheduleValidationSchema } from '@/validations/schedule';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { FieldValues } from 'react-hook-form';

export default function Schedules() {

    const {id} = useParams();
    const router = useRouter();

    const { data, isLoading, error } = useGetWorkshopScheduleQuery(id as string, {skip: !id});

    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (data && data.data && !isLoading && !error) {
            setSchedules(data.data.schedules);
        }
    }, [data, isLoading, error]);

    const searchConfig: SearchConfig = {
        enabled: false,
    };

    const statusConfig: StatusConfig = {
        enabled: false,
    };

    const actionConfig: ActionConfig = {
        enabled: true,
        showAdd: true,
        showDelete: true,
        addButtonText: "Add schedule",
        onAdd: () => {
            setIsOpen(true);
        },
    };

    // ====== add-new-schedule ====== //

    const [addNewSchedule, { isLoading: isAddingSchedule }] = useAddNewScheduleMutation();

    const handleAddSchedule = async (formData: FieldValues) => {
        try {
            const scheduleData = {
                workshop_id: parseInt(id as string),
                date: formData.date instanceof Date 
                    ? formData.date.toISOString().split('T')[0] 
                    : formData.date,
                start_time: formData.start_time,
                end_time: formData.end_time,
                capacity: parseInt(formData.capacity.toString()),
                available_slots: parseInt(formData.available_slots.toString()),
                available_slots_on_site: parseInt(formData.available_slots_on_site.toString()),
            };

            console.log("Submitting schedule data:", scheduleData);

            const result = await addNewSchedule(scheduleData).unwrap();

            console.log("Schedule created:", result);

        } catch (error) {
            console.error("Error creating schedule:", error);
            
            // const errorMessage = error?.data?.message || 
            //     error?.message || 
            //     "Failed to add schedule";
            
            // toast.error(errorMessage);
            
            throw error;
        }
    };

    if (isLoading) return <Loading />;

    return <React.Fragment>

        <div className="container mx-auto py-6">

            <Button variant={'outline'} className='mb-6' onClick={() => router.back()}>
                <ChevronLeft />
                <p>Go Back</p>
            </Button>

            <h1 className="text-2xl font-bold mb-6">Schedule</h1>

            <DataTable<Schedule>
                data={schedules}
                columns={scheduleColumns}
                searchConfig={searchConfig}
                statusConfig={statusConfig}
                actionConfig={actionConfig}
                onDataChange={setSchedules}
                // allowTrigger={true}
            />

            {isOpen && (
                <CrudForm
                    fields={getScheduleFields()}
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    operation={"add"}
                    asDialog={true}
                    validationSchema={scheduleValidationSchema}
                    onSubmit={handleAddSchedule}
                />
            )}

        </div>

    </React.Fragment>

}
