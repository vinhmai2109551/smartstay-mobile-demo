import type { ReactNode } from "react";

export function EmptyState({
  icon,
  title,
  desc,
  action,
}: {
  icon: ReactNode;
  title: string;
  desc: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center px-8 py-14 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
        {icon}
      </span>
      <p className="mt-4 font-semibold">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
