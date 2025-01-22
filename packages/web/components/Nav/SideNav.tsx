'use client';

import Link from 'next/link';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  useSidebar,
} from '../ui/sidebar';

import { MENU_ITEMS } from '../../constants/menuItems';
import { useTranslations } from 'next-intl';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../ui/collapsible';
import { ChevronRightIcon, GemIcon } from 'lucide-react';

const SideNav = () => {
  const { setOpenMobile } = useSidebar();
  const t = useTranslations('Menu');

  const handleLinkClick = () => {
    setOpenMobile(false);
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/" onClick={handleLinkClick} passHref>
              <SidebarMenuButton size="lg">
                <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <GemIcon className="size-4" />
                </div>

                <div className="grid flex-1 text-left text-sm leading-tight">
                  <p className="font-bold text-inherit">FIN-TRACK</p>
                </div>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Pages</SidebarGroupLabel>
          <SidebarMenu>
            {MENU_ITEMS.map((item) => (
              <Collapsible
                key={item.label}
                defaultOpen={item.isActive}
                className="group/collapsible"
                asChild
              >
                <SidebarMenuItem>
                  {item.items?.length ? (
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        size="lg"
                        tooltip={item.label}
                      >
                        <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                          {item.icon && <item.icon />}
                        </div>

                        <div className="grid flex-1 text-left text-sm leading-tight">
                          <p className="font-medium">{t(item.value)}</p>
                        </div>

                        <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                  ) : (
                    <Link href={item.route} onClick={handleLinkClick} passHref>
                      <SidebarMenuButton size="lg" tooltip={item.label}>
                        <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                          {item.icon && <item.icon />}
                        </div>

                        <div className="grid flex-1 text-left text-sm leading-tight">
                          <p className="font-medium">{t(item.value)}</p>
                        </div>
                      </SidebarMenuButton>
                    </Link>
                  )}

                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.value}>
                          <Link
                            href={subItem.route}
                            onClick={handleLinkClick}
                            passHref
                          >
                            <SidebarMenuSubButton size="md" asChild>
                              <p className="font-medium">{t(subItem.value)}</p>
                            </SidebarMenuSubButton>
                          </Link>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
};

export default SideNav;
