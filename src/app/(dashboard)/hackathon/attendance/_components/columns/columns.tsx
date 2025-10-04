import { ColumnDef } from "@tanstack/react-table";
import { Member } from "@/types/hackthon/member";
import { Badge } from "@/components/ui/badge";

export const attendedMembersColumns: ColumnDef<Member>[] = [
  { header: "UUID", accessorKey: "member.uuid", size: 80 },
  { header: "National ID", accessorKey: "member.national", size: 180 },
  { header: "Name", accessorKey: "member.name", size: 180 },
  { header: "Email", accessorKey: "member.email", size: 220 },
  { header: "Phone Number", accessorKey: "member.phone_number", size: 150 },
  { header: "Attended On", accessorKey: "attended_on", size: 150 },
  {
    header: "Participation Type",
    accessorKey: "member.participation_type",
    cell: ({ row }) => {
      console.log("Method:", row?.original);
      const participantType = row?.original?.member?.participation_type;
      return (
        <Badge variant={participantType === 1 ? "default" : "secondary"}>
          {participantType === 1 ? "Onsite" : "Virtual"}
        </Badge>
      );
    },
    size: 150,
  },
];
export const attendedMentorColumns: ColumnDef<Member>[] = [
  { header: "UUID", accessorKey: "mentor.uuid", size: 80 },
  { header: "National ID", accessorKey: "mentor.national", size: 180 },
  { header: "Name", accessorKey: "mentor.name", size: 180 },
  { header: "Email", accessorKey: "mentor.email", size: 220 },
  { header: "Phone Number", accessorKey: "mentor.phone_number", size: 150 },
  { header: "Attended On", accessorKey: "attended_on", size: 150 },
];

export const attendedJudgesColumns: ColumnDef<Member>[] = [
  { header: "UUID", accessorKey: "judge.uuid", size: 80 },
  { header: "National ID", accessorKey: "judge.national", size: 180 },
  { header: "Name", accessorKey: "judge.name", size: 180 },
  { header: "Email", accessorKey: "judge.email", size: 220 },
  { header: "Phone Number", accessorKey: "judge.phone_number", size: 150 },
  { header: "Attended On", accessorKey: "attended_on", size: 150 },
];

export const attendedGuestColumns: ColumnDef<Member>[] = [
  { header: "UUID", accessorKey: "guest.uuid", size: 80 },
  { header: "National ID", accessorKey: "guest.national", size: 180 },
  { header: "Name", accessorKey: "guest.name", size: 180 },
  { header: "Email", accessorKey: "guest.email", size: 220 },
  { header: "Phone Number", accessorKey: "guest.phone_number", size: 150 },
  { header: "Attended On", accessorKey: "attended_on", size: 150 },
];

export const attendedVipColumns: ColumnDef<Member>[] = [
  { header: "UUID", accessorKey: "vip.uuid", size: 80 },
  { header: "National ID", accessorKey: "vip.national", size: 180 },
  { header: "Name", accessorKey: "vip.name", size: 180 },
  { header: "Email", accessorKey: "vip.email", size: 220 },
  { header: "Phone Number", accessorKey: "vip.phone_number", size: 150 },
  { header: "Attended On", accessorKey: "attended_on", size: 150 },
];
