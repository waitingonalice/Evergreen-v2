import { useState } from "react";
import { useRouter } from "next/router";
import { Bars3CenterLeftIcon } from "@heroicons/react/16/solid";
import { Drawer, cn } from "@waitingonalice/design-system";
import { clientRoutes } from "@/constants";
import { navigation } from "@/constants/navigation";
import { Link } from "../../../link";

function Topbar() {
  const [openPanel, setOpenPanel] = useState(false);
  const router = useRouter();
  const handlePanel = () => {
    setOpenPanel((prev) => !prev);
  };
  const activeRoute = (currentRoute: string) =>
    currentRoute.includes(router.pathname);

  return (
    <header className="sticky top-0 flex justify-between items-center gap-x-4 h-16 gap-4 border-b bg-secondary-1 px-4 md:px-6">
      <nav
        className={cn("hidden", "gap-6 md:flex md:flex-row md:items-center")}
      >
        {navigation.map((item) => (
          <Link
            textSize="medium"
            to={item.href}
            key={item.name}
            className={cn(
              activeRoute(item.href) &&
                "bg-primary-main rounded-lg text-secondary-1 px-3 py-1 hover:text-secondary-1",
            )}
          >
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
      <Link to={clientRoutes.auth.logout} variant="secondary" className="h-fit">
        Sign out
      </Link>
      <Drawer
        open={openPanel}
        direction="left"
        onClose={handlePanel}
        content={
          <nav className={cn("flex flex-col items-start text-start gap-y-6")}>
            {navigation.map((item) => (
              <Link
                className={cn(
                  activeRoute(item.href) &&
                    "flex justify-start w-full bg-primary-main text-secondary-1 py-1 px-6 hover:text-secondary-1",
                )}
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
