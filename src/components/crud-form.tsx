"use client";

import React, { Fragment, useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, ClockIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import type { Field, FieldOption } from "@/app/interface";
import {
  Controller,
  FormProvider,
  useForm,
  type FieldValues,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTrigger,
} from "./ui/stepper";
import DynamicArrayField from "./fields/DynamicArrayFields";
import { DateInput } from "@/components/ui/datefield-rac";
import { TimeField } from "@/components/ui/datefield-rac";
import { Textarea } from "./ui/textarea";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

export default function CrudForm(props: {
  operation: "add" | "edit" | "preview";
  fields: Field[];
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  asDialog?: boolean;
  validationSchema: any;
  steps?: number[];
  onSubmit: (data: FieldValues, formData?: FormData) => Promise<void> | void;
}) {
  const {
    operation,
    fields,
    isOpen,
    setIsOpen,
    asDialog = true,
    validationSchema,
    steps,
    onSubmit: handleFormSubmit,
  } = props;

  const fullPageStyle = "!w-screen !h-screen !max-w-none !p-8";
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  const isDisabled = operation === "preview";

  const defaultValues: Record<string, any> = {};

  fields.forEach((field: Field) => {
    defaultValues[field.name] =
      field.defaultValue !== undefined
        ? field.defaultValue
        : field.type === "checkbox"
        ? false
        : "";
  });

  // Replace useForm with FormProvider
  const methods = useForm({
    defaultValues,
    resolver: zodResolver(validationSchema),
  });

  const {
    handleSubmit,
    formState: { errors },
    reset,
    control,
    register,
  } = methods;

  const onSubmit = async (data: FieldValues) => {
    setIsSubmittingForm(true);

    try {
      console.log("Form data being submitted:", data);

      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (value instanceof File) {
          formData.append(key, value);
        } else if (value instanceof Date) {
          formData.append(key, value.toISOString());
        } else if (value !== null && value !== undefined) {
          formData.append(key, String(value));
        }
      });

      console.log("FormData entries:", [...formData.entries()]);

      await handleFormSubmit(data, formData);

      // Only reset and close if successful
      reset();
      setIsOpen(false);
      setCurrentStep(1); // Reset step if using steps
    } catch (error) {
      console.error("Form submission error:", error);
      // Don't close the form on error, let user see what happened
    } finally {
      setIsSubmittingForm(false);
    }
  };

  const FormBody = (
    <>
      <div id="hello" className="mx-auto w-full max-w-xl space-y-6 sm:space-y-8 px-1 sm:px-0">
        <DialogHeader className={`${!asDialog ? "!text-center" : ""}`}>
          <DialogTitle className="text-lg sm:text-xl">{operation.toUpperCase()} Form</DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            Fill out the fields and click save.
          </DialogDescription>
        </DialogHeader>

        {/* <div className="flex-1 overflow-auto px-1 space-y-6 max-h-[90vh]"> */}
        {steps && (
          <Stepper value={currentStep} onValueChange={setCurrentStep}>
            {steps?.map((mainStep) => (
              <StepperItem
                key={mainStep}
                step={mainStep}
                className="not-last:flex-1"
              >
                <StepperTrigger asChild>
                  <StepperIndicator />
                </StepperTrigger>
                {mainStep < steps.length && <StepperSeparator />}
              </StepperItem>
            ))}
          </Stepper>
        )}

        {fields.map(
          (field: Field, idx: number) =>
            (!steps || field.step === currentStep) && (
              <Fragment key={idx}>
                {[
                  "text",
                  "email",
                  "password",
                  "number",
                  "tel",
                  "time",
                ].includes(field.type) && (
                  <div className="grid gap-3">
                    <Label htmlFor={field.name}>{field.label}</Label>
                    <Input
                      {...register(`${field.name}`)}
                      id={field.name}
                      name={field.name}
                      type={field.type}
                      disabled={isDisabled || field.disabled}
                      placeholder={field.placeholder}
                      className={
                        field.type === "time"
                          ? "bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                          : ""
                      }
                    />
                    {errors[field.name] && (
                      <p className="text-red-500 text-sm">
                        {errors[field.name]?.message as string}
                      </p>
                    )}
                  </div>
                )}

                {field.type === "command" && (
                  <div className="grid gap-3">
                    <Label>{field.label}</Label>
                    <Controller
                      name={field.name}
                      control={control}
                      render={({ field: fld }) => (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              className="w-full justify-between h-10 px-3 py-2 text-sm sm:text-base text-left font-normal"
                              disabled={isDisabled || field.disabled}
                            >
                              <span className="truncate flex-1">
                                {fld.value
                                  ? field.options?.find((option) => option.value === fld.value)?.label
                                  : field.placeholder}
                              </span>
                              <svg
                                className="ml-2 h-4 w-4 shrink-0 opacity-50"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="m6 9 6 6 6-6" />
                              </svg>
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent 
                            className="w-[var(--radix-popover-trigger-width)] p-0 max-w-[calc(100vw-2rem)] sm:max-w-none" 
                            align="start"
                            side="bottom"
                            sideOffset={4}
                          >
                            <Command className="w-full">
                              <CommandInput 
                                placeholder={field.placeholder}
                                className="h-9 text-sm sm:text-base"
                              />
                              <CommandList className="max-h-[200px] sm:max-h-[300px]">
                                <CommandEmpty className="py-6 text-center text-sm">
                                  No participant found.
                                </CommandEmpty>
                                <CommandGroup>
                                  {field.options?.map((option) => (
                                    <CommandItem
                                      key={option.value}
                                      value={(option as any).searchableText || option.label}
                                      onSelect={() => {
                                        fld.onChange(option.value);
                                      }}
                                      className="px-2 py-2 text-sm sm:text-base cursor-pointer"
                                    >
                                      <div className="flex flex-col w-full min-w-0">
                                        <div className="truncate font-medium">
                                          {option.label.split(' - ')[0]} {/* Name */}
                                        </div>
                                        <div className="text-xs text-muted-foreground truncate">
                                          {option.label.split(' - ').slice(1).join(' - ')} {/* Email and UUID */}
                                        </div>
                                      </div>
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      )}
                    />
                    {errors[field.name] && (
                      <p className="text-red-500 text-sm">
                        {errors[field.name]?.message as string}
                      </p>
                    )}
                  </div>
                )}

                {field.type == "textArea" && (
                  <div className="grid gap-3">
                    <Label htmlFor={field.name}>{field.label}</Label>
                    <Textarea
                      {...register(`${field.name}`)}
                      id={field.name}
                      name={field.name}
                      disabled={isDisabled || field.disabled}
                      placeholder={field.placeholder}
                    />
                    {errors[field.name] && (
                      <p className="text-red-500 text-sm">
                        {errors[field.name]?.message as string}
                      </p>
                    )}
                  </div>
                )}
                {field.type === "file" && (
                  <div className="grid gap-3">
                    <Label htmlFor={field.name}>{field.label}</Label>
                    <Controller
                      name={field.name}
                      control={control}
                      render={({ field: fld }) => (
                        <Input
                          type="file"
                          id={field.name}
                          disabled={isDisabled}
                          name={field.name}
                          onChange={(e) => {
                            const fileList = e.target.files;
                            if (fileList && fileList.length > 0) {
                              fld.onChange(fileList[0]);
                            }
                          }}
                        />
                      )}
                    />
                    {errors[field.name] && (
                      <p className="text-red-500 text-sm">
                        {errors[field.name]?.message as string}
                      </p>
                    )}
                  </div>
                )}

                {field.type === "select" && (
                  <div className="grid gap-3">
                    <Label>{field.label || field.placeholder}</Label>
                    <Controller
                      name={`${field.name}`}
                      control={control}
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
                            {field.options?.map(
                              (option: FieldOption, index) => (
                                <SelectItem key={index} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              )
                            )}
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
                )}

                {field.type === "date" && (
                  <div className="grid gap-3">
                    <Label>{field.label ?? field.placeholder}</Label>
                    <Controller
                      name={`${field.name}`}
                      control={control}
                      render={({ field: fld }) => (
                        <Popover>
                          <PopoverTrigger asChild className="w-full">
                            <Button
                              variant="outline"
                              disabled={isDisabled}
                              data-empty={!fld.value}
                              className="w-full data-[empty=true]:text-muted-foreground justify-start text-left font-normal"
                            >
                              <CalendarIcon className="mr-2 h-4" />
                              {fld.value ? (
                                format(fld.value, "PPP")
                              ) : (
                                <span>{`${field.placeholder}`}</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={fld.value}
                              onSelect={(date) => fld.onChange(date)}
                              captionLayout="dropdown"
                            />
                          </PopoverContent>
                        </Popover>
                      )}
                    />
                    {errors[field.name] && (
                      <p className="text-red-500 text-sm">
                        {errors[field.name]?.message as string}
                      </p>
                    )}
                  </div>
                )}

                {field.type === "checkbox" && (
                  <div className="flex items-center space-x-2">
                    <Controller
                      name={field.name}
                      control={control}
                      render={({ field: fld }) => (
                        <Checkbox
                          id={field.name}
                          disabled={isDisabled}
                          checked={fld.value}
                          onCheckedChange={fld.onChange}
                        />
                      )}
                    />
                    <Label htmlFor={field.name}>{field.label}</Label>
                    {errors[field.name] && (
                      <p className="text-red-500 text-sm ml-2">
                        {errors[field.name]?.message as string}
                      </p>
                    )}
                  </div>
                )}

                {field.type === "dynamicArrayField" && (
                  <DynamicArrayField
                    minItems={field.dynamicArrayFieldsConfig?.minItem ?? 1}
                    name={field.name}
                    addButtonLabel={
                      field.dynamicArrayFieldsConfig?.addButtonLabel ??
                      field.label
                    }
                    simpleArray={field.dynamicArrayFieldsConfig?.isSimpleArray}
                    fieldsConfig={field.dynamicArrayFieldsConfig?.fields}
                    itemName={
                      field.dynamicArrayFieldsConfig?.itemName ?? "item"
                    }
                    disabled={operation == "preview"}
                  />
                )}
              </Fragment>
            )
        )}

        {steps && (
          <div className="flex justify-center space-x-4">
            <Button
              variant="outline"
              className="w-32"
              type="button"
              onClick={() => setCurrentStep((prev) => prev - 1)}
              disabled={currentStep === 1 || isSubmittingForm}
            >
              Prev step
            </Button>
            <Button
              variant="outline"
              className="w-32"
              type="button"
              onClick={() => setCurrentStep((prev) => prev + 1)}
              disabled={currentStep >= steps.length || isSubmittingForm}
            >
              Next step
            </Button>
          </div>
        )}
        {/* </div> */}

        <DialogFooter className={` ${!asDialog ? "!flex-col-reverse" : ""}`}>
          <DialogClose asChild>
            <Button variant="outline" disabled={isSubmittingForm}>
              Cancel
            </Button>
          </DialogClose>
          {!isDisabled && (
            <Button type="submit" disabled={isSubmittingForm}>
              {isSubmittingForm
                ? "Submitting..."
                : operation === "edit"
                ? "Update"
                : "Submit"}
            </Button>
          )}
        </DialogFooter>
      </div>
    </>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        className={`w-[95vw] max-w-md sm:max-w-lg lg:max-w-2xl !max-h-[95dvh] overflow-y-auto form-scroll ${
          !asDialog ? fullPageStyle : ""
        }`}
      >
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className={`space-y-6`}>
            {FormBody}
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
