"use client";

import { useState } from "react";
import DataTable from "../../../../../../../components/table/data-table";
import CrudForm from "../../../../../../../components/crud-form";
import { AssignmentSchema } from "@/validations/assignment";
import {
  assignmentColumns,
  getAssignmentFields,
} from "@/app/(dashboard)/bootcamp/participants/[id]/_components/columns/assignmentColumns";
import { ColumnDef } from "@tanstack/react-table";

interface AssignmentsTabProps {
  assignData: any[];
  assignmentColumns: ColumnDef<any, any>[];
  handleAddAssignment: (formData: any) => void;
}

export default function AssignmentsTab({
  assignData,
  assignmentColumns,
  handleAddAssignment,
}: AssignmentsTabProps) {
  const [isAssignFormOpen, setIsAssignFormOpen] = useState(false);

  return (
    <div>
      <h1 className="text-2xl font-bold py-5">Participant Assignments</h1>
      <DataTable
        data={assignData}
        columns={assignmentColumns}
        searchConfig={{ enabled: false }}
        statusConfig={{ enabled: false }}
        actionConfig={{
          enabled: true,
          showAdd: true,
          showDelete: true,
          addButtonText: "Add Assignment",
          onAdd: () => setIsAssignFormOpen(true),
        }}
      />

      {isAssignFormOpen && (
        <CrudForm
          fields={getAssignmentFields()}
          isOpen={isAssignFormOpen}
          setIsOpen={setIsAssignFormOpen}
          operation="add"
          asDialog={true}
          validationSchema={AssignmentSchema}
          onSubmit={handleAddAssignment}
        />
      )}
    </div>
  );
}
