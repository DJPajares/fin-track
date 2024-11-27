'use client';

import Link from 'next/link';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  useSidebar
} from '../ui/sidebar';

import { MENU_ITEMS } from '@/constants/menuItems';
import { useTranslations } from 'next-intl';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '../ui/collapsible';
import {
  ChevronRightIcon,
  GalleryVerticalEnd,
  GemIcon,
  MinusIcon,
  PlusIcon
} from 'lucide-react';
import { Label } from '../ui/label';

const SideNav = () => {
  const { setOpenMobile } = useSidebar();
  const t = useTranslations('Menu');

  const handleLinkClick = () => {
    setOpenMobile(false);
  };

  return (
    // <Sidebar collapsible="icon">
    //   <SidebarContent>
    //     <SidebarGroup>
    //       <SidebarGroupLabel>FIN-TRACK</SidebarGroupLabel>
    //       <SidebarGroupContent>
    //         <SidebarMenu>
    //           {MENU_ITEMS.map((item, index) => (
    //             <Collapsible
    //               key={item.value}
    //               defaultOpen={index === 1}
    //               className="group/collapsible"
    //             >
    //               <SidebarMenuItem key={item.value}>
    //                 <CollapsibleTrigger asChild>
    //                   <SidebarMenuButton size="md" asChild>
    //                     <Link
    //                       href={item.route}
    //                       onClick={handleLinkClick} // Close the sidebar on navigation
    //                       passHref
    //                     >
    //                       <item.icon />
    //                       <span>{t(item.value)}</span>
    //                     </Link>
    //                     <PlusIcon className="ml-auto group-data-[state=open]/collapsible:hidden" />
    //                     <MinusIcon className="ml-auto group-data-[state=closed]/collapsible:hidden" />
    //                   </SidebarMenuButton>
    //                 </CollapsibleTrigger>

    //                 {item.items?.length ? (
    //                   <CollapsibleContent>
    //                     <SidebarMenuSub>
    //                       {item.items.map((item) => (
    //                         <SidebarMenuSubItem key={item.title}>
    //                           <SidebarMenuSubButton
    //                             asChild
    //                             isActive={item.isActive}
    //                           >
    //                             <a href={item.url}>{item.title}</a>
    //                           </SidebarMenuSubButton>
    //                         </SidebarMenuSubItem>
    //                       ))}
    //                     </SidebarMenuSub>
    //                   </CollapsibleContent>
    //                 ) : null}
    //               </SidebarMenuItem>
    //             </Collapsible>
    //           ))}
    //         </SidebarMenu>
    //       </SidebarGroupContent>
    //     </SidebarGroup>
    //   </SidebarContent>

    //   <SidebarRail />
    // </Sidebar>

    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <GemIcon className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <Link href="/" onClick={handleLinkClick} passHref>
                  <p className="font-bold text-inherit">FIN-TRACK</p>
                </Link>
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
                asChild
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                      size="lg"
                      tooltip={item.label}
                    >
                      <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                        {item.icon && <item.icon />}
                      </div>

                      {item.items?.length ? (
                        <>
                          <div className="grid flex-1 text-left text-sm leading-tight">
                            <p>{t(item.value)}</p>
                          </div>

                          <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </>
                      ) : (
                        <>
                          <div className="grid flex-1 text-left text-sm leading-tight">
                            <Link
                              href={item.route}
                              onClick={handleLinkClick}
                              passHref
                            >
                              <p className="font-medium">{t(item.value)}</p>
                            </Link>
                          </div>
                        </>
                      )}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.value}>
                          <SidebarMenuSubButton asChild>
                            {/* <a href={subItem.route}>
                              <span>{subItem.label}</span>
                            </a> */}
                            <Link
                              href={subItem.route}
                              onClick={handleLinkClick}
                              passHref
                            >
                              {/* <Label className="cursor-pointer">
                                {t(subItem.value)}
                              </Label> */}
                              <p className="font-normal">{t(subItem.value)}</p>
                            </Link>
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
