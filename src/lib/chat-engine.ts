import { formatVnd, promos, rooms, type Room } from "@/data/mock";

export type ChatReply = {
  text: string;
  roomIds?: string[];
  /** Mở widget đặt phòng ngay trong chat cho phòng này. */
  bookingRoomId?: string;
  /** Hiện bộ chọn ngày trong chat + nút áp dụng sang trang tìm phòng. */
  showStayPicker?: boolean;
};

/** Bỏ dấu + hạ chữ để so khớp linh hoạt hơn (viết có dấu / không dấu đều được). */
export const normalize = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .toLowerCase();

type Intent =
  | "greeting"
  | "cancel_policy"
  | "promo"
  | "price"
  | "amenity"
  | "checkin_time"
  | "location"
  | "capacity"
  | "book"
  | "thanks"
  | "help"
  | "search";

const KEYWORDS: Record<Intent, string[]> = {
  greeting: ["xin chao", "hello", "hi ", "chao ban", "chao"],
  cancel_policy: ["huy", "hoan tien", "chinh sach", "doi ngay", "refund"],
  promo: ["uu dai", "khuyen mai", "ma giam", "giam gia", "voucher", "coupon", "promo"],
  price: ["gia", "bao nhieu tien", "chi phi", "re nhat", "dat khong", "tien"],
  amenity: [
    "tien nghi",
    "wifi",
    "ho boi",
    "bua sang",
    "an sang",
    "dieu hoa",
    "do xe",
    "dau xe",
    "bep",
    "may lanh",
  ],
  checkin_time: ["gio nhan phong", "check in", "checkin", "check out", "tra phong", "gio"],
  location: ["dia chi", "o dau", "vi tri", "bien", "san bay", "di lai", "cach"],
  capacity: [
    "may nguoi",
    "nguoi",
    "khach",
    "gia dinh",
    "tre em",
    "em be",
    "nhom",
    "doan",
    "phong lon",
  ],
  book: ["dat phong", "dat luon", "chot", "book", "dat giup", "muon dat", "dat ngay"],
  thanks: ["cam on", "thanks", "thank you", "ok ban"],
  help: ["giup", "ho tro", "tu van", "goi y", "nen o phong nao"],
  search: ["phong", "trong", "con phong", "tim", "view bien", "suite", "bungalow", "dorm"],
};

const score = (text: string, words: string[]) =>
  words.reduce((sum, w) => (text.includes(w) ? sum + w.length : sum), 0);

const detectIntent = (text: string): Intent => {
  const t = ` ${normalize(text)} `;
  let best: Intent = "search";
  let bestScore = 0;
  (Object.keys(KEYWORDS) as Intent[]).forEach((intent) => {
    const s = score(t, KEYWORDS[intent]);
    if (s > bestScore) {
      bestScore = s;
      best = intent;
    }
  });
  return bestScore === 0 ? "help" : best;
};

export const guestsFrom = (text: string): number | null => {
  const t = normalize(text);
  const digit = t.match(/(\d+)\s*(nguoi|khach|ng)/);
  if (digit?.[1]) return Number(digit[1]);
  const words: Record<string, number> = { mot: 1, hai: 2, ba: 3, bon: 4, nam: 5, sau: 6 };
  const found = Object.keys(words).find((w) => t.includes(`${w} nguoi`));
  return found ? (words[found] ?? null) : null;
};

const roomByText = (text: string): Room | null => {
  const t = normalize(text);
  return (
    rooms.find((r) => t.includes(normalize(r.name))) ??
    rooms.find((r) => t.includes(normalize(r.type))) ??
    (t.includes("view bien") ? (rooms.find((r) => r.amenities.includes("seaview")) ?? null) : null)
  );
};

const cheapest = () => [...rooms].sort((a, b) => a.price - b.price)[0]!;

