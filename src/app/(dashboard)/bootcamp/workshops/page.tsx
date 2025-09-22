"use client";

import { Workshop } from "@/types/workshop";
import React, { useEffect, useState } from "react";
import {
  ActionConfig,
  SearchConfig,
  StatusConfig,
} from "@/types/table";
import DataTable from "../../../../components/table/data-table";
import { getWorkshopsFields, workshopColumns } from "./_components/columns";
import Loading from "../../../../components/loading/loading";
import CrudForm from "../../../../components/crud-form";
import { workshopValidationSchema } from "@/validations/workshop";
import {
  useAddNewWorkshopMutation,
  useGetAllWorkshopsQuery,
  useCheckInWorkshopParticipantMutation,
} from "@/service/Api/workshops";
import { FieldValues } from "react-hook-form";
import { toast } from "sonner";
import { ChevronRight, QrCode, Upload, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import QrScanner from "@/components/scanner/QrScanner";

// Helper function to convert array of strings to HTML
const descriptionArrayToHtml = (descriptionArray: string[]): string => {
  if (!Array.isArray(descriptionArray) || descriptionArray.length === 0) {
    return '';
  }
  
  const listItems = descriptionArray
    .filter(item => item && item.trim())
    .map(item => {
      // Escape HTML entities
      const escapedItem = item
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
      
      return `<li style="margin-bottom:8px;">${escapedItem}</li>`;
    })
    .join('');
  
  return `<ul style="margin:10px 0 10px 20px;padding:0;font-size:15px;color:#333;line-height:1.6;">${listItems}</ul>`;
};

export default function Workshops() {
  const {
    data: workshopsData,
    isLoading: isLoadingWorkshops,
    error: workshopsError,
  } = useGetAllWorkshopsQuery();

  const [isOpen, setIsOpen] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const [checkInParticipant] = useCheckInWorkshopParticipantMutation();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleQrScan = async (uuid: string) => {
    try {
      const result = await checkInParticipant({
        bootcamp_participant_uuid: uuid,
      }).unwrap();

      if (result.success) {
        toast.success("Participant checked in successfully");
      } else {
        toast.error("Failed to check in participant");
      }
    } catch (error: any) {
      console.error("Check-in error:", error);
      toast.error(
        error?.data?.message || "An error occurred during check-in"
      );
    }
  };

  const searchConfig: SearchConfig = {
    enabled: true,
    placeholder: "Filter by title",
    searchKeys: ["title"],
  };

  const statusConfig: StatusConfig = {
    enabled: false,
  };

  const actionConfig: ActionConfig = {
    enabled: true,
    showAdd: true,
    showDelete: true,
    addButtonText: "Add workshop",
    onAdd: () => {
      setIsOpen(true);
    },
  };

  // ====== add-new-workshop ====== //

  const [addWorkshop] = useAddNewWorkshopMutation();

  const handleAddWorkshopSubmit = async (
    data: FieldValues,
    formData?: FormData
  ) => {
    try {
      console.log("Submitting workshop data:", data);
      console.log(
        "Form data:",
        formData ? [...formData.entries()] : "No form data"
      );

      const workshopData: Omit<Workshop, "id" | "created_at" | "schedules"> = {
        title: data.title,
        description: descriptionArrayToHtml(data.description),
        workshop_details: data.workshop_details,
        start_date:
          data.start_date instanceof Date
            ? data.start_date.toISOString().split("T")[0]
            : data.start_date,
        end_date:
          data.end_date instanceof Date
            ? data.end_date.toISOString().split("T")[0]
            : data.end_date,
      };

      const result = await addWorkshop(workshopData as Workshop).unwrap();

      toast.success(result.message || "Workshop created successfully");

    } catch (error) {
      const err = error as any;
      toast.error("Failed to add workshop. Please try again.", {
        description: err?.message || err?.data?.message || "Unexpected error",
      });
      throw error;
    }
  };

  if (isLoadingWorkshops) return <Loading />;

  if (workshopsError) {
    return (
      <div className="mx-auto py-6">
        <div className="text-red-500">Error loading workshops</div>
      </div>
    );
  }

  return (
    <React.Fragment>
      <div className="mx-auto py-6 flex flex-col gap-6 px-7">

        <div className='w-full flex flex-wrap item-center justify-between'>

          <h1 className="text-2xl font-bold mb-6">Workshops</h1>

          <div className="flex items-center gap-2">

            <Button onClick={() => setShowScanner(true)}>
                <QrCode size={16} />
                Check Attendees
            </Button>

          </div>

        </div>

        <DataTable<Workshop>
          data={workshopsData?.data || []}
          columns={workshopColumns}
          searchConfig={searchConfig}
          statusConfig={statusConfig}
          actionConfig={actionConfig}
          allowTrigger={true}
        />

        {isOpen && (
          <CrudForm
            fields={getWorkshopsFields()}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            operation={"add"}
            asDialog={true}
            steps={[1, 2]}
            validationSchema={workshopValidationSchema}
            onSubmit={handleAddWorkshopSubmit}
          />
        )}

        {isClient && showScanner && (
          <QrScanner
            onScanSuccess={async (res) => {
              try {
                setShowScanner(false);
                const participantUuid = String(res).trim();
                await handleQrScan(participantUuid);
              } catch (err: unknown) {
                const apiErr = err as { data?: { message?: string } };
                toast.error("Scan error", {
                  description: apiErr?.data?.message || "An error occurred while checking in the participant.",
                });
              }
            }}
            onError={(msg) => {
              setShowScanner(false);
              toast.error("Scan error", {
                description: msg,
              });
            }}
            onClose={() => setShowScanner(false)}
          />
        )}
      </div>
    </React.Fragment>
  );
}
