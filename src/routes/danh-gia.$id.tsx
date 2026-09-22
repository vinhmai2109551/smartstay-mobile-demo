import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PartyPopper } from "lucide-react";
import { PhoneFrame } from "@/components/layout/PhoneFrame";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { RatingStars } from "@/components/smartstay/RatingStars";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getRoom } from "@/data/mock";
import { useAppStore, useBookingById } from "@/store/app-store";

export const Route = createFileRoute("/danh-gia/$id")({
  head: () => ({
    meta: [
      { title: "Đánh giá kỳ lưu trú — SmartStay" },
      { name: "description", content: "Chia sẻ cảm nhận của bạn về kỳ lưu trú tại SmartStay." },
      { property: "og:title", content: "Đánh giá kỳ lưu trú — SmartStay" },
      {
        property: "og:description",
        content: "Chia sẻ cảm nhận của bạn về kỳ lưu trú tại SmartStay.",
      },
    ],
  }),
  component: ReviewScreen,
});

const criteria = ["Sạch sẽ", "Vị trí", "Dịch vụ", "Đáng giá tiền"];

function ReviewScreen() {
  const { id } = Route.useParams();
  const booking = useBookingById(id);
  const { markReviewed, addReview } = useAppStore();
  const room = getRoom(booking.roomId);
  const [overall, setOverall] = useState(5);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [comment, setComment] = useState("");
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <PhoneFrame>
        <div className="flex min-h-screen flex-col items-center justify-center px-8 text-center">
          <span className="flex size-20 items-center justify-center rounded-full bg-accent/15 text-accent">
            <PartyPopper className="size-10" />
          </span>
          <h1 className="mt-6 font-display text-2xl">Cảm ơn bạn!</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Đánh giá của bạn giúp SmartStay phục vụ tốt hơn cho những khách tiếp theo.
          </p>
          <Button asChild size="lg" className="mt-8 w-full">
            <Link to="/danh-gia">Xem đánh giá của tôi</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="mt-3 w-full">
            <Link to="/don-cua-toi">Về danh sách đơn</Link>
          </Button>
        </div>
      </PhoneFrame>
    );
  }

  return (
    <PhoneFrame>
      <ScreenHeader title="Đánh giá" subtitle={room.name} />
      <form
        className="space-y-6 px-4 pb-10 pt-6"
        onSubmit={(e) => {
          e.preventDefault();
          markReviewed(booking.id);
          addReview({
            bookingId: booking.id,
            roomId: booking.roomId,
            rating: overall,
            content: comment.trim(),
          });
          setSent(true);
        }}
      >
        <div className="rounded-3xl bg-card p-5 text-center shadow-soft">
          <img
            src={room.images[0]}
            alt={room.name}
            loading="lazy"
            className="mx-auto size-20 rounded-2xl object-cover"
          />
          <p className="mt-3 font-semibold">{room.name}</p>
          <p className="text-xs text-muted-foreground">
            {booking.checkIn} – {booking.checkOut}
          </p>
          <p className="mt-4 text-sm font-medium">Bạn hài lòng ở mức nào?</p>
          <RatingStars
            value={overall}
            size={30}
            onChange={setOverall}
            className="mt-2 justify-center"
          />
        </div>

        <div className="space-y-3">
          {criteria.map((c) => (
            <div
              key={c}
              className="flex items-center justify-between rounded-2xl bg-card p-3 shadow-soft"
            >
              <span className="text-sm font-medium">{c}</span>
              <RatingStars
                value={scores[c] ?? 0}
                size={18}
                onChange={(v) => setScores((s) => ({ ...s, [c]: v }))}
              />
            </div>
          ))}
        </div>

        <div>
          <label htmlFor="comment" className="mb-2 block text-sm font-semibold">
            Nhận xét của bạn
          </label>
          <Textarea
            id="comment"
            rows={5}
            value={comment}
            maxLength={500}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Điều gì khiến bạn hài lòng hoặc cần cải thiện?"
          />
        </div>

        <Button type="submit" size="lg" className="w-full">
          Gửi đánh giá
        </Button>
      </form>
    </PhoneFrame>
  );
}
