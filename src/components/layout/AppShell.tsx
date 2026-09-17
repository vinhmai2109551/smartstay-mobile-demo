import type { ReactNode } from "react";
import { PhoneFrame } from "./PhoneFrame";
import { TabBar } from "./TabBar";
import { cn } from "@/lib/utils";

export function AppShell({
  children,
  withTabBar = true,
  className,
}: {
  children: ReactNode;
  withTabBar?: boolean;
  className?: string;
}) {
  return (
    <PhoneFrame>
      <div className={cn("min-w-0 flex-1 pb-4", className)}>{children}</div>
      {withTabBar && <TabBar />}
    </PhoneFrame>
  );
}
