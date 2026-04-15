import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MENU_ITEMS } from '@web/constants/menuItems';
import { describe, expect, it, vi } from 'vitest';

import SideNav from './SideNav';

// ── external deps ─────────────────────────────────────────────────────────────

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    onClick,
  }: {
    href: string;
    children: React.ReactNode;
    onClick?: () => void;
  }) => (
    <a href={href} onClick={onClick}>
      {children}
    </a>
  ),
}));

// ── sidebar UI (passthrough) ──────────────────────────────────────────────────

const mockSetOpenMobile = vi.fn();
vi.mock('@web/components/ui/sidebar', () => ({
  Sidebar: ({ children }: { children: React.ReactNode }) => (
    <nav data-testid="sidebar">{children}</nav>
  ),
  SidebarHeader: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sidebar-header">{children}</div>
  ),
  SidebarContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  SidebarGroup: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  SidebarGroupLabel: ({ children }: { children: React.ReactNode }) => (
    <span>{children}</span>
  ),
  SidebarMenu: ({ children }: { children: React.ReactNode }) => (
    <ul>{children}</ul>
  ),
  SidebarMenuItem: ({ children }: { children: React.ReactNode }) => (
    <li>{children}</li>
  ),
  SidebarMenuButton: ({
    children,
    title,
    render: renderProp,
  }: {
    children?: React.ReactNode;
    title?: string;
    render?: React.ReactElement;
    size?: string;
    className?: string;
  }) => {
    if (renderProp) {
      return (
        <div title={title}>
          {renderProp}
          {children}
        </div>
      );
    }
    return <div title={title}>{children}</div>;
  },
  SidebarMenuSub: ({ children }: { children: React.ReactNode }) => (
    <ul>{children}</ul>
  ),
  SidebarMenuSubItem: ({ children }: { children: React.ReactNode }) => (
    <li>{children}</li>
  ),
  SidebarMenuSubButton: ({
    children,
    render: renderProp,
  }: {
    children?: React.ReactNode;
    render?: React.ReactElement;
  }) => (
    <div>
      {renderProp}
      {children}
    </div>
  ),
  SidebarRail: () => <div data-testid="sidebar-rail" />,
  useSidebar: () => ({ setOpenMobile: mockSetOpenMobile }),
}));

vi.mock('@web/components/ui/collapsible', () => ({
  Collapsible: ({
    children,
    defaultOpen,
  }: {
    children: React.ReactNode;
    defaultOpen?: boolean;
  }) => <div data-open={defaultOpen ? 'true' : 'false'}>{children}</div>,
  CollapsibleTrigger: ({
    children,
    render: renderProp,
  }: {
    children?: React.ReactNode;
    render?: React.ReactElement;
  }) => (
    <div data-testid="collapsible-trigger">
      {renderProp}
      {children}
    </div>
  ),
  CollapsibleContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="collapsible-content">{children}</div>
  ),
}));

// ── tests ─────────────────────────────────────────────────────────────────────

describe('SideNav', () => {
  describe('app name header', () => {
    it('renders a link to the home route "/" in the header', () => {
      render(<SideNav />);
      const homeLinks = screen
        .getAllByRole('link')
        .filter((a) => a.getAttribute('href') === '/');
      expect(homeLinks.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('menu items', () => {
    it('renders every top-level menu item label', () => {
      render(<SideNav />);
      MENU_ITEMS.forEach((item) => {
        // The translation mock returns the key; multiple instances are fine.
        expect(screen.getAllByText(item.value).length).toBeGreaterThanOrEqual(
          1,
        );
      });
    });

    it('renders every top-level menu item count correctly', () => {
      render(<SideNav />);
      // Titles on sidebar buttons use the translated value
      const titledElements = screen
        .getAllByTitle(/.+/)
        .map((el) => el.getAttribute('title'));

      const topLevelWithRoutes = MENU_ITEMS.filter((item) => item.route);
      topLevelWithRoutes.forEach((item) => {
        expect(titledElements).toContain(item.value);
      });
    });

    it('renders a link for every top-level item that has no sub-items', () => {
      render(<SideNav />);
      const leafItems = MENU_ITEMS.filter(
        (item) => !item.items || item.items.length === 0,
      );
      const links = screen
        .getAllByRole('link')
        .map((a) => a.getAttribute('href'));
      leafItems.forEach((item) => {
        expect(links).toContain(item.route);
      });
    });

    it('renders sub-items inside the collapsible content', () => {
      render(<SideNav />);
      const itemsWithSubs = MENU_ITEMS.filter(
        (item) => item.items && item.items.length > 0,
      );
      itemsWithSubs.forEach((parent) => {
        parent.items!.forEach((sub) => {
          expect(screen.getAllByText(sub.value).length).toBeGreaterThanOrEqual(
            1,
          );
        });
      });
    });

    it('renders a link for every sub-item with the correct href', () => {
      render(<SideNav />);
      const allSubItems = MENU_ITEMS.flatMap((item) => item.items ?? []);
      const links = screen
        .getAllByRole('link')
        .map((a) => a.getAttribute('href'));
      allSubItems.forEach((sub) => {
        expect(links).toContain(sub.route);
      });
    });
  });

  describe('mobile close behavior', () => {
    it('calls setOpenMobile(false) when a leaf-item link is clicked', async () => {
      render(<SideNav />);
      const leafItem = MENU_ITEMS.find(
        (item) => !item.items || item.items.length === 0,
      )!;
      const link = screen
        .getAllByRole('link')
        .find((a) => a.getAttribute('href') === leafItem.route)!;

      await userEvent.click(link);
      expect(mockSetOpenMobile).toHaveBeenCalledWith(false);
    });

    it('calls setOpenMobile(false) when a sub-item link is clicked', async () => {
      render(<SideNav />);
      const parentWithSubs = MENU_ITEMS.find(
        (item) => item.items && item.items.length > 0,
      )!;
      const subItem = parentWithSubs.items![0];
      const link = screen
        .getAllByRole('link')
        .find((a) => a.getAttribute('href') === subItem.route)!;

      await userEvent.click(link);
      expect(mockSetOpenMobile).toHaveBeenCalledWith(false);
    });
  });
});
