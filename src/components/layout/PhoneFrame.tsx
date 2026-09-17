import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Khung điện thoại: giới hạn 430px, canh giữa để xem tốt trên desktop. */
export function PhoneFrame({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className="flex min-h-screen justify-center">
      <div
        className={cn(
          "relative flex min-h-screen w-full max-w-[430px] min-w-0 flex-col overflow-x-clip bg-background shadow-card",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}
