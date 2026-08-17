import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import {
  ChevronLeft,
  Heart,
  Star,
  Users,
  Maximize,
  BedDouble,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { PhoneFrame } from "@/components/layout/PhoneFrame";
import { RatingStars } from "@/components/smartstay/RatingStars";
import { Button } from "@/components/ui/button";
import { amenityLabel, formatVnd, getRoom, reviews } from "@/data/mock";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/phong/$id")({
  head: ({ params }) => {
    const room = getRoom(params.id);
    return {
      meta: [
        { title: `${room.name} — SmartStay` },
        { name: "description", content: room.description.slice(0, 155) },
        { property: "og:title", content: `${room.name} — SmartStay` },
        { property: "og:description", content: room.description.slice(0, 155) },
      ],
    };
  },
  component: RoomDetail,
});

function RoomDetail() {
  const { id } = Route.useParams();
  const room = getRoom(id);
  const router = useRouter();
  const [active, setActive] = useState(0);

  return (
    <PhoneFrame>
      <div className="relative">
        <img
          src={room.images[active]}
          alt={room.name}
          width={1024}
          height={768}
          className="h-72 w-full object-cover"
        />
        <div className="absolute inset-x-0 top-0 flex justify-between p-4">
          <button
            type="button"
            onClick={() => router.history.back()}
            aria-label="Quay lại"
            className="flex size-9 items-center justify-center rounded-full bg-card/85 backdrop-blur"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            aria-label="Yêu thích"
            className="flex size-9 items-center justify-center rounded-full bg-card/85 backdrop-blur"
          >
            <Heart className="size-4" />
          </button>
        </div>
        <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
          {room.images.map((img, i) => (
            <button
              key={img}
              type="button"
              aria-label={`Ảnh ${i + 1}`}
              onClick={() => setActive(i)}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === active ? "w-6 bg-card" : "w-1.5 bg-card/60",
              )}
            />
          ))}
        </div>
      </div>

      <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-3">
        {room.images.map((img, i) => (
          <button key={img} type="button" onClick={() => setActive(i)}>
            <img
              src={img}
              alt=""
              loading="lazy"
              className={cn(
                "size-16 rounded-xl object-cover",
                i === active && "ring-2 ring-primary",
              )}
            />
          </button>
        ))}
      </div>

      <div className="space-y-5 px-4 pb-40">
        <div>
          <div className="flex items-start justify-between gap-3">
            <h1 className="font-display text-2xl">{room.name}</h1>
            <span className="flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold">
              <Star className="size-3 fill-gold text-gold" /> {room.rating}
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {room.type} · còn {room.available} phòng trống
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Fact icon={<Users className="size-4" />} label={`${room.maxGuests} khách`} />
          <Fact icon={<Maximize className="size-4" />} label={`${room.size} m²`} />
          <Fact icon={<BedDouble className="size-4" />} label={room.beds} />
        </div>

        <section>
          <h2 className="mb-2 font-display text-lg">Giới thiệu</h2>
          <p className="text-sm/6 text-muted-foreground">{room.description}</p>
        </section>

        <section>
          <h2 className="mb-2 font-display text-lg">Tiện nghi</h2>
          <div className="flex flex-wrap gap-2">
            {room.amenities.map((a) => (
              <span
                key={a}
                className="rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground"
              >
                {amenityLabel(a)}
              </span>
            ))}
          </div>
        </section>

        <section className="rounded-2xl bg-success/8 p-4">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-success">
            <ShieldCheck className="size-4" /> Chính sách huỷ
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground">{room.cancelPolicy}</p>
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg">Đánh giá ({room.reviewCount})</h2>
            <RatingStars value={room.rating} />
          </div>
          <div className="space-y-3">
            {reviews.map((rv) => (
              <div key={rv.id} className="rounded-2xl bg-card p-4 shadow-soft">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">{rv.name}</p>
                  <RatingStars value={rv.rating} size={12} />
                </div>
                <p className="text-[11px] text-muted-foreground">{rv.date}</p>
                <p className="mt-2 text-sm/6 text-muted-foreground">{rv.content}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="sticky bottom-0 z-20 border-t border-border bg-card/95 p-4 backdrop-blur">
        <div className="mb-3 flex items-end justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Giá mỗi đêm</p>
            <p className="text-xl font-bold text-primary">{formatVnd(room.price)}</p>
          </div>
          {room.oldPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {formatVnd(room.oldPrice)}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            asChild
            variant="outline"
            size="lg"
            className="flex-1 gap-2 border-ai/40 text-ai"
          >
            <Link to="/chat" search={{ room: room.id }}>
              <Sparkles className="size-4" />
              Hỏi AI
            </Link>
          </Button>
          <Button asChild size="lg" className="flex-[1.4]">
            <Link to="/dat-phong/$id" params={{ id: room.id }}>
              Đặt phòng
            </Link>
          </Button>
        </div>
      </div>
    </PhoneFrame>
  );
}

function Fact({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="rounded-2xl bg-secondary/70 p-3 text-center">
      <span className="mx-auto flex size-8 items-center justify-center rounded-lg bg-card text-primary">
        {icon}
      </span>
      <p className="mt-1.5 text-[11px] font-medium leading-tight">{label}</p>
    </div>
  );
}
