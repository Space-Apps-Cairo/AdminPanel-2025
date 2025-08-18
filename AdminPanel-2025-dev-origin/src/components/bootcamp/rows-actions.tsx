

"use client";

import { BootcampType } from "@/types/bootcamp";
import React, { useState } from "react";
import { Eye, SquarePen, Trash, CircleAlertIcon } from "lucide-react";
import { OperationType, RowsActionsProps } from "@/types/rows-actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import CrudForm from "@/components/crud-form";
import { Button } from "@/components/ui/button";
import {
  useDeleteBootcampMutation,
  useUpdateBootcampMutation,
  useGetBootcampsQuery,
} from "@/service/Api/bootcamp";

export default function RowsActions({
  steps,
  fields,
  rowData,
  isDelete = false,
  isUpdate = true,
  asDialog = true,
  isPreview = true,
  validationSchema,
}: RowsActionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [operation, setOperation] = useState<OperationType>("edit");

  const [deleteBootcamp] = useDeleteBootcampMutation();
  const [updateBootcamp] = useUpdateBootcampMutation();
  const { refetch } = useGetBootcampsQuery();

  const handleButtonClick = (op: OperationType) => {
    setOperation(op);
    setIsOpen(true);
  };

  const handleDeleteRow = async () => {
    if (rowData?.id) {
      try {
        await deleteBootcamp(rowData.id).unwrap();
        await refetch();
      } catch (error) {
        console.error("Delete error:", error);
      }
    }
  };

  return (
    <>
      {isOpen && (
        <CrudForm
          fields={fields}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          operation={operation}
          asDialog={asDialog}
          validationSchema={validationSchema}
          steps={steps}
          onSubmit={async (values) => {
            if (operation === "edit") {
              try {
                const payload: BootcampType = {
                  id: rowData?.id as string | number,
                  name: values.name as string,
                  date: values.date as string,
                  total_capacity: Number(values.total_capacity),
                  forms: [], // مهم تحطيه عشان type BootcampType
                };

                await updateBootcamp(payload).unwrap();
                setIsOpen(false);
                await refetch();
              } catch (error) {
                console.error("Update error:", error);
              }
            }
          }}
        />
      )}

      <div className="py-2.5 flex items-center gap-2.5">
        {isPreview && (
          <Button
            onClick={() => handleButtonClick("preview")}
            variant="outline"
            size="sm"
          >
            <Eye size={16} />
          </Button>
        )}

        {isUpdate && (
          <Button
            onClick={() => handleButtonClick("edit")}
            variant="outline"
            size="sm"
          >
            <SquarePen size={16} />
          </Button>
        )}

        {isDelete && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Trash size={16} />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
                <div
                  className="flex size-9 shrink-0 items-center justify-center rounded-full border"
                  aria-hidden="true"
                >
                  <CircleAlertIcon className="opacity-80" size={16} />
                </div>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    this bootcamp.
                  </AlertDialogDescription>
                </AlertDialogHeader>
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteRow}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </>
  );
}
