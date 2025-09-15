"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
   useSidebar,
} from "./ui/sidebar";

import { TeamSwitcher } from "./team-switcher";
import SearchBar from "./ui/search-bar";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { logout } from "@/service/store/features/authSlice"
import {
  HomeIcon,
  Building,
  GalleryVerticalEnd,
  Shapes,
  QrCode,
  ClipboardList,
  LogOut,
} from "lucide-react";
import { NavMain } from "./nav-main";
import { toast } from "sonner";

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
      title: "Qr Code",
      url: "/qr-code",
      icon: QrCode,
      isActive: true,
      items: [{ title: "Scan QR Code", url: "/qr-code/scan" }],
    },
    {
      title: "Materials Management",
      url: "/materials",
      isActive: true,
      icon: Shapes,
      items: [
        // {
        //   title: "Overview",
        //   url: "/materials",
        // },
        {
          title: "Volunteers",
          url: "/materials/volunteers",
        },
        {
          title: "Materials",
          url: "/materials/materials",
        },
        {
          title: "Collections",
          url: "/materials/collections",
        },
      ],
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
          title: "Bootcamps",
          url: "/bootcamp/bootcamps",
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
          title: "Email Templates",
          url: "/bootcamp/email-templates",
        },
      ],
    },
    {
      title: "Registeration Details ",
      url: "/bootcamp/registerationDetails",
      isActive: true,
      icon: ClipboardList,
      items: [
        {
          title: "Skills",
          url: "/bootcamp/registerationDetails/skills",
        },
        {
          title: "Education Levels",
          url: "/bootcamp/registerationDetails/education-levels",
        },
        {
          title: "Field Of Study",
          url: "/bootcamp/registerationDetails/field-of-study",
        },
        {
          title: "Nationality",
          url: "/bootcamp/registerationDetails/nationality",
        },
        {
          title: "Team Status",
          url: "/bootcamp/registerationDetails/team-status",
        },
        {
          title: "Participation Status",
          url: "/bootcamp/registerationDetails/participation-status",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const dispatch=useDispatch();
  const router=useRouter();
  const { state } = useSidebar();
  const Handlelogout=()=>{
dispatch(logout());
toast.success("Logout Successfully");

 router.push("/login");
  }
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SearchBar />
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
       <SidebarFooter>
       <Button
          variant="outline"
          className="w-full text-red-600 flex items-center gap-2"
          onClick={Handlelogout}
        >
          <LogOut className="h-4 w-4" />
          {state === "expanded" && <span>Log out</span>}
        </Button>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
