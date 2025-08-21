"use client";

import React, { Fragment, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
} from "@/components/ui/stepper";
import DynamicArrayField from "./fields/DynamicArrayFields";
import { Textarea } from "./ui/textarea";

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
        if (value instanceof FileList) {
          formData.append(key, value[0]);
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
      {/* <div id="hello" className="mx-auto max-w-xl space-y-8 overflow-auto"> */}
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
              {["text", "email", "password", "number", "tel", "time"].includes(
                field.type
              ) && (
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
                        disabled={isDisabled}
                        value={fld.value}
                        onValueChange={fld.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={field.placeholder} />
                        </SelectTrigger>
                        <SelectContent>
                          {field.options?.map((option: FieldOption, index) => (
                            <SelectItem key={index} value={option.value}>
                              {option.placeholder}
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
                            initialFocus
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
                  minItems={1}
                  name={field.name}
                  addButtonLabel={
                    field.dynamicArrayFieldsConfig?.addButtonLabel ??
                    field.label
                  }
                  simpleArray={field.dynamicArrayFieldsConfig?.isSimpleArray}
                  fieldsConfig={field.dynamicArrayFieldsConfig?.fields}
                  itemName={field.dynamicArrayFieldsConfig?.itemName ?? "item"}
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
      {/* </div> */}
    </>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        className={`sm:max-w-[425px] flex flex-col max-h-[90vh] overflow-y-auto ${
          !asDialog ? fullPageStyle : ""
        }`}
      >
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className={`space-y-6  overflow-y-auto`}
          >
            {FormBody}
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
