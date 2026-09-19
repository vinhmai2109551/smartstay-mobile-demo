import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Clock, ShieldCheck, TimerOff, Loader2, Copy, Check } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";
import { PhoneFrame } from "@/components/layout/PhoneFrame";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { StepIndicator } from "@/components/smartstay/StepIndicator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatVnd, getRoom } from "@/data/mock";
import { SERVICE_FEE, nightsBetween, useAppStore } from "@/store/app-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/thanh-toan/$id")({
  head: () => ({
    meta: [
      { title: "Thanh toán đơn phòng — SmartStay" },
      { name: "description", content: "Thanh toán bằng thẻ nội địa, ví MoMo hoặc quét VietQR." },
      { property: "og:title", content: "Thanh toán đơn phòng — SmartStay" },
      {
        property: "og:description",
        content: "Thanh toán bằng thẻ nội địa, ví MoMo hoặc quét VietQR.",
      },
    ],
  }),
  component: PaymentScreen,
});

type Method = "vietqr" | "atm" | "momo" | "cash";

const methods: { id: Method; label: string; desc: string }[] = [
  { id: "vietqr", label: "VietQR", desc: "Quét mã bằng app ngân hàng" },
  { id: "atm", label: "Thẻ nội địa / ATM", desc: "Napas, Internet Banking" },
  { id: "momo", label: "Ví MoMo", desc: "Xác nhận trong app MoMo" },
  { id: "cash", label: "Trả tại quầy", desc: "Giữ phòng 2 giờ" },
];

const BANK = {
  name: "MB Bank",
  accountNo: "0987 654 321",
  accountName: "SMARTSTAY VIKA HOTEL",
};

const HOLD_SECONDS = 10 * 60;

/** Payload dạng EMV/VietQR giả lập để mã QR quét được như mã thật. */
const vietQrPayload = (amount: number, memo: string) => {
  const amountField = `54${String(String(amount).length).padStart(2, "0")}${amount}`;
  const memoField = `08${String(memo.length).padStart(2, "0")}${memo}`;
  const merchantInfo = `0010A000000727012700069704220113${BANK.accountNo.replace(/\s/g, "")}0208QRIBFTTA`;
  const body = `00020101021238${String(merchantInfo.length).padStart(2, "0")}${merchantInfo}5303704${amountField}5802VN62${String(memoField.length).padStart(2, "0")}${memoField}6304`;
  return `${body}D34F`;
};

function PaymentScreen() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const room = getRoom(id);
  const { draft, search, user, addBooking } = useAppStore();

  const nights = draft?.nights ?? nightsBetween(search.checkIn, search.checkOut);
  const total = draft?.total ?? room.price * nights + SERVICE_FEE;
  const memo = (draft ? "SS DATPHONG" : "SS DATPHONG").slice(0, 20);

  const [method, setMethod] = useState<Method>("vietqr");
  const [seconds, setSeconds] = useState(HOLD_SECONDS);
  const [processing, setProcessing] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  const expired = seconds === 0;
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  const copy = async (label: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      /* clipboard có thể bị chặn trong iframe preview */
    }
    setCopied(label);
    toast.success(`Đã sao chép ${label.toLowerCase()}`);
    setTimeout(() => setCopied(null), 1500);
  };

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
        search: {
          status: ok ? "success" : "failed",
          method,
          ...(bookingId ? { booking: bookingId } : {}),
        },
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
              Mã thanh toán không còn hiệu lực. Bạn có thể tạo lại phiên thanh toán mới.
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
                  "flex w-full items-center gap-3 rounded-2xl border bg-card p-3 text-left transition-colors",
                  method === m.id ? "border-primary" : "border-border",
                )}
              >
                <span
                  className={cn(
                    "size-4 shrink-0 rounded-full border-4",
                    method === m.id ? "border-primary bg-card" : "border-border bg-card",
                  )}
                />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold">{m.label}</span>
                  <span className="block text-xs text-muted-foreground">{m.desc}</span>
                </span>
              </button>
            ))}
          </div>
        </section>

        {method === "vietqr" && (
          <section className="rounded-3xl bg-card p-5 text-center shadow-card">
            <p className="text-sm font-semibold">Quét mã để thanh toán</p>
            <div
              className={cn(
                "mx-auto mt-4 w-fit rounded-2xl border border-border bg-card p-3",
                expired && "opacity-40 grayscale",
              )}
            >
              <QRCodeSVG
                value={vietQrPayload(total, memo)}
                size={176}
                level="M"
                marginSize={0}
              />
            </div>

            <div className="mt-4 space-y-2 rounded-2xl bg-secondary/60 p-3 text-left text-xs">
              <BankRow label="Ngân hàng" value={BANK.name} />
              <BankRow
                label="Số tài khoản"
                value={BANK.accountNo}
                onCopy={() => copy("Số tài khoản", BANK.accountNo.replace(/\s/g, ""))}
                copied={copied === "Số tài khoản"}
              />
              <BankRow label="Chủ tài khoản" value={BANK.accountName} />
              <BankRow
                label="Nội dung CK"
                value={memo}
                onCopy={() => copy("Nội dung chuyển khoản", memo)}
                copied={copied === "Nội dung chuyển khoản"}
              />
              <BankRow label="Số tiền" value={formatVnd(total)} strong />
            </div>

            <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <ShieldCheck className="size-3.5" /> Giao dịch bảo mật qua PayOS
            </p>
          </section>
        )}

        {method === "atm" && <AtmCardForm />}

        {method === "momo" && (
          <section className="rounded-3xl bg-card p-5 shadow-card">
            <p className="text-sm font-semibold">Thanh toán qua ví MoMo</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Yêu cầu thanh toán sẽ được gửi tới số điện thoại đăng ký MoMo của bạn.
            </p>
            <div className="mt-3 flex items-center justify-between rounded-2xl bg-secondary/60 px-3 py-2.5 text-sm">
              <span className="text-muted-foreground">Số điện thoại</span>
              <span className="font-semibold">{user?.phone ?? "0905 123 456"}</span>
            </div>
            <p className="mt-3 text-xs/5 text-muted-foreground">
              Mở app MoMo → mục <span className="font-medium">Thông báo</span> để xác nhận
              giao dịch {formatVnd(total)}. Sau đó quay lại đây và bấm "Tôi đã thanh toán".
            </p>
          </section>
        )}

        {method === "cash" && (
          <section className="rounded-3xl bg-card p-5 shadow-card">
            <p className="text-sm font-semibold">Trả tại quầy lễ tân</p>
            <p className="mt-1 text-xs/5 text-muted-foreground">
              Phòng được giữ trong 2 giờ. Đến quầy lễ tân {BANK.accountName} và cung cấp số
              điện thoại đặt phòng để hoàn tất thanh toán {formatVnd(total)}.
            </p>
          </section>
        )}

        <div className="rounded-2xl bg-secondary/60 p-4 text-xs/5 text-muted-foreground">
          Sau khi thanh toán thành công, hệ thống tự động xác nhận và gửi mã đặt phòng kèm
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
          {processing
            ? "Đang xác nhận giao dịch..."
            : method === "cash"
              ? "Xác nhận giữ phòng"
              : "Tôi đã thanh toán"}
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

