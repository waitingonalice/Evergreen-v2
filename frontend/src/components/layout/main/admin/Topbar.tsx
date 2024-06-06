/* eslint-disable react/no-array-index-key */
import { useState } from "react";
import { useRouter } from "next/router";
import {
  Bars3CenterLeftIcon,
  ChevronLeftIcon,
} from "@heroicons/react/16/solid";
import { Button, ButtonProps, Drawer, cn } from "@waitingonalice/design-system";
import { clientRoutes } from "@/constants";
import { navigation } from "@/constants/navigation";
import { Link as LinkComponent } from "../../../link";

export interface TopbarProps {
  onBackClick?: () => void;
  ctxButtons?: Omit<ButtonProps, "size">[];
}

function Topbar({ onBackClick, ctxButtons }: TopbarProps) {
  const router = useRouter();
  const [openPanel, setOpenPanel] = useState(false);

  const handlePanel = () => {
    setOpenPanel((prev) => !prev);
  };

  const isActive = (href: string) =>
    router.route.split("/").slice(0, 3).join("/") === href;

  return (
    <header className="sticky top-0 flex justify-between items-center gap-x-4 h-16 gap-4 border-b bg-secondary-1 px-4 md:px-6 z-10">
      <nav
        className={cn("hidden", "gap-6 md:flex md:flex-row md:items-center")}
      >
        {onBackClick && (
          <button
            type="button"
            aria-label="Back button"
            onClick={onBackClick}
            className="-ml-2"
          >
            <ChevronLeftIcon className="text-secondary-5 h-5 w-5" />
          </button>
        )}
        {navigation.map((item) => (
          <LinkComponent
            textSize="subhead-2-bold"
            to={item.href}
            key={item.name}
            className={cn(
              isActive(item.href) &&
                "bg-primary-main rounded-lg text-secondary-1 px-3 py-1 hover:text-secondary-1",
            )}
          >
            {item.name}
          </LinkComponent>
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
      <div className="flex gap-x-4 items-center">
        {ctxButtons?.map((props, index) => (
          <Button key={index} {...props} size="small" />
        ))}
        <LinkComponent
          to={clientRoutes.auth.logout}
          variant="primaryLink"
          className="h-fit"
        >
          Sign out
        </LinkComponent>
      </div>
      <Drawer
        open={openPanel}
        direction="left"
        onClose={handlePanel}
        className="p-3 pt-6"
      >
        <nav className={cn("flex flex-col items-start text-start gap-y-6")}>
          {navigation.map((item) => (
            <LinkComponent
              className={cn(
                isActive(item.href) &&
                  "flex justify-start w-full bg-primary-main text-secondary-1 py-1 px-1 hover:text-secondary-1",
              )}
              key={item.name}
              textSize="subhead-2-bold"
              to={item.href}
              prefixIcon={<item.Icon className="w-6 h-auto" />}
            >
              {item.name}
            </LinkComponent>
          ))}
        </nav>
      </Drawer>
    </header>
  );
}

export { Topbar };
