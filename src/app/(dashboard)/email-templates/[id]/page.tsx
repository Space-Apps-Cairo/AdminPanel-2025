"use client";

import React from "react";
import EmailGenerator from "../_components/generator";
import { useGetEmailTemplateByIdQuery } from "@/service/Api/emails/templates";
import Loading from "@/components/loading/loading";

export default function EditEmailTemplate({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  const { data, isLoading } = useGetEmailTemplateByIdQuery(id);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <EmailGenerator mode="edit" email={data?.data} />
    </div>
  );
}
