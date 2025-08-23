"use client";

import { useState } from "react";
import DataTable from "../../../../../../../components/table/data-table";
import CrudForm from "../../../../../../../components/crud-form";
import {
  preferenceColumns,
  getPreferenceFields,
} from "@/app/(dashboard)/bootcamp/participants/[id]/_components/columns/preferenceColumns";
import { ParticipantPreferenceSchema } from "@/validations/preference";

interface PreferencesTabProps {
  prefData: any[];
  workshopOptions: any[];
  handleAddPreference: (formData: any) => void;
}
export default function PreferencesTab({
  prefData,
  workshopOptions,
  handleAddPreference,
}: PreferencesTabProps) {
  const [isPrefFormOpen, setIsPrefFormOpen] = useState(false);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Participant Preferences</h1>

      <DataTable
        data={prefData}
        columns={preferenceColumns(workshopOptions)}
        searchConfig={{ enabled: false }}
        statusConfig={{ enabled: false }}
        actionConfig={{
          enabled: true,
          showAdd: true,
          showDelete: true,
          addButtonText: "Add Preference",
          onAdd: () => setIsPrefFormOpen(true),
        }}
      />

      {isPrefFormOpen && (
        <CrudForm
          fields={getPreferenceFields(undefined, workshopOptions)}
          isOpen={isPrefFormOpen}
          setIsOpen={setIsPrefFormOpen}
          operation="add"
          asDialog={true}
          validationSchema={ParticipantPreferenceSchema}
          onSubmit={handleAddPreference}
        />
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import DataTable from "../../../../../../../components/table/data-table";
import CrudForm from "../../../../../../../components/crud-form";
import {
  preferenceColumns,
  getPreferenceFields,
} from "@/app/(dashboard)/bootcamp/participants/[id]/_components/columns/preferenceColumns";
import { ParticipantPreferenceSchema } from "@/validations/preference";

interface PreferencesTabProps {
  prefData: any[];
  workshopOptions: any[];
  handleAddPreference: (formData: any) => void;
}
export default function PreferencesTab({
  prefData,
  workshopOptions,
  handleAddPreference,
}: PreferencesTabProps) {
  const [isPrefFormOpen, setIsPrefFormOpen] = useState(false);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Participant Preferences</h1>

      <DataTable
        data={prefData}
        columns={preferenceColumns(workshopOptions)}
        searchConfig={{ enabled: false }}
        statusConfig={{ enabled: false }}
        actionConfig={{
          enabled: true,
          showAdd: true,
          showDelete: true,
          addButtonText: "Add Preference",
          onAdd: () => setIsPrefFormOpen(true),
        }}
      />

      {isPrefFormOpen && (
        <CrudForm
          fields={getPreferenceFields(undefined, workshopOptions)}
          isOpen={isPrefFormOpen}
          setIsOpen={setIsPrefFormOpen}
          operation="add"
          asDialog={true}
          validationSchema={ParticipantPreferenceSchema}
          onSubmit={handleAddPreference}
        />
      )}
    </div>
  );
}
