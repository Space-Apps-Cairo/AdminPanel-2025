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
import { Calendar as CalendarIcon } from "lucide-react";
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
import { Textarea } from "./ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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
      <div id="hello" className="mx-auto max-w-xl space-y-8 ">
        <DialogHeader className={`${!asDialog ? "!text-center" : ""}`}>
          <DialogTitle>{operation.toUpperCase()} Form</DialogTitle>
          <DialogDescription>
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

                {field.name.startsWith('category_header_') && (
                  <div className="bg-muted/50 p-4 rounded-lg mb-6">
                    <h3 className="text-lg font-semibold text-foreground">
                      {field.label}
                    </h3>
                    {field.placeholder && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {field.placeholder}
                      </p>
                    )}
                  </div>
                )}

                {!field.name.startsWith('category_header_') && (
                  <>
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
                  </>
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
                    <Label style={{lineHeight: "20px"}}>{field.label || field.placeholder}</Label>
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

                {/* {field.type === "time" && (
                  <div className="grid gap-3">
                    <Label>{field.label ?? field.placeholder}</Label>
                    <Controller
                      name={`${field.name}`}
                      control={control}
                      render={({ field: fld, fieldState: { error } }) => {
                        const parseTimeString = (timeStr: string) => {
                          if (!timeStr) return null;

                          const [hours, minutes, seconds] = timeStr
                            .split(":")
                            .map(Number);
                          return {
                            hour: hours || 0,
                            minute: minutes || 0,
                            second: seconds || 0,
                          };
                        };

                        // Helper function to convert Time object to string
                        const formatTimeToString = (timeObj: any) => {
                          if (!timeObj) return "";

                          const hours = String(timeObj.hour || 0).padStart(
                            2,
                            "0"
                          );
                          const minutes = String(timeObj.minute || 0).padStart(
                            2,
                            "0"
                          );
                          const seconds = String(timeObj.second || 0).padStart(
                            2,
                            "0"
                          );

                          return `${hours}:${minutes}:${seconds}`;
                        };

                        return (
                          <TimeField
                            className="*:not-first:mt-2"
                            aria-label={field.label ?? field.placeholder}
                            value={parseTimeString(fld.value)} // Convert string to Time object
                            onChange={(time) => {
                              const timeString = formatTimeToString(time);
                              fld.onChange(timeString); // Send string back to form
                            }}
                          >
                            <div className="relative">
                              <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 z-10 flex items-center justify-center ps-3">
                                <ClockIcon size={16} aria-hidden="true" />
                              </div>
                              <DateInput className="ps-9" />
                            </div>
                          </TimeField>
                        );
                      }}
                    />
                    {errors[field.name] && (
                      <p className="text-red-500 text-sm">
                        {errors[field.name]?.message as string}
                      </p>
                    )}
                  </div>
                )} */}

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

                {field.type === "radio" && (
                  <fieldset className="space-y-4">
                    <legend className="text-foreground text-sm leading-none font-medium mb-4" style={{lineHeight: "20px"}}>
                      {field.label}
                    </legend>
                    <Controller
                      name={field.name}
                      control={control}
                      render={({ field: fld }) => (
                        <RadioGroup 
                          value={fld.value} 
                          onValueChange={fld.onChange}
                          className={`flex gap-0 -space-x-px rounded-md shadow-xs ${
                            field.radioConfig?.orientation === "vertical" 
                              ? "flex-col space-y-2" 
                              : "flex-row"
                          }`}
                          disabled={isDisabled}
                        >
                          {field.options?.map((option: FieldOption, index) => (
                            <label
                              key={index}
                              className={`
                                border-input has-data-[state=checked]:border-primary/50 has-focus-visible:border-ring has-focus-visible:ring-ring/50
                                has-data-[state=checked]:bg-secondary/50 has-focus-visible:bg-ring
                                relative flex cursor-pointer items-center justify-center border text-center text-sm font-medium 
                                transition-[color,box-shadow] outline-none has-focus-visible:ring-[3px] has-data-disabled:cursor-not-allowed 
                                has-data-disabled:opacity-50 has-data-[state=checked]:z-10 bg-background hover:bg-muted/50
                                ${field.radioConfig?.orientation === "vertical"
                                  ? "w-full p-3 first:rounded-t-md last:rounded-b-md"
                                  : "flex-1 size-9 first:rounded-s-md last:rounded-e-md"
                                }`
                              }
                            >
                              <RadioGroupItem
                                value={option.value}
                                className="sr-only after:absolute after:inset-0"
                                disabled={isDisabled}
                              />
                              <span className={`${
                                field.radioConfig?.orientation === "vertical" 
                                  ? "text-base" 
                                  : "text-sm font-semibold"
                              }`}>
                                {option.label}
                              </span>
                            </label>
                          ))}
                        </RadioGroup>
                      )}
                    />
                    {errors[field.name] && (
                      <p className="text-red-500 text-sm mt-2">
                        {errors[field.name]?.message as string}
                      </p>
                    )}
                  </fieldset>
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
        className={`sm:max-w-[425px] !max-h-[95dvh] overflow-y-auto form-scroll ${
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
