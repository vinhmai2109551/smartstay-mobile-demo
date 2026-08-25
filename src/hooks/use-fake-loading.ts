import { useEffect, useState } from "react";

/** Mô phỏng thời gian "tải dữ liệu" để hiển thị skeleton (chưa gắn API thật). */
export function useFakeLoading(delay = 700, deps: unknown[] = []) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), delay);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delay, ...deps]);

  return loading;
}
