"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MoreVerticalIcon, MoonIcon, SunIcon, LogOutIcon } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "../ui/sidebar";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { cn } from "@/lib/utils";

export const SidebarUser = () => {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarFallback className="rounded-lg">C</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Covena Support</span>
                <span className="truncate text-xs">support@covena.ai</span>
              </div>
              <MoreVerticalIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="dark w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}>
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarFallback className="rounded-lg">C</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Covena Support</span>
                  <span className="truncate text-xs">support@covena.ai</span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />
            <div className="flex items-center justify-between px-2 py-1.5 text-sm">
              <span className="flex items-center gap-2">
                {true ? (
                  <MoonIcon className="text-muted-foreground size-4" />
                ) : (
                  <SunIcon className="text-muted-foreground size-4" />
                )}
                Toggle
              </span>
              <ToggleGroup
                type="single"
                size="sm"
                variant="outline"
                defaultValue="dark"
                aria-label="Theme toggle"
                title="Theme toggle"
                className={cn("shadow-none dark:shadow-none")}>
                <ToggleGroupItem
                  value="light"
                  aria-label="Toggle light mode"
                  className={cn(
                    "!text-muted-foreground !bg-transparent",
                    "hover:!text-neutral-950 data-[state=on]:!text-neutral-950 dark:hover:!text-neutral-50 dark:data-[state=on]:!text-neutral-50",
                  )}>
                  <SunIcon />
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="dark"
                  aria-label="Toggle dark mode"
                  className={cn(
                    "!text-muted-foreground !bg-transparent",
                    "hover:!text-neutral-950 data-[state=on]:!text-neutral-950 dark:hover:!text-neutral-50 dark:data-[state=on]:!text-neutral-50",
                  )}>
                  <MoonIcon />
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOutIcon />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
