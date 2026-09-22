import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { PhoneFrame } from "@/components/layout/PhoneFrame";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { RoomCard } from "@/components/smartstay/RoomCard";
import { Button } from "@/components/ui/button";
import { getRoom } from "@/data/mock";
import { useAppStore } from "@/store/app-store";

export const Route = createFileRoute("/yeu-thich")({
  head: () => ({
    meta: [
      { title: "Phòng yêu thích — SmartStay" },
      { name: "description", content: "Danh sách phòng bạn đã lưu để đặt sau tại SmartStay." },
      { property: "og:title", content: "Phòng yêu thích — SmartStay" },
      {
        property: "og:description",
        content: "Danh sách phòng bạn đã lưu để đặt sau tại SmartStay.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FavoritesScreen,
});

function FavoritesScreen() {
  const { favorites } = useAppStore();
  const rooms = favorites.map((id) => getRoom(id));

  return (
    <PhoneFrame>
      <ScreenHeader
        title="Phòng yêu thích"
        subtitle={rooms.length > 0 ? `${rooms.length} phòng đã lưu` : "Chưa có phòng nào"}
      />
      <div className="space-y-3 px-4 py-4">
        {rooms.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <span className="flex size-16 items-center justify-center rounded-full bg-secondary text-primary">
              <Heart className="size-7" />
            </span>
            <p className="mt-4 font-semibold">Chưa có phòng yêu thích</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Chạm vào biểu tượng trái tim trên mỗi phòng để lưu lại và đặt sau.
            </p>
            <Button asChild size="lg" className="mt-6 w-full">
              <Link to="/tim-phong">Khám phá phòng trống</Link>
            </Button>
          </div>
        ) : (
          rooms.map((room) => <RoomCard key={room.id} room={room} />)
        )}
      </div>
    </PhoneFrame>
  );
}
