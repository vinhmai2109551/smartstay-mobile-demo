import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CalendarDays, Check, Users } from "lucide-react";
import { PhoneFrame } from "@/components/layout/PhoneFrame";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { StepIndicator } from "@/components/smartstay/StepIndicator";
import { PriceSummary } from "@/components/smartstay/PriceSummary";
import { StayPicker } from "@/components/smartstay/StayPicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { extraServices, formatVnd, getRoom, promos } from "@/data/mock";
import {
  SERVICE_FEE,
  formatDay,
  nightsBetween,
  serviceTotal as sumServices,
  useAppStore,
} from "@/store/app-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dat-phong/$id")({
  head: ({ params }) => {
    const room = getRoom(params.id);
    return {
      meta: [
        { title: `Đặt ${room.name} — SmartStay` },
        { name: "description", content: `Chọn dịch vụ đi kèm và xác nhận đặt ${room.name}.` },
        { property: "og:title", content: `Đặt ${room.name} — SmartStay` },
        {
          property: "og:description",
          content: `Chọn dịch vụ đi kèm và xác nhận đặt ${room.name}.`,
        },
      ],
    };
  },
  component: BookingScreen,
});

function BookingScreen() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const room = getRoom(id);
  const { search, setDraft } = useAppStore();
  const [services, setServices] = useState<string[]>([]);
  const [code, setCode] = useState("");
  const [applied, setApplied] = useState<(typeof promos)[number] | null>(null);
  const [editStay, setEditStay] = useState(false);

  const nights = nightsBetween(search.checkIn, search.checkOut);
  const roomTotal = room.price * nights;
  const serviceTotal = useMemo(() => sumServices(services), [services]);
  const discount = applied ? Math.round((roomTotal + serviceTotal) * applied.discount) : 0;
  const total = roomTotal + serviceTotal + SERVICE_FEE - discount;

  const toggle = (sid: string) =>
    setServices((s) => (s.includes(sid) ? s.filter((x) => x !== sid) : [...s, sid]));

  const apply = () => {
    const found = promos.find((p) => p.code.toLowerCase() === code.trim().toLowerCase());
    setApplied(found ?? null);
  };

  const goPay = () => {
    setDraft({
      roomId: room.id,
      serviceIds: services,
      promoCode: applied?.code ?? null,
      discount,
      nights,
      guests: search.guests,
      checkIn: formatDay(search.checkIn),
      checkOut: formatDay(search.checkOut),
      total,
    });
    navigate({ to: "/thanh-toan/$id", params: { id: room.id } });
  };

  return (
    <PhoneFrame>
      <ScreenHeader title="Đặt phòng" subtitle={room.name} />
      <div className="space-y-5 px-4 pb-40 pt-4">
        <StepIndicator current={2} />

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
              <CalendarDays className="size-3" /> {formatDay(search.checkIn)} –{" "}
              {formatDay(search.checkOut)} · {nights} đêm
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Users className="size-3" /> {search.guests} khách · {search.rooms} phòng
            </p>
            <button
              type="button"
              onClick={() => setEditStay((v) => !v)}
              className="mt-1 text-xs font-semibold text-primary"
            >
              {editStay ? "Đóng" : "Đổi ngày / số khách"}
            </button>
          </div>
        </div>

        {editStay && <StayPicker />}

        <section>
          <h2 className="mb-3 font-display text-lg">Dịch vụ đi kèm</h2>
          <div className="space-y-2">
            {extraServices.map((s) => {
              const on = services.includes(s.id);
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => toggle(s.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-2xl border bg-card p-3 text-left transition-colors",
                    on ? "border-primary" : "border-border",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-5 shrink-0 items-center justify-center rounded-md border",
                      on ? "border-primary bg-primary text-primary-foreground" : "border-border",
                    )}
                  >
                    {on && <Check className="size-3.5" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium">{s.label}</span>
                    <span className="block text-xs text-muted-foreground">{s.desc}</span>
                  </span>
                  <span className="text-sm font-semibold">{formatVnd(s.price)}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <h2 className="mb-2 font-display text-lg">Mã khuyến mãi</h2>
          <div className="flex gap-2">
            <Input
              value={code}
              maxLength={20}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Nhập mã, ví dụ SUMMER25"
            />
            <Button variant="outline" onClick={apply}>
              Áp dụng
            </Button>
          </div>
          {applied ? (
            <p className="mt-2 text-xs font-medium text-success">
              Đã áp dụng {applied.code} — giảm {Math.round(applied.discount * 100)}%
            </p>
          ) : (
            code.length > 0 && (
              <p className="mt-2 text-xs text-muted-foreground">
                Gợi ý: SUMMER25, SOMSOM, STAY7
              </p>
            )
          )}
        </section>

        <PriceSummary
          lines={[
            { label: `${formatVnd(room.price)} × ${nights} đêm`, value: roomTotal },
            ...(serviceTotal ? [{ label: "Dịch vụ đi kèm", value: serviceTotal }] : []),
            { label: "Phí dịch vụ", value: SERVICE_FEE },
            ...(discount ? [{ label: `Khuyến mãi ${applied?.code}`, value: -discount }] : []),
          ]}
          total={total}
          note="Giá đã bao gồm thuế VAT. Thanh toán qua PayOS/VietQR."
        />
      </div>

      <div className="sticky bottom-0 z-20 flex items-center gap-3 border-t border-border bg-card/95 p-4 backdrop-blur">
        <div className="flex-1">
          <p className="text-xs text-muted-foreground">Tổng cộng</p>
          <p className="text-lg font-bold text-primary">{formatVnd(total)}</p>
        </div>
        <Button size="lg" className="flex-1" onClick={goPay}>
          Tiếp tục
        </Button>
      </div>
    </PhoneFrame>
  );
}
