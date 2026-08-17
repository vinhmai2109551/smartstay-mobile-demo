import { Link } from "@tanstack/react-router";
import { Star, Users, Maximize } from "lucide-react";
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
          "block w-[210px] shrink-0 overflow-hidden rounded-2xl bg-card shadow-soft",
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
        "flex gap-3 overflow-hidden rounded-2xl bg-card p-3 shadow-soft",
        className,
      )}
    >
      <img
        src={room.images[0]}
        alt={room.name}
        loading="lazy"
        className="size-28 shrink-0 rounded-xl object-cover"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="truncate font-semibold">{room.name}</p>
          <span className="flex shrink-0 items-center gap-1 text-xs font-medium">
            <Star className="size-3 fill-gold text-gold" />
            {room.rating}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">{room.type}</p>
        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <Users className="size-3" /> {room.maxGuests} khách
          </span>
          <span className="flex items-center gap-1">
            <Maximize className="size-3" /> {room.size} m²
          </span>
        </div>
        <div className="mt-2 flex items-end gap-2">
          <span className="text-base font-bold text-primary">{formatVnd(room.price)}</span>
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
