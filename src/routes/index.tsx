import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, ShieldCheck, BedDouble } from "lucide-react";
import { PhoneFrame } from "@/components/layout/PhoneFrame";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero-hotel.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SmartStay — Đặt phòng khách sạn cùng trợ lý AI" },
      {
        name: "description",
        content:
          "SmartStay: đặt phòng khách sạn, homestay chỉ trong vài phút với trợ lý AI Chat-to-Book.",
      },
      { property: "og:title", content: "SmartStay — Đặt phòng cùng trợ lý AI" },
      {
        property: "og:description",
        content: "Tìm phòng, hỏi chính sách và đặt phòng ngay trong hội thoại.",
      },
    ],
  }),
  component: Onboarding,
});

const slides = [
  {
    icon: BedDouble,
    title: "Chào mừng đến SmartStay",
    desc: "Không gian nghỉ dưỡng ven biển Đà Nẵng với phòng ấm cúng và dịch vụ tận tâm.",
  },
  {
    icon: Sparkles,
    title: "Đặt phòng bằng hội thoại",
    desc: "Nhắn cho trợ lý AI như nhắn lễ tân: hỏi phòng trống, giá, chính sách và đặt ngay.",
  },
  {
    icon: ShieldCheck,
    title: "Thanh toán an toàn",
    desc: "Quét VietQR qua PayOS, nhận mã đặt phòng và QR check-in ngay lập tức.",
  },
];

function Onboarding() {
  const [step, setStep] = useState(0);
  const slide = slides[step]!;
  const Icon = slide.icon;
  const last = step === slides.length - 1;

  return (
    <PhoneFrame className="overflow-hidden">
      <div className="relative flex min-h-screen flex-col">
        <img
          src={heroImg}
          alt="Khách sạn SmartStay ven biển lúc hoàng hôn"
          width={1024}
          height={1280}
          className="absolute inset-0 size-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: "var(--gradient-hero)" }}
        />

        <div className="relative flex flex-1 flex-col justify-between p-6 pb-10 text-primary-foreground">
          <div className="flex items-center gap-2 pt-4">
            <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-ai">
              <Sparkles className="size-5" />
            </span>
            <span className="font-display text-lg font-semibold">SmartStay</span>
          </div>

          <div>
            <span className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-card/15 backdrop-blur">
              <Icon className="size-6" />
            </span>
            <h1 className="font-display text-3xl leading-tight">{slide.title}</h1>
            <p className="mt-3 max-w-[300px] text-sm/6 opacity-85">{slide.desc}</p>

            <div className="mt-6 flex gap-1.5">
              {slides.map((s, i) => (
                <span
                  key={s.title}
                  className={
                    i === step
                      ? "h-1.5 w-7 rounded-full bg-accent"
                      : "h-1.5 w-3 rounded-full bg-card/40"
                  }
                />
              ))}
            </div>

            <div className="mt-8 space-y-3">
              {last ? (
                <Button asChild size="lg" className="w-full">
                  <Link to="/dang-nhap">Bắt đầu</Link>
                </Button>
              ) : (
                <Button
                  size="lg"
                  className="w-full"
                  onClick={() => setStep((s) => s + 1)}
                >
                  Tiếp tục
                </Button>
              )}
              <Link
                to="/trang-chu"
                className="block py-1 text-center text-sm font-medium opacity-80"
              >
                Bỏ qua, xem phòng trước
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}
