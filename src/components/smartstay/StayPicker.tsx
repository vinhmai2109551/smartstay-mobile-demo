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
            className="grid w-full grid-cols-2 gap-3 text-left"
            aria-label="Chọn ngày nhận và trả phòng"
          >
            <span className="block rounded-2xl bg-secondary/70 p-3">
              <span className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                <CalendarDays className="size-4" /> Nhận phòng
              </span>
              <span className="mt-1 block text-sm font-semibold">{formatDay(search.checkIn)}</span>
            </span>
            <span className="block rounded-2xl bg-secondary/70 p-3">
              <span className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                <CalendarDays className="size-4" /> Trả phòng
              </span>
              <span className="mt-1 block text-sm font-semibold">{formatDay(search.checkOut)}</span>
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent align="center" className="w-auto rounded-3xl p-2">
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

      <div className="rounded-2xl bg-secondary/70 p-3">
        <span className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
          <Users className="size-4" /> Số khách · số phòng
        </span>
        <div className="mt-2 grid grid-cols-2 gap-3">
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
    <div className="flex items-center justify-between rounded-xl bg-card px-2 py-1.5">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <span className="flex items-center gap-1">
        <Button
          type="button"
          size="icon"
          variant="outline"
          aria-label={`Giảm ${label}`}
          disabled={value <= min}
          className="size-7 rounded-full"
          onClick={() => onChange(Math.max(min, value - 1))}
        >
          <Minus className="size-3.5" />
        </Button>
        <span className="w-6 text-center text-sm font-semibold">{value}</span>
        <Button
          type="button"
          size="icon"
          variant="outline"
          aria-label={`Tăng ${label}`}
          disabled={value >= max}
          className="size-7 rounded-full"
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
