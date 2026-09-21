import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BadgePercent, CalendarCheck, BellRing, Sparkles, BellOff } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { EmptyState } from "@/components/smartstay/EmptyState";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/thong-bao")({
  head: () => ({
    meta: [
      { title: "Thông báo — SmartStay" },
      { name: "description", content: "Cập nhật đơn đặt phòng và ưu đãi mới nhất của bạn." },
      { property: "og:title", content: "Thông báo — SmartStay" },
      {
        property: "og:description",
        content: "Cập nhật đơn đặt phòng và ưu đãi mới nhất của bạn.",
      },
    ],
  }),
  component: NotificationsScreen,
});

type Notification = {
  id: string;
  icon: typeof BellRing;
  tone: "success" | "accent" | "ai";
  title: string;
  desc: string;
  time: string;
  unread: boolean;
};

const seed: Notification[] = [
  {
    id: "n1",
    icon: CalendarCheck,
    tone: "success",
    title: "Đơn SS-8FK2QD đã được xác nhận",
    desc: "Deluxe View Biển · 22/08 – 25/08. QR check-in đã sẵn sàng trong chi tiết đơn.",
    time: "2 giờ trước",
    unread: true,
  },
  {
    id: "n2",
    icon: BadgePercent,
    tone: "accent",
    title: "Ưu đãi mới: SUMMER25",
    desc: "Giảm 25% cho đặt phòng từ 2 đêm trở lên. Áp dụng đến hết tháng này.",
    time: "Hôm qua",
    unread: true,
  },
  {
    id: "n3",
    icon: Sparkles,
    tone: "ai",
    title: "Trợ lý AI có thể đặt phòng cho bạn",
    desc: "Thử nhắn \"phòng đôi view biển 2 người cuối tuần này\" trong khung chat.",
    time: "3 ngày trước",
    unread: false,
  },
  {
    id: "n4",
    icon: BellRing,
    tone: "accent",
    title: "Nhắc lịch nhận phòng",
    desc: "Bạn có đơn nhận phòng lúc 14:00 ngày 22/08. Mang theo CCCD khi làm thủ tục.",
    time: "1 tuần trước",
    unread: false,
  },
];

const toneClass: Record<Notification["tone"], string> = {
  success: "bg-success/12 text-success",
  accent: "bg-accent/15 text-accent",
  ai: "bg-ai/12 text-ai",
};

function NotificationsScreen() {
  const [items, setItems] = useState(seed);
  const unread = items.filter((n) => n.unread).length;

  const markAllRead = () => setItems((list) => list.map((n) => ({ ...n, unread: false })));

  return (
    <AppShell>
      <ScreenHeader
        title="Thông báo"
        subtitle={unread > 0 ? `${unread} thông báo chưa đọc` : "Bạn đã đọc hết"}
        right={
          unread > 0 ? (
            <button
              type="button"
              onClick={markAllRead}
              className="text-xs font-semibold text-primary"
            >
              Đọc tất cả
            </button>
          ) : undefined
        }
      />

      <div className="px-4 py-4">
        {items.length === 0 ? (
          <EmptyState
            icon={<BellOff className="size-6" />}
            title="Chưa có thông báo"
            desc="Thông báo về đơn đặt phòng và ưu đãi sẽ hiện ở đây."
          />
        ) : (
          <div className="space-y-2.5">
            {items.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() =>
                  setItems((list) =>
                    list.map((x) => (x.id === n.id ? { ...x, unread: false } : x)),
                  )
                }
                className={cn(
                  "flex w-full items-start gap-3 rounded-2xl bg-card p-3.5 text-left shadow-soft transition-colors",
                  n.unread && "ring-1 ring-primary/25",
                )}
              >
                <span
                  className={cn(
                    "flex size-10 shrink-0 items-center justify-center rounded-xl",
                    toneClass[n.tone],
                  )}
                >
                  <n.icon className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-start justify-between gap-2">
                    <span className="text-sm font-semibold">{n.title}</span>
                    {n.unread && <span className="mt-1 size-2 shrink-0 rounded-full bg-accent" />}
                  </span>
                  <span className="mt-0.5 block text-xs/5 text-muted-foreground">{n.desc}</span>
                  <span className="mt-1 block text-[11px] text-muted-foreground">{n.time}</span>
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
