

// src/components/crud-form.tsx

"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { participantSchema, ParticipantFormValues } from "@/validations/participantSchema";
import { useAddParticipantMutation, useUpdateParticipantMutation } from "@/store/api/participantsApi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CrudFormProps {
  formType?: "create" | "edit" | "view";
  defaultValues?: Partial<ParticipantFormValues>;
  id?: number;
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function CrudForm({
  formType = "create",
  defaultValues,
  id,
  onSuccess,
  onClose,
}: CrudFormProps) {
  const [addParticipant] = useAddParticipantMutation();
  const [updateParticipant] = useUpdateParticipantMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ParticipantFormValues>({
    resolver: zodResolver(participantSchema),
    defaultValues: defaultValues as any,
  });

  useEffect(() => {
    if (defaultValues) reset(defaultValues as any);
  }, [defaultValues, reset]);

  const onSubmit = async (data: ParticipantFormValues) => {
    try {
      if (formType === "edit" && id) {
        await updateParticipant({ id, data }).unwrap();
      } else if (formType === "create") {
        await addParticipant(data).unwrap();
      }
      onSuccess?.();
      onClose?.();
    } catch (err) {
      console.error("Form submit error:", err);
    }
  };

  const readonly = formType === "view";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Name</label>
        {readonly ? (
          <div className="py-2">{defaultValues?.name}</div>
        ) : (
          <Input {...register("name")} placeholder="Name" />
        )}
        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Email</label>
        {readonly ? (
          <div className="py-2">{defaultValues?.email}</div>
        ) : (
          <Input {...register("email")} placeholder="Email" />
        )}
        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Phone</label>
        {readonly ? (
          <div className="py-2">{defaultValues?.phone}</div>
        ) : (
          <Input {...register("phone")} placeholder="Phone" />
        )}
        {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Gender</label>
        {readonly ? (
          <div className="py-2">{defaultValues?.gender}</div>
        ) : (
          <select {...register("gender")} className="w-full border rounded px-2 py-1">
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        )}
        {errors.gender && <p className="text-sm text-red-500">{errors.gender.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Status</label>
        {readonly ? (
          <div className="py-2">{defaultValues?.status}</div>
        ) : (
          <select {...register("status")} className="w-full border rounded px-2 py-1">
            <option value="">Select status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        )}
        {errors.status && <p className="text-sm text-red-500">{errors.status.message}</p>}
      </div>

      {!readonly && (
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {formType === "edit" ? "Update" : "Create"}
          </Button>
        </div>
      )}
    </form>
  );
}
