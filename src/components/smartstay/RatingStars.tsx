import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function RatingStars({
  value,
  size = 14,
  onChange,
  className,
}: {
  value: number;
  size?: number;
  onChange?: (v: number) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = i <= Math.round(value);
        const star = (
          <Star
            style={{ width: size, height: size }}
            className={filled ? "fill-gold text-gold" : "text-border"}
          />
        );
        return onChange ? (
          <button
            key={i}
            type="button"
            aria-label={`${i} sao`}
            onClick={() => onChange(i)}
            className="p-0.5 transition-transform active:scale-90"
          >
            {star}
          </button>
        ) : (
          <span key={i}>{star}</span>
        );
      })}
    </div>
  );
}
