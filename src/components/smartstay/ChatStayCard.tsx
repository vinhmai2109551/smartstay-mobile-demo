import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { StayPicker } from "@/components/smartstay/StayPicker";
import { formatDay, nightsBetween, useAppStore } from "@/store/app-store";

/**
 * Bộ chọn ngày ngay trong khung chat: chọn xong là đồng bộ luôn sang
 * trang Tìm phòng (dùng chung store), kèm nút chuyển thẳng qua đó.
 */
export function ChatStayCard() {
  const { search } = useAppStore();
  const nights = nightsBetween(search.checkIn, search.checkOut);

  return (
    <div className="rounded-2xl border border-ai/30 bg-card p-3 shadow-soft">
      <p className="text-xs font-semibold text-muted-foreground">
        Kỳ lưu trú đang chọn
      </p>
      <StayPicker className="mt-2" />
      <p className="mt-2 text-[11px] text-muted-foreground">
        {formatDay(search.checkIn)} – {formatDay(search.checkOut)} · {nights} đêm ·{" "}
        {search.guests} khách · {search.rooms} phòng
      </p>
      <Button asChild className="mt-3 w-full bg-gradient-ai text-ai-foreground">
        <Link to="/tim-phong">
          Xem phòng trống theo ngày này
          <ArrowRight className="size-4" />
        </Link>
      </Button>
    </div>
  );
}
