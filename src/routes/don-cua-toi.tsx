import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarX2, CalendarDays, ChevronRight } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { BookingStatusBadge } from "@/components/smartstay/BookingStatusBadge";
import { EmptyState } from "@/components/smartstay/EmptyState";
import { BookingListSkeleton } from "@/components/smartstay/Skeletons";
import { useFakeLoading } from "@/hooks/use-fake-loading";
import { formatVnd, getRoom } from "@/data/mock";
import { useAppStore } from "@/store/app-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/don-cua-toi")({
  head: () => ({
    meta: [
      { title: "Đơn của tôi — SmartStay" },
      { name: "description", content: "Theo dõi đơn đặt phòng sắp tới, đã qua và đã huỷ." },
      { property: "og:title", content: "Đơn của tôi — SmartStay" },
      {
        property: "og:description",
        content: "Theo dõi đơn đặt phòng sắp tới, đã qua và đã huỷ.",
      },
    ],
  }),
  component: BookingsScreen,
});

const tabs = [
  { id: "upcoming", label: "Sắp tới" },
  { id: "past", label: "Đã qua" },
  { id: "cancelled", label: "Đã huỷ" },
] as const;

function BookingsScreen() {
  const [tab, setTab] = useState<(typeof tabs)[number]["id"]>("upcoming");
  const { bookings } = useAppStore();
  const loading = useFakeLoading(600, [tab]);
  const list = bookings.filter((b) => b.group === tab);

  return (
    <AppShell>
      <header className="sticky top-0 z-20 border-b border-border bg-card/95 px-4 pb-3 pt-5 backdrop-blur">
        <h1 className="font-display text-xl">Đơn của tôi</h1>
        <div className="mt-3 flex gap-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                "flex-1 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                tab === t.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </header>

      {loading ? (
        <div className="px-4 py-4">
          <BookingListSkeleton count={3} />
        </div>
      ) : list.length === 0 ? (
        <EmptyState
          icon={<CalendarX2 className="size-6" />}
          title="Chưa có đơn nào"
          desc="Các đơn đặt phòng của bạn sẽ hiển thị tại đây."
        />
      ) : (
        <div className="space-y-3 px-4 py-4">
          {list.map((b) => {
            const room = getRoom(b.roomId);
            return (
              <Link
                key={b.id}
                to="/don/$id"
                params={{ id: b.id }}
                className="flex gap-3 rounded-2xl bg-card p-3 shadow-soft"
              >
                <img
                  src={room.images[0]}
                  alt={room.name}
                  loading="lazy"
                  className="size-24 shrink-0 rounded-xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="truncate font-semibold">{room.name}</p>
                    <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                  </div>
                  <p className="font-mono text-[11px] text-muted-foreground">{b.code}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <CalendarDays className="size-3" /> {b.checkIn} – {b.checkOut} · {b.nights} đêm
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <BookingStatusBadge status={b.status} />
                    <span className="text-sm font-bold text-primary">{formatVnd(b.total)}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}