/** Sinh câu trả lời dựa trên ý định + ngữ cảnh phòng đang xem. */
export function replyFor(text: string, ctxRoom?: Room | null): ChatReply {
  const intent = detectIntent(text);
  const mentioned = roomByText(text) ?? ctxRoom ?? null;
  const guests = guestsFrom(text);

  if (intent === "greeting") {
    return {
      text: "Chào bạn 👋 Bạn chọn ngày ở và số khách ngay bên dưới, mình sẽ áp dụng luôn cho trang tìm phòng nhé.",
      showStayPicker: true,
    };
  }

  if (intent === "thanks") {
    return { text: "Rất vui được giúp bạn! Nếu cần đổi ngày hay thêm dịch vụ, cứ nhắn mình nhé." };
  }

  if (intent === "cancel_policy") {
    const target = mentioned ?? rooms[0]!;
    return {
      text: `Chính sách huỷ của ${target.name}: ${target.cancelPolicy} Sau thời hạn miễn phí, đơn bị thu 50% giá trị. Bạn cũng có thể đổi ngày một lần miễn phí trước 7 ngày.`,
    };
  }

  if (intent === "promo") {
    return {
      text: `Hiện có ${promos.length} ưu đãi: ${promos
        .map((p) => `${p.code} (${p.desc.toLowerCase()})`)
        .join(", ")}. Mình có thể áp dụng mã tốt nhất khi bạn đặt trong chat.`,
    };
  }

  if (intent === "price") {
    const target = mentioned ?? cheapest();
    return {
      text: `${target.name} đang có giá ${formatVnd(target.price)}/đêm${
        target.oldPrice ? ` (giá gốc ${formatVnd(target.oldPrice)})` : ""
      }. Phí dịch vụ 80.000 ₫/đơn, đã gồm VAT. Bạn muốn mình giữ phòng này không?`,
      roomIds: [target.id],
      bookingRoomId: target.id,
    };
  }

  if (intent === "amenity") {
    const target = mentioned ?? rooms[0]!;
    return {
      text: `${target.name} có: ${target.amenities
        .map((a) => a)
        .join(", ")
        .replace(/wifi/, "wifi miễn phí")}. Toàn bộ khách sạn đều có wifi, điều hoà và hồ bơi ngoài trời mở 6:00–21:00.`,
      roomIds: [target.id],
    };
  }

  if (intent === "checkin_time") {
    return {
      text: "Giờ nhận phòng từ 14:00, trả phòng trước 12:00. Bạn có thể mua thêm dịch vụ nhận phòng sớm (10:00) hoặc trả phòng muộn (15:00) khi đặt.",
    };
  }

  if (intent === "location") {
    return {
      text: "Khách sạn ở 128 Võ Nguyên Giáp, Sơn Trà, Đà Nẵng — đi bộ 3 phút ra biển Mỹ Khê, cách sân bay Đà Nẵng khoảng 15 phút xe. Mình có thể đặt xe đón sân bay kèm đơn phòng.",
    };
  }

  if (intent === "capacity") {
    const n = guests ?? 4;
    const fits = rooms.filter((r) => r.maxGuests >= n);
    if (fits.length === 0) {
      return {
        text: `Với ${n} khách, mình gợi ý đặt 2 phòng cạnh nhau (ví dụ 2 phòng Deluxe). Bạn muốn mình kiểm tra ngày trống không?`,
        roomIds: [rooms[0]!.id],
      };
    }
    return {
      text: `Cho ${n} khách, mình tìm được ${fits.length} lựa chọn phù hợp. Gợi ý tốt nhất là ${fits[0]!.name} (tối đa ${fits[0]!.maxGuests} khách, ${fits[0]!.beds}).`,
      roomIds: fits.slice(0, 3).map((r) => r.id),
      bookingRoomId: fits[0]!.id,
      showStayPicker: true,
    };
  }

  if (intent === "book") {
    const target = mentioned ?? rooms[0]!;
    return {
      text: `Được luôn! Mình mở phiếu đặt ${target.name} ngay đây — bạn chọn ngày và số khách rồi xác nhận là xong.`,
      bookingRoomId: target.id,
    };
  }

  if (intent === "help") {
    return {
      showStayPicker: true,
      text: "Mình có thể giúp bạn: tìm phòng theo ngày & số khách, so sánh giá, giải thích chính sách huỷ, áp mã ưu đãi và đặt phòng ngay trong chat. Bạn thử nhắn kiểu \"phòng đôi view biển 2 người cuối tuần này\" nhé.",
    };
  }

  // search (mặc định)
  const list = mentioned
    ? [mentioned, ...rooms.filter((r) => r.id !== mentioned.id).slice(0, 1)]
    : rooms.filter((r) => r.maxGuests >= (guests ?? 2)).slice(0, 3);
  const picked = list.length > 0 ? list : rooms.slice(0, 2);
  return {
    text: `Mình tìm được ${picked.length} phòng phù hợp${guests ? ` cho ${guests} khách` : ""}. Bạn xem thử nhé — muốn đặt phòng nào thì nhắn mình.`,
    roomIds: picked.map((r) => r.id),
    bookingRoomId: picked[0]!.id,
    showStayPicker: true,
  };
}
