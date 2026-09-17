import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, MapPin, Sparkles, Star, ChevronRight, Tag } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { SearchCard } from "@/components/smartstay/SearchCard";
import { RoomCard } from "@/components/smartstay/RoomCard";
import { hotel, promos, rooms } from "@/data/mock";
import heroImg from "@/assets/hero-hotel.jpg";

export const Route = createFileRoute("/trang-chu")({
  head: () => ({
    meta: [
      { title: "Trang chủ — SmartStay Vika Hotel" },
      {
        name: "description",
        content: "Tìm phòng trống, xem phòng nổi bật và ưu đãi mới nhất tại SmartStay.",
      },
      { property: "og:title", content: "Trang chủ — SmartStay Vika Hotel" },
      {
        property: "og:description",
        content: "Tìm phòng trống, xem phòng nổi bật và ưu đãi mới nhất tại SmartStay.",
      },
    ],
  }),
  component: HomeScreen,
});

function HomeScreen() {
  return (
    <AppShell>
      <div className="relative">
        <img
          src={heroImg}
          alt="Khách sạn SmartStay ven biển"
          width={1024}
          height={1280}
          className="h-64 w-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4 text-primary-foreground">
          <div>
            <p className="text-xs opacity-80">Xin chào, Minh Anh 👋</p>
            <p className="font-display text-xl">{hotel.name}</p>
            <p className="mt-1 flex items-center gap-1 text-xs opacity-85">
              <MapPin className="size-3" /> {hotel.address}
            </p>
          </div>
          <button
            type="button"
            aria-label="Thông báo"
            className="flex size-9 items-center justify-center rounded-full bg-card/20 backdrop-blur"
          >
            <Bell className="size-4" />
          </button>
        </div>
        <div className="absolute inset-x-0 bottom-4 flex items-center gap-2 px-4 text-primary-foreground">
          <Star className="size-4 fill-gold text-gold" />
          <span className="text-sm font-semibold">{hotel.rating}</span>
          <span className="text-xs opacity-80">({hotel.reviewCount} đánh giá)</span>
        </div>
      </div>

      <div className="-mt-6 px-4">
        <SearchCard />
      </div>

      <Link
        to="/chat"
        className="mx-4 mt-4 flex items-center gap-3 rounded-2xl bg-gradient-ai p-4 text-ai-foreground shadow-ai"
      >
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-card/20">
          <Sparkles className="size-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold">Đặt phòng bằng trò chuyện</span>
          <span className="block text-xs opacity-90">
            "Tìm phòng đôi view biển cuối tuần này"
          </span>
        </span>
        <ChevronRight className="size-5 shrink-0" />
      </Link>

      <section className="mt-6">
        <SectionTitle title="Phòng nổi bật" to="/tim-phong" />
        <div className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain px-4 pb-2">
          {rooms.map((r) => (
            <RoomCard key={r.id} room={r} variant="compact" />
          ))}
        </div>
      </section>

      <section className="mt-6 px-4">
        <h2 className="mb-3 font-display text-lg">Ưu đãi đang có</h2>
        <div className="space-y-3">
          {promos.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-3 rounded-2xl border border-dashed border-accent/50 bg-accent/8 p-4"
            >
              <span className="flex size-10 items-center justify-center rounded-xl bg-accent/15 text-accent">
                <Tag className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{p.title}</p>
                <p className="text-xs text-muted-foreground">{p.desc}</p>
              </div>
              <span className="rounded-lg bg-accent px-2.5 py-1 text-[11px] font-bold text-accent-foreground">
                {p.code}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6 px-4 pb-6">
        <h2 className="mb-3 font-display text-lg">Tất cả phòng</h2>
        <div className="space-y-3">
          {rooms.map((r) => (
            <RoomCard key={r.id} room={r} />
          ))}
        </div>
      </section>
    </AppShell>
  );
}

function SectionTitle({ title, to }: { title: string; to: "/tim-phong" }) {
  return (
    <div className="mb-3 flex items-center justify-between px-4">
      <h2 className="font-display text-lg">{title}</h2>
      <Link to={to} className="text-xs font-semibold text-primary">
        Xem tất cả
      </Link>
    </div>
  );
}
