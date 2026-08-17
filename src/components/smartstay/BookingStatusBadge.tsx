import type { BookingStatus } from "@/data/mock";
import { cn } from "@/lib/utils";

const map: Record<BookingStatus, { label: string; className: string }> = {
  confirmed: { label: "Đã xác nhận", className: "bg-success/12 text-success" },
  pending: { label: "Chờ thanh toán", className: "bg-warning/20 text-warning-foreground" },
  completed: { label: "Đã hoàn tất", className: "bg-secondary text-secondary-foreground" },
  cancelled: { label: "Đã huỷ", className: "bg-destructive/12 text-destructive" },
};

export function BookingStatusBadge({
  status,
  className,
}: {
  status: BookingStatus;
  className?: string;
}) {
  const s = map[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold",
        s.className,
        className,
      )}
    >
      {s.label}
    </span>
  );
}
