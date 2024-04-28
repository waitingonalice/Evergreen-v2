import { useState } from "react";
import {
  BanknotesIcon,
  Bars3CenterLeftIcon,
  ChartBarSquareIcon,
  HomeIcon,
  NewspaperIcon,
} from "@heroicons/react/16/solid";
import { Drawer, cn } from "@waitingonalice/design-system";
import { clientRoutes } from "@/constants";
import { Link } from "../../../link";

const navigation = [
  {
    name: "Dashboard",
    href: clientRoutes.admin.dashboard,
    Icon: HomeIcon,
  },
  {
    name: "CV",
    href: "/",
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

function Topbar() {
  const [openPanel, setOpenPanel] = useState(false);

  const handlePanel = () => {
    setOpenPanel((prev) => !prev);
  };

  return (
    <header className="sticky top-0 flex h-16 gap-4 border-b bg-secondary-1 px-4 md:px-6 mb-8">
      <nav
        className={cn("hidden", "gap-6 md:flex md:flex-row md:items-center")}
      >
        {navigation.map((item) => (
          <Link textSize="medium" to={item.href} key={item.name}>
            {item.name}
          </Link>
        ))}
      </nav>
      <button
        onClick={handlePanel}
        type="button"
        aria-label="Open navigation"
        className={cn("md:hidden", "block")}
      >
        <Bars3CenterLeftIcon className="w-6 h-auto" />
      </button>
      <Drawer
        open={openPanel}
        direction="left"
        onClose={handlePanel}
        content={
          <nav className={cn("flex flex-col items-start text-start gap-y-6")}>
            {navigation.map((item) => (
              <Link
                key={item.name}
                textSize="medium"
                to={item.href}
                prefixIcon={<item.Icon className="w-6 h-auto" />}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        }
      />
    </header>
  );
}

export { Topbar };
