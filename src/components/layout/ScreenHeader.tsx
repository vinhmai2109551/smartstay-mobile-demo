import { useRouter } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";

export function ScreenHeader({
  title,
  subtitle,
  right,
  transparent = false,
}: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
  transparent?: boolean;
}) {
  const router = useRouter();
  return (
    <header
      className={
        transparent
          ? "flex items-center gap-3 px-4 py-3"
          : "sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-card/95 px-4 py-3 backdrop-blur"
      }
    >
      <button
        type="button"
        onClick={() => router.history.back()}
        aria-label="Quay lại"
        className="flex size-9 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors active:bg-secondary"
      >
        <ChevronLeft className="size-5" />
      </button>
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-base font-semibold">{title}</h1>
        {subtitle && (
          <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {right}
    </header>
  );
}
