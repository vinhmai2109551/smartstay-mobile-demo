import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, RotateCcw, Send, Sparkles } from "lucide-react";
import { PhoneFrame } from "@/components/layout/PhoneFrame";
import { RoomCard } from "@/components/smartstay/RoomCard";
import { ChatBookingWidget } from "@/components/smartstay/ChatBookingWidget";
import { ChatStayCard } from "@/components/smartstay/ChatStayCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatVnd, getRoom } from "@/data/mock";
import { guestsFrom, replyFor } from "@/lib/chat-engine";
import { useAppStore, type ChatMessage } from "@/store/app-store";
import { cn } from "@/lib/utils";

type Search = { room?: string | undefined };

export const Route = createFileRoute("/chat")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    room: typeof search["room"] === "string" ? (search["room"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Trợ lý AI Chat-to-Book — SmartStay" },
      {
        name: "description",
        content: "Trò chuyện với trợ lý AI để tìm phòng, hỏi chính sách và đặt phòng ngay.",
      },
      { property: "og:title", content: "Trợ lý AI Chat-to-Book — SmartStay" },
      {
        property: "og:description",
        content: "Trò chuyện với trợ lý AI để tìm phòng, hỏi chính sách và đặt phòng ngay.",
      },
    ],
  }),
  component: ChatScreen,
});

const quickReplies = [
  "Phòng đôi view biển cuối tuần này",
  "Chính sách huỷ thế nào?",
  "Có phòng cho 4 người không?",
  "Ưu đãi đang có",
  "Đặt phòng giúp mình",
];

const newId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

function ChatScreen() {
  const router = useRouter();
  const { room: roomParam } = Route.useSearch();
  const focusRoom = roomParam ? getRoom(roomParam) : null;
  const { chat, setChat, resetChat, setSearch } = useAppStore();

  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  // Tin nhắn chào mừng (chỉ tạo khi lịch sử đang trống).
  useEffect(() => {
    if (chat.length > 0) return;
    setChat([
      {
        id: newId(),
        from: "ai",
        text: focusRoom
          ? `Chào bạn! Bạn đang quan tâm ${focusRoom.name} (${formatVnd(focusRoom.price)}/đêm). Mình có thể kiểm tra ngày trống, giải thích chính sách hoặc đặt phòng ngay tại đây.`
          : "Chào bạn 👋 Mình là trợ lý SmartStay. Bạn muốn ở ngày nào và đi mấy người? Mình sẽ tìm phòng phù hợp và đặt luôn trong khung chat.",
        ...(focusRoom ? { roomIds: [focusRoom.id] } : {}),
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chat.length, roomParam]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, typing]);

  const send = (text: string) => {
    const value = text.trim().slice(0, 500);
    if (!value || typing) return;
    setChat((prev) => [...prev, { id: newId(), from: "user", text: value }]);
    setInput("");
    setTyping(true);

    // Số khách nhắc trong câu chat được áp thẳng vào bộ lọc chung.
    const guests = guestsFrom(value);
    if (guests && guests >= 1 && guests <= 12) setSearch({ guests });

    const reply = replyFor(value, focusRoom);
    setTimeout(() => {
      setTyping(false);
      setChat((prev) => [
        ...prev,
        {
          id: newId(),
          from: "ai",
          text: reply.text,
          ...(reply.roomIds ? { roomIds: reply.roomIds } : {}),
          ...(reply.bookingRoomId ? { bookingRoomId: reply.bookingRoomId } : {}),
          ...(reply.showStayPicker ? { showStayPicker: true } : {}),
        },
      ]);
    }, 900 + Math.min(1200, value.length * 18));
  };

  const onBookingDone = (code: string, bookingId: string) => {
    setChat((prev) => [
      ...prev,
      {
        id: newId(),
        from: "ai",
        text: `Đặt phòng thành công! Mã đặt phòng của bạn là ${code}. Bạn có thể thanh toán ngay hoặc xem chi tiết đơn bất cứ lúc nào.`,
        bookingId,
      },
    ]);
  };

  return (
    <PhoneFrame className="bg-secondary/40">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-card/95 px-4 py-3 backdrop-blur">
        <button
          type="button"
          onClick={() => router.history.back()}
          aria-label="Quay lại"
          className="flex size-9 items-center justify-center rounded-full border border-border"
        >
          <ChevronLeft className="size-5" />
        </button>
        <span className="flex size-9 items-center justify-center rounded-full bg-gradient-ai text-ai-foreground">
          <Sparkles className="size-4" />
        </span>
        <div className="flex-1">
          <p className="text-sm font-semibold">Trợ lý SmartStay</p>
          <p className="flex items-center gap-1.5 text-[11px] text-success">
            <span className="size-1.5 rounded-full bg-success" /> Đang trực tuyến
          </p>
        </div>
        <button
          type="button"
          onClick={resetChat}
          aria-label="Bắt đầu hội thoại mới"
          className="flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground"
        >
          <RotateCcw className="size-4" />
        </button>
      </header>

      <div className="flex-1 space-y-3 px-4 py-4">
        {chat.map((m) => (
          <MessageRow key={m.id} message={m} onBookingDone={onBookingDone} />
        ))}

        {typing && (
          <div className="w-fit rounded-2xl rounded-tl-sm bg-card px-4 py-3 shadow-soft">
            <span className="flex items-center gap-1">
              {[0, 150, 300].map((d) => (
                <span
                  key={d}
                  className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60"
                  style={{ animationDelay: `${d}ms` }}
                />
              ))}
              <span className="ml-2 text-xs text-muted-foreground">
                Trợ lý đang trả lời...
              </span>
            </span>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="sticky bottom-0 border-t border-border bg-card/95 backdrop-blur">
        <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pt-3">
          {quickReplies.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => send(q)}
              className="shrink-0 rounded-full border border-ai/40 bg-ai/8 px-3 py-1.5 text-xs font-medium text-ai"
            >
              {q}
            </button>
          ))}
        </div>
        <form
          className="flex items-center gap-2 p-4"
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
        >
          <Input
            value={input}
            maxLength={500}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Nhắn cho trợ lý SmartStay..."
            className="rounded-full"
          />
          <Button
            type="submit"
            size="icon"
            aria-label="Gửi"
            disabled={typing || input.trim().length === 0}
            className="size-10 shrink-0 rounded-full bg-gradient-ai text-ai-foreground"
          >
            <Send className="size-4" />
          </Button>
        </form>
      </div>
    </PhoneFrame>
  );
}

function MessageRow({
  message: m,
  onBookingDone,
}: {
  message: ChatMessage;
  onBookingDone: (code: string, bookingId: string) => void;
}) {
  return (
    <div className="space-y-2">
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm/6",
          m.from === "ai"
            ? "rounded-tl-sm bg-card shadow-soft"
            : "ml-auto rounded-tr-sm bg-primary text-primary-foreground",
        )}
      >
        {m.text}
      </div>

      {m.roomIds && m.roomIds.length > 0 && (
        <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-1">
          {m.roomIds.map((id) => (
            <RoomCard key={id} room={getRoom(id)} variant="compact" />
          ))}
        </div>
      )}

      {m.showStayPicker && <ChatStayCard />}

      {m.bookingRoomId && (
        <ChatBookingWidget roomId={m.bookingRoomId} onDone={onBookingDone} />
      )}

      {m.bookingId && (
        <div className="flex gap-2">
          <Button asChild size="sm">
            <Link to="/thanh-toan/$id" params={{ id: m.bookingId }}>
              Thanh toán ngay
            </Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link to="/don/$id" params={{ id: m.bookingId }}>
              Xem đơn
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
