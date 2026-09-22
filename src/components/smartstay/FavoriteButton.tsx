import { Heart } from "lucide-react";
import { toast } from "sonner";
import { useAppStore } from "@/store/app-store";
import { cn } from "@/lib/utils";

/** Nút lưu phòng vào danh sách yêu thích (dùng được cả bên trong thẻ Link). */
export function FavoriteButton({
  roomId,
  className,
}: {
  roomId: string;
  className?: string;
}) {
  const { isFavorite, toggleFavorite } = useAppStore();
  const active = isFavorite(roomId);

  return (
    <button
      type="button"
      aria-label={active ? "Bỏ khỏi yêu thích" : "Lưu vào yêu thích"}
      aria-pressed={active}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(roomId);
        toast.success(active ? "Đã bỏ khỏi yêu thích" : "Đã lưu vào phòng yêu thích");
      }}
      className={cn(
        "flex size-8 items-center justify-center rounded-full bg-card/90 shadow-soft backdrop-blur transition-transform active:scale-90",
        className,
      )}
    >
      <Heart
        className={cn(
          "size-4 transition-colors",
          active ? "fill-accent text-accent" : "text-muted-foreground",
        )}
      />
    </button>
  );
}
