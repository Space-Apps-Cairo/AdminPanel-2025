import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Braces } from "lucide-react";

export default function DynamicVariables({ variables,onInsertVariable }) {
  return (
    <Card className=" row-start-2 lg:col-span-1 lg:row-start-1  h-full rounded-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-bold">
          <Braces /> Dynmaic Varibales
        </CardTitle>
        <CardDescription className="text-base">
          Click any variable to insert it into your template
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-col gap-4">
        {variables.map((variable) => (
          <Button
            key={variable.id}
            variant={"outline"}
            onClick={() => onInsertVariable(variable.id)}
            className="hover:scale-105  transition-all duration-200"
          >
            {variable.label}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
