import React from "react";
import { useFormContext, useFieldArray, Controller } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Trash2, Plus } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { Field } from "@/app/interface";

interface DynamicArrayFieldProps<T = any> {
  name: string;
  fieldsConfig?: Field[];
  defaultItemValue?: T;
  disabled?: boolean;
  addButtonLabel?: string;
  itemName: string;
  minItems?: number;
  maxItems?: number;
  simpleArray?: boolean;
}

const DynamicArrayField = ({
  name,
  fieldsConfig = [],
  defaultItemValue,
  disabled = false,
  addButtonLabel = "Add Item",
  minItems = 1,
  maxItems = Infinity,
  simpleArray = false,
  itemName,
}: DynamicArrayFieldProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const getDefaultItem = () => {
    if (defaultItemValue) return defaultItemValue;

    return simpleArray
      ? ""
      : fieldsConfig.reduce((acc, field) => {
          // Use field.defaultValue if available
          acc[field.name] = field.defaultValue || "";
          return acc;
        }, {} as Record<string, any>);
  };
  const { fields, append, remove } = useFieldArray({
    control,
    name,
    keyName: "id", // Unique ID for each field
  });

  const addNewItem = () => {
    if (fields.length < maxItems) {
      append(getDefaultItem());
    }
  };

  if (!simpleArray && fieldsConfig.length === 0) {
    console.error(
      "DynamicArrayField: fieldsConfig is required when simpleArray is false"
    );
    return null;
  }

  if (disabled) {
    return (
      <div className="space-y-3">
        {fields.map((field: any, index) => (
          <div key={field.id} className="border p-3 rounded-md">
            <div className="flex justify-between">
              <h4 className="text-sm font-medium">
                {itemName} {index + 1}
              </h4>
              {fields.length > minItems && (
                <Button
                  type="button"
                  onClick={() => remove(index)}
                  variant="ghost"
                  size="icon"
                  className="opacity-50 cursor-not-allowed"
                  disabled
                >
                  <Trash2 size={16} />
                </Button>
              )}
            </div>

            {simpleArray ? (
              <p className="text-sm text-gray-600 mt-2">{field || "-"}</p>
            ) : (
              <div className="mt-2 grid grid-cols-1 gap-2">
                {fieldsConfig.map((config) => (
                  <div key={config.name}>
                    <p className="text-xs text-gray-500">{config.label}</p>
                    <p className="text-sm">{field[config.name] || "-"}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }
  // console.log("fields:", fields);
  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="border p-4 rounded-md space-y-3 relative"
          >
            <div className="flex justify-between items mb-2">
              <h4 className="text-sm font-medium capitalize">
                {itemName} #{index + 1}
              </h4>
              {fields.length > minItems && (
                <Button
                  type="button"
                  onClick={() => remove(index)}
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2"
                >
                  <Trash2 size={16} className="text-destructive" />
                </Button>
              )}
            </div>

            {simpleArray ? (
              <div className="space-y-2">
                <Controller
                  name={`${name}.${index}`}
                  control={control}
                  render={({ field: controllerField }) => {
                    const fieldError = errors?.[name]?.[index]?.message as
                      | string
                      | undefined;
                    return (
                      <>
                        <Input
                          type="text"
                          placeholder="Enter value"
                          {...controllerField}
                        />
                        {fieldError && (
                          <p className="text-sm text-destructive">
                            {fieldError}
                          </p>
                        )}
                      </>
                    );
                  }}
                />
              </div>
            ) : (
              <div className="grid grid-cols-1  gap-4">
                {fieldsConfig.map((config) => (
                  <div key={`${field.id}-${config.name}`} className="space-y-2 ">
                    <label className="text-sm font-medium">
                      {config.label}
                    </label>
                    <Controller
                      name={`${name}.${index}.${config.name}`}
                      control={control}
                      render={({ field: controllerField }) => {
                        const fieldError = errors?.[name]?.[index]?.[
                          config.name
                        ]?.message as string | undefined;

                        if (config.type === "select") {
                          return (
                            <>
                              <Select
                                value={controllerField.value}
                                onValueChange={controllerField.onChange}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder={config.label} />
                                </SelectTrigger>
                                <SelectContent>
                                  {config.options?.map((option) => (
                                    <SelectItem
                                      key={option.value}
                                      value={option.value.toString()}
                                    >
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              {fieldError && (
                                <p className="text-sm text-destructive">
                                  {fieldError}
                                </p>
                              )}
                            </>
                          );
                        }

                        if (config.type === "textArea") {
                          return (
                            <>
                              <Textarea
                                {...controllerField}
                                placeholder={config.label}
                              />
                              {fieldError && (
                                <p className="text-sm text-destructive">
                                  {fieldError}
                                </p>
                              )}
                            </>
                          );
                        }

                        return (
                          <>
                            <Input
                              type={config.type}
                              placeholder={config.placeholder}
                              {...controllerField}
                              className="mt-1.5"
                            />
                            {fieldError && (
                              <p className="text-sm text-destructive">
                                {fieldError}
                              </p>
                            )}
                          </>
                        );
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {fields.length < maxItems && (
        <Button
          type="button"
          onClick={addNewItem}
          variant="outline"
          className="w-full"
        >
          <Plus size={16} className="mr-2" />
          {addButtonLabel}
        </Button>
      )}
    </div>
  );
};
export default DynamicArrayField;
