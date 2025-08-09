import { Field } from "@/app/interface";
import { BootcampType } from "@/types/bootcamp"; 

export const getBootcampFields = (bootcampData?: BootcampType): Field[] => [
  {
    name: "name",
    type: "text",
    label: "Name",
    ...(bootcampData?.name && { defaultValue: bootcampData.name }),
    step: 1,
  },
  {
    name: "date",
    type: "text",
    label: "Date",
    ...(bootcampData?.date && { defaultValue: bootcampData.date }),
    step: 1,
  },
  {
    name: "total_capacity",
    type: "text",  
    label: "Total Capacity",
    ...(bootcampData?.total_capacity && {
      defaultValue: bootcampData.total_capacity.toString(),
    }),
    step: 2,
  },
  {
    name: "terms",
    type: "checkbox",
    label: "Accept Terms",
    defaultValue: true,
    step: 2,
  },
];
