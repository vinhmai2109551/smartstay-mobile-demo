import { cn } from "@/lib/utils";

const steps = ["Chọn phòng", "Đặt phòng", "Thanh toán"];

export function StepIndicator({ current }: { current: 1 | 2 | 3 }) {
  return (
    <ol className="flex items-center gap-2">
      {steps.map((s, i) => {
        const n = i + 1;
        const done = n <= current;
        return (
          <li key={s} className="flex flex-1 items-center gap-2">
            <span
              className={cn(
                "flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
                done ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground",
              )}
            >
              {n}
            </span>
            <span
              className={cn(
                "truncate text-[11px] font-medium",
                done ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {s}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
