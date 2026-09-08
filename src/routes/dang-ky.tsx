import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PhoneFrame } from "@/components/layout/PhoneFrame";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { useAppStore } from "@/store/app-store";

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

const schema = z.object({
  name: z.string().min(2, "Vui lòng nhập họ tên"),
  email: z.string().min(1, "Vui lòng nhập email").email("Email không hợp lệ"),
  phone: z
    .string()
    .regex(/^0\d{8,10}$/, "Số điện thoại phải bắt đầu bằng 0 và có 9–11 số"),
  password: z
    .string()
    .min(8, "Mật khẩu tối thiểu 8 ký tự")
    .regex(/[A-Za-z]/, "Mật khẩu cần ít nhất 1 chữ cái")
    .regex(/\d/, "Mật khẩu cần ít nhất 1 chữ số"),
  accept: z.boolean().refine((v) => v === true, {
    message: "Bạn cần đồng ý với điều khoản",
  }),
});
type FormValues = z.infer<typeof schema>;

function SignUp() {
  const navigate = useNavigate();
  const { signIn } = useAppStore();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    await new Promise((r) => setTimeout(r, 900));
    signIn({ name: values.name, email: values.email, phone: values.phone });
    navigate({ to: "/trang-chu" });
  };

  return (
    <PhoneFrame>
      <ScreenHeader title="Tạo tài khoản" transparent />
      <div className="flex flex-1 flex-col px-6 pb-10">
        <h2 className="font-display text-2xl">Bắt đầu với SmartStay</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Chỉ mất một phút để tạo tài khoản.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Field label="Họ và tên" id="name" error={errors.name?.message}>
            <Input id="name" placeholder="Nguyễn Văn A" {...register("name")} />
          </Field>
          <Field label="Email" id="email" error={errors.email?.message}>
            <Input id="email" type="email" placeholder="ban@email.com" {...register("email")} />
          </Field>
          <Field label="Số điện thoại" id="phone" error={errors.phone?.message}>
            <Input id="phone" type="tel" placeholder="0905123456" {...register("phone")} />
          </Field>
          <Field label="Mật khẩu" id="password" error={errors.password?.message}>
            <Input
              id="password"
              type="password"
              placeholder="Tối thiểu 8 ký tự"
              {...register("password")}
            />
          </Field>

          <div>
            <label className="flex items-start gap-2.5 text-xs text-muted-foreground">
              <Checkbox
                className="mt-0.5"
                onCheckedChange={(v) =>
                  setValue("accept", v === true, { shouldValidate: true })
                }
              />
              <span>
                Tôi đồng ý với Điều khoản sử dụng và Chính sách bảo mật của SmartStay.
              </span>
            </label>
            {errors.accept && (
              <p className="mt-1 text-xs font-medium text-destructive">{errors.accept.message}</p>
            )}
          </div>

          <Button type="submit" size="lg" className="w-full gap-2" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="size-4 animate-spin" />}
            {isSubmitting ? "Đang tạo tài khoản..." : "Đăng ký"}
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

function Field({
  label,
  id,
  error,
  children,
}: {
  label: string;
  id: string;
  error?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error && <p className="text-xs font-medium text-destructive">{error}</p>}
    </div>
  );
}
