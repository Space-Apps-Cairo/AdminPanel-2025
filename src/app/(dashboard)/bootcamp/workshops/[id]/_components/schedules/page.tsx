import Loading from "../../../../../../../components/loading/loading";
import DataTable from "../../../../../../../components/table/data-table";
import {
  useAddNewScheduleMutation,
  useGetWorkshopScheduleQuery,
} from "@/service/Api/workshops";
import { ActionConfig, SearchConfig, StatusConfig } from "@/types/table";
import { Schedule } from "@/types/workshop";
import { useEffect, useState } from "react";
import { FieldValues } from "react-hook-form";
import { getScheduleFields, scheduleColumns } from "../columns";
import CrudForm from "../../../../../../../components/crud-form";
import { scheduleValidationSchema } from "@/validations/schedule";

// Schedules Tab Component
export default function SchedulesTab({
  schedules,
  workshopId,
}: {
  schedules: Schedule[];
  workshopId: string;
}) {
  const {
    data: scheduleData,
    isLoading: isLoadingSchedules,
    error: scheduleError,
  } = useGetWorkshopScheduleQuery(workshopId, {
    skip: !workshopId,
  });

  // const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // useEffect(() => {
  //   if (
  //     scheduleData &&
  //     scheduleData.data &&
  //     !isLoadingSchedules &&
  //     !scheduleError
  //   ) {
  //     setSchedules(scheduleData.data.schedules);
  //   }
  // }, [scheduleData, isLoadingSchedules, scheduleError]);

  const searchConfig: SearchConfig = { enabled: false };
  const statusConfig: StatusConfig = { enabled: false };

  const actionConfig: ActionConfig = {
    enabled: true,
    showAdd: true,
    showDelete: true,
    addButtonText: "Add schedule",
    onAdd: () => setIsOpen(true),
  };

  const [addNewSchedule, { isLoading: isAddingSchedule }] =
    useAddNewScheduleMutation();

  const handleAddSchedule = async (formData: FieldValues) => {
    try {
      const scheduleData = {
        workshop_id: parseInt(workshopId),
        date:
          formData.date instanceof Date
            ? formData.date.toISOString().split("T")[0]
            : formData.date,
        start_time: `${formData.start_time}:00`,
        end_time: `${formData.end_time}:00`,
        capacity: parseInt(formData.capacity.toString()),
        available_slots: parseInt(formData.available_slots.toString()),
        available_slots_on_site: parseInt(
          formData.available_slots_on_site.toString()
        ),
      };

      await addNewSchedule(scheduleData).unwrap();
      setIsOpen(false);
    } catch (error) {
      console.error("Error creating schedule:", error);
      throw error;
    }
  };

  if (isLoadingSchedules) return <Loading />;
  if (scheduleError)
    return <div className="text-red-500">Error loading schedules</div>;

  return (
    <div>
      <DataTable<Schedule>
        data={schedules}
        columns={scheduleColumns}
        searchConfig={searchConfig}
        statusConfig={statusConfig}
        actionConfig={actionConfig}
        // onDataChange={setSchedules}
      />

      {isOpen && (
        <CrudForm
          fields={getScheduleFields()}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          operation="add"
          asDialog={true}
          validationSchema={scheduleValidationSchema}
          onSubmit={handleAddSchedule}
        />
      )}
    </div>
  );
}
