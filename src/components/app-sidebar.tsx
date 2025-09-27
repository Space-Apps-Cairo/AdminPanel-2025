"use client";

import {
  SidebarContent,
  Sidebar,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";

import { TeamSwitcher } from "./team-switcher";
// import SearchBar from "./ui/search-bar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { logout } from "@/service/store/features/authSlice";
import { useAppDispatch, useAppSelector } from "@/service/store/store";
import {
  Building,
  Shapes,
  QrCode,
  ClipboardList,
  LogOut,
  HomeIcon,
  ShieldUser,
  Trophy,
  Mail,
  MailIcon,
} from "lucide-react";
import { NavMain } from "./nav-main";
import { toast } from "sonner";
import { UserRole } from "@/types/auth.types";

// Define navigation items with role-based access
const getNavigationItems = (userRole: UserRole) => {
  const allItems = [
    {
      title: "Home",
      url: "/",
      icon: HomeIcon,
      isActive: true,
      roles: ["Admin", "logistics", "registeration", "material"] as UserRole[],
    },

    {
      title: "Qr Code",
      url: "/qr",
      icon: QrCode,
      isActive: false,
      roles: ["Admin", "logistics", "registeration", "material"] as UserRole[],
      items: [
        {
          title: "Bootcamp",
          url: "/qr/qr-bootcamp",
          items: [
            { title: "Scan QR Code", url: "/qr/qr-bootcamp/scan" },
            {
              title: "Manual Attending",
              url: "/qr/qr-bootcamp/manual-attending",
            },
          ],
        },
        {
          title: "Hackathon",
          url: "/qr/qr-hackathon",
          items: [
            { title: "Scan QR Code", url: "/qr/qr-hackathon/scan" },
            {
              title: "Manual Attending",
              url: "/qr/qr-hackathon/manual-attending",
            },
            { title: "Special Cases", url: "/qr/qr-hackathon/special-cases" },
          ],
        },
      ],
    },
    {
      title: "Materials Management",
      url: "/materials",
      isActive: false,
      icon: Shapes,
      roles: ["Admin", "material"] as UserRole[],
      items: [
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
      isActive: false,
      roles: ["Admin", "logistics", "registeration"] as UserRole[],
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
          title: "Registeration Details ",
          url: "/bootcamp/registerationDetails",
          isActive: false,
          icon: ClipboardList,
          roles: ["Admin", "logistics", "registeration"] as UserRole[],
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
    },
    {
      title: "Hackathon Management",
      url: "/hackathon",
      icon: Trophy,
      isActive: true,
      roles: [
        "Admin",
        "logistics",
        "registeration",
        "filtration",
      ] as UserRole[],
      items: [
        {
          title: "Dashboard",
          url: "/hackathon/dashboard",
        },
        {
          title: "Teams",
          url: "/hackathon/teams",
        },
        {
          title: "Members",
          url: "/hackathon/members",
        },

        {
          title: "Form Options",
          url: "/hackathon/form-options",
          isActive: false,
          roles: [
        "Admin",
      ] as UserRole[],

          items: [
            {
              title: "Tshirt Sizes",
              url: "/hackathon/form-options/tshirt-size",
            },
            {
              title: "Study Levels",
              url: "/hackathon/form-options/study-levels",
            },
            {
              title: "Participation",
              url: "/hackathon/form-options/participationMethod",
            },
            {
              title: "Mentorship",
              url: "/hackathon/form-options/mentorship",
            },
            {
              title: "Challenges",
              url: "/hackathon/form-options/challenges",
            },
            {
              title: "Majors",
              url: "/hackathon/form-options/majors",
            },
            // {
            //   title: "Member Roles",
            //   url: "/hackathon/form-options/memberRole",
            // },
            // {
            //   title: "Actual Solutions",
            //   url: "/hackathon/form-options/actualSolutions",
            // },
          ],
        },
      ],
    },
    {
      title: "Email Templates",
      url: "/email-templates",
      icon: MailIcon,
      roles: ["Admin", "logistics", "registeration", "material","filtration"] as UserRole[],
    },
  ];

  // Filter items based on user role
const canView = (item: any, role: UserRole) => {
    if (!item.roles) return true; 
    return item.roles.includes(role);
  }; 

 const filterItems = (items: any[]): any[] => {
    return items
      .filter((item) => canView(item, userRole)) 
      .map((item) => ({
        ...item,
        items: item.items ? filterItems(item.items) : undefined, 
      }));
  };

  return filterItems(allItems);
};
//   return allItems.filter((item) => item.roles.includes(userRole));
// };

// Function to get team data based on user role
const getTeamData = (userRole: UserRole) => {
  const roleConfig = {
    Admin: {
      name: "NSAC | Admins",
      logo: ShieldUser,
      plan: "admin",
    },
    material: {
      name: "NSAC | Materials",
      logo: Shapes,
      plan: "material team",
    },
    logistics: {
      name: "NSAC | Logistics",
      logo: Building,
      plan: "logistics team",
    },
    registeration: {
      name: "NSAC | Registration",
      logo: ClipboardList,
      plan: "registration team",
    },
  };

  const config = roleConfig[userRole] || roleConfig.Admin;

  return {
    teams: [
      {
        name: config.name,
        logo: config.logo,
        plan: config.plan,
      },
    ],
  };
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { state } = useSidebar();

  // Get user role from Redux store
  const userRole = useAppSelector((state) => state.auth.role) as UserRole;

  // Get filtered navigation items based on user role
  const navMain = getNavigationItems(userRole || "Admin"); // Default to admin if no role

  // Get team data based on user role
  const data = getTeamData(userRole || "Admin");

  const Handlelogout = async () => {
    dispatch(logout());
    toast.success("Logout Successfully");
    router.refresh();
    router.push("/login");
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
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
