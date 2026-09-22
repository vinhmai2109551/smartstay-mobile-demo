import { Link } from "@tanstack/react-router";
import { Star, Users, Maximize } from "lucide-react";
import { FavoriteButton } from "@/components/smartstay/FavoriteButton";
import { formatVnd, type Room } from "@/data/mock";
import { cn } from "@/lib/utils";

/** Card phòng dùng lại ở Trang chủ, Tìm phòng và gợi ý trong Chat AI. */
export function RoomCard({
  room,
  variant = "list",
  className,
}: {
  room: Room;
  variant?: "list" | "compact";
  className?: string;
}) {
  if (variant === "compact") {
    return (
      <Link
        to="/phong/$id"
        params={{ id: room.id }}
        className={cn(
          "animate-rise block w-[min(210px,calc(100vw-3rem))] shrink-0 snap-start overflow-hidden rounded-2xl bg-card shadow-soft transition-transform active:scale-[0.98]",
          className,
        )}
      >
        <div className="relative h-32">
          <img
            src={room.images[0]}
            alt={room.name}
            loading="lazy"
            className="size-full object-cover"
          />
          {room.tag && (
            <span className="absolute left-2 top-2 rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold text-accent-foreground">
              {room.tag}
            </span>
          )}
          <FavoriteButton roomId={room.id} className="absolute right-2 top-2" />
        </div>
        <div className="p-3">
          <p className="truncate text-sm font-semibold">{room.name}</p>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="size-3 fill-gold text-gold" /> {room.rating} · {room.type}
          </p>
          <p className="mt-2 text-sm font-bold text-primary">
            {formatVnd(room.price)}
            <span className="text-xs font-normal text-muted-foreground"> /đêm</span>
          </p>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to="/phong/$id"
      params={{ id: room.id }}
      className={cn(
        "animate-rise grid min-w-0 grid-cols-[88px_minmax(0,1fr)] gap-2.5 overflow-hidden rounded-2xl bg-card p-2.5 shadow-soft transition-transform active:scale-[0.99] min-[380px]:grid-cols-[112px_minmax(0,1fr)] min-[380px]:gap-3 min-[380px]:p-3",
        className,
      )}
    >
      <img
        src={room.images[0]}
        alt={room.name}
        loading="lazy"
        className="aspect-square size-full min-w-0 rounded-xl object-cover"
      />
      <div className="min-w-0 flex-1">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-1.5">
          <p className="truncate text-sm font-semibold min-[380px]:text-base">{room.name}</p>
          <span className="flex shrink-0 items-center gap-1 text-xs font-medium">
            <Star className="size-3 fill-gold text-gold" />
            {room.rating}
            <FavoriteButton roomId={room.id} className="-my-1 ml-0.5 size-7 shadow-none" />
          </span>
        </div>
        <p className="text-xs text-muted-foreground">{room.type}</p>
        <div className="mt-1.5 flex min-w-0 flex-wrap gap-x-2 gap-y-1 text-[10px] text-muted-foreground min-[380px]:mt-2 min-[380px]:gap-x-3 min-[380px]:text-[11px]">
          <span className="flex items-center gap-1">
            <Users className="size-3" /> {room.maxGuests} khách
          </span>
          <span className="flex items-center gap-1">
            <Maximize className="size-3" /> {room.size} m²
          </span>
        </div>
        <div className="mt-1.5 flex min-w-0 flex-wrap items-baseline gap-x-1.5 gap-y-0 min-[380px]:mt-2 min-[380px]:gap-x-2">
          <span className="whitespace-nowrap text-sm font-bold text-primary min-[380px]:text-base">{formatVnd(room.price)}</span>
          {room.oldPrice && (
            <span className="text-xs text-muted-foreground line-through">
              {formatVnd(room.oldPrice)}
            </span>
          )}
          <span className="text-xs text-muted-foreground">/đêm</span>
        </div>
      </div>
    </Link>
  );
}
