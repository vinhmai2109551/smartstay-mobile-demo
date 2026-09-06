import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X, BedDouble } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { RoomCard } from "@/components/smartstay/RoomCard";
import { EmptyState } from "@/components/smartstay/EmptyState";
import { RoomListSkeleton } from "@/components/smartstay/Skeletons";
import { StayPicker, StaySummaryText } from "@/components/smartstay/StayPicker";
import { useFakeLoading } from "@/hooks/use-fake-loading";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { amenities, formatVnd, rooms } from "@/data/mock";
import { cn } from "@/lib/utils";


export const Route = createFileRoute("/tim-phong")({
  head: () => ({
    meta: [
      { title: "Tìm phòng trống — SmartStay" },
      {
        name: "description",
        content: "Lọc phòng theo loại phòng, mức giá và tiện nghi để tìm phòng phù hợp.",
      },
      { property: "og:title", content: "Tìm phòng trống — SmartStay" },
      {
        property: "og:description",
        content: "Lọc phòng theo loại phòng, mức giá và tiện nghi để tìm phòng phù hợp.",
      },
    ],
  }),
  component: SearchScreen,
});

const types = ["Tất cả", "Phòng đôi", "Suite", "Bungalow", "Phòng tập thể"] as const;

function SearchScreen() {
  const [keyword, setKeyword] = useState("");
  const [type, setType] = useState<string>("Tất cả");
  const [maxPrice, setMaxPrice] = useState(2500000);
  const [picked, setPicked] = useState<string[]>([]);
  const loading = useFakeLoading(700, [keyword, type, maxPrice, picked.length]);


  const results = useMemo(
    () =>
      rooms.filter(
        (r) =>
          (type === "Tất cả" || r.type === type) &&
          r.price <= maxPrice &&
          r.name.toLowerCase().includes(keyword.toLowerCase()) &&
          picked.every((a) => r.amenities.includes(a)),
      ),
    [keyword, type, maxPrice, picked],
  );

  const toggle = (id: string) =>
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  return (
    <AppShell>
      <header className="sticky top-0 z-20 border-b border-border bg-card/95 px-4 pb-3 pt-5 backdrop-blur">
        <h1 className="font-display text-xl">Tìm phòng trống</h1>
        <p className="text-xs text-muted-foreground">
          <StaySummaryText />
        </p>

        <div className="mt-3 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Tên phòng, loại phòng..."
              className="pl-9"
            />
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Bộ lọc" className="size-9 shrink-0">
                <SlidersHorizontal className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-3xl">
              <SheetHeader>
                <SheetTitle>Bộ lọc</SheetTitle>
              </SheetHeader>
              <div className="space-y-6 px-4 pb-8">
                <div>
                  <p className="mb-2 text-sm font-semibold">Giá tối đa mỗi đêm</p>
                  <Slider
                    value={[maxPrice]}
                    min={300000}
                    max={2500000}
                    step={50000}
                    onValueChange={(v) => setMaxPrice(v[0] ?? 2500000)}
                  />
                  <p className="mt-2 text-sm text-muted-foreground">{formatVnd(maxPrice)}</p>
                </div>
                <div>
                  <p className="mb-2 text-sm font-semibold">Tiện nghi</p>
                  <div className="flex flex-wrap gap-2">
                    {amenities.map((a) => (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => toggle(a.id)}
                        className={cn(
                          "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                          picked.includes(a.id)
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-card text-muted-foreground",
                        )}
                      >
                        {a.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4">
          {types.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={cn(
                "shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                type === t
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground",
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </header>

      <div className="px-4 py-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{results.length} phòng phù hợp</p>
          {picked.length > 0 && (
            <button
              type="button"
              onClick={() => setPicked([])}
              className="flex items-center gap-1 text-xs font-medium text-primary"
            >
              <X className="size-3" /> Xoá lọc tiện nghi
            </button>
          )}
        </div>

        {results.length === 0 ? (
          <EmptyState
            icon={<BedDouble className="size-6" />}
            title="Không tìm thấy phòng"
            desc="Thử nới rộng mức giá hoặc bỏ bớt tiện nghi đã chọn."
          />
        ) : (
          <div className="space-y-3">
            {results.map((r) => (
              <RoomCard key={r.id} room={r} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
