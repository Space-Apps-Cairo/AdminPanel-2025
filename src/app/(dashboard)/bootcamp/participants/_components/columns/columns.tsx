import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { User } from "@/types/user";
import RowsActions from "@/components/table/rows-actions";
import { Field } from "@/app/interface";
import { userValidationSchema } from "@/validations/user";

export const getUsersFields = (userData?: User): Field[] => [
  {
    name: "name",
    type: "text",
    label: "Name",
    ...(userData?.name && { defaultValue: userData.name }),
    step: 1,
  },
  {
    name: "email",
    type: "email",
    label: "Email",
    ...(userData?.email && { defaultValue: userData.email }),
    step: 1,
  },
  {
    name: "status",
    type: "select",
    placeholder: "Select Status",
    defaultValue: userData?.status || "Inactive",
    options: [
      { value: "Active", placeholder: "Active" },
      { value: "Inactive", placeholder: "Inactive" },
    ],
    step: 1,
  },
  // {
  //   name: "balance",
  //   type: "number",
  //   label: "Balance",
  //   ...(userData?.balance && { defaultValue: userData.balance }),
  //   step: 2,
  // },
  {
    name: "location",
    type: "text",
    label: "Location",
    ...(userData?.location && { defaultValue: userData.location }),
    step: 2,
  },
  { name: "password", type: "password", label: "Password", step: 2 },
  {
    name: "terms",
    type: "checkbox",
    label: "Accept Terms",
    defaultValue: true,
    step: 2,
  },
];

export const userColumns: ColumnDef<User>[] = [
  {
    header: "Name",
    accessorKey: "name",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
    size: 180,
    enableHiding: false,
  },
  {
    header: "Email",
    accessorKey: "email",
    size: 220,
  },
  {
    header: "Location",
    accessorKey: "location",
    cell: ({ row }) => (
      <div>
        <span className="text-lg leading-none">{row.original.flag}</span>{" "}
        {row.getValue("location")}
      </div>
    ),
    size: 180,
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => (
      <Badge
        className={cn(
          row.getValue("status") === "Inactive" &&
            "bg-muted-foreground/60 text-primary-foreground"
        )}
      >
        {row.getValue("status")}
      </Badge>
    ),
    size: 100,
  },
  {
    accessorKey: "bonusPoints",
    header: "Bonus Points",
    cell: ({ row }) => <div>{row.original.bonusPoints}</div>,
  },
  {
    header: "Balance",
    accessorKey: "balance",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("balance"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return formatted;
    },
    size: 120,
  },
  {
    id: "actions",
    header: () => <span>Actions</span>,
    cell: ({ row }) => (
      <RowsActions
        rowData={row.original}
        steps={[1, 2]}
        isDelete={true}
        fields={getUsersFields(row.original)}
        validationSchema={userValidationSchema}
      />
    ),
    size: 150,
    enableHiding: false,
  },
];
