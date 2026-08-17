import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { PhoneFrame } from "@/components/layout/PhoneFrame";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleButton } from "@/components/auth/GoogleButton";

export const Route = createFileRoute("/dang-nhap")({
  head: () => ({
    meta: [
      { title: "Đăng nhập — SmartStay" },
      { name: "description", content: "Đăng nhập tài khoản SmartStay để đặt phòng." },
      { property: "og:title", content: "Đăng nhập — SmartStay" },
      { property: "og:description", content: "Đăng nhập tài khoản SmartStay để đặt phòng." },
    ],
  }),
  component: SignIn,
});

function SignIn() {
  const navigate = useNavigate();
  return (
    <PhoneFrame>
      <div className="flex min-h-screen flex-col px-6 pb-10 pt-14">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-gradient-ai text-ai-foreground shadow-ai">
          <Sparkles className="size-6" />
        </span>
        <h1 className="mt-6 font-display text-3xl">Chào mừng trở lại</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Đăng nhập để tiếp tục kỳ nghỉ của bạn tại SmartStay.
        </p>

        <form
          className="mt-8 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            navigate({ to: "/trang-chu" });
          }}
        >
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="ban@email.com" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Mật khẩu</Label>
            <Input id="password" type="password" placeholder="••••••••" required />
          </div>
          <div className="flex justify-end">
            <Link to="/quen-mat-khau" className="text-sm font-medium text-primary">
              Quên mật khẩu?
            </Link>
          </div>
          <Button type="submit" size="lg" className="w-full">
            Đăng nhập
          </Button>
        </form>

        <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          hoặc
          <span className="h-px flex-1 bg-border" />
        </div>

        <GoogleButton />

        <p className="mt-auto pt-8 text-center text-sm text-muted-foreground">
          Chưa có tài khoản?{" "}
          <Link to="/dang-ky" className="font-semibold text-primary">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </PhoneFrame>
  );
}
