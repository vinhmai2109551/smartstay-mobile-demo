import { useNavigate } from "@tanstack/react-router";
import { CalendarDays, Users, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Ô tìm phòng: ngày nhận/trả và số khách (mock, không gắn API). */
export function SearchCard() {
  const navigate = useNavigate();
  return (
    <div className="rounded-3xl bg-card p-4 shadow-card">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Nhận phòng" value="22/08/2026" icon={<CalendarDays className="size-4" />} />
        <Field label="Trả phòng" value="25/08/2026" icon={<CalendarDays className="size-4" />} />
      </div>
      <div className="mt-3">
        <Field label="Số khách" value="2 người lớn · 1 phòng" icon={<Users className="size-4" />} />
      </div>
      <Button
        size="lg"
        className="mt-4 w-full gap-2"
        onClick={() => navigate({ to: "/tim-phong" })}
      >
        <Search className="size-4" />
        Tìm phòng trống
      </Button>
    </div>
  );
}

function Field({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className="w-full rounded-2xl bg-secondary/70 p-3 text-left transition-colors active:bg-secondary"
    >
      <span className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
        {icon}
        {label}
      </span>
      <span className="mt-1 block text-sm font-semibold">{value}</span>
    </button>
  );
}
