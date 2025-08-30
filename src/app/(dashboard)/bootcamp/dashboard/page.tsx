"use client";

import Loading from "../../../../components/loading/loading";
import {
  useGetWorkshopAttendanceQuery,
  useGetAttendeesNumbersQuery,
  useGetWorkshopsAttendeesQuery,
  useGetAgeDistributionQuery,
  useGetGovernorateDistributionQuery,
} from "@/service/Api/dashboard";
import { TrendingUp, UserCheck, Users, UserX } from "lucide-react";
import { MultiBarChart } from "../../../../components/cnCharts/multichart";
import { ChartBar } from "../../../../components/cnCharts/barChart";
import { SectionCardData, SectionCards } from "@/components/sectionCards/page";
import { ReusablePieChart } from "@/components/charts/ReusablePieChart";

const colors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
];
export default function AttendanceDashboard() {
  // ---------- Hooks ----------
  const {
    data: workshopData,
    isLoading: isLoadingWorkshop,
    error: workshopError,
  } = useGetWorkshopAttendanceQuery();
  const {
    data: attendeesData,
    isLoading: isLoadingAttendees,
    error: attendeesError,
  } = useGetAttendeesNumbersQuery();
  const {
    data: workshopsAttendeesData,
    isLoading: isLoadingWorkshopsAttendees,
    error: workshopsAttendeesError,
  } = useGetWorkshopsAttendeesQuery();

  const { data: ageRes, isLoading: ageLoading } = useGetAgeDistributionQuery();
  const { data: govRes, isLoading: govLoading } =
    useGetGovernorateDistributionQuery();

  // ---------- Loading / Error ----------
  if (
    isLoadingWorkshop ||
    isLoadingAttendees ||
    isLoadingWorkshopsAttendees ||
    ageLoading ||
    govLoading
  )
    return <Loading />;
  if (
    workshopError ||
    attendeesError ||
    workshopsAttendeesError ||
    !workshopData ||
    !attendeesData ||
    !workshopsAttendeesData
  )
    return <div>Error loading data</div>; // Error Component

  // --------------- PieCharts Data -------------
  const ageData =
    ageRes?.data?.map((item: any, i: number) => ({
      age: item.age,
      count: item.count,
      fill: colors[i % colors.length],
    })) ?? [];

  const govData =
    govRes?.data?.map((item: any, i: number) => ({
      governorate: item.governorate,
      count: item.count,
      fill: colors[i % colors.length],
    })) ?? [];
  // ---------------- MultiBarChart Data ----------------
  const chartData = workshopData.data.attendance.map((item: any) => ({
    month: item.workshop_title || "Unassigned",
    attended: item.attended_count,
    absent: item.absent_count,
    assigned: item.assigned_count,
  }));

  const chartKeys = [
    {
      dataKey: "attended",
      label: "Attended",
      color: "#4CAF50",
    },
    {
      dataKey: "absent",
      label: "Absent",
      color: "#F44336",
    },
    {
      dataKey: "assigned",
      label: "Assigned",
      color: "#2196F3",
    },
  ];

  // ---------------- Section Cards Data ----------------
  const cards: SectionCardData[] = [
    {
      title: "Registered Attendees",
      value: attendeesData.data.registered_attendees.toString(),
      description: "Registered Attendees",
      icon: <Users />,
      color: "text-blue-500 bg-blue-100",
    },
    {
      title: "Enrolled Attendees",
      value: attendeesData.data.enrolled_attendees.toString(),
      description: "Enrolled Attendees",
      icon: <UserCheck />,
      color: "text-green-500 bg-green-100",
    },
    {
      title: "Absent Attendees",
      value: attendeesData.data.not_enrolled_attendees.toString(),
      description: "Absent Attendees",
      icon: <UserX />,
      color: "text-red-500 bg-red-100",
    },
  ];

  // ---------------- Bar Chart Data (Workshops) ----------------
  const workshopsChartData = workshopsAttendeesData.data.workshops.map(
    (w: any) => ({
      month: w.workshop_title || "Unassigned",
      participants: w.total_participants,
    })
  );

  const workshopsChartConfig = {
    participants: { label: "Participants", color: "var(--chart-1)" },
  };

  return (
    <div className="space-y-6 px-8">
      {/* ---------- Section Cards ---------- */}
      <SectionCards data={cards} />

      {/* ---------- Charts Side by Side ---------- */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        {/* Multi Bar Chart */}
        <div className="col-span-3">
          <MultiBarChart
            title="Workshop Attendance"
            description="Attendance summary for all workshops"
            data={chartData}
            keys={chartKeys}
          />
        </div>
        <div className="col-span-3">
          <ChartBar
            title="Participants per Workshop"
            description="Total participants for each workshop"
            data={workshopsChartData}
            config={workshopsChartConfig}
          />
        </div>
        {/* Single Bar Chart */}
      </div>

      {/* Pie Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ReusablePieChart
          title="Age Distribution"
          description="Participants by age groups"
          data={ageData}
          dataKey="count"
          nameKey="age"
          // config={{ count: { label: "Participants" } }}
        />

        <ReusablePieChart
          title="Governorate Distribution"
          description="Participants by governorates"
          data={govData}
          dataKey="count"
          nameKey="governorate"
          // config={{ count: { label: "Participants" } }}
        />
      </div>
    </div>
  );
}
