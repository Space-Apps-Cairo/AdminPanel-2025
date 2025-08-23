"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "./ui/sidebar";

import { TeamSwitcher } from "./team-switcher";
import SearchBar from "./ui/search-bar";

import {
  HomeIcon,
  Building,
  // Frame,
  GalleryVerticalEnd,
  BrickWall,
  // PieChart,
  // Map,
} from "lucide-react";
import { NavMain } from "./nav-main";

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
          title: "Dashboard",
          url: "/bootcamp/dashboard",
        },
        {
          title: "Details",
          url: "/bootcamp/details",
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
    {
      title: "Forms",
      url: "/form-builder",
      icon: BrickWall,
      isActive: true,
      items: [
        {
          title: "Form Builder",
          url: "/form-builder",
        }
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
