"use client";
// import { z } from "zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Field } from "../app/interface";
import CrudForm from "@/components/crud-form";
import { FieldValues, useForm } from "react-hook-form";
import { useLoginMutation } from "@/service/Api/login";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/service/store/features/authSlice";
import cookieService from "@/service/cookies/cookieService";
import z from "zod";

export default function Home() {
  const fields: Field[] = [
    {
      name: "email",
      type: "email",
      label: "Email",
      defaultValue: "abcd@gmail.com",
      step: 1,
    },
    {
      name: "password",
      type: "password",
      label: "Password",
      defaultValue: "01127769663",
      step: 1,
    },
    {
      name: "gender",
      type: "select",
      placeholder: "Select Gender",
      defaultValue: "female",
      options: [
        { value: "male", placeholder: "Male" },
        { value: "female", placeholder: "Female" },
      ],
      step: 2,
    },
    {
      name: "dob",
      type: "date",
      placeholder: "Choose birth date",
      defaultValue: "2000-01-01",
      step: 2,
    },
    { name: "file", type: "file", placeholder: "Choose file date", step: 3 },
    {
      name: "terms",
      type: "checkbox",
      label: "Accept Terms",
      defaultValue: true,
      step: 3,
    },
  ];

  const steps = [1, 2, 3];

  const validationSchema = z.object({
    email: z.string().email("Enter a valid Email"),
    password: z.string().min(10, "Password must be at least 10 characters"),
    gender: z.string(),
    dob: z.string(),
    terms: z.boolean(),
    file: z.any(),
  });

  const [isOpen, setIsOpen] = useState(false);
  const [operation, setOperation] = useState<"add" | "edit" | "preview">("add");
  const dispatch = useDispatch();
  const [login, { isError, error, data, isSuccess, isLoading }] =
    useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm();

  const onSubmit = async (e: FieldValues) => {
    console.log("Data before login request:", e);
    const result = await login(e).unwrap();
    dispatch(setCredentials(result));
    console.log("Token:", cookieService.get("token"));
    console.log("Result:", result);

    // isError && console.log(error);
    // isLoading && console.log("loading");
    // isSuccess && console.log(data);
    console.log(e);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={() => {
            setOperation("add");
            setIsOpen(true);
          }}
        >
          Add
        </Button>

        <Button
          onClick={() => {
            setOperation("edit");
            setIsOpen(true);
          }}
        >
          Edit
        </Button>

        <Button
          onClick={() => {
            setOperation("preview");
            setIsOpen(true);
          }}
        >
          Preview
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className=" mt-6">
        <Label htmlFor={"email"}>Email</Label>
        <Input
          {...register(`email`)}
          type="email"
          name="email"
          id="email"
          className="w-[400px]"
        />

        <Label htmlFor={"password"}>Password</Label>
        <Input
          {...register(`password`)}
          type="password"
          name="password"
          id="password"
          className="w-[400px] mb-2"
        />
        <Button type="submit">Login</Button>
      </form>

      {isOpen && (
        <CrudForm
          fields={fields}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          operation={operation}
          asDialog={true}
          validationSchema={validationSchema}
          steps={steps}
        />
      )}
    </div>
  );
}
