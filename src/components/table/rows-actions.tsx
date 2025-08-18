<<<<<<< HEAD
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
} from "@/components/ui/alert-dialog";
import CrudForm from "@/components/crud-form";
import { Button } from "@/components/ui/button";
import {
  useDeleteUserMutation,
  useUpdateUserMutation,
  useGetUsersQuery,
} from "@/service/Api/userApi";

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
}: RowsActionsProps) {

    const [isOpen, setIsOpen] = useState(false)
    const [operation, setOperation] = useState<OperationType>("edit");
    const [isDeleting, setIsDeleting] = useState(false)

    const handleButtonClick = (operation: OperationType) => {
        setOperation(operation)
        setIsOpen(true)
    }

    const handleUpdateRow = async (formData: any) => {
        if (updateMutation && rowData?.id) {
            try {
                const result = await updateMutation({
                    id: rowData.id,
                    data: formData
                })

                const unwrappedResult = await result.unwrap()
                onUpdateSuccess?.(unwrappedResult)
                setIsOpen(false)
            } catch (error) {
                onUpdateError?.(error)
            }
        }
    }

    const handleDeleteRow = async () => {
        if (deleteMutation && rowData?.id) {
            try {
                setIsDeleting(true)
                const result = await deleteMutation(rowData.id).unwrap()
                onDeleteSuccess?.(result)
            } catch (error) {
                onDeleteError?.(error)
            } finally {
                setIsDeleting(false)
            }
        } else if (rowData?.id) {
            console.log(`Delete row with ID: ${rowData.id}`, rowData)
        }
    }

    return <React.Fragment>

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
                                <AlertDialogTitle>
                                    Are you absolutely sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete this row.
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

=======
// src/components/table/rows-actions.tsx
"use client";

import { Eye, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import CrudForm from "@/components/crud-form";
import { Participant } from "@/types/table";
import { useDeleteParticipantMutation } from "@/store/api/participantsApi";
import { useState } from "react";

interface RowsActionsProps {
  row: Participant;
  onSuccess?: () => void;
}

export default function RowsActions({ row, onSuccess }: RowsActionsProps) {
  const [openView, setOpenView] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [deleteParticipant] = useDeleteParticipantMutation();

  const handleDelete = async () => {
    try {
      await deleteParticipant(row.id).unwrap();
      onSuccess?.();
      setOpenDelete(false);
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="flex gap-2">
      {/* View */}
      <Dialog open={openView} onOpenChange={setOpenView}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon">
            <Eye className="w-4 h-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <CrudForm formType="view" defaultValues={row} onClose={() => setOpenView(false)} />
        </DialogContent>
      </Dialog>

      {/* Edit */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon">
            <Edit className="w-4 h-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <CrudForm
            formType="edit"
            id={row.id}
            defaultValues={row}
            onSuccess={() => {
              onSuccess?.();
            }}
            onClose={() => setOpenEdit(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete */}
      <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" size="icon">
            <Trash2 className="w-4 h-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>هل أنت متأكد من حذف هذا العنصر؟</AlertDialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>حذف</AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
>>>>>>> 5b0490d00324e886d65979efd1577e3af36f4623
}
