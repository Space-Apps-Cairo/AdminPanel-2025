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
}
