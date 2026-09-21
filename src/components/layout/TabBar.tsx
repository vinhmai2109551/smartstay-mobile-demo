import { Link } from "@tanstack/react-router";
import { Home, Search, Sparkles, CalendarCheck, User } from "lucide-react";

const items = [
  { to: "/trang-chu", label: "Trang chủ", icon: Home },
  { to: "/tim-phong", label: "Tìm phòng", icon: Search },
  { to: "/don-cua-toi", label: "Đơn của tôi", icon: CalendarCheck },
  { to: "/ho-so", label: "Hồ sơ", icon: User },
] as const;

export function TabBar() {
  return (
    <nav className="sticky bottom-0 z-50 mt-auto min-w-0 border-t border-border bg-card/95 backdrop-blur-xl">
      <div className="relative grid min-h-16 grid-cols-5 items-end gap-0.5 px-1 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] min-[380px]:px-2">
        {items.slice(0, 2).map((it) => (
          <TabLink key={it.to} {...it} />
        ))}

        <div className="flex justify-center">
          <Link
            to="/chat"
            aria-label="Chat AI"
            className="-mt-7 flex size-14 shrink-0 flex-col items-center justify-center gap-0.5 rounded-full bg-gradient-ai text-ai-foreground shadow-ai transition-transform active:scale-95 min-[380px]:-mt-8 min-[380px]:size-16"
          >
            <Sparkles className="size-5 min-[380px]:size-6" />
            <span className="whitespace-nowrap text-[9px] font-semibold min-[380px]:text-[10px]">Chat AI</span>
          </Link>
        </div>

        {items.slice(2).map((it) => (
          <TabLink key={it.to} {...it} />
        ))}
      </div>
    </nav>
  );
}

function TabLink({
  to,
  label,
  icon: Icon,
}: {
  to: string;
  label: string;
  icon: typeof Home;
}) {
  return (
    <Link
      to={to}
      className="group flex min-w-0 flex-col items-center gap-1 py-1 text-[9px] font-medium text-muted-foreground transition-colors active:scale-95 min-[380px]:text-[11px]"
      activeProps={{ className: "text-primary" }}
    >
      <Icon className="size-[18px] shrink-0 transition-transform duration-200 group-active:scale-90 group-data-[status=active]:-translate-y-0.5 min-[380px]:size-5" />
      <span className="max-w-full whitespace-nowrap">{label}</span>
    </Link>
  );
}
