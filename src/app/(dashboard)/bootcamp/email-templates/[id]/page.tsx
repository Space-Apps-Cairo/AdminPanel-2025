"use client";

import React from "react";
import EmailGenerator from "../_components/generator";
import { useGetEmailTemplateByIdQuery } from "@/service/Api/emails/templates";

export default function EditEmailTemplate({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  const { data, isLoading } = useGetEmailTemplateByIdQuery(id);

  if (isLoading) {
    return <div>Loading template...</div>;
  }

  return (
    <div>
      <EmailGenerator mode="edit" email={data?.data} />
    </div>
  );
}
