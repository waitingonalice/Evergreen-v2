import {
  BanknotesIcon,
  ChartBarSquareIcon,
  HomeIcon,
  NewspaperIcon,
} from "@heroicons/react/16/solid";
import { clientRoutes } from "./routes";

export const navigation = [
  {
    name: "Home",
    href: clientRoutes.admin.dashboard,
    Icon: HomeIcon,
  },
  {
    name: "CV",
    href: clientRoutes.admin.cv.index,
    Icon: NewspaperIcon,
  },
  {
    name: "Expenses",
    href: "/",
    Icon: BanknotesIcon,
  },
  {
    name: "Analytics",
    href: "/",
    Icon: ChartBarSquareIcon,
  },
];
