import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Trash } from "lucide-react"
import { cn } from "@/lib/utils"
import { Officer } from "@/types/officer"
export const OfficersColumns: ColumnDef<Officer>[] = [
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
    header: "Username",
    accessorKey: "username",
    size: 220,
  },
  {
    header: "Badge number",
    accessorKey: "badgeNum",
    size: 220,
  },
  {
    header: "Location",
    accessorKey: "location",
    cell: ({ row }) => (
      <div>
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
          row.getValue("status") === "Offline" &&
            "bg-muted-foreground/60 text-primary-foreground"
        )}
      >
        {row.getValue("status")}
      </Badge>
    ),
    size: 100,
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
          <Trash size={16} />
        </Button>
      </div>
    ),
    size: 80,
    enableHiding: false,
  },

]
