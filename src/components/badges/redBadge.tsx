import { Badge } from "@/components/ui/badge";

export default function RedBadge({ text }: { text: string }) {
  return (
    <Badge className="capitalize bg-red-100  border-red-200 text-red-700">
      {text}
    </Badge>
  );
}
