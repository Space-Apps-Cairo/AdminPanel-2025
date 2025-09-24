import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { EmailTemplateVariable } from "@/types/emails/variables";
import { Braces, LoaderCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";

export default function DynamicVariables({
  variables,
  onInsertVariable,
  isLoading,
}: {
  variables: EmailTemplateVariable[];
  onInsertVariable: (id: string) => void;
  isLoading: boolean;
}) {
  const [search, setSearch] = useState("");

  const filteredVariables = useMemo(() => {
    if (!search) return variables;
    return variables.filter((v) =>
      v.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [variables, search]);

  return (
    <Card className="row-start-2 lg:col-span-1 lg:row-start-1 h-full rounded-lg  ">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-bold">
          <Braces /> Dynamic Variables
        </CardTitle>
        <CardDescription className="text-base">
          Click any variable to insert it into your template
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-col gap-4  relative  max-h-[500px]">
        {/* 🔍 Search Box */}
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search variables..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>

        {isLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <LoaderCircle className="animate-spin w-6 h-6 text-gray-400" />
          </div>
        ) : (
          <div className="flex flex-col gap-2 overflow-y-auto flex-1 pr-1">
            {filteredVariables.length > 0 ? (
              filteredVariables.map((variable) => (
                <Button
                  key={variable.key}
                  variant="outline"
                  onClick={() => onInsertVariable(variable.key)}
                  className="hover:scale-105 transition-all duration-200 justify-start whitespace-normal break-words text-left"
                >
                  {variable.label}
                </Button>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                No variables found
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
