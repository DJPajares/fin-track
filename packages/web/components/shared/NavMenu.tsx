import {
  Navbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle
} from '@nextui-org/navbar';
import { Link } from '@nextui-org/react';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';

const menuItems = [
  {
    name: 'Home',
    route: '/'
  },
  {
    name: 'Dashboard',
    route: '/dashboard'
  },
  {
    name: 'Transactions',
    route: '/transactions'
  }
];

/* <div className="flex flex-row justify-end p-2">
  <Sheet>
    <SheetTrigger asChild>
      <Button variant="ghost" size="icon">
        <MenuIcon className="h-8 w-8" />
      </Button>
    </SheetTrigger>
    <SheetContent>
      <SheetHeader>
        <p className="text-left text-lg font-semibold">Main Menu</p>
      </SheetHeader>
      <div className="flex flex-col justify-start py-6">
        <p>Dashboard</p>
        <p>Transactions</p>
      </div>
    </SheetContent>
  </Sheet>
</div> */

const NavMenu = () => (
  <Navbar>
    <NavbarContent justify="start">
      <NavbarMenuToggle />
    </NavbarContent>
    <NavbarMenu>
      {menuItems.map((item, index) => (
        <NavbarMenuItem key={`${item.name}-${index}`}>
          <Link
            color={
              index === 2
                ? 'primary'
                : index === menuItems.length - 1
                ? 'danger'
                : 'foreground'
            }
            className="w-full"
            href={item.route}
            size="lg"
          >
            {item.name}
          </Link>
        </NavbarMenuItem>
      ))}
    </NavbarMenu>
  </Navbar>
);

export default NavMenu;
