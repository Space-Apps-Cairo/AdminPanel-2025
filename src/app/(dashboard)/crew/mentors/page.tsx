"use client";

import DataTable from "@/components/table/data-table";
import React, { useCallback, useMemo, useState } from "react";
import { FieldValues } from "react-hook-form";
import CrudForm from "@/components/crud-form";
import ImportButton from "@/components/import/ImportButton";
import Error from "@/components/Error/page";
import { toast } from "sonner";

import {
  useAddMentorMutation,
  useDeleteMentorMutation,
  useGetAllMentorsQuery,
  useImportMentorsFileMutation,
} from "@/service/Api/crew/mentors";
import { Mentor, CreateMentorRequest } from "@/types/crew/mentors";
import { ActionConfig, SearchConfig, StatusConfig } from "@/types/table";
import { getMentorFields, mentorColumns } from "./_components/columns";
import { mentorValidationSchema } from "@/validations/crew/mentors";

export default function MentorsPage() {
  // pagination + search + filters
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [orgFilters, setOrgFilters] = useState<string[]>([]);
  const [expFilters, setExpFilters] = useState<string[]>([]);
  const [expertiseFilters, setExpertiseFilters] = useState<string[]>([]);

  const buildQueryString = useCallback(() => {
    const params = new URLSearchParams();

    // search by name/email/phone
    if (searchTerm) params.append("search", searchTerm);

    // filters
    if (orgFilters.length) params.append("organization", orgFilters.join(","));
    if (expFilters.length)
      params.append("level_of_experience", expFilters.join(","));
    if (expertiseFilters.length)
      params.append("area_of_expertise", expertiseFilters.join(","));

    if (pageSize === -1) {
      params.append("limit", "all");
    } else {
      params.append("limit", pageSize.toString());
    }
    params.append("page", currentPage.toString());

    return params.toString() ? `?${params.toString()}` : "";
  }, [
    searchTerm,
    orgFilters,
    expFilters,
    expertiseFilters,
    pageSize,
    currentPage,
  ]);

  const {
    data: mentorsRes,
    isLoading,
    error,
  } = useGetAllMentorsQuery(buildQueryString());

  const [isOpen, setIsOpen] = useState(false);
  const [importMentors] = useImportMentorsFileMutation();
  const [deleteMentor] = useDeleteMentorMutation();
  const [addMentor] = useAddMentorMutation();

  const searchConfig: SearchConfig = {
    enabled: true,
    placeholder: "Search by name, email or phone",
    searchKeys: ["name", "email", "phone_number"],
  };

  // dynamic filter options from current page data
  const { orgOptions, expOptions, expertiseOptions } = useMemo(() => {
    const org = new Set<string>();
    const exp = new Set<string>();
    const expertise = new Set<string>();
    (mentorsRes?.data || []).forEach((m) => {
      if (m.organization) org.add(m.organization);
      if (m.level_of_experience) exp.add(m.level_of_experience);
      if (m.area_of_expertise) expertise.add(m.area_of_expertise);
    });
    const toOpts = (arr: string[]) => arr.map((label, i) => ({ id: i, label }));
    return {
      orgOptions: toOpts(Array.from(org)),
      expOptions: toOpts(Array.from(exp)),
      expertiseOptions: toOpts(Array.from(expertise)),
    };
  }, [mentorsRes?.data]);

  const statusConfig: StatusConfig = {
    enabled: false,
    filterOptions: [
      { title: "Organization", queryKey: "organization", options: orgOptions },
      {
        title: "Experience",
        queryKey: "level_of_experience",
        options: expOptions,
      },
      {
        title: "Expertise",
        queryKey: "area_of_expertise",
        options: expertiseOptions,
      },
    ],
  };

  const actionConfig: ActionConfig = {
    enabled: true,
    showAdd: true,
    showDelete: true,
    addButtonText: "Add Mentor",
    onAdd: () => setIsOpen(true),
  };

  const backendPagination = {
    enabled: true,
    currentPage: mentorsRes?.current_page || 1,
    totalPages: mentorsRes?.total_pages || 1,
    pageSize,
    totalCount: mentorsRes?.count || 0,
    onPageChange: (page: number) => setCurrentPage(page),
    onPageSizeChange: (size: number) => {
      setPageSize(size);
      setCurrentPage(1);
    },
    onSearchChange: (q: string) => {
      setSearchTerm(q);
      setCurrentPage(1);
    },
    onFilterChange: (filters: Record<string, unknown>) => {
      setOrgFilters((filters["organization"] as string[]) || []);
      setExpFilters((filters["level_of_experience"] as string[]) || []);
      setExpertiseFilters((filters["area_of_expertise"] as string[]) || []);
      setCurrentPage(1);
    },
    loading: isLoading,
  };

  function formatMentorsPayload(rows: Record<string, unknown>[]) {
    // const safeBool = (v: unknown) => String(v).toLowerCase() === "true";
    const data = rows.map((r) => ({
      name: (r.name as string) ?? "N/A",
      email: (r.email as string) ?? "N/A",
      phone_number: (r.phone_number as string) ?? "N/A",
      job_title: (r.job_title as string) ?? "N/A",
      organization: (r.organization as string) ?? "N/A",
      tshirt_size: (r.tshirt_size as string) ?? "N/A",
      area_of_expertise: (r.area_of_expertise as string) ?? "N/A",
      level_of_experience: (r.level_of_experience as string) ?? "N/A",

      // brief_professional_bio: (r.brief_professional_bio as string) ?? "",
      // additional_comments: (r.additional_comments as string) ?? "",
      // was_part_of_nasa_space_apps: safeBool(r.was_part_of_nasa_space_apps),
      // available_for_full_support: safeBool(r.available_for_full_support),
      // available_during_hackathon_all_times: safeBool(r.available_during_hackathon_all_times),
      // willing_to_stay_overnight: safeBool(r.willing_to_stay_overnight),
      // linkedin_profile_url: (r.linkedin_profile_url as string) ?? "",
      // personal_photo_path: (r.personal_photo_path as string) ?? "",
      // national_id_front_path: (r.national_id_front_path as string) ?? "",
      // national_id_back_path: (r.national_id_front_path as string) ?? "",
      // space_apps_year: (r.space_apps_year as string) ?? "",
      // timing_concerns: (r.timing_concerns as string) ?? "",
    }));

    console.log("data", data);

    return {
      data,
    };
  }

  async function submitMentors(
    payload: ReturnType<typeof formatMentorsPayload>
  ) {
    await importMentors(payload).unwrap();
  }

  const handleAddMentorSubmit = async (data: FieldValues) => {
    try {
      const payload: CreateMentorRequest = {
        name: data.name,
        email: data.email,
        phone_number: data.phone_number,
        job_title: data.job_title,
        organization: data.organization,
        brief_professional_bio: data.brief_professional_bio,
        area_of_expertise: data.area_of_expertise,
        level_of_experience: data.level_of_experience,
        tshirt_size: data.tshirt_size,
        additional_comments: data.additional_comments,
        was_part_of_nasa_space_apps:
          String(data.was_part_of_nasa_space_apps) === "true" ||
          data.was_part_of_nasa_space_apps === true,
        available_for_full_support:
          String(data.available_for_full_support) === "true" ||
          data.available_for_full_support === true,
        available_during_hackathon_all_times:
          String(data.available_during_hackathon_all_times) === "true" ||
          data.available_during_hackathon_all_times === true,
        willing_to_stay_overnight:
          String(data.willing_to_stay_overnight) === "true" ||
          data.willing_to_stay_overnight === true,
        linkedin_profile_url: data.linkedin_profile_url,
        personal_photo_path: data.personal_photo_path,
        national_id_front_path: data.national_id_front_path,
        national_id_back_path: data.national_id_back_path,
        space_apps_year: data.space_apps_year,
        timing_concerns: data.timing_concerns,
      };
      const result = await addMentor(payload).unwrap();
      toast.success(result?.message || "Mentor added successfully!");
      setIsOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to add mentor");
      throw err;
    }
  };

  if (error) return <Error status={404} message="Error fetching mentors" />;

  return (
    <React.Fragment>
      {isOpen && (
        <CrudForm
          fields={getMentorFields()}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          operation={"add"}
          asDialog={true}
          steps={[1, 2, 3]}
          validationSchema={mentorValidationSchema}
          onSubmit={handleAddMentorSubmit}
        />
      )}

      <div className="mx-auto py-6 px-8">
        <div className="w-full flex flex-wrap item-center justify-between">
          <h1 className="text-2xl font-bold mb-6">Mentors</h1>

          <ImportButton
            label="Import Mentors File"
            accept="both"
            title="Import Mentors File"
            description="Upload a CSV or Excel file to import multiple mentors."
            formatPayload={formatMentorsPayload}
            onSubmit={submitMentors}
            onSuccess={() => setCurrentPage(1)}
          />
        </div>

        <DataTable<Mentor>
          data={mentorsRes?.data || []}
          columns={mentorColumns}
          searchConfig={searchConfig}
          statusConfig={statusConfig}
          actionConfig={actionConfig}
          bulkDeleteMutation={deleteMentor}
          backendPagination={backendPagination}
          emailTemplateType="mentors"
          enableBulkEmail={true}
        />
      </div>
    </React.Fragment>
  );
}
