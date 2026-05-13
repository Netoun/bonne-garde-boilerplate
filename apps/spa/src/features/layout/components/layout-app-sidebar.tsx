import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@bonne-garde/ui/components/sidebar";
import { LayoutOrgSwitcher } from "./layout-org-switcher";
import { LayoutNavMain } from "./layout-nav-main";
import { LayoutNavUser } from "./layout-nav-user";
import chestImage from "@bonne-garde/assets/images/chest,w_194.webp";

export function LayoutAppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-sidebar-border/50 bg-sidebar-background overflow-hidden"
      {...props}
    >
      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 pointer-events-none bg-linear-to-b from-card/50 via-transparent to-muted/30" />

      {/* Decorative top border accent */}
      <div className="absolute top-0 left-0 right-0 h-0.5 pointer-events-none bg-linear-to-r from-transparent via-primary/60 to-transparent" />

      <SidebarHeader className="relative z-10 py-4">
        {/* Logo / Brand */}
        <div className="px-3 group-data-[collapsible=icon]:px-1 mb-2">
          <div className="flex items-center gap-3 group cursor-default">
            <img
              src={chestImage}
              alt="Bonne Garde"
              className="size-8 group-data-[collapsible=icon]:size-6 transition-all duration-300 ease-out group-hover:scale-105 shadow-md"
            />
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
              <span className="font-heading text-lg font-semibold tracking-tight leading-none text-foreground">
                Bonne Garde
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] font-medium mt-0.5 text-secondary">
                Backoffice
              </span>
            </div>
          </div>
        </div>

        <LayoutOrgSwitcher />
      </SidebarHeader>

      <SidebarContent className="relative z-10">
        <LayoutNavMain />
      </SidebarContent>

      <SidebarFooter className="relative z-10">
        {/* Decorative line above user */}
        <div className="mx-3 mb-3">
          <div className="h-px w-full bg-linear-to-r from-transparent via-border to-transparent" />
        </div>
        <LayoutNavUser />
      </SidebarFooter>

      <SidebarRail className="after:bg-transparent hover:after:bg-sidebar-accent/50" />
    </Sidebar>
  );
}
