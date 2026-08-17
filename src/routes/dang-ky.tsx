import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/layout/PhoneFrame";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { GoogleButton } from "@/components/auth/GoogleButton";

export const Route = createFileRoute("/dang-ky")({
  head: () => ({
    meta: [
      { title: "Đăng ký tài khoản — SmartStay" },
      { name: "description", content: "Tạo tài khoản SmartStay để đặt phòng nhanh hơn." },
      { property: "og:title", content: "Đăng ký tài khoản — SmartStay" },
      { property: "og:description", content: "Tạo tài khoản SmartStay để đặt phòng nhanh hơn." },
    ],
  }),
  component: SignUp,
});

function SignUp() {
  const navigate = useNavigate();
  return (
    <PhoneFrame>
      <ScreenHeader title="Tạo tài khoản" transparent />
      <div className="flex flex-1 flex-col px-6 pb-10">
        <h2 className="font-display text-2xl">Bắt đầu với SmartStay</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Chỉ mất một phút để tạo tài khoản.
        </p>

        <form
          className="mt-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            navigate({ to: "/trang-chu" });
          }}
        >
          <div className="space-y-1.5">
            <Label htmlFor="name">Họ và tên</Label>
            <Input id="name" placeholder="Nguyễn Văn A" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="ban@email.com" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone">Số điện thoại</Label>
            <Input id="phone" type="tel" placeholder="09xx xxx xxx" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Mật khẩu</Label>
            <Input id="password" type="password" placeholder="Tối thiểu 8 ký tự" required />
          </div>
          <label className="flex items-start gap-2.5 text-xs text-muted-foreground">
            <Checkbox required className="mt-0.5" />
            <span>
              Tôi đồng ý với Điều khoản sử dụng và Chính sách bảo mật của SmartStay.
            </span>
          </label>
          <Button type="submit" size="lg" className="w-full">
            Đăng ký
          </Button>
        </form>

        <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          hoặc
          <span className="h-px flex-1 bg-border" />
        </div>
        <GoogleButton />

        <p className="mt-auto pt-8 text-center text-sm text-muted-foreground">
          Đã có tài khoản?{" "}
          <Link to="/dang-nhap" className="font-semibold text-primary">
            Đăng nhập
          </Link>
        </p>
      </div>
    </PhoneFrame>
  );
}
