"use client";

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
} from "../ui/alert-dialog";
import CrudForm from "../crud-form";
import { Button } from "../ui/button";


export default function RowsActions({
  steps,
  fields,
  rowData,
  isDelete = false,
  isUpdate = true,
  asDialog = true,
  isPreview = true,
  validationSchema,
  updateMutation,
  deleteMutation,
  onUpdateSuccess,
  onUpdateError,
  onDeleteSuccess,
  onDeleteError,
  customPreviewHandler,
}: RowsActionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [operation, setOperation] = useState<OperationType>("edit");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleButtonClick = (operation: OperationType) => {
    setOperation(operation);
    setIsOpen(true);
  };

  const handleUpdateRow = async (formData: any) => {
    if (updateMutation && rowData?.id) {
      try {
        const result = await updateMutation({
          id: rowData.id,
          data: formData,
        });

        const unwrappedResult = await result.unwrap();
        onUpdateSuccess?.(unwrappedResult);
        setIsOpen(false);
      } catch (error) {
        onUpdateError?.(error);
      }
    }
  };

  const handleDeleteRow = async () => {
    if (deleteMutation && rowData?.id) {
      try {
        setIsDeleting(true);
        const result = await deleteMutation(rowData.id).unwrap();
        onDeleteSuccess?.(result);
      } catch (error) {
        onDeleteError?.(error);
      } finally {
        setIsDeleting(false);
      }
    } else if (rowData?.id) {
      console.log(`Delete row with ID: ${rowData.id}`, rowData);
    }
  };

  return (
    <React.Fragment>
      {isOpen && (
        <CrudForm
          fields={fields}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          operation={operation}
          asDialog={asDialog}
          validationSchema={validationSchema}
          steps={steps}
          onSubmit={handleUpdateRow}
        />
      )}

      <div className="py-2.5 flex items-center gap-2.5">
        {isPreview && (
          <Button
            onClick={() =>customPreviewHandler
        ? customPreviewHandler(rowData): handleButtonClick("preview")}
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
                    this row.
                  </AlertDialogDescription>
                </AlertDialogHeader>
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteRow}
                  disabled={isDeleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </React.Fragment>
  );
}
