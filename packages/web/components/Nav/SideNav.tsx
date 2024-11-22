'use client';

import { Dispatch, SetStateAction } from 'react';
import Link from 'next/link';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '../ui/sidebar';

import { MENU_ITEMS } from '@/constants/menuItems';

type SideNavProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const SideNav = ({ open, setOpen }: SideNavProps) => {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {MENU_ITEMS.map((item) => (
                <SidebarMenuItem key={item.value}>
                  <SidebarMenuButton asChild>
                    {/* <a href={item.route}>
                      <item.icon />
                      <span>{item.label}</span>
                    </a> */}

                    <Link href={item.route} onClick={() => setOpen(false)}>
                      {/* <Link href={item.route} onClick={() => setOpen(false)}> */}
                      <item.icon />
                      {item.label}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default SideNav;
