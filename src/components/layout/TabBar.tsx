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
    <nav className="sticky bottom-0 z-30 mt-auto border-t border-border bg-card/95 backdrop-blur">
      <div className="relative grid grid-cols-5 items-end px-2 pb-3 pt-2">
        {items.slice(0, 2).map((it) => (
          <TabLink key={it.to} {...it} />
        ))}

        <div className="flex justify-center">
          <Link
            to="/chat"
            aria-label="Chat AI"
            className="-mt-8 flex size-16 flex-col items-center justify-center gap-0.5 rounded-full bg-gradient-ai text-ai-foreground shadow-ai transition-transform active:scale-95"
          >
            <Sparkles className="size-6" />
            <span className="text-[10px] font-semibold">Chat AI</span>
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
      className="flex flex-col items-center gap-1 py-1 text-[11px] font-medium text-muted-foreground transition-colors"
      activeProps={{ className: "text-primary" }}
    >
      <Icon className="size-5" />
      <span>{label}</span>
    </Link>
  );
}
