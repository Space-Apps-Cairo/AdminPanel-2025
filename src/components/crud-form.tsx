// 'use client'

// import React, { Fragment, useState } from "react"
// import { Button } from "@/components/ui/button"
// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle
// } from "@/components/ui/dialog"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import {
//   Select, SelectContent, SelectItem, SelectTrigger, SelectValue
// } from "@/components/ui/select"
// import { Calendar } from "@/components/ui/calendar"
// import { Calendar as CalendarIcon } from "lucide-react"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import { format } from "date-fns"
// import { cn } from "@/lib/utils"
// import { Controller, useForm, type FieldValues } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Field,FieldOption } from "@/app/interface"

// export default function CrudForm(props: {
//   operation: "add" | "edit" | "review" | "update";
//   fields: Field[];
//   isOpen: boolean;
//   setIsOpen: (open: boolean) => void;
//   asDialog?: boolean;
//   defaultValues?: Record<string, any>;
//   validationSchema:any
// }){

  
//   const { operation, fields, isOpen, setIsOpen, asDialog = true, validationSchema } = props;

//   const fullPageStyle = "!w-screen !h-screen !max-w-none !p-8";
//   const [date, setDate] = useState<Date>();

//   const isDisabled = operation === "review";

//   const defaultValues: Record<string, any> = {};

//   fields.forEach((field:Field) => {
//   defaultValues[field.name] = field.defaultValue !== undefined
//     ? field.defaultValue: (field.type === "checkbox" ? false : "");
//   });

//     const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//     reset,
//     getValues,
//     control,
//     } = useForm({
//         defaultValues,
//         resolver: zodResolver(validationSchema)
//     });
        
//     const onSubmit = async (data: FieldValues) => {
//         console.log(data);
//         await new Promise((resolve) => setTimeout(resolve, 1000));

//         reset();
//     };
  

//   const FormBody = (
//     <>
//         <DialogHeader>
//         <DialogTitle>{operation.toUpperCase()} Form</DialogTitle>
//         <DialogDescription>Fill out the fields and click save.</DialogDescription>
//         </DialogHeader>

//         {fields.map((field: Field, index: number) => (
//             <Fragment key={index}>
//             {["text", "email", "password", "number", "tel"].includes(field.type) && (
//                 <div className="grid gap-3">
//                     <Label htmlFor={field.name}>{field.label}</Label>
//                     <Input
//                         {...register(`${field.name}`)}
//                         id={field.name}
//                         name={field.name}
//                         type={field.type}
//                         disabled={isDisabled}
//                     />
//                     {errors[field.name] && (
//                         <p className="text-red-500">{errors[field.name]?.message as string}</p>
//                     )}
//                 </div>
//             )}

//             {field.type === "file" && (
//                 <div className="grid gap-3">
//                     <Label htmlFor={field.name}>{field.label}</Label>
//                     <Controller
//                     name={field.name}
//                     control={control}
//                     render={({ field: fld }) => (
//                         <Input
//                         type="file"
//                         id={field.name}
//                         disabled={isDisabled}
//                         name={field.name}
//                         onChange={(e) => {
//                             const fileList = e.target.files;
//                             if (fileList && fileList.length > 0) {
//                             fld.onChange(fileList[0]);
//                             }
//                         }}
//                     />)}
//                     />
//                 </div>
//             )}

//             {field.type === "select" && (
//                 <div className="grid gap-3">
//                     <Label>{field.placeholder}</Label>
//                     <Controller
//                         name={`${field.name}`}
//                         control={control}
//                         render={({ field:fld }) => (
//                             <Select
//                             disabled={isDisabled}
//                             value={fld.value}
//                             onValueChange={fld.onChange}
//                             >
//                             <SelectTrigger className="w-full">
//                                 <SelectValue placeholder={field.placeholder} />
//                             </SelectTrigger>
//                             <SelectContent>
//                                 {field.options?.map((option: FieldOption, index) => (
//                                 <SelectItem key={index} value={option.value}>
//                                     {option.placeholder}
//                                 </SelectItem>
//                                 ))}
//                             </SelectContent>
//                             </Select>
//                         )}
//                     />
//                 </div>
//             )}

//             {field.type === "date" && (
//                 <div className="grid gap-3">
//                     <Label>{field.placeholder}</Label>
//                     <Controller
//                         name={`${field.name}`}
//                         control={control}
//                         render={({ field:fld }) => (
//                             <Popover>
//                             <PopoverTrigger asChild className="w-full">
//                                 <Button
//                                 variant="outline"
//                                 disabled={isDisabled}
//                                 data-empty={!fld.value}
//                                 className="w-full data-[empty=true]:text-muted-foreground justify-start text-left font-normal"
//                                 >
//                                 <CalendarIcon className="mr-2 h-4" />
//                                 {fld.value ? format(fld.value, "PPP") :<span>{`${field.placeholder}`}</span>}
//                                 </Button>
//                             </PopoverTrigger>
//                             <PopoverContent>
//                                 <Calendar
//                                 mode="single"
//                                 selected={fld.value}
//                                 onSelect={(date) => fld.onChange(date)}
//                                 className="w-full"
//                                 />
//                             </PopoverContent>
//                             </Popover>
//                         )}
//                     />
//                 </div>
//             )}

//             {field.type === "checkbox" && (
//                 <div className="flex items-center space-x-2">
//                 <Controller
//                 name={field.name}
//                 control={control}
//                 render={({ field: fld }) => (
//                     <Checkbox
//                     id={field.name}
//                     disabled={isDisabled}
//                     checked={fld.value}
//                     onCheckedChange={fld.onChange}
//                     />
//                 )} 
//                 />
                
//                 <Label htmlFor={field.name}>{field.label}</Label>
//                 </div>
//             )}
//             </Fragment>
//         ))}

//         <DialogFooter className="mt-6">
//         <DialogClose asChild>
//             <Button variant="outline">Cancel</Button>
//         </DialogClose>
//         {!isDisabled && <Button type="submit">{operation === "edit" ? "Update" : "Submit"}</Button>}
//         </DialogFooter>
//     </>
//   );

//   return (
//     <Dialog open={isOpen} onOpenChange={setIsOpen}>
//         <DialogContent className={`sm:max-w-[425px] ${!asDialog ? fullPageStyle : ""}`}>
//             <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
//                 {FormBody}
//             </form>
//         </DialogContent>
//     </Dialog>
//   );
// }