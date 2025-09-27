// evaluation-form.tsx - Updated validation to ignore header fields
"use client";

import React from "react";
import CrudForm from "@/components/crud-form";
import { useEvaluationFields } from "./fields";
import { z } from "zod";

// Create dynamic validation schema that ignores header fields
const createValidationSchema = (fields: any[]) => {
  const schema: Record<string, any> = {};

  fields.forEach(field => {
    // Skip validation for header fields
    if (field.name.startsWith('criteria_')) {
      // Add validation for both select and radio fields
      if (field.type === "select" || field.type === "radio") {
        schema[field.name] = z.string().min(1, "This field is required");
      }
    }
  });

  return z.object(schema);
};

interface EvaluationFormProps {
  operation: "add" | "edit" | "preview";
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSubmit: (data: any, formData?: FormData) => Promise<void> | void;
  initialData?: any;
}

export default function EvaluationForm(props: EvaluationFormProps) {
  const { fields, steps } = useEvaluationFields();

  // Filter out header fields from form data submission
  const filteredFields = fields.filter(field => !field.name.startsWith('category_header_'));

  // Create validation schema only for criteria fields
  const validationSchema = createValidationSchema(filteredFields);

  const handleSubmit = async (data: any, formData?: FormData) => {
    // Filter out header fields from submitted data
    const filteredData = Object.fromEntries(
      Object.entries(data).filter(([key]) => !key.startsWith('category_header_'))
    );

    console.log("Filtered evaluation data:", filteredData);
    await props.onSubmit(filteredData, formData);
  };

  if (fields.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <p>Loading evaluation criteria...</p>
      </div>
    );
  }

  return (
    <CrudForm
      operation={props.operation}
      fields={fields}
      isOpen={props.isOpen}
      setIsOpen={props.setIsOpen}
      validationSchema={validationSchema}
      steps={steps}
      onSubmit={handleSubmit}
    />
  );
}