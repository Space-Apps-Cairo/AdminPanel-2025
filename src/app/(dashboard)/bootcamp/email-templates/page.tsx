"use client";

import { EmailColumns } from "./_components/coulmns";
import DataTable from "../../../../components/table/data-table";

import { useRouter } from "next/navigation";
import CrudForm from "@/components/crud-form";
import { useState } from "react";
import Loading from "@/components/loading/loading";

import { useDispatch } from "react-redux";

import { useGetEmailTemplatesQuery } from "@/service/Api/emails/templates";

export default function EmailPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);
  const { data, isLoading } = useGetEmailTemplatesQuery();
  if (isLoading) {
    return <Loading />;
  }
  return (
    <>
      <div className=" px-8 py-6 ">
        <h1 className="text-2xl font-bold mb-6">Email Templates</h1>

        <DataTable<any>
          data={data?.data ?? []}
          columns={EmailColumns}
          searchConfig={{
            enabled: true,
            placeholder: "Search by name or template",
            searchKeys: ["name", "template"],
          }}
          actionConfig={{
            enabled: true,
            showAdd: true,
            showDelete: true,
            addButtonText: "Create Template",
            onAdd: () => {
              router.push("/bootcamp/email-templates/new");
            },
          }}
          // onDeleteRows={deleteBootcamp}
        />
      </div>
    </>
  );
}
