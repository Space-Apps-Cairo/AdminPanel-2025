"use client";

import React, { useEffect, useState } from "react";
import { ActionConfig, SearchConfig } from "@/types/table";
import DataTable from "../../../../components/table/data-table";
import {
  getParticipantsFields,
  participantColumns,
} from "./_components/coulmns";
import Loading from "../../../../components/loading/loading";
import CrudForm from "../../../../components/crud-form";
import {
  ParticipantFormValues,
  participantValidationSchema,
} from "@/validations/participantSchema";
import {
  useAddNewParticipantMutation,
  useGetAllParticipantsQuery,
} from "@/service/Api/participants";
import { Participant } from "@/types/participants";
import { ParticipantRequest } from "@/types/participants";

export default function ParticipantsPage() {
  const {
    data: participantsData,
    isLoading,
    error,
  } = useGetAllParticipantsQuery();

  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (participantsData?.data) {
      setParticipants(participantsData.data);
    }
  }, [participantsData]);

  const searchConfig: SearchConfig = {
    enabled: true,
    placeholder: "Filter by ID, National ID, Email or Phone",
    searchKeys: ["id", "national", "email", "phone_number"],
  };

  const actionConfig: ActionConfig = {
    enabled: true,
    showAdd: true,
    addButtonText: "Add Participant",
    onAdd: () => setIsOpen(true),
  };

  const [addParticipant] = useAddNewParticipantMutation();

  const handleAddParticipant = async (data: ParticipantFormValues) => {
    try {
      // Convert to FormData if files are involved
      const formData = new FormData();

      // Append all fields
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });

      const result = await addParticipant(
        formData as unknown as ParticipantRequest
      ).unwrap();
      if (result.data) {
        setParticipants((prev) => [...prev, result.data]);
      }
      setIsOpen(false);
    } catch (error) {
      console.error("Error adding participant:", error);
    }
  };

  if (isLoading) return <Loading />;
  if (error) return <div>Error loading participants</div>;

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Participants</h1>

      <DataTable<Participant>
        data={participants}
        columns={participantColumns}
        searchConfig={searchConfig}
        actionConfig={actionConfig}
        onDataChange={setParticipants}
      />

      {isOpen && (
        <CrudForm
          fields={getParticipantsFields()}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          operation="add"
          asDialog={true}
          validationSchema={participantValidationSchema}
          onSubmit={handleAddParticipant}
          steps={[1, 2, 3]}
        />
      )}
    </div>
  );
}
