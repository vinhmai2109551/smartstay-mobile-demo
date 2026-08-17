import { formatVnd } from "@/data/mock";
import { cn } from "@/lib/utils";

export type PriceLine = { label: string; value: number; muted?: boolean };

export function PriceSummary({
  lines,
  total,
  note,
  className,
}: {
  lines: PriceLine[];
  total: number;
  note?: string;
  className?: string;
}) {
  return (
    <div className={cn("rounded-2xl bg-card p-4 shadow-soft", className)}>
      <h3 className="text-sm font-semibold">Tóm tắt thanh toán</h3>
      <dl className="mt-3 space-y-2 text-sm">
        {lines.map((l) => (
          <div key={l.label} className="flex justify-between gap-3">
            <dt className="text-muted-foreground">{l.label}</dt>
            <dd className={l.value < 0 ? "font-medium text-success" : "font-medium"}>
              {l.value < 0 ? "-" : ""}
              {formatVnd(Math.abs(l.value))}
            </dd>
          </div>
        ))}
      </dl>
      <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
        <span className="text-sm font-semibold">Tổng cộng</span>
        <span className="text-lg font-bold text-primary">{formatVnd(total)}</span>
      </div>
      {note && <p className="mt-2 text-xs text-muted-foreground">{note}</p>}
    </div>
  );
}
