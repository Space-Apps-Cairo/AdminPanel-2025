"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { SpecialMemberSchema } from "@/validations/hackthon/specialMember";

type FormData = z.infer<typeof SpecialMemberSchema>;

export default function FullFormCard() {
  const router = useRouter();
  const form = useForm<FormData>({
    resolver: zodResolver(SpecialMemberSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      national_id:"",
      reason:"",
    },
  });

  const [submissions, setSubmissions] = useState<FormData[]>([]);
  const [showTable, setShowTable] = useState(false);

  const onSubmit = (data: FormData) => {
    console.log("Sending data:", data);
    setSubmissions((prev) => [...prev, data]);
    form.reset();
    setShowTable(true);
  };

  return (
    <div className="w-full max-w-lg mx-auto mt-10 space-y-6">
      <h1 className="text-3xl font-bold text-center">Register For Special Cases</h1>

      <Card className="shadow-lg ">
        <CardHeader>
          {/* <CardTitle className="text-xl">Sign Up Form</CardTitle> */}
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your phone" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="national_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>National Id</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your National Id" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter  Reason" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <CardFooter className="flex flex-col gap-2">
                <Button type="submit" className="w-full">
                  Submit
                </Button>
               <Button
  type="button"
  variant="outline"
  className="w-full"
  onClick={() => router.push("/qr-hackathon/special-cases/table")}
>
  Show Submissions
</Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
