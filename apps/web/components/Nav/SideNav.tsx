'use client';

import { CONSTANTS } from '@shared/constants/common';
import { TypographyLabel } from '@web/components/shared/Typography';
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
            <SidebarMenuButton
              render={<Link href="/" onClick={handleLinkClick} />}
              size="lg"
              className="flex flex-row gap-3"
            >
              <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <TrendingUpIcon className="size-4" />
              </div>

              <div className="grid flex-1 text-left leading-tight">
                <TypographyLabel className="uppercase">
                  {CONSTANTS.APP_NAME}
                </TypographyLabel>
              </div>
            </SidebarMenuButton>
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
                    <CollapsibleTrigger
                      render={
                        <SidebarMenuButton
                          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                          size="lg"
                          title={t(item.value)}
                        >
                          <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                            {item.icon && <item.icon />}
                          </div>

                          <div className="grid flex-1 text-left leading-tight">
                            <TypographyLabel>{t(item.value)}</TypographyLabel>
                          </div>

                          <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      }
                    />
                  ) : (
                    <SidebarMenuButton
                      render={
                        <Link href={item.route} onClick={handleLinkClick} />
                      }
                      size="lg"
                      title={t(item.value)}
                    >
                      <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                        {item.icon && <item.icon />}
                      </div>

                      <div className="grid flex-1 text-left leading-tight">
                        <TypographyLabel>{t(item.value)}</TypographyLabel>
                      </div>
                    </SidebarMenuButton>
                  )}

                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.value}>
                          <SidebarMenuSubButton
                            render={
                              <Link
                                href={subItem.route}
                                onClick={handleLinkClick}
                              />
                            }
                          >
                            <div className="grid flex-1 text-left leading-tight">
                              <TypographyLabel>
                                {t(subItem.value)}
                              </TypographyLabel>
                            </div>
                          </SidebarMenuSubButton>
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
