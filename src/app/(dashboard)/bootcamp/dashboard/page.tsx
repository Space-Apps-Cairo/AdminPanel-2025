"use client"

import Loading from "../../../../components/loading/loading"
import { 
  useGetWorkshopAttendanceQuery, 
  useGetAttendeesNumbersQuery,
  useGetWorkshopsAttendeesQuery 
} from "@/service/Api/dashboard"
import { TrendingUp, TrendingDown } from "lucide-react"
import { MultiBarChart } from "../../../../components/cnCharts/multichart"
import { ChartBar } from "../../../../components/cnCharts/barChart"
import { SectionCardData, SectionCards } from "@/components/sectionCards/page"

export default function AttendanceDashboard() {
  // ---------- Hooks ----------
  const { data: workshopData, isLoading: isLoadingWorkshop, error: workshopError } = useGetWorkshopAttendanceQuery()
  const { data: attendeesData, isLoading: isLoadingAttendees, error: attendeesError } = useGetAttendeesNumbersQuery()
  const { data: workshopsAttendeesData, isLoading: isLoadingWorkshopsAttendees, error: workshopsAttendeesError } = useGetWorkshopsAttendeesQuery()

  // ---------- Loading / Error ----------
  if (isLoadingWorkshop || isLoadingAttendees || isLoadingWorkshopsAttendees) return <Loading />
  if (workshopError || attendeesError || workshopsAttendeesError || !workshopData || !attendeesData || !workshopsAttendeesData) 
    return <div>Error loading data</div>

  // ---------------- MultiBarChart Data ----------------
  const chartData = workshopData.data.attendance.map((item: any) => ({
    month: item.workshop_title || "Unassigned",
    attended: item.attended_count,
    absent: item.absent_count,
    assigned: item.assigned_count,
  }))

  const chartKeys = [
    { dataKey: "attended", label: "Attended", color: "var(--color-slate-600)" },
    { dataKey: "absent", label: "Absent", color: "var(--color-slate-400)" },
    { dataKey: "assigned", label: "Assigned", color: "var(--color-slate-900)" },
  ]

  // ---------------- Section Cards Data ----------------
  const cards: SectionCardData[] = [
    {
      title: "Registered Attendees",
      value: attendeesData.data.registered_attendees.toString(),
      description: "Registered Attendees",
      trend: "up",
      trendValue: "+0%",
      footerMain: "Total registered attendees",
    },
    {
      title: "Enrolled Attendees",
      value: attendeesData.data.enrolled_attendees.toString(),
      description: "Enrolled Attendees",
      trend: "up",
      trendValue: "+0%",
      footerMain: "Total attendees who attended workshops",
    },
    {
      title: "Absent Attendees",
      value: attendeesData.data.not_enrolled_attendees.toString(),
      description: "Absent Attendees",
      trend: "down",
      trendValue: "-0%",
      footerMain: "Total attendees who were absent",
    },
  ]

  // ---------------- Bar Chart Data (Workshops) ----------------
  const workshopsChartData = workshopsAttendeesData.data.workshops.map((w: any) => ({
    month: w.workshop_title || "Unassigned",
    participants: w.total_participants,
  }))

  const workshopsChartConfig = {
    participants: { label: "Participants", color: "var(--color-slate-800)" },
  }

  return (
   <div className="space-y-6">
  {/* ---------- Section Cards ---------- */}
  <SectionCards data={cards} />

  {/* ---------- Charts Side by Side ---------- */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {/* Multi Bar Chart */}
    <MultiBarChart
      title="Workshop Attendance"
      description="Attendance summary for all workshops"
      data={chartData}
      keys={chartKeys}
      footerText="Attendance overview"
      footerSubText="Showing workshop attendance details"
      indicator={<TrendingUp className="h-4 w-4" />}
    />

    {/* Single Bar Chart */}
    <ChartBar
      title="Participants per Workshop"
      description="Total participants for each workshop"
      data={workshopsChartData}
      config={workshopsChartConfig}
      footerText="Workshop overview"
      trendValue="Trending up"
      trendIcon={<TrendingUp className="h-4 w-4" />}
    />
  </div>
</div>)
}
