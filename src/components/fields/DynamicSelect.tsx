import { Controller, useWatch } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export function DynamicSelect({ field, control, errors, isDisabled }: any) {
    // ✅ useWatch at top level
    const depValue = field.dependsOn ? useWatch({ control, name: field.dependsOn.name })
        : undefined;

    console.log(depValue, "depValue");
    const options = field.dependsOn
        ? field.dependsOn.data(depValue) || []
        : field.options || [];

    console.log(options, "options");

    return (
        <div className="grid gap-3">
            <Label>{field.label || field.placeholder}</Label>
            <Controller
                name={field.name}
                control={control}
                defaultValue={field.defaultValue ?? ""}
                render={({ field: fld }) => (
                    <Select
                        disabled={isDisabled || field.disabled}
                        value={fld.value}
                        onValueChange={fld.onChange}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder={field.placeholder} />
                        </SelectTrigger>
                        <SelectContent>
                            {options.map((option: any, index: number) => (
                                <SelectItem key={index} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
            />
            {errors[field.name] && (
                <p className="text-red-500 text-sm">
                    {errors[field.name]?.message as string}
                </p>
            )}
        </div>
    );
}
