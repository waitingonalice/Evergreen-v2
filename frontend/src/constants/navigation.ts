import { List } from "lucide-react";
import { HomeIcon, NewspaperIcon } from "@heroicons/react/16/solid";
import { clientRoutes } from "./routes";

export const navigation = [
  {
    name: "Home",
    href: clientRoutes.admin.dashboard,
    Icon: HomeIcon,
  },
  {
    name: "Records",
    href: clientRoutes.admin.records,
    Icon: List,
  },
  {
    name: "CV",
    href: clientRoutes.admin.cv.index,
    Icon: NewspaperIcon,
  },
  // {
  //   name: "Analytics",
  //   href: "/",
  //   Icon: ChartBarSquareIcon,
  // },
];
