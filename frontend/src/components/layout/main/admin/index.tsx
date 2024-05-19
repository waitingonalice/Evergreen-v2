import { cn } from "@waitingonalice/design-system/utils/cn";
import { Topbar, TopbarProps } from "./Topbar";

interface LayoutProps extends TopbarProps {
  children: React.ReactNode;
}

function Layout({ children, onBackClick, ctxButtons }: LayoutProps) {
  return (
    <>
      <Topbar onBackClick={onBackClick} ctxButtons={ctxButtons} />
      {children}
    </>
  );
}

interface ContentProps {
  className?: string;
  children: React.ReactNode;
}
function Content({ children, className }: ContentProps) {
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
Layout.Header = Topbar;

export { Layout as AdminLayout };
