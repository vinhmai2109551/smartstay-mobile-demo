import { createServerFn } from "@tanstack/react-start";
import { createOpenAI } from "@ai-sdk/openai";
import { streamText, Output, NoObjectGeneratedError } from "ai";
import { z } from "zod";
import { extraServices, hotel, promos, rooms } from "@/data/mock";

const Input = z.object({
  history: z
    .array(z.object({ from: z.enum(["ai", "user"]), text: z.string().max(2000) }))
    .max(20),
  focusRoomId: z.string().nullable(),
});

const Schema = z.object({
  text: z.string(),
  roomIds: z.array(z.string()),
  serviceIds: z.array(z.string()),
  bookingRoomId: z.string().nullable(),
  showStayPicker: z.boolean(),
});

export type ConciergeReply = z.infer<typeof Schema>;

const catalog = () =>
  JSON.stringify({
    hotel: { name: hotel.name, address: hotel.address, checkIn: "14:00", checkOut: "12:00" },
    rooms: rooms.map((r) => ({
      id: r.id, name: r.name, type: r.type, priceVnd: r.price, maxGuests: r.maxGuests,
      beds: r.beds, amenities: r.amenities, cancelPolicy: r.cancelPolicy,
      available: r.available, description: r.description,
    })),
    services: extraServices,
    promos,
    serviceFeeVnd: 80000,
    pets: "Nhận thú cưng dưới 8kg tại Bungalow Vườn, phụ thu 200.000 ₫/đêm",
  });

export const askConcierge = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => Input.parse(d))
  .handler(async ({ data }): Promise<{ ok: true; reply: ConciergeReply } | { ok: false; error: string }> => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) return { ok: false, error: "Trợ lý AI chưa được cấu hình." };
    const lovable = createOpenAI({
      baseURL: "https://ai.gateway.lovable.dev/v1",
      apiKey: key,
      headers: { "Lovable-API-Key": key, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    });
    const system = `Bạn là trợ lý đặt phòng thân thiện của ${hotel.name}. Luôn trả lời bằng tiếng Việt, ngắn gọn (tối đa 80 từ), ấm áp.
Chỉ dùng dữ liệu trong danh mục sau, không bịa phòng/giá/dịch vụ:
${catalog()}
Quy tắc: roomIds tối đa 3 id phòng phù hợp nhất (từ danh mục), serviceIds tối đa 3 id dịch vụ phù hợp. bookingRoomId = id phòng khi khách muốn đặt/giữ phòng, ngược lại null. showStayPicker = true khi cần khách chọn ngày/số khách.${
      data.focusRoomId ? ` Khách đang xem phòng id "${data.focusRoomId}".` : ""
    }`;
    try {
      const result = streamText({
        model: lovable.responses("openai/gpt-6-astra"),
        system,
        messages: data.history.map((m) => ({
          role: m.from === "ai" ? ("assistant" as const) : ("user" as const),
          content: m.text,
        })),
        output: Output.object({ schema: Schema }),
        providerOptions: {
          openai: { forceReasoning: true, reasoningEffort: "low", store: false, include: ["reasoning.encrypted_content"] },
        },
      });
      const out = await result.output;
      const roomSet = new Set(rooms.map((r) => r.id));
      const svcSet = new Set(extraServices.map((s) => s.id));
      return {
        ok: true,
        reply: {
          text: out.text,
          roomIds: out.roomIds.filter((id) => roomSet.has(id)).slice(0, 3),
          serviceIds: out.serviceIds.filter((id) => svcSet.has(id)).slice(0, 3),
          bookingRoomId: out.bookingRoomId && roomSet.has(out.bookingRoomId) ? out.bookingRoomId : null,
          showStayPicker: out.showStayPicker,
        },
      };
    } catch (e) {
      if (NoObjectGeneratedError.isInstance(e) && e.text) {
        return { ok: true, reply: { text: e.text, roomIds: [], serviceIds: [], bookingRoomId: null, showStayPicker: false } };
      }
      const msg = String((e as Error)?.message ?? e);
      console.error("askConcierge", msg);
      if (msg.includes("402")) return { ok: false, error: "Hết lượt dùng AI, vui lòng nạp thêm credits." };
      if (msg.includes("429")) return { ok: false, error: "Trợ lý đang bận, bạn thử lại sau ít phút nhé." };
      return { ok: false, error: "Trợ lý AI tạm thời không phản hồi được." };
    }
  });
