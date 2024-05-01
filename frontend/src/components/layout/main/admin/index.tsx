import { cn } from "@waitingonalice/design-system/utils/cn";
import { Topbar } from "./Topbar";

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <div>
      <Topbar />
      <>{children}</>
    </div>
  );
}

interface ContentProps {
  className?: string;
}
function Content({ children, className }: LayoutProps & ContentProps) {
  return (
    <main
      className={cn(
        "p-4 mt-8  flex justify-center flex-col items-center",
        "md:p-8",
        className,
      )}
    >
      {children}
    </main>
  );
}

Layout.Content = Content;

export { Layout as AdminLayout };
