"use client";
import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { SpecialMemberSchema } from "@/validations/hackthon/specialMember";
import { useAddSpecialCaseMutation } from "@/service/Api/hackathon/specialcase";
import { toast } from "sonner";
import { useGetAllTeamsQuery } from "@/service/Api/teams";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type FormData = z.infer<typeof SpecialMemberSchema>;

export default function FullFormCard() {
  const router = useRouter();
  const form = useForm<FormData>({
    resolver: zodResolver(SpecialMemberSchema),
    defaultValues: {
      name: "",
      phone: "",
      national_id: "",
      reason: "",
      email: "",
      team_id: "",
      national_id_front: null,
      national_id_back: null,
    },
  });

  const [addSpecialCase] = useAddSpecialCaseMutation();
  const [searchTerm, setSearchTerm] = useState("");
const [limit, setLimit] = useState(5);


const buildQueryString = useCallback(() => {
  const params = new URLSearchParams();
  if (searchTerm) params.append("search", searchTerm);
  return params.toString() ? `?${params.toString()}` : "";
}, [searchTerm]);



const { data: teamsData, isLoading: isLoadingTeams } = useGetAllTeamsQuery(buildQueryString());

  const onSubmit = async (data: FormData) => {
  try {
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("phone", data.phone);
    formData.append("national_id", data.national_id);
    formData.append("reason", data.reason);
     formData.append("team_id", data.team_id);
      formData.append("email", data.email);
    if (data.national_id_front) {
      formData.append("national_id_front", data.national_id_front);
    }
    if (data.national_id_back) {
      formData.append("national_id_back", data.national_id_back);
    }

    await addSpecialCase(formData).unwrap();
    toast.success("Special case submitted successfully");
    form.reset();
  } catch (error: any) {
    console.error(error);
    toast.error(error?.data?.message || "Failed to submit special case");
  }
};

  return (
    <div className="w-full max-w-lg mx-auto mt-10 mb-10 space-y-6">
      <h1 className="text-3xl font-bold text-center">
        Register For Special Cases
      </h1>

      <Card className="shadow-lg ">
        <CardHeader></CardHeader>

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
  name="team_id"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Team Name</FormLabel>
      <FormControl>
        <Select
          onValueChange={field.onChange}
          value={field.value}
        >
          <SelectTrigger>
            <SelectValue placeholder="Search and select a team" />
          </SelectTrigger>
         
          <SelectContent>
            <div className="p-2">
              <Input
                placeholder="Search team..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {isLoadingTeams ? (
              <div className="p-2 text-sm text-gray-500">Loading...</div>
            ) : (
              teamsData?.data?.slice(0, limit).map((team: any) => (
                <SelectItem key={team.id} value={team.id.toString()}>
                  {team.team_name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
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
                      <Input placeholder="Enter Reason" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="national_id_front"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>National ID Front</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          field.onChange(e.target.files?.[0] || null)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="national_id_back"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>National ID Back</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          field.onChange(e.target.files?.[0] || null)
                        }
                      />
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
                  onClick={() =>
                    router.push("/qr/qr-hackathon/special-cases/table")
                  }
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

