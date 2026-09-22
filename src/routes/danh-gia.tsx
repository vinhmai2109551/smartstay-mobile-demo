import { createFileRoute, Link } from "@tanstack/react-router";
import { MessageSquareQuote, Star } from "lucide-react";
import { PhoneFrame } from "@/components/layout/PhoneFrame";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { RatingStars } from "@/components/smartstay/RatingStars";
import { Button } from "@/components/ui/button";
import { getRoom, hotel, reviews } from "@/data/mock";
import { useAppStore } from "@/store/app-store";

export const Route = createFileRoute("/danh-gia")({
  head: () => ({
    meta: [
      { title: "Đánh giá của khách — SmartStay" },
      {
        name: "description",
        content: "Tất cả nhận xét của khách đã lưu trú tại SmartStay Vika Hotel.",
      },
      { property: "og:title", content: "Đánh giá của khách — SmartStay" },
      {
        property: "og:description",
        content: "Tất cả nhận xét của khách đã lưu trú tại SmartStay Vika Hotel.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ReviewsScreen,
});

function ReviewsScreen() {
  const { myReviews, user } = useAppStore();

  return (
    <PhoneFrame>
      <ScreenHeader title="Đánh giá của khách" subtitle={hotel.name} />

      <div className="space-y-4 px-4 py-4">
        <div className="flex items-center gap-4 rounded-3xl bg-card p-4 shadow-soft">
          <div className="text-center">
            <p className="font-display text-3xl text-primary">{hotel.rating}</p>
            <RatingStars value={Math.round(hotel.rating)} size={14} className="mt-1" />
          </div>
          <div className="min-w-0 flex-1 text-sm text-muted-foreground">
            <p className="font-semibold text-foreground">Rất tốt</p>
            <p className="text-xs">
              Dựa trên {hotel.reviewCount} đánh giá của khách đã lưu trú.
            </p>
          </div>
        </div>

        {myReviews.length > 0 && (
          <section className="space-y-2">
            <h2 className="text-sm font-semibold">Đánh giá của bạn</h2>
            {myReviews.map((r) => (
              <article key={r.id} className="rounded-2xl bg-card p-4 shadow-soft">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-semibold">{getRoom(r.roomId).name}</p>
                  <span className="flex shrink-0 items-center gap-1 text-xs font-medium">
                    <Star className="size-3 fill-gold text-gold" /> {r.rating}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  {user?.name ?? "Bạn"} · {r.date}
                </p>
                <p className="mt-2 text-sm/6">
                  {r.content || "Bạn chưa viết nhận xét cho kỳ lưu trú này."}
                </p>
              </article>
            ))}
          </section>
        )}

        <section className="space-y-2">
          <h2 className="text-sm font-semibold">Khách khác nói gì</h2>
          {reviews.map((r) => (
            <article key={r.id} className="rounded-2xl bg-card p-4 shadow-soft">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-sm font-semibold">{r.name}</p>
                <span className="flex shrink-0 items-center gap-1 text-xs font-medium">
                  <Star className="size-3 fill-gold text-gold" /> {r.rating}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">{r.date}</p>
              <p className="mt-2 text-sm/6">{r.content}</p>
            </article>
          ))}
        </section>

        {myReviews.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border p-4 text-center">
            <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-secondary text-primary">
              <MessageSquareQuote className="size-5" />
            </span>
            <p className="mt-3 text-sm font-medium">Bạn chưa viết đánh giá nào</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Sau khi trả phòng, bạn có thể chia sẻ cảm nhận từ màn Đơn của tôi.
            </p>
            <Button asChild size="sm" variant="outline" className="mt-3">
              <Link to="/don-cua-toi">Xem đơn của tôi</Link>
            </Button>
          </div>
        )}
      </div>
    </PhoneFrame>
  );
}
