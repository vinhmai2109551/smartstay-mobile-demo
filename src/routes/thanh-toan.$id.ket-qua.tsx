import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, XCircle } from "lucide-react";
import { PhoneFrame } from "@/components/layout/PhoneFrame";
import { Button } from "@/components/ui/button";
import { formatVnd, getRoom } from "@/data/mock";
import { SERVICE_FEE, formatDay, nightsBetween, useAppStore } from "@/store/app-store";

type Search = { status: "success" | "failed"; booking?: string; method?: string };

export const Route = createFileRoute("/thanh-toan/$id/ket-qua")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    status: search["status"] === "failed" ? "failed" : "success",
    ...(typeof search["booking"] === "string" ? { booking: search["booking"] } : {}),
    ...(typeof search["method"] === "string" ? { method: search["method"] } : {}),
  }),
  head: () => ({
    meta: [
      { title: "Kết quả thanh toán — SmartStay" },
      { name: "description", content: "Trạng thái giao dịch đặt phòng tại SmartStay." },
      { property: "og:title", content: "Kết quả thanh toán — SmartStay" },
      { property: "og:description", content: "Trạng thái giao dịch đặt phòng tại SmartStay." },
    ],
  }),
  component: PaymentResult,
});

const methodLabel: Record<string, string> = {
  vietqr: "VietQR",
  atm: "Thẻ nội địa / ATM",
  momo: "Ví MoMo",
  cash: "Trả tại quầy",
};

function PaymentResult() {
  const { id } = Route.useParams();
  const { status, booking: bookingId, method } = Route.useSearch();
  const { bookings, draft, search } = useAppStore();
  const booking = bookings.find((b) => b.id === bookingId);
  const room = getRoom(booking?.roomId ?? id);
  const nights = booking?.nights ?? draft?.nights ?? nightsBetween(search.checkIn, search.checkOut);
  const total = booking?.total ?? draft?.total ?? room.price * nights + SERVICE_FEE;
  const roomAmount = total - SERVICE_FEE;
  const stay = booking
    ? `${booking.checkIn} – ${booking.checkOut}`
    : `${formatDay(search.checkIn)} – ${formatDay(search.checkOut)}`;
  const ok = status === "success";
  const now = new Date();
  const paidAt = `${now.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })} ${formatDay(now)}`;

  return (
    <PhoneFrame>
      <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <span
          className={
            ok
              ? "flex size-20 animate-in zoom-in-50 items-center justify-center rounded-full bg-success/12 text-success duration-500"
              : "flex size-20 animate-in zoom-in-50 items-center justify-center rounded-full bg-destructive/12 text-destructive duration-500"
          }
        >
          {ok ? <CheckCircle2 className="size-10" /> : <XCircle className="size-10" />}
        </span>

        <h1 className="mt-6 font-display text-2xl">
          {ok ? "Thanh toán thành công" : "Thanh toán thất bại"}
        </h1>
        <p className="mt-2 max-w-[300px] text-sm text-muted-foreground">
          {ok
            ? "Đơn của bạn đã được xác nhận. Mã đặt phòng và QR check-in đã sẵn sàng."
            : "Giao dịch chưa hoàn tất. Phòng vẫn được giữ thêm ít phút, bạn hãy thử lại nhé."}
        </p>

        <div className="mt-6 w-full rounded-2xl bg-card p-4 text-left shadow-soft">
          <p className="mb-1 border-b border-dashed border-border pb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Biên lai thanh toán
          </p>
          <Row label="Phòng" value={room.name} />
          <Row label="Nhận / trả phòng" value={stay} />
          <Row label="Số đêm" value={`${nights} đêm`} />
          <Row label="Tiền phòng" value={formatVnd(roomAmount)} />
          <Row label="Phí dịch vụ (gồm VAT)" value={formatVnd(SERVICE_FEE)} />
          <div className="my-1 border-t border-dashed border-border" />
          <Row label="Tổng thanh toán" value={formatVnd(total)} strong />
          {ok && (
            <>
              <Row label="Phương thức" value={methodLabel[method ?? ""] ?? "VietQR"} />
              <Row label="Thời gian giao dịch" value={paidAt} />
              <Row label="Mã đặt phòng" value={booking?.code ?? "Đang cập nhật"} />
            </>
          )}
        </div>

        <div className="mt-8 w-full space-y-2">
          {ok ? (
            <>
              <Button asChild size="lg" className="w-full">
                <Link to="/don/$id" params={{ id: booking?.id ?? bookingId ?? "bk1" }}>
                  Xem chi tiết đơn
                </Link>
              </Button>
              <Button asChild variant="ghost" size="lg" className="w-full">
                <Link to="/trang-chu">Về trang chủ</Link>
              </Button>
            </>
          ) : (
            <>
              <Button asChild size="lg" className="w-full">
                <Link to="/thanh-toan/$id" params={{ id }}>
                  Thử lại
                </Link>
              </Button>
              <Button asChild variant="ghost" size="lg" className="w-full">
                <Link to="/chat">Nhờ trợ lý AI hỗ trợ</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </PhoneFrame>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex justify-between gap-3 py-1.5 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={strong ? "font-bold text-primary" : "font-medium"}>{value}</span>
    </div>
  );
}
