"use client";

import Loading from "@/components/loading/loading";
import {
  useGetHackathonInsightsQuery,
  useGetStudyLevelsQuery,
  useGetMajorsQuery,
} from "@/service/Api/hackathon/dashboard";
import { SectionCards, SectionCardData } from "@/components/sectionCards/page";
import { ReusablePieChart } from "@/components/charts/ReusablePieChart";
import { ChartBar } from "@/components/cnCharts/barChart";
import { Users, UserCheck } from "lucide-react";

const colors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
];

export default function HackathonDashboard() {
  const {
    data: insightsRes,
    isLoading,
    error,
  } = useGetHackathonInsightsQuery();
  const { data: studyLevelsRes, isLoading: levelsLoading } =
    useGetStudyLevelsQuery();
  const { data: majorsRes, isLoading: majorsLoading } = useGetMajorsQuery();

  if (isLoading || levelsLoading || majorsLoading) return <Loading />;
  if (error || !insightsRes?.data) return <div>Error loading data</div>;

  const insights = insightsRes.data;
  const studyLevels = studyLevelsRes?.data ?? [];
  const majors = majorsRes?.data ?? [];

  // ---------- Section Cards ----------
  const cards: SectionCardData[] = [
    {
      title: "Members",
      value: insights.members_and_teams.members.toString(),
      description: "Total Members",
      icon: <Users />,
      color: "text-blue-500 bg-blue-100",
    },
    {
      title: "Teams",
      value: insights.members_and_teams.teams.toString(),
      description: "Total Teams",
      icon: <UserCheck />,
      color: "text-green-500 bg-green-100",
    },
    {
      title: "New Members",
      value: insights.members_and_teams.new_members.toString(),
      description: "Joined this hackathon",
      icon: <Users />,
      color: "text-purple-500 bg-purple-100",
    },
  ];

  // ---------- Pie Data ----------
  const genderData =
    insights.gender_members.map((g: any, i: number) => ({
      gender: g.gender,
      count: g.count,
      fill: colors[i % colors.length],
    })) ?? [];

  const ageData =
    insights.age_members.map((a: any, i: number) => ({
      age: a.age,
      count: a.count,
      fill: colors[i % colors.length],
    })) ?? [];

  const studyLevelData =
    insights.studylevels_members.map((s: any, i: number) => {
      // بدل ما نشتغل بالـ id هنشتغل بالـ title مباشرة
      const matchedLevel = studyLevels.find(
        (lvl: any) => String(lvl.id) === String(s.study_level_id)
      );

      return {
        title: matchedLevel ? matchedLevel.title : "Unknown",
        count: s.count,
        fill: colors[i % colors.length],
      };
    }) ?? [];

  const majorsData =
    insights.major_members.map((m: any, i: number) => {
      const majorTitle =
        majors.find((mj: any) => mj.id === m.major_id)?.title || "Unknown";
      return {
        title: majorTitle,
        count: m.count,
        fill: colors[i % colors.length],
      };
    }) ?? [];

  // ---------- Bar Charts ----------
  const challengeTeamsData =
    insights.challenges_teams.map((c: any) => ({
      challenge: `Challenge ${c.challenge_id}`,
      teams: c.count,
    })) ?? [];

  const challengeTeamsConfig = {
    teams: { label: "Teams", color: "var(--chart-1)" },
  };

  const mentorshipData =
    insights.mentorshipTeam.map((m: any) => ({
      mentorship: `Need ${m.mentorship_needed_id}`,
      total: m.total,
    })) ?? [];

  const mentorshipConfig = {
    total: { label: "Teams", color: "var(--chart-2)" },
  };

  return (
    <div className="space-y-6 px-8 h-fit overflow-hidden pb-10">
      {/* Section Cards */}
      <SectionCards data={cards} />

      {/* Pie Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ReusablePieChart
          title="Gender Distribution"
          description="Members by gender"
          data={genderData}
          dataKey="count"
          nameKey="gender"
        />
        <ReusablePieChart
          title="Age Distribution"
          description="Members by age groups"
          data={ageData}
          dataKey="count"
          nameKey="age"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ReusablePieChart
          title="Study Levels"
          description="Distribution of members by study levels"
          data={studyLevelData}
          dataKey="count"
          nameKey="title"
        />
        <ReusablePieChart
          title="Majors"
          description="Distribution of members by majors"
          data={majorsData}
          dataKey="count"
          nameKey="title"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartBar
          title="Challenges Teams"
          description="Number of teams per challenge"
          data={challengeTeamsData}
          config={challengeTeamsConfig}
        />
        <ChartBar
          title="Mentorship Needs"
          description="Teams requiring mentorship by type"
          data={mentorshipData}
          config={mentorshipConfig}
        />
      </div>
    </div>
  );
}
