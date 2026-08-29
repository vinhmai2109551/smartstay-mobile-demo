import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StayPicker } from "@/components/smartstay/StayPicker";

/** Ô tìm phòng: ngày nhận/trả và số khách, đồng bộ với store toàn cục. */
export function SearchCard() {
  const navigate = useNavigate();
  return (
    <div className="rounded-3xl bg-card p-4 shadow-card">
      <StayPicker />
      <Button
        size="lg"
        className="mt-4 w-full gap-2"
        onClick={() => navigate({ to: "/tim-phong" })}
      >
        <Search className="size-4" />
        Tìm phòng trống
      </Button>
    </div>
  );
}
