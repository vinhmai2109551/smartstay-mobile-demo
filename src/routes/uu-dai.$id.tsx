import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Copy, Check, Tag, CalendarClock, ListChecks, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { PhoneFrame } from "@/components/layout/PhoneFrame";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { Button } from "@/components/ui/button";
import { promos } from "@/data/mock";

export const Route = createFileRoute("/uu-dai/$id")({
  head: () => ({
    meta: [
      { title: "Chi tiết ưu đãi — SmartStay" },
      { name: "description", content: "Điều kiện áp dụng và mã ưu đãi đặt phòng tại SmartStay." },
      { property: "og:title", content: "Chi tiết ưu đãi — SmartStay" },
      {
        property: "og:description",
        content: "Điều kiện áp dụng và mã ưu đãi đặt phòng tại SmartStay.",
      },
    ],
  }),
  component: PromoDetailScreen,
});

function PromoDetailScreen() {
  const { id } = Route.useParams();
  const promo = promos.find((p) => p.id === id) ?? promos[0]!;
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(promo.code);
    } catch {
      /* clipboard có thể bị chặn trong iframe preview */
    }
    setCopied(true);
    toast.success(`Đã sao chép mã ${promo.code}`);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <PhoneFrame>
      <ScreenHeader title="Ưu đãi" subtitle="SmartStay Vika Hotel" />
      <div className="space-y-5 px-4 py-5">
        <div className="rounded-3xl bg-gradient-ai p-5 text-ai-foreground shadow-ai">
          <span className="flex size-11 items-center justify-center rounded-xl bg-card/20">
            <Tag className="size-5" />
          </span>
          <h1 className="mt-3 font-display text-2xl">{promo.title}</h1>
          <p className="mt-1 text-sm opacity-90">{promo.desc}</p>

          <button
            type="button"
            onClick={copyCode}
            className="mt-4 flex w-full items-center justify-between rounded-2xl border border-dashed border-ai-foreground/50 bg-card/15 px-4 py-3 backdrop-blur"
          >
            <span className="font-mono text-lg font-bold tracking-widest">{promo.code}</span>
            <span className="flex items-center gap-1.5 text-xs font-semibold">
              {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
              {copied ? "Đã sao chép" : "Sao chép"}
            </span>
          </button>
        </div>

        <section className="rounded-2xl bg-card p-4 shadow-soft">
          <p className="flex items-center gap-2 text-sm font-semibold">
            <ListChecks className="size-4 text-primary" /> Điều kiện áp dụng
          </p>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-xs/5 text-muted-foreground">
            <li>Áp dụng cho mọi loại phòng tại SmartStay Vika Hotel.</li>
            <li>{promo.desc}.</li>
            <li>Không cộng dồn cùng mã ưu đãi khác trong cùng một đơn.</li>
            <li>Đơn đã áp mã vẫn được huỷ miễn phí theo chính sách từng phòng.</li>
          </ul>
        </section>

        <section className="rounded-2xl bg-card p-4 shadow-soft">
          <p className="flex items-center gap-2 text-sm font-semibold">
            <CalendarClock className="size-4 text-primary" /> Thời hạn
          </p>
          <p className="mt-2 text-xs/5 text-muted-foreground">
            Có hiệu lực đến hết 31/12/2026. Nhập mã ở bước Đặt phòng hoặc nhờ trợ lý AI áp mã
            giúp bạn.
          </p>
        </section>

        <Button asChild size="lg" className="w-full gap-2">
          <Link to="/tim-phong">
            Tìm phòng áp dụng mã <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </PhoneFrame>
  );
}
