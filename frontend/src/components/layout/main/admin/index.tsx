import { cn } from "@waitingonalice/design-system/utils/cn";
import { Topbar } from "./Topbar";

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

function Layout({ children, className }: LayoutProps) {
  return <main className={className}>{children}</main>;
}

interface ContentProps {
  className?: string;
  children: React.ReactNode;
}
function Content({ children, className }: ContentProps) {
  return (
    <div
      className={cn(
        "p-4 mt-8 flex justify-center flex-col items-center",
        "md:p-8",
        className,
      )}
    >
      {children}
    </div>
  );
}

Layout.Content = Content;
Layout.Header = Topbar;

export { Layout as AdminLayout };
