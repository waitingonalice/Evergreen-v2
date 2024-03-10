import { SideBar } from "./Sidebar";
import Topbar from "./Topbar";

interface ContentProps {
  children: React.ReactNode;
}

export const Main = ({ children }: ContentProps) => <main>{children}</main>;

const Content = ({ children }: ContentProps) => (
  <div>
    <SideBar />
    <section className="pl-[196px] w-full ">{children}</section>
  </div>
);

Main.Header = Topbar;
Main.Content = Content;
