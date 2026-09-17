import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { vi } from "date-fns/locale";
import { CalendarDays, Minus, Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { formatDay, nightsBetween, useAppStore } from "@/store/app-store";
import { cn } from "@/lib/utils";

/** Bộ chọn ngày nhận/trả phòng + số khách, đồng bộ qua store toàn cục. */
export function StayPicker({ className }: { className?: string }) {
  const { search, setSearch } = useAppStore();
  const [open, setOpen] = useState(false);

  const range: DateRange = { from: search.checkIn, to: search.checkOut };
  const nights = nightsBetween(search.checkIn, search.checkOut);

  const onSelect = (next: DateRange | undefined) => {
    if (!next?.from) return;
    if (next.to && next.to > next.from) {
      setSearch({ checkIn: next.from, checkOut: next.to });
      setOpen(false);
    } else {
      setSearch({ checkIn: next.from });
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="grid w-full min-w-0 grid-cols-2 gap-2 text-left min-[380px]:gap-3"
            aria-label="Chọn ngày nhận và trả phòng"
          >
            <span className="block min-w-0 rounded-xl bg-secondary/70 p-2.5 min-[380px]:rounded-2xl min-[380px]:p-3">
              <span className="flex min-w-0 items-center gap-1 text-[10px] font-medium text-muted-foreground min-[380px]:gap-1.5 min-[380px]:text-[11px]">
                <CalendarDays className="size-4" /> Nhận phòng
              </span>
              <span className="mt-1 block truncate text-xs font-semibold min-[380px]:text-sm">{formatDay(search.checkIn)}</span>
            </span>
            <span className="block min-w-0 rounded-xl bg-secondary/70 p-2.5 min-[380px]:rounded-2xl min-[380px]:p-3">
              <span className="flex min-w-0 items-center gap-1 text-[10px] font-medium text-muted-foreground min-[380px]:gap-1.5 min-[380px]:text-[11px]">
                <CalendarDays className="size-4" /> Trả phòng
              </span>
              <span className="mt-1 block truncate text-xs font-semibold min-[380px]:text-sm">{formatDay(search.checkOut)}</span>
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent align="center" className="max-w-[calc(100vw-1rem)] overflow-x-auto rounded-2xl p-1 min-[380px]:w-auto min-[380px]:rounded-3xl min-[380px]:p-2">
          <Calendar
            mode="range"
            locale={vi}
            numberOfMonths={1}
            selected={range}
            onSelect={onSelect}
            disabled={{ before: new Date() }}
            defaultMonth={search.checkIn}
          />
          <p className="px-3 pb-2 text-center text-xs text-muted-foreground">
            Đang chọn {nights} đêm
          </p>
        </PopoverContent>
      </Popover>

      <div className="min-w-0 rounded-2xl bg-secondary/70 p-2.5 min-[380px]:p-3">
        <span className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
          <Users className="size-4" /> Số khách · số phòng
        </span>
        <div className="mt-2 grid min-w-0 grid-cols-1 gap-2 min-[350px]:grid-cols-2 min-[380px]:gap-3">
          <Stepper
            label="Khách"
            value={search.guests}
            min={1}
            max={12}
            onChange={(guests) => setSearch({ guests })}
          />
          <Stepper
            label="Phòng"
            value={search.rooms}
            min={1}
            max={5}
            onChange={(rooms) => setSearch({ rooms })}
          />
        </div>
      </div>
    </div>
  );
}

function Stepper({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-1 rounded-xl bg-card px-2 py-1.5">
      <span className="truncate text-xs font-medium text-muted-foreground">{label}</span>
      <span className="flex shrink-0 items-center gap-0.5 min-[380px]:gap-1">
        <Button
          type="button"
          size="icon"
          variant="outline"
          aria-label={`Giảm ${label}`}
          disabled={value <= min}
          className="size-7 shrink-0 rounded-full"
          onClick={() => onChange(Math.max(min, value - 1))}
        >
          <Minus className="size-3.5" />
        </Button>
        <span className="w-5 text-center text-sm font-semibold min-[380px]:w-6">{value}</span>
        <Button
          type="button"
          size="icon"
          variant="outline"
          aria-label={`Tăng ${label}`}
          disabled={value >= max}
          className="size-7 shrink-0 rounded-full"
          onClick={() => onChange(Math.min(max, value + 1))}
        >
          <Plus className="size-3.5" />
        </Button>
      </span>
    </div>
  );
}

/** Dòng mô tả kỳ lưu trú dùng ở header các màn hình. */
export function StaySummaryText() {
  const { search } = useAppStore();
  const nights = nightsBetween(search.checkIn, search.checkOut);
  return (
    <>
      {formatDay(search.checkIn)} – {formatDay(search.checkOut)} · {nights} đêm ·{" "}
      {search.guests} khách · {search.rooms} phòng
    </>
  );
}
