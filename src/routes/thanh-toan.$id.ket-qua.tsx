import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, XCircle } from "lucide-react";
import { PhoneFrame } from "@/components/layout/PhoneFrame";
import { Button } from "@/components/ui/button";
import { formatVnd, getRoom } from "@/data/mock";
import { SERVICE_FEE, formatDay, nightsBetween, useAppStore } from "@/store/app-store";

type Search = { status: "success" | "failed"; booking?: string };

export const Route = createFileRoute("/thanh-toan/$id/ket-qua")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    status: search["status"] === "failed" ? "failed" : "success",
    ...(typeof search["booking"] === "string" ? { booking: search["booking"] } : {}),
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

function PaymentResult() {
  const { id } = Route.useParams();
  const { status, booking: bookingId } = Route.useSearch();
  const { bookings, draft, search } = useAppStore();
  const booking = bookings.find((b) => b.id === bookingId);
  const room = getRoom(booking?.roomId ?? id);
  const nights = booking?.nights ?? draft?.nights ?? nightsBetween(search.checkIn, search.checkOut);
  const total = booking?.total ?? draft?.total ?? room.price * nights + SERVICE_FEE;
  const stay = booking
    ? `${booking.checkIn} – ${booking.checkOut}`
    : `${formatDay(search.checkIn)} – ${formatDay(search.checkOut)}`;
  const ok = status === "success";

  return (
    <PhoneFrame>
      <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <span
          className={
            ok
              ? "flex size-20 items-center justify-center rounded-full bg-success/12 text-success"
              : "flex size-20 items-center justify-center rounded-full bg-destructive/12 text-destructive"
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
          <Row label="Phòng" value={room.name} />
          <Row label="Nhận / trả phòng" value="22/08 – 25/08/2026" />
          <Row label="Mã đặt phòng" value="SS-8FK2QD" />
          <Row label="Số tiền" value={formatVnd(total)} />
        </div>

        <div className="mt-8 w-full space-y-2">
          {ok ? (
            <>
              <Button asChild size="lg" className="w-full">
                <Link to="/don/$id" params={{ id: "bk1" }}>
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

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3 py-1.5 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
