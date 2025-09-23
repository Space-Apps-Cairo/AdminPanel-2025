"use client";

import { Field } from "@/app/interface";
import RowsActions from "@/components/table/rows-actions";
import {
  useAssignCollectionMutation,
  useDeleteCollectionMutation,
  useGetAllMaterialsQuery,
  useUpdateCollectionMutation,
} from "@/service/Api/materials";
import {
  Collection,
  CreateCollectionRequest,
  Material,
  MaterialsForCollections,
  MaterialsRes,
} from "@/types/material/materials";
import { collectionValidationSchema } from "@/validations/material/collection";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronRight, QrCode } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import QrScanner from "@/components/scanner/QrScanner";
import { toast } from "sonner";
import Link from "next/link";

export const useCollectionsFields = (
  collectionData?: Collection,
): Field[] => {
  const { data: materialsData } = useGetAllMaterialsQuery();

  const materials = (materialsData as MaterialsRes)?.data as
    | Material[]
    | undefined;

  const materialOptions =
    materials?.map((material) => ({
      value: String(material.id),
      placeholder: material.material_name,
    })) ?? [];

  return [
    {
      name: "collection_name",
      type: "text",
      label: "Collection Name",
      placeholder: "Enter the collection name",
      ...(collectionData?.collection_name && {
        defaultValue: collectionData.collection_name,
      }),
      step: 1,
    },

    {
      name: "total_quantity",
      type: "number",
      label: "Total Quantity",
      placeholder: "Enter the total quantity",
      ...(collectionData?.total_quantity && {
        defaultValue: collectionData.total_quantity,
      }),
      step: 1,
    },

    {
      name: "max_per_user",
      type: "number",
      label: "Max Per User",
      placeholder: "Enter the max item for user",
      ...(collectionData?.max_per_user && {
        defaultValue: collectionData.max_per_user,
      }),
      step: 1,
    },

    {
      name: "materials",
      type: "dynamicArrayField",
      label: "Materials",
      dynamicArrayFieldsConfig: {
        fields: [
          {
            name: "id",
            type: "select",
            label: "Select material",
            options: materialOptions.map((option) => ({
              ...option,
              label: option.placeholder,
            })),
          },
          {
            name: "quantity_used",
            type: "number",
            label: "Quantity Used",
            placeholder: "Enter the quantity used",
          },
        ],
        addButtonLabel: "Add new material",
        itemName: "Material",
        minItem: 1,
      },
      step: 2,
      ...(collectionData?.materials && {
        defaultValue: collectionData.materials.map((m) => ({
          id: String(m.id),
          quantity_used: m.pivot.quantity_used,
        })),
      }),
    },
  ];
};

export const collectionColumns: ColumnDef<Collection>[] = [
  {
    header: "Collection Name",
    accessorKey: "collection_name",
    size: 180,
    enableHiding: false,
  },
  {
    header: "Total Quantity",
    accessorKey: "total_quantity",
    size: 220,
  },
  {
    header: "Used Quantity",
    accessorKey: "used_quantity",
    size: 180,
  },
  {
    header: "Max Per User",
    accessorKey: "max_per_user",
    size: 180,
  },
  {
    header: "Registrants",
    cell: ({ row }) => (
      <Link href={`collections/${row.original.id}`}>
        <Button variant="outline" size="sm">
          <p>Registrants</p>
          <ChevronRight />
        </Button>
      </Link>
    ),
    size: 180,
    enableHiding: false,
  },
  {
    id: "actions",
    header: () => <span>Actions</span>,
    cell: ({ row }) => <CollectionRowActions rowData={row.original} />,
    size: 150,
    enableHiding: false,
  },
];

function CollectionRowActions({ rowData }: { rowData: Collection }) {
  const [updateCollection] = useUpdateCollectionMutation();
  const [deleteCollection] = useDeleteCollectionMutation();
  const [assignCollection] = useAssignCollectionMutation();
  const [showScanner, setShowScanner] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => setIsClient(true), []);

  return (
    <React.Fragment>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size={"sm"}
          onClick={() => setShowScanner(true)}
        >
          <QrCode />
        </Button>

        <RowsActions
          rowData={rowData}
          isDelete={true}
          isUpdate={true}
          isPreview={false}
          fields={useCollectionsFields(rowData)}
          validationSchema={collectionValidationSchema}
          steps={[1, 2]}
          updateMutation={(data) => {
            console.log("Data from form:", data);

            const transformedData: CreateCollectionRequest & {
              used_quantity?: number;
            } = {
              collection_name: data.collection_name,
              total_quantity: Number(data.total_quantity),
              max_per_user: Number(data.max_per_user),
              materials:
                data.materials?.map((material: MaterialsForCollections) => ({
                  id: Number(material.id),
                  quantity_used: Number(material.quantity_used),
                })) || [],
            };

            if (data.used_quantity !== undefined) {
              transformedData.used_quantity = Number(data.used_quantity);
            }

            console.log("Transformed data for API:", transformedData);

            return updateCollection({
              id: rowData.id,
              data: transformedData,
            });
          }}
          deleteMutation={deleteCollection}
          onUpdateSuccess={(result) => {
            console.log("Collection updated successfully:", result);
            toast.success(result.msg || "Collection updated successfully!");
          }}
          onUpdateError={(error) => {
            console.error("Error updating collection:", error);
            toast.error(
              error.data?.msg ||
                "Failed to update collection. Please try again."
            );
          }}
          onDeleteSuccess={(result) => {
            console.log("Collection deleted successfully:", result);
            toast.success(result.msg || "Collection deleted successfully!");
          }}
          onDeleteError={(error) => {
            console.error("Error deleting collection:", error);
            toast.error(
              error.data?.msg ||
                "Failed to delete collection. Please try again."
            );
          }}
        />
      </div>

      {isClient && showScanner && (
        <QrScanner
          onScanSuccess={async (res) => {
            try {
              setShowScanner(false);
              const userId = String(res).trim();
              const result = await assignCollection({
                user_id: userId,
                collection_id: rowData.id,
              }).unwrap();

              toast.success(
                result.success
                  ? "Assigned successfully"
                  : "Assignment completed",
                {
                  description:
                    result.msg ||
                    `Allowed: ${result.data?.allowed}, Current: ${result.data?.current_quantity}`,
                }
              );
            } catch (err: unknown) {
              const apiErr = err as { data?: { msg?: string } };
              toast.error("Assignment failed", {
                description:
                  apiErr?.data?.msg ||
                  "An error occurred while assigning the collection.",
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
    </React.Fragment>
  );
}
