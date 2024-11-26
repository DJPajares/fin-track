import {
  ChartColumnBigIcon,
  GaugeIcon,
  HandCoinsIcon,
  HouseIcon,
  Layers3Icon
} from 'lucide-react';

export const MENU_ITEMS = [
  {
    value: 'home',
    label: 'Home',
    route: '/',
    icon: HouseIcon
  },
  {
    value: 'dashboard',
    label: 'Dashboard',
    route: '/dashboard',
    icon: GaugeIcon
  },
  {
    value: 'charts',
    label: 'Charts (Month)',
    route: '/charts/month',
    icon: ChartColumnBigIcon
  },
  {
    value: 'chartsYear',
    label: 'Charts (Year)',
    route: '/charts/year',
    icon: ChartColumnBigIcon
  },
  {
    value: 'transactions',
    label: 'Transactions',
    route: '/transactions',
    icon: HandCoinsIcon
  },
  {
    value: 'categories',
    label: 'Categories',
    route: '/categories',
    icon: Layers3Icon
  }
];
