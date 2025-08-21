import { Badge } from "@/components/ui/badge";

export default function GreenBagde({ text }: { text: string }) {
  return (
    <Badge className="capitalize bg-green-100 border-green-200 text-green-800">
      {text}
    </Badge>
  );
}
