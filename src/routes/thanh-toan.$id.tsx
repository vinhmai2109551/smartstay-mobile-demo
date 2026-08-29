import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { QrCode, Clock, ShieldCheck, TimerOff, Loader2 } from "lucide-react";
import { PhoneFrame } from "@/components/layout/PhoneFrame";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { StepIndicator } from "@/components/smartstay/StepIndicator";
import { Button } from "@/components/ui/button";
import { formatVnd, getRoom } from "@/data/mock";
import { SERVICE_FEE, nightsBetween, useAppStore } from "@/store/app-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/thanh-toan/$id")({
  head: () => ({
    meta: [
      { title: "Thanh toán đơn phòng — SmartStay" },
      { name: "description", content: "Thanh toán bằng PayOS hoặc quét VietQR để giữ phòng." },
      { property: "og:title", content: "Thanh toán đơn phòng — SmartStay" },
      {
        property: "og:description",
        content: "Thanh toán bằng PayOS hoặc quét VietQR để giữ phòng.",
      },
    ],
  }),
  component: PaymentScreen,
});

const methods = [
  { id: "payos", label: "PayOS", desc: "Thẻ nội địa, Internet Banking" },
  { id: "vietqr", label: "VietQR", desc: "Quét mã bằng app ngân hàng" },
  { id: "cash", label: "Trả tại quầy", desc: "Giữ phòng 2 giờ" },
];

const HOLD_SECONDS = 10 * 60;

function PaymentScreen() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const room = getRoom(id);
  const { draft, search, addBooking } = useAppStore();

  const nights = draft?.nights ?? nightsBetween(search.checkIn, search.checkOut);
  const total = draft?.total ?? room.price * nights + SERVICE_FEE;

  const [method, setMethod] = useState("vietqr");
  const [seconds, setSeconds] = useState(HOLD_SECONDS);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  const expired = seconds === 0;
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  const finish = (ok: boolean) => {
    if (processing) return;
    setProcessing(true);
    setTimeout(() => {
      const bookingId = ok
        ? addBooking({
            roomId: room.id,
            total,
            nights,
            guests: draft?.guests ?? search.guests,
            ...(draft ? { checkIn: draft.checkIn, checkOut: draft.checkOut } : {}),
            paid: true,
          }).id
        : undefined;
      setProcessing(false);
      navigate({
        to: "/thanh-toan/$id/ket-qua",
        params: { id },
        search: { status: ok ? "success" : "failed", ...(bookingId ? { booking: bookingId } : {}) },
      });
    }, 1200);
  };

  return (
    <PhoneFrame>
      <ScreenHeader title="Thanh toán" subtitle={room.name} />
      <div className="space-y-5 px-4 pb-40 pt-4">
        <StepIndicator current={3} />

        {expired ? (
          <div className="rounded-2xl bg-destructive/10 p-4 text-center text-sm text-destructive">
            <span className="inline-flex items-center gap-2 font-semibold">
              <TimerOff className="size-4" /> Phiên giữ phòng đã hết hạn
            </span>
            <p className="mt-1 text-xs">
              Mã QR không còn hiệu lực. Bạn có thể tạo lại phiên thanh toán mới.
            </p>
            <Button
              size="sm"
              variant="outline"
              className="mt-3"
              onClick={() => setSeconds(HOLD_SECONDS)}
            >
              Tạo phiên mới
            </Button>
          </div>
        ) : (
          <div className="rounded-2xl bg-warning/15 p-3 text-center text-sm font-medium text-warning-foreground">
            <span className="inline-flex items-center gap-2">
              <Clock className="size-4" /> Giữ phòng trong {mm}:{ss}
            </span>
          </div>
        )}

        <section>
          <h2 className="mb-2 font-display text-lg">Phương thức thanh toán</h2>
          <div className="space-y-2">
            {methods.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMethod(m.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-2xl border bg-card p-3 text-left",
                  method === m.id ? "border-primary" : "border-border",
                )}
              >
                <span
                  className={cn(
                    "size-4 shrink-0 rounded-full border-4",
                    method === m.id ? "border-primary bg-card" : "border-border bg-card",
                  )}
                />
                <span className="flex-1">
                  <span className="block text-sm font-semibold">{m.label}</span>
                  <span className="block text-xs text-muted-foreground">{m.desc}</span>
                </span>
              </button>
            ))}
          </div>
        </section>

        {method !== "cash" && (
          <section className="rounded-3xl bg-card p-5 text-center shadow-card">
            <p className="text-sm font-semibold">Quét mã để thanh toán</p>
            <div
              className={cn(
                "mx-auto mt-4 flex size-44 items-center justify-center rounded-2xl border-2 border-dashed border-border bg-secondary/50",
                expired && "opacity-40 grayscale",
              )}
            >
              <QrCode className="size-20 text-primary" />
            </div>
            <p className="mt-4 text-xs text-muted-foreground">Nội dung chuyển khoản</p>
            <p className="font-mono text-sm font-semibold">SS 8FK2QD</p>
            <p className="mt-3 text-2xl font-bold text-primary">{formatVnd(total)}</p>
            <p className="mt-2 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <ShieldCheck className="size-3.5" /> Giao dịch bảo mật qua PayOS
            </p>
          </section>
        )}

        <div className="rounded-2xl bg-secondary/60 p-4 text-xs/5 text-muted-foreground">
          Sau khi chuyển khoản thành công, hệ thống tự động xác nhận và gửi mã đặt phòng kèm
          QR check-in tới email của bạn.
        </div>
      </div>

      <div className="sticky bottom-0 z-20 space-y-2 border-t border-border bg-card/95 p-4 backdrop-blur">
        <Button
          size="lg"
          className="w-full gap-2"
          disabled={expired || processing}
          onClick={() => finish(true)}
        >
          {processing && <Loader2 className="size-4 animate-spin" />}
          {processing ? "Đang xác nhận giao dịch..." : "Tôi đã thanh toán"}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-muted-foreground"
          disabled={processing}
          onClick={() => finish(false)}
        >
          Mô phỏng thanh toán thất bại
        </Button>
      </div>
    </PhoneFrame>
  );
}
