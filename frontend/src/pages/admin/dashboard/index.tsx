import React from "react";
import {
  AcademicCapIcon,
  ChartBarIcon,
  CloudIcon,
  CodeBracketIcon,
  SparklesIcon,
} from "@heroicons/react/16/solid";
import { cn } from "@waitingonalice/design-system";
import { AdminLayout, Grid, Link } from "@/components";

const appNavigation = [
  {
    name: "Code Editor",
    href: "https://editor.evergreen-project.xyz/",
    Icon: CodeBracketIcon,
  },
  {
    name: "Weather",
    href: "https://weather-app-two-rust.vercel.app/",
    Icon: CloudIcon,
  },
  {
    name: "Visual Algo",
    href: "https://waitingonalice.github.io/Visual-Algo/",
    Icon: ChartBarIcon,
  },
  {
    name: "Portfolio",
    href: "https://wilson-sie.dev/",
    Icon: AcademicCapIcon,
  },
  {
    name: "Design System",
    href: "https://github.com/waitingonalice/Evergreen-packages/tree/main/design-system",
    Icon: SparklesIcon,
  },
];
function AdminDashboard() {
  return (
    <AdminLayout>
      <AdminLayout.Content>
        <Grid
          title="Applications"
          className={cn(
            "grid grid-cols-3 gap-6 md:gap-8",
            "md:grid-cols-4",
            "lg:grid-cols-5",
          )}
        >
          {appNavigation.map((item) => (
            <Link
              key={item.name}
              className="flex flex-col items-center "
              to={item.href}
              prefixIcon={<item.Icon className="w-8 h-auto" />}
            >
              {item.name}
            </Link>
          ))}
        </Grid>
      </AdminLayout.Content>
    </AdminLayout>
  );
}

export { AdminDashboard };
