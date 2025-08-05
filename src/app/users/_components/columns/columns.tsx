import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, SquarePen, Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import { User } from "@/types/user";

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
      <div className="py-2.5 flex items-center gap-2.5">
        <Button variant="outline" size="sm">
          <Eye size={16} />
        </Button>
        <Button variant="outline" size="sm">
          <SquarePen size={16} />
        </Button>
        <Button variant="outline" size="sm">
          <Trash size={16} />
        </Button>
      </div>
    ),
    size: 150,
    enableHiding: false,
  },
];
