"use client";

import { useState } from "react";
import DataTable from "../../../../../../../components/table/data-table";
import CrudForm from "../../../../../../../components/crud-form";
import {teamColumns } from "../columns/rejectcolumns"

interface rejectTabProps {
  Data: any[];
  handleAddteam: (formData: any) => void;
}
export default function RejectTab() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div>
      <h1 className="text-2xl font-bold py-5">Rejected Teams</h1>

      <DataTable
        data={[]}
        columns={teamColumns}
        searchConfig={{ enabled: false }}
        statusConfig={{ enabled: false }}
        actionConfig={{
          enabled: true,
          showAdd: true,
          showDelete: true,
          addButtonText: "Add Team",
          onAdd: () => setIsFormOpen(true),
        }}
      />

      {/* {isFormOpen && (
        <CrudForm
          fields={any}
          isOpen={isFormOpen}
          setIsOpen={setIsFormOpen}
          operation="add"
          asDialog={true}
          validationSchema={ParticipantPreferenceSchema}
          onSubmit={}
        />
      )} */}
    </div>
  );
}