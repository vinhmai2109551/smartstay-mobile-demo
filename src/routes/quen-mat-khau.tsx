import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { MailCheck } from "lucide-react";
import { PhoneFrame } from "@/components/layout/PhoneFrame";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/quen-mat-khau")({
  head: () => ({
    meta: [
      { title: "Quên mật khẩu — SmartStay" },
      { name: "description", content: "Đặt lại mật khẩu tài khoản SmartStay qua email." },
      { property: "og:title", content: "Quên mật khẩu — SmartStay" },
      { property: "og:description", content: "Đặt lại mật khẩu tài khoản SmartStay qua email." },
    ],
  }),
  component: ForgotPassword,
});

function ForgotPassword() {
  const [sent, setSent] = useState(false);

  return (
    <PhoneFrame>
      <ScreenHeader title="Quên mật khẩu" transparent />
      <div className="flex flex-1 flex-col px-6 pb-10">
        {sent ? (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <span className="flex size-16 items-center justify-center rounded-3xl bg-success/12 text-success">
              <MailCheck className="size-8" />
            </span>
            <h2 className="mt-5 font-display text-2xl">Đã gửi email</h2>
            <p className="mt-2 max-w-[280px] text-sm text-muted-foreground">
              Kiểm tra hộp thư của bạn và làm theo hướng dẫn để đặt lại mật khẩu.
            </p>
            <Button asChild size="lg" className="mt-8 w-full">
              <Link to="/dang-nhap">Về trang đăng nhập</Link>
            </Button>
            <button
              type="button"
              onClick={() => setSent(false)}
              className="mt-3 text-sm font-medium text-muted-foreground"
            >
              Gửi lại email
            </button>
          </div>
        ) : (
          <>
            <h2 className="font-display text-2xl">Đặt lại mật khẩu</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Nhập email đã đăng ký, chúng tôi sẽ gửi liên kết đặt lại mật khẩu.
            </p>
            <form
              className="mt-6 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
            >
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="ban@email.com" required />
              </div>
              <Button type="submit" size="lg" className="w-full">
                Gửi liên kết
              </Button>
            </form>
          </>
        )}
      </div>
    </PhoneFrame>
  );
}