function BankRow({
  label,
  value,
  strong,
  onCopy,
  copied,
}: {
  label: string;
  value: string;
  strong?: boolean;
  onCopy?: () => void;
  copied?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="shrink-0 text-muted-foreground">{label}</span>
      <span className={cn("min-w-0 truncate font-medium", strong && "font-bold text-primary")}>
        {value}
      </span>
      {onCopy && (
        <button
          type="button"
          onClick={onCopy}
          aria-label={`Sao chép ${label}`}
          className="shrink-0 text-muted-foreground transition-colors hover:text-primary"
        >
          {copied ? <Check className="size-3.5 text-success" /> : <Copy className="size-3.5" />}
        </button>
      )}
    </div>
  );
}

/** Form thẻ nội địa giả lập: tự format số thẻ và ngày hết hạn. */
function AtmCardForm() {
  const [cardNo, setCardNo] = useState("");
  const [name, setName] = useState("");
  const [expiry, setExpiry] = useState("");

  const formatCard = (v: string) =>
    v
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(\d{4})(?=\d)/g, "$1 ");

  const formatExpiry = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
  };

  return (
    <section className="rounded-3xl bg-card p-5 shadow-card">
      <p className="text-sm font-semibold">Thông tin thẻ nội địa</p>
      <div className="mt-3 space-y-3">
        <div className="space-y-1.5">
          <Label htmlFor="card-no" className="text-xs">
            Số thẻ
          </Label>
          <Input
            id="card-no"
            inputMode="numeric"
            placeholder="9704 0000 0000 0018"
            value={cardNo}
            onChange={(e) => setCardNo(formatCard(e.target.value))}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="card-name" className="text-xs">
            Tên chủ thẻ
          </Label>
          <Input
            id="card-name"
            placeholder="NGUYEN MINH ANH"
            value={name}
            onChange={(e) => setName(e.target.value.toUpperCase())}
          />
        </div>
        <div className="w-1/2 space-y-1.5">
          <Label htmlFor="card-exp" className="text-xs">
            Ngày phát hành / hết hạn
          </Label>
          <Input
            id="card-exp"
            inputMode="numeric"
            placeholder="MM/YY"
            value={expiry}
            onChange={(e) => setExpiry(formatExpiry(e.target.value))}
          />
        </div>
      </div>
      <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
        <ShieldCheck className="size-3.5" /> Thông tin thẻ được mã hoá qua cổng PayOS
      </p>
    </section>
  );
}
