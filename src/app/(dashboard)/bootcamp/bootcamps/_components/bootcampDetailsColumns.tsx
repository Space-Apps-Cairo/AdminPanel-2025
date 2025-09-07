import { Field } from "@/app/interface";
import RowsActions from "@/components/table/rows-actions";
import { Button } from "@/components/ui/button";
import { useDeleteBootcampDetailsMutation, useUpdateBootcampDetailsMutation } from "@/service/Api/bootcampDetails";
import { BootcampDetailsRequest, BootcampDetailsType } from "@/types/bootcampDetails";
import { bootcampDetailsValidationSchema } from "@/validations/bootcampDetails";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronRight, QrCode } from "lucide-react";
import Link from "next/link";
import { toast } from 'sonner';
import React, { useEffect, useState } from "react";
import QrScanner from "@/components/scanner/QrScanner";
import { useRegisterBootcampAttendeeMutation } from "@/service/Api/bootcamp";

export const getBootcampDetailsFields = (bootcampData?: BootcampDetailsType): Field[] => [

    {
        name: "name",
        type: "text",
        label: "Bootcamp Name",
        placeholder: "Enter the bootcamp name",
        ...(bootcampData?.name && { defaultValue: bootcampData.name }),
        step: 1,
    },

    {
        name: "date",
        type: "date",
        label: "Date",
        placeholder: "Enter the bootcamp date",
        ...(bootcampData?.date && { defaultValue: bootcampData.date.slice(0, 16)}),
        // ...(workshop?.start_date && { defaultValue: workshop.start_date }),
        step: 1,
    },

    {
        name: "total_capacity",
        type: "number",
        label: "Total Capacity",
        placeholder: "Enter the bootcamp capacity",
        ...(bootcampData?.total_capacity && { defaultValue: bootcampData.total_capacity }),
        step: 1,
    },

];

export const bootcampDetailsColumns: ColumnDef<BootcampDetailsType>[] = [

    {
        header: "Name",
        accessorKey: "name",
        size: 220,
        enableHiding: false,
    },

    {
        header: "Date",
        accessorKey: "date",
        size: 180,
        enableHiding: false,
        cell: ({ row }) => {
            return (
                <p>{row.original.date.split(" ")[0].split("-").reverse().join("-")}</p>
            );
        },
    },

    {
        header: "Total Capacity",
        accessorKey: "total_capacity",
        size: 150,
        enableHiding: false,
    },

    {
        header: "Attendees",
        cell: ({ row }) => (
            <Button variant="outline" size="sm">
                <Link href={`bootcamps/${row.original.id}`}>Attendees</Link>
                <ChevronRight />
            </Button>
        ),
        size: 180,
        enableHiding: false,
    },

    {
        id: "actions",
        header: () => <span>Actions</span>,
        cell: ({ row }) => (
            <BootcampDetailsRowActions rowData={row.original} />
        ),
        size: 150,
        enableHiding: false,
    },
];

function BootcampDetailsRowActions({ rowData }: { rowData: BootcampDetailsType }) {
    const [updateBootcampDetails] = useUpdateBootcampDetailsMutation();
    const [deleteBootcampDetails] = useDeleteBootcampDetailsMutation();
    const [registerAttendee] = useRegisterBootcampAttendeeMutation();
    const [showScanner, setShowScanner] = useState(false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => setIsClient(true), []);

    return (
        <React.Fragment>
            <div className="flex items-center gap-2">
                <Button 
                    variant="outline" size={'sm'} 
                    onClick={() => setShowScanner(true)}
                >
                    <QrCode />
                </Button>

                <RowsActions
                    rowData={rowData}
                    isDelete={true}
                    isUpdate={true}
                    isPreview={true}
                    fields={getBootcampDetailsFields(rowData)}
                    validationSchema={bootcampDetailsValidationSchema}
                    updateMutation={(data: BootcampDetailsType) => {
                        const formattedData = {
                            ...data,
                            date: data.date ? new Date(data.date).toISOString().slice(0, 19).replace('T', ' ') : null,
                        };
                        return updateBootcampDetails({ id: rowData.id, data: formattedData as BootcampDetailsRequest });
                    }}
                    deleteMutation={deleteBootcampDetails}
                    onUpdateSuccess={(result) => {
                        console.log('Bootcamp Details updated successfully:', result);
                        toast.success(result.message || "Bootcamp Details updated successfully!");
                    }}
                    onUpdateError={(error) => {
                        console.error('Error updating bootcamp details:', error);
                        toast.error(error.data?.message || "Failed to update bootcamp details. Please try again.");
                    }}
                    onDeleteSuccess={(result) => {
                        console.log('Bootcamp Details deleted successfully:', result);
                        toast.success(result.message || "Bootcamp Details deleted successfully!");
                    }}
                    onDeleteError={(error) => {
                        console.error('Error deleting bootcamp details:', error);
                        toast.error(error.data?.message || "Failed to delete bootcamp details. Please try again.");
                    }}
                />
            </div>

            {isClient && showScanner && (
                <QrScanner
                    onScanSuccess={async (res) => {
                        try {
                            setShowScanner(false);
                            const participantUuid = String(res).trim();
                            const result = await registerAttendee({
                                bootcamp_details_id: Number(rowData.id),
                                bootcamp_participant_uuid: participantUuid,
                                category: "1",
                                attendance_status: "attended"
                            }).unwrap();

                            toast.success("Registration successful", {
                                description: `Participant ${result.data.bootcamp_participant.name_en} registered successfully`,
                            });
                        } catch (err: unknown) {
                            console.error('Registration error:', err);
                            
                            // تحسين معالجة الأخطاء
                            let errorMessage = "An error occurred while registering the participant.";
                            
                            if (err && typeof err === 'object' && 'data' in err) {
                                const errorData = (err as any).data;
                                
                                // التحقق من وجود رسائل خطأ محددة
                                if (errorData?.errors?.bootcamp_participant_uuid?.[0]) {
                                    errorMessage = errorData.errors.bootcamp_participant_uuid[0];
                                } else if (errorData?.message) {
                                    errorMessage = errorData.message;
                                } else if (errorData?.error) {
                                    errorMessage = errorData.error;
                                }
                            } else if (err && typeof err === 'object' && 'message' in err) {
                                errorMessage = (err as any).message;
                            }
                            
                            toast.error("Registration failed", {
                                description: errorMessage,
                            });
                        }
                    }}
                    onError={(msg) => {
                        setShowScanner(false);
                        toast.error("Scan error", {
                            description: msg || "An error occurred while registering the participant.",
                        });
                    }}
                    onClose={() => setShowScanner(false)}
                />
            )}
        </React.Fragment>
    );
}