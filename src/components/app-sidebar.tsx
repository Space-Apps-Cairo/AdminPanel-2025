"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

import { TeamSwitcher } from "@/components/team-switcher";
import { NavMain } from "@/components/nav-main";
import SearchBar from "@/components/ui/search-bar";

import {
  HomeIcon,
  Building,
  // Frame,
  GalleryVerticalEnd,
  // PieChart,
  // Map,
} from "lucide-react";

const data = {
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: HomeIcon,
      isActive: true,
    },
    {
      title: "Bootcamp Management",
      url: "/bootcamp",
      icon: Building,
      isActive: true,
      items: [
        {
          title: "Analytics",
          url: "/bootcamp/analytics",
        },
        {
          title: "Workshops",
          url: "/bootcamp/workshops",
        },
        {
          title: "Participants",
          url: "/bootcamp/participants",
        },
        {
          title: "Email Tracking",
          url: "/bootcamp/emails",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SearchBar />
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter />
      <SidebarRail />
    </Sidebar>
  );
}
