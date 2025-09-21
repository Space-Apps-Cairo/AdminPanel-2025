"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";

  import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,

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
import { logout } from "@/service/store/features/authSlice"
import { useAppDispatch, useAppSelector } from "@/service/store/store";
import {
  Building,
  Shapes, 
  QrCode,
  ClipboardList,
  LogOut,
  HomeIcon,
  ShieldUser,
} from "lucide-react";
import { NavMain } from "./nav-main";
import { toast } from "sonner";
import { UserRole } from "@/types/auth.types";
 
// Define navigation items with role-based access
const getNavigationItems = (userRole: UserRole) => {
  const allItems = [

    {
      title: "Dashboard",
      url: "/",
      icon: HomeIcon,
      isActive: true,
      roles: ['Admin', 'logistics', 'registeration', 'material'] as UserRole[],
      items: [{title: 'Dashboard', url: '/'}],
    },
    {
      title: "Qr Code",
      url: "/qr-code",
      icon: QrCode,
      isActive: true,
      roles: ['Admin', 'logistics', 'registeration', 'material'] as UserRole[],
      items: [
        { title: "Scan QR Code", url: "/qr-code/scan" },
        { title: "Manual Attending", url: "/qr-code/manual-attending" }
      ],
    },
    {
      title: "Materials Management",
      url: "/materials",
      isActive: true,
      icon: Shapes,
      roles: ['Admin', 'material'] as UserRole[],
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
      isActive: true,
      roles: ['Admin', 'logistics', 'registeration'] as UserRole[],
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
      roles: ['Admin', 'logistics', 'registeration'] as UserRole[],
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




    {
  title: "Hackathon Management",
  url: "/hackathon",
  icon: Building,
  isActive: true,
  roles: ["Admin"],
  items: [
    {
      title: "Member Roles",
      url: "/hackathon/form-options/memberRole",
    },
    {
      title: "Actual Solutions",
      url: "/hackathon/form-options/actualSolutions",
    },
  ],
},

  ];

  // Filter items based on user role
  return allItems.filter(item => item.roles.includes(userRole));
};

// Function to get team data based on user role
const getTeamData = (userRole: UserRole) => {
  const roleConfig = {
    Admin: {
      name: "NSAC | Admins",
      logo: ShieldUser,
      plan: "admin"
    },
    material: {
      name: "NSAC | Materials",
      logo: Shapes,
      plan: "material team"
    },
    logistics: {
      name: "NSAC | Logistics",
      logo: Building,
      plan: "logistics team"
    },
    registeration: {
      name: "NSAC | Registration",
      logo: ClipboardList,
      plan: "registration team"
    }
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
  const navMain = getNavigationItems(userRole || 'Admin'); // Default to admin if no role
  const pathname = usePathname();
  const isActive = (path: string) => pathname?.startsWith(path);
  // Get team data based on user role
  const data = getTeamData(userRole || 'Admin');

  const Handlelogout = async () => {
    dispatch(logout());
    toast.success("Logout Successfully");
    router.refresh();
    router.push("/login");
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        
  

  {/* Hackathon Management Section
  <SidebarGroup>
    <SidebarGroupLabel>Hackathon Management</SidebarGroupLabel>
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuSub>
          <SidebarMenuSubItem>
              <SidebarMenuSubButton asChild data-active={isActive("/hackathon/form-options/memberRole") ? "true" : undefined}>
                 <Link href="/hackathon/form-options/memberRole">
                   Member Roles
                      </Link>
                       </SidebarMenuSubButton>


          </SidebarMenuSubItem>
          <SidebarMenuSubItem>
            <SidebarMenuSubButton asChild data-active={isActive("/hackathon/form-options/actualSolutions") ? "true" : undefined}
  >
             <Link href="/hackathon/form-options/actualSolutions">
               Actual Solutions
               </Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
        </SidebarMenuSub>
      </SidebarMenuItem>
    </SidebarMenu>
  </SidebarGroup> */}


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
