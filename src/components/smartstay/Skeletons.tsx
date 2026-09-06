import { Skeleton } from "@/components/ui/skeleton";

/** Skeleton cho danh sách phòng dạng card dọc. */
export function RoomListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex gap-3 rounded-2xl bg-card p-3 shadow-soft">
          <Skeleton className="size-24 shrink-0 rounded-xl" />
          <div className="min-w-0 flex-1 space-y-2 py-1">
            <Skeleton className="h-4 w-3/5" />
            <Skeleton className="h-3 w-2/5" />
            <Skeleton className="h-3 w-4/5" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Skeleton cho danh sách đơn đặt phòng. */
export function BookingListSkeleton({ count = 2 }: { count?: number }) {
  return <RoomListSkeleton count={count} />;
}

/** Skeleton cho màn chi tiết phòng. */
export function RoomDetailSkeleton() {
  return (
    <div>
      <Skeleton className="h-72 w-full rounded-none" />
      <div className="flex gap-2 px-4 py-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="size-16 rounded-xl" />
        ))}
      </div>
      <div className="space-y-4 px-4 pb-10">
        <Skeleton className="h-7 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-24 w-full rounded-2xl" />
        <Skeleton className="h-28 w-full rounded-2xl" />
      </div>
    </div>
  );
}
