import React from "react";
import { AppSidebar } from "../../components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "../../components/ui/sidebar";
import { Separator } from "../../components/ui/separator";

import ModeToggle from "../../components/ui/theme-toggle";
import { SearchProvider } from "../../components/ui/search-context";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <SearchProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 justify-between pr-5">
            <div className="flex items-center gap-2 px-4 ">
              <SidebarTrigger className="-ml-1" />
            </div>
            <div>
              <ModeToggle />
            </div>
          </header>

          <main className="p-4 flex-1 overflow-hidden">
            <div className="h-full overflow-auto">{children}</div>
          </main>
        </SidebarInset>
      </SearchProvider>
    </SidebarProvider>
  );
}
