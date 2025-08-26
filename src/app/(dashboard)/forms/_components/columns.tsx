
import { ColumnDef } from "@tanstack/react-table";
import RowsActions from "@/components/table/rows-actions";
import {
  useDeleteFormMutation,
  useGetFormModelByIdQuery,
  useUpdateFormMutation,
} from "@/service/Api/forms";
import { Form, FormableItem, FormableType } from "@/types/forms";
import { Field } from "@/app/interface";
import { FormSchema } from "@/validations/forms";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";



export const getFormFields = (formData?: Form,
  formableData?: FormableType[],
  filteredFormableIds?: FormableItem[]): Field[] => {

  console.log(formableData, "zzz");
  formableData?.forEach(fd => {
    console.log(fd.name, "fd");
  })

  const getFormableId = (formableTypeId?: string) => {
    if (!formableTypeId) return [];
    const matched = formableData?.find(fd =>
      String(fd.formable_type_id) === String(formableTypeId)
    );
    if (!matched) return [];
    return matched.data.map(d => ({
      label: d.name_en,
      value: String(d.formable_id),
    }));
  };

  console.log(getFormableId("1"), "89999");
  return [
    {
      name: "title",
      type: "text",
      label: "Title",
      ...(formData?.title && { defaultValue: formData.title }),
      placeholder: "Enter form title",
    },
    {
      name: "description",
      type: "text",
      label: "Description",
      ...(formData?.description && { defaultValue: formData.description }),
      placeholder: "Enter form description",
    },
    {
      name: "formable_type_id",
      type: "select",
      label: "Formable Type ID",
      placeholder: "select formable type",
      options: formableData?.map(fd => ({
        label: fd.name,
        value: fd.formable_type_id.toString(),
      })),
      ...(formData?.formable_type_id && {
        defaultValue: formData.formable_type_id.toString(),
      }),
    },
    {
      name: "formable_id",
      type: "select",
      label: "Formable ID",
      placeholder: " select formable id",
      dependsOn: {
        name: "formable_type_id",
        data: getFormableId,

      },
      options: filteredFormableIds?.map(d => ({
        label: d.name_en,
        value: d.formable_id.toString(),
      })),
      ...(formData?.formable_id && { defaultValue: formData.formable_id.toString() }),
    },
    {
      name: "is_active",
      type: "select",
      label: "Status",
      placeholder: "select active status",
      options: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
      ],
      ...(formData?.is_active !== undefined && {
        defaultValue: formData.is_active ? "active" : "inactive",
      }),
    }
  ];
}

export const formColumns: ColumnDef<Form>[] = [
  {
    header: "ID",
    accessorKey: "id",
    size: 50,
    enableHiding: false,
  },
  {
    header: "Title",
    accessorKey: "title",
    size: 200,
    enableHiding: false,
  },
  {
    header: "Description",
    accessorKey: "description",
    size: 250,
  },
  {
    header: "Formable Type",
    accessorKey: "formable_type_id",
    size: 100,
  },
  {
    header: "Formable ID",
    accessorKey: "formable_id",
    size: 100,
  },
  {
    header: "Created At",
    accessorKey: "created_at",
    cell: ({ row }) =>
      row.original.created_at
        ? format(new Date(row.original.created_at), "yyyy-MM-dd HH:mm:ss")
        : "-",
    size: 150,
  },
  {
    header: "Updated At",
    accessorKey: "updated_at",
    cell: ({ row }) =>
      row.original.updated_at
        ? format(new Date(row.original.updated_at), "yyyy-MM-dd HH:mm:ss")
        : "-",
    size: 150,
  },
  {
    header: "Status",
    accessorKey: "is_active",
    cell: ({ row }) =>
      row.original.is_active ? (
        <Badge variant="outline">Active</Badge>
      ) : (
        <Badge variant="destructive">Inactive</Badge>
      ),
    size: 110,
  },

  {
    id: "actions",
    header: () => <span>Actions</span>,
    cell: ({ row }) => <FormRowActions rowData={row.original} />,
    size: 150,
    enableHiding: false,
  },
];


function FormRowActions({ rowData }: { rowData: Form }) {
  const [updateForm] = useUpdateFormMutation();
  const [deleteForm] = useDeleteFormMutation();

  return (
    <RowsActions
      navigateBtn={{
        name: "Form Builder",
        url: `/forms/form-builder/${rowData.id}`,
      }}
      rowData={rowData}
      isDelete={true}
      fields={getFormFields(rowData)}
      validationSchema={FormSchema}
      updateMutation={updateForm}
      deleteMutation={deleteForm}
      onUpdateSuccess={(result) => console.log("Form updated:", result)}
      onUpdateError={(error) => console.error("Update error:", error)}
      onDeleteSuccess={(result) => console.log("Form deleted:", result)}
      onDeleteError={(error) => console.error("Delete error:", error)}
    />
  );
}
