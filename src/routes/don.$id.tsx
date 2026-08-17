import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { QrCode, CalendarDays, Users, Sparkles } from "lucide-react";
import { PhoneFrame } from "@/components/layout/PhoneFrame";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { BookingStatusBadge } from "@/components/smartstay/BookingStatusBadge";
import { PriceSummary } from "@/components/smartstay/PriceSummary";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { getBooking, getRoom } from "@/data/mock";

export const Route = createFileRoute("/don/$id")({
  head: () => ({
    meta: [
      { title: "Chi tiết đơn đặt phòng — SmartStay" },
      { name: "description", content: "Mã đặt phòng, QR check-in và thông tin thanh toán." },
      { property: "og:title", content: "Chi tiết đơn đặt phòng — SmartStay" },
      {
        property: "og:description",
        content: "Mã đặt phòng, QR check-in và thông tin thanh toán.",
      },
    ],
  }),
  component: BookingDetail,
});

function BookingDetail() {
  const { id } = Route.useParams();
  const booking = getBooking(id);
  const room = getRoom(booking.roomId);
  const [cancelled, setCancelled] = useState(booking.status === "cancelled");
  const status = cancelled ? "cancelled" : booking.status;

  const roomTotal = room.price * booking.nights;
  const fee = booking.total - roomTotal;

  return (
    <PhoneFrame>
      <ScreenHeader title="Chi tiết đơn" subtitle={booking.code} />
      <div className="space-y-5 px-4 pb-10 pt-4">
        <div className="flex items-center justify-between">
          <BookingStatusBadge status={status} />
          <span className="text-xs text-muted-foreground">
            {booking.paid ? "Đã thanh toán" : "Chưa thanh toán"}
          </span>
        </div>

        {status === "confirmed" && (
          <div className="rounded-3xl bg-card p-5 text-center shadow-card">
            <p className="text-sm font-semibold">QR check-in</p>
            <p className="text-xs text-muted-foreground">Đưa mã này cho lễ tân khi nhận phòng</p>
            <div className="mx-auto mt-4 flex size-40 items-center justify-center rounded-2xl border-2 border-dashed border-border bg-secondary/50">
              <QrCode className="size-20 text-primary" />
            </div>
            <p className="mt-4 font-mono text-lg font-bold tracking-wider">{booking.code}</p>
          </div>
        )}

        <div className="flex gap-3 rounded-2xl bg-card p-3 shadow-soft">
          <img
            src={room.images[0]}
            alt={room.name}
            loading="lazy"
            className="size-20 rounded-xl object-cover"
          />
          <div className="min-w-0 flex-1 text-sm">
            <p className="font-semibold">{room.name}</p>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <CalendarDays className="size-3" /> {booking.checkIn} – {booking.checkOut}
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Users className="size-3" /> {booking.guests} khách · {booking.nights} đêm
            </p>
          </div>
        </div>

        <PriceSummary
          lines={[
            { label: `Tiền phòng ${booking.nights} đêm`, value: roomTotal },
            { label: "Dịch vụ & phí", value: fee },
          ]}
          total={booking.total}
        />

        <div className="rounded-2xl bg-secondary/60 p-4 text-xs/5 text-muted-foreground">
          <p className="mb-1 font-semibold text-foreground">Chính sách huỷ</p>
          {room.cancelPolicy}
        </div>

        <div className="space-y-2">
          <Button asChild variant="outline" size="lg" className="w-full gap-2 border-ai/40 text-ai">
            <Link to="/chat">
              <Sparkles className="size-4" /> Hỏi trợ lý AI về đơn này
            </Link>
          </Button>

          {booking.group === "past" && (
            <Button asChild size="lg" className="w-full">
              <Link to="/danh-gia/$id" params={{ id: booking.id }}>
                Đánh giá kỳ lưu trú
              </Link>
            </Button>
          )}

          {booking.group === "upcoming" && !cancelled && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="lg" className="w-full text-destructive">
                  Huỷ phòng
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="max-w-[340px] rounded-3xl">
                <AlertDialogHeader>
                  <AlertDialogTitle>Huỷ đơn {booking.code}?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Đơn còn trong thời hạn huỷ miễn phí. Tiền sẽ hoàn về tài khoản trong 3–5 ngày
                    làm việc.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex-row gap-2">
                  <AlertDialogCancel className="flex-1">Giữ đơn</AlertDialogCancel>
                  <AlertDialogAction className="flex-1" onClick={() => setCancelled(true)}>
                    Xác nhận huỷ
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
    </PhoneFrame>
  );
}
