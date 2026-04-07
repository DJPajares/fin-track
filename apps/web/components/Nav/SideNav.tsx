'use client';

import { CONSTANTS } from '@shared/constants/common';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@web/components/ui/collapsible';
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
} from '@web/components/ui/sidebar';
import { MENU_ITEMS } from '@web/constants/menuItems';
import { ChevronRightIcon, TrendingUpIcon } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { TypographyLabel, TypographyMuted } from '../shared/Typography';

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
              <SidebarMenuButton size="lg" className="flex flex-row gap-3">
                <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <TrendingUpIcon className="size-4" />
                </div>

                <div className="grid flex-1 text-left leading-tight">
                  <TypographyLabel className="uppercase">
                    {CONSTANTS.APP_NAME}
                  </TypographyLabel>
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
              >
                <SidebarMenuItem>
                  {item.items?.length ? (
                    <CollapsibleTrigger>
                      <SidebarMenuButton
                        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        size="lg"
                        tooltip={item.label}
                      >
                        <div className="text-muted-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                          {item.icon && <item.icon />}
                        </div>

                        <div className="grid flex-1 text-left leading-tight">
                          <TypographyMuted>{t(item.value)}</TypographyMuted>
                        </div>

                        <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                  ) : (
                    <Link href={item.route} onClick={handleLinkClick} passHref>
                      <SidebarMenuButton size="lg" tooltip={item.label}>
                        <div className="text-muted-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                          {item.icon && <item.icon />}
                        </div>

                        <div className="grid flex-1 text-left leading-tight">
                          <TypographyMuted>{t(item.value)}</TypographyMuted>
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
                            <SidebarMenuSubButton>
                              <div className="grid flex-1 text-left leading-tight">
                                <TypographyMuted>
                                  {t(subItem.value)}
                                </TypographyMuted>
                              </div>
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
