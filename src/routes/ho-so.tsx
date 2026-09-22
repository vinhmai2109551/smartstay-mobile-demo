import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ChevronRight,
  Heart,
  KeyRound,
  Bell,
  HelpCircle,
  Globe,
  LogOut,
  Star,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useAppStore } from "@/store/app-store";

export const Route = createFileRoute("/ho-so")({
  head: () => ({
    meta: [
      { title: "Hồ sơ cá nhân — SmartStay" },
      { name: "description", content: "Quản lý thông tin tài khoản và tuỳ chọn của bạn." },
      { property: "og:title", content: "Hồ sơ cá nhân — SmartStay" },
      { property: "og:description", content: "Quản lý thông tin tài khoản và tuỳ chọn của bạn." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProfileScreen,
});

type SheetKind = "profile" | "password" | null;

function ProfileScreen() {
  const { bookings, favorites, myReviews, user, signOut, updateUser } = useAppStore();
  const [sheet, setSheet] = useState<SheetKind>(null);
  const upcoming = bookings.filter((b) => b.group === "upcoming").length;
  const initials = (user?.name ?? "SS")
    .split(" ")
    .slice(-2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const soon = () => toast("Tính năng này sẽ có trong bản hoàn chỉnh.");

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
          <Button size="sm" variant="outline" onClick={() => setSheet("profile")}>
            Sửa
          </Button>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-3">
          <Stat value={String(upcoming)} label="Đơn sắp tới" />
          <Stat value={String(favorites.length)} label="Yêu thích" />
          <Stat value={String(myReviews.length)} label="Đánh giá" />
        </div>

        <div className="mt-5 space-y-4 pb-6">
          <div className="overflow-hidden rounded-2xl bg-card shadow-soft">
            <RowButton
              icon={UserRound}
              label="Thông tin cá nhân"
              onClick={() => setSheet("profile")}
            />
            <RowButton
              icon={KeyRound}
              label="Đổi mật khẩu"
              onClick={() => setSheet("password")}
            />
            <RowLink icon={Heart} label="Phòng yêu thích" to="/yeu-thich" />
            <RowLink icon={Star} label="Đánh giá của tôi" to="/danh-gia" />
          </div>

          <div className="overflow-hidden rounded-2xl bg-card shadow-soft">
            <RowLink icon={Bell} label="Thông báo" to="/thong-bao" />
            <RowButton icon={Globe} label="Ngôn ngữ · Tiếng Việt" onClick={soon} />
            <RowButton icon={HelpCircle} label="Trung tâm hỗ trợ" onClick={soon} />
          </div>

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

      <Sheet open={sheet === "profile"} onOpenChange={(o) => !o && setSheet(null)}>
        <SheetContent side="bottom" className="rounded-t-3xl">
          <SheetHeader className="text-left">
            <SheetTitle>Thông tin cá nhân</SheetTitle>
            <SheetDescription>Cập nhật tên, email và số điện thoại liên hệ.</SheetDescription>
          </SheetHeader>
          <form
            className="space-y-3 px-4 pb-6"
            onSubmit={(e) => {
              e.preventDefault();
              const data = new FormData(e.currentTarget);
              updateUser({
                name: String(data.get("name") ?? "").trim() || (user?.name ?? ""),
                email: String(data.get("email") ?? "").trim() || (user?.email ?? ""),
                phone: String(data.get("phone") ?? "").trim() || (user?.phone ?? ""),
              });
              setSheet(null);
              toast.success("Đã cập nhật thông tin của bạn");
            }}
          >
            <div>
              <Label htmlFor="name">Họ và tên</Label>
              <Input id="name" name="name" defaultValue={user?.name ?? ""} className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={user?.email ?? ""}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input id="phone" name="phone" defaultValue={user?.phone ?? ""} className="mt-1.5" />
            </div>
            <Button type="submit" size="lg" className="w-full">
              Lưu thay đổi
            </Button>
          </form>
        </SheetContent>
      </Sheet>

      <Sheet open={sheet === "password"} onOpenChange={(o) => !o && setSheet(null)}>
        <SheetContent side="bottom" className="rounded-t-3xl">
          <SheetHeader className="text-left">
            <SheetTitle>Đổi mật khẩu</SheetTitle>
            <SheetDescription>Mật khẩu mới cần tối thiểu 6 ký tự.</SheetDescription>
          </SheetHeader>
          <PasswordForm onDone={() => setSheet(null)} />
        </SheetContent>
      </Sheet>
    </AppShell>
  );
}

function PasswordForm({ onDone }: { onDone: () => void }) {
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="space-y-3 px-4 pb-6"
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const next = String(data.get("next") ?? "");
        const confirm = String(data.get("confirm") ?? "");
        if (next.length < 6) return setError("Mật khẩu mới phải từ 6 ký tự trở lên.");
        if (next !== confirm) return setError("Mật khẩu xác nhận chưa khớp.");
        setError(null);
        onDone();
        toast.success("Đã đổi mật khẩu");
      }}
    >
      <div>
        <Label htmlFor="current">Mật khẩu hiện tại</Label>
        <Input id="current" name="current" type="password" className="mt-1.5" />
      </div>
      <div>
        <Label htmlFor="next">Mật khẩu mới</Label>
        <Input id="next" name="next" type="password" className="mt-1.5" />
      </div>
      <div>
        <Label htmlFor="confirm">Nhập lại mật khẩu mới</Label>
        <Input id="confirm" name="confirm" type="password" className="mt-1.5" />
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
      <Button type="submit" size="lg" className="w-full">
        Cập nhật mật khẩu
      </Button>
    </form>
  );
}

function RowButton({
  icon: Icon,
  label,
  onClick,
}: {
  icon: typeof UserRound;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 border-b border-border px-4 py-3.5 text-left last:border-0 transition-colors active:bg-secondary"
    >
      <RowIcon icon={Icon} />
      <span className="flex-1 text-sm font-medium">{label}</span>
      <ChevronRight className="size-4 text-muted-foreground" />
    </button>
  );
}

function RowLink({
  icon: Icon,
  label,
  to,
}: {
  icon: typeof UserRound;
  label: string;
  to: "/yeu-thich" | "/danh-gia" | "/thong-bao";
}) {
  return (
    <Link
      to={to}
      className="flex w-full items-center gap-3 border-b border-border px-4 py-3.5 text-left last:border-0 transition-colors active:bg-secondary"
    >
      <RowIcon icon={Icon} />
      <span className="flex-1 text-sm font-medium">{label}</span>
      <ChevronRight className="size-4 text-muted-foreground" />
    </Link>
  );
}

function RowIcon({ icon: Icon }: { icon: typeof UserRound }) {
  return (
    <span className="flex size-9 items-center justify-center rounded-xl bg-secondary text-primary">
      <Icon className="size-4" />
    </span>
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
