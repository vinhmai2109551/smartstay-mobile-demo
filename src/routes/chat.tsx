import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, Send, Sparkles } from "lucide-react";
import { PhoneFrame } from "@/components/layout/PhoneFrame";
import { RoomCard } from "@/components/smartstay/RoomCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatVnd, getRoom, rooms, type Room } from "@/data/mock";
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

type Message = {
  id: number;
  from: "ai" | "user";
  text: string;
  rooms?: Room[];
  cta?: { label: string; roomId: string };
};

const quickReplies = [
  "Phòng đôi view biển cuối tuần này",
  "Chính sách huỷ thế nào?",
  "Có phòng cho 4 người không?",
  "Ưu đãi đang có",
];

function ChatScreen() {
  const router = useRouter();
  const { room: roomParam } = Route.useSearch();
  const focusRoom = roomParam ? getRoom(roomParam) : null;

  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: 1,
      from: "ai",
      text: focusRoom
        ? `Chào bạn! Bạn đang quan tâm phòng ${focusRoom.name} (${formatVnd(focusRoom.price)}/đêm). Mình có thể giúp gì — kiểm tra ngày trống, chính sách huỷ hay đặt luôn?`
        : "Chào bạn 👋 Mình là trợ lý SmartStay. Bạn muốn ở ngày nào và đi mấy người? Mình sẽ tìm phòng phù hợp ngay.",
    },
  ]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now(), from: "user", text };
    setMessages((m) => [...m, userMsg]);
    setInput("");

    setTimeout(() => {
      setMessages((m) => [...m, replyFor(text)]);
    }, 600);
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
      </header>

      <div className="flex-1 space-y-3 px-4 py-4">
        {messages.map((m) => (
          <div key={m.id} className="space-y-2">
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

            {m.rooms && (
              <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-1">
                {m.rooms.map((r) => (
                  <RoomCard key={r.id} room={r} variant="compact" />
                ))}
              </div>
            )}

            {m.cta && (
              <Button asChild size="sm" className="gap-2">
                <Link to="/dat-phong/$id" params={{ id: m.cta.roomId }}>
                  {m.cta.label}
                </Link>
              </Button>
            )}
          </div>
        ))}
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
            onChange={(e) => setInput(e.target.value)}
            placeholder="Nhắn cho trợ lý SmartStay..."
            className="rounded-full"
          />
          <Button
            type="submit"
            size="icon"
            aria-label="Gửi"
            className="size-10 shrink-0 rounded-full bg-gradient-ai text-ai-foreground"
          >
            <Send className="size-4" />
          </Button>
        </form>
      </div>
    </PhoneFrame>
  );
}

function replyFor(text: string): Message {
  const t = text.toLowerCase();
  const id = Date.now() + 1;

  if (t.includes("huỷ") || t.includes("hủy") || t.includes("chính sách")) {
    return {
      id,
      from: "ai",
      text: "Với hầu hết các phòng, bạn được miễn phí huỷ trước 48 giờ so với giờ nhận phòng. Riêng Suite Gia Đình là 72 giờ. Sau thời hạn này, đơn bị thu 50% giá trị.",
    };
  }
  if (t.includes("ưu đãi") || t.includes("khuyến mãi")) {
    return {
      id,
      from: "ai",
      text: "Hiện có 3 ưu đãi: SUMMER25 giảm 25% cho kỳ nghỉ từ 2 đêm, SOMSOM giảm 15% khi đặt sớm 14 ngày, và STAY7 tặng 1 đêm khi ở 7 đêm.",
    };
  }
  if (t.includes("4 người") || t.includes("gia đình")) {
    const r = getRoom("family-suite");
    return {
      id,
      from: "ai",
      text: "Cho nhóm 4 người, mình gợi ý Suite Gia Đình — 52 m², 1 giường King và 2 giường đơn, có bếp nhỏ.",
      rooms: [r],
      cta: { label: "Đặt Suite Gia Đình", roomId: r.id },
    };
  }
  return {
    id,
    from: "ai",
    text: "Mình tìm được 2 phòng phù hợp cho 2 khách, ngày 22–25/08. Bạn xem thử nhé:",
    rooms: [getRoom("deluxe-sea"), getRoom("garden-bungalow")],
    cta: { label: "Đặt Deluxe View Biển", roomId: rooms[0]!.id },
  };
}
