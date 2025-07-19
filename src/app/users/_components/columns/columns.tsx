import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { User } from "@/types/user"
import RowsActions from "@/components/table/rows-actions"
import { Field } from "@/app/interface"
import { userValidationSchema } from "@/validations/user"

const getUsersFields = (userData?: User): Field[] => [
  { name: "name", type: "text", label: "Name", defaultValue: userData.name || false },
  { name: "email", type: "email", label: "Email", defaultValue:userData.email || false },
  { name: "password", type: "password", label: "Password",defaultValue: userData.phone || "01127769663",},
  {
    name: "gender",
    type: "select",
    placeholder: "Select Gender",
    defaultValue:"female",
    options: [
      { value: "male", placeholder: "Male" },
      { value: "female", placeholder: "Female" },
    ]
  },
  { name: "dob", type: "date", placeholder: "Choose birth date", defaultValue:"2000-01-01"},
  { name: "file", type: "file", placeholder: "Choose file date"},
  { name: "terms", type: "checkbox", label: "Accept Terms", defaultValue: true},
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
    header: "Balance",
    accessorKey: "balance",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("balance"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)
      return formatted
    },
    size: 120,
  },
  {
    id: "actions",
    header: () => <span>Actions</span>,
    cell: ({ row }) => (
      <RowsActions 
        fields={getUsersFields(row.original)} 
        validationSchema={userValidationSchema} 
      />
    ),
    size: 90,
    enableHiding: false,
  },
]