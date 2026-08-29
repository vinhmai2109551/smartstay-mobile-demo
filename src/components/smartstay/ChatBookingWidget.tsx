import { useState } from "react";
import { CalendarDays, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PriceSummary } from "@/components/smartstay/PriceSummary";
import { StayPicker } from "@/components/smartstay/StayPicker";
import { formatVnd, getRoom } from "@/data/mock";
import {
  SERVICE_FEE,
  formatDay,
  nightsBetween,
  useAppStore,
} from "@/store/app-store";

/** Phiếu đặt phòng thu gọn hiển thị ngay trong khung chat. */
export function ChatBookingWidget({
  roomId,
  onDone,
}: {
  roomId: string;
  onDone: (bookingCode: string, bookingId: string) => void;
}) {
  const { search, addBooking } = useAppStore();
  const room = getRoom(roomId);
  const [editing, setEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const nights = nightsBetween(search.checkIn, search.checkOut);
  const roomTotal = room.price * nights;
  const total = roomTotal + SERVICE_FEE;

  const confirm = () => {
    setSubmitting(true);
    setTimeout(() => {
      const booking = addBooking({
        roomId: room.id,
        total,
        guests: search.guests,
        nights,
        checkIn: formatDay(search.checkIn),
        checkOut: formatDay(search.checkOut),
        paid: false,
      });
      setSubmitting(false);
      setDone(true);
      onDone(booking.code, booking.id);
    }, 900);
  };

  return (
    <div className="rounded-2xl border border-ai/30 bg-card p-3 shadow-soft">
      <div className="flex items-center gap-3">
        <img
          src={room.images[0]}
          alt={room.name}
          className="size-14 rounded-xl object-cover"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{room.name}</p>
          <p className="text-xs text-muted-foreground">
            {formatVnd(room.price)}/đêm · tối đa {room.maxGuests} khách
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setEditing((v) => !v)}
        disabled={done}
        className="mt-3 flex w-full items-center gap-2 rounded-xl bg-secondary/70 px-3 py-2 text-left text-xs font-medium"
      >
        <CalendarDays className="size-4 text-muted-foreground" />
        {formatDay(search.checkIn)} – {formatDay(search.checkOut)} · {nights} đêm ·{" "}
        {search.guests} khách
        <span className="ml-auto text-ai">{editing ? "Xong" : "Đổi"}</span>
      </button>

      {editing && !done && <StayPicker className="mt-3" />}

      <PriceSummary
        className="mt-3 !p-0 !shadow-none"
        lines={[
          { label: `${formatVnd(room.price)} × ${nights} đêm`, value: roomTotal },
          { label: "Phí dịch vụ", value: SERVICE_FEE },
        ]}
        total={total}
      />

      {done ? (
        <p className="mt-3 flex items-center justify-center gap-1.5 rounded-xl bg-success/10 py-2 text-xs font-semibold text-success">
          <Check className="size-4" /> Đã tạo đơn đặt phòng
        </p>
      ) : (
        <Button
          className="mt-3 w-full bg-gradient-ai text-ai-foreground"
          disabled={submitting}
          onClick={confirm}
        >
          {submitting && <Loader2 className="size-4 animate-spin" />}
          Xác nhận đặt phòng
        </Button>
      )}
    </div>
  );
}
