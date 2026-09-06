import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ChevronRight,
  Heart,
  CreditCard,
  Bell,
  HelpCircle,
  Globe,
  LogOut,
  UserRound,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/app-store";

export const Route = createFileRoute("/ho-so")({
  head: () => ({
    meta: [
      { title: "Hồ sơ cá nhân — SmartStay" },
      { name: "description", content: "Quản lý thông tin tài khoản và tuỳ chọn của bạn." },
      { property: "og:title", content: "Hồ sơ cá nhân — SmartStay" },
      { property: "og:description", content: "Quản lý thông tin tài khoản và tuỳ chọn của bạn." },
    ],
  }),
  component: ProfileScreen,
});

const groups = [
  [
    { icon: UserRound, label: "Thông tin cá nhân" },
    { icon: CreditCard, label: "Phương thức thanh toán" },
    { icon: Heart, label: "Phòng yêu thích" },
  ],
  [
    { icon: Bell, label: "Thông báo" },
    { icon: Globe, label: "Ngôn ngữ · Tiếng Việt" },
    { icon: HelpCircle, label: "Trung tâm hỗ trợ" },
  ],
];

function ProfileScreen() {
  const { bookings, user, signOut } = useAppStore();
  const upcoming = bookings.filter((b) => b.group === "upcoming").length;
  const initials = (user?.name ?? "SS")
    .split(" ")
    .slice(-2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <AppShell>
      <header className="bg-primary px-4 pb-14 pt-8 text-primary-foreground">
        <h1 className="font-display text-xl">Hồ sơ</h1>
      </header>

      <div className="-mt-10 px-4">
        <div className="flex items-center gap-3 rounded-3xl bg-card p-4 shadow-card">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-gradient-ai text-xl font-bold text-ai-foreground">
            {initials}
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-semibold">{user?.name ?? "Khách"}</p>
            <p className="truncate text-xs text-muted-foreground">{user?.email ?? "—"}</p>
            <p className="text-xs text-muted-foreground">{user?.phone ?? "—"}</p>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-3">
          <Stat value={String(upcoming)} label="Đơn sắp tới" />
          <Stat value="6" label="Đêm đã ở" />
          <Stat value="320" label="Điểm thưởng" />
        </div>

        <div className="mt-5 space-y-4 pb-6">
          {groups.map((g, gi) => (
            <div key={gi} className="overflow-hidden rounded-2xl bg-card shadow-soft">
              {g.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  className="flex w-full items-center gap-3 border-b border-border px-4 py-3.5 text-left last:border-0"
                >
                  <span className="flex size-9 items-center justify-center rounded-xl bg-secondary text-primary">
                    <item.icon className="size-4" />
                  </span>
                  <span className="flex-1 text-sm font-medium">{item.label}</span>
                  <ChevronRight className="size-4 text-muted-foreground" />
                </button>
              ))}
            </div>
          ))}

          <Button asChild variant="outline" size="lg" className="w-full gap-2 text-destructive">
            <Link to="/dang-nhap" onClick={() => signOut()}>
              <LogOut className="size-4" /> Đăng xuất
            </Link>
          </Button>

          <p className="text-center text-[11px] text-muted-foreground">
            SmartStay v1.0 · Đồ án tốt nghiệp
          </p>
        </div>
      </div>
    </AppShell>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl bg-card p-3 text-center shadow-soft">
      <p className="font-display text-xl text-primary">{value}</p>
      <p className="text-[11px] text-muted-foreground">{label}</p>
    </div>
  );
}
