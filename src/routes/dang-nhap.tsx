import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Loader2, Sparkles } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PhoneFrame } from "@/components/layout/PhoneFrame";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { useAppStore } from "@/store/app-store";

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

const schema = z.object({
  email: z.string().min(1, "Vui lòng nhập email").email("Email không hợp lệ"),
  password: z.string().min(8, "Mật khẩu tối thiểu 8 ký tự"),
});
type FormValues = z.infer<typeof schema>;

function SignIn() {
  const navigate = useNavigate();
  const { signIn } = useAppStore();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: FormValues) => {
    await new Promise((r) => setTimeout(r, 900));
    signIn({
      name: "Nguyễn Minh Anh",
      email: values.email,
      phone: "0905 123 456",
    });
    navigate({ to: "/trang-chu" });
  };

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

        <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="ban@email.com" {...register("email")} />
            {errors.email && (
              <p className="text-xs font-medium text-destructive">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Mật khẩu</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-xs font-medium text-destructive">{errors.password.message}</p>
            )}
          </div>
          <div className="flex justify-end">
            <Link to="/quen-mat-khau" className="text-sm font-medium text-primary">
              Quên mật khẩu?
            </Link>
          </div>
          <Button type="submit" size="lg" className="w-full gap-2" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="size-4 animate-spin" />}
            {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
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
