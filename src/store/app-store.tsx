import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { addDays, differenceInCalendarDays, format } from "date-fns";
import { bookings as seedBookings, extraServices, type Booking } from "@/data/mock";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type AppUser = {
  name: string;
  email: string;
  phone: string;
};

export type StaySearch = {
  checkIn: Date;
  checkOut: Date;
  guests: number;
  rooms: number;
};

/** Đơn đang thao tác (chưa thanh toán xong). */
export type BookingDraft = {
  roomId: string;
  serviceIds: string[];
  promoCode: string | null;
  discount: number;
  nights: number;
  guests: number;
  checkIn: string;
  checkOut: string;
  total: number;
};

export type ChatMessage = {
  id: string;
  from: "ai" | "user";
  text: string;
  roomIds?: string[];
  /** Widget đặt phòng ngay trong khung chat. */
  bookingRoomId?: string;
  /** Kết quả đặt phòng trong chat. */
  bookingId?: string;
  /** Hiện bộ chọn ngày + nút chuyển sang trang tìm phòng. */
  showStayPicker?: boolean;
};

type AppState = {
  user: AppUser | null;
  isAuthed: boolean;
  search: StaySearch;
  bookings: Booking[];
  draft: BookingDraft | null;
  chat: ChatMessage[];
};

type AppActions = {
  signIn: (u: AppUser) => void;
  signOut: () => void;
  updateUser: (patch: Partial<AppUser>) => void;
  setSearch: (patch: Partial<StaySearch>) => void;
  setDraft: (draft: BookingDraft | null) => void;
  addBooking: (input: {
    roomId: string;
    total: number;
    guests?: number;
    checkIn?: string;
    checkOut?: string;
    nights?: number;
    paid?: boolean;
  }) => Booking;
  cancelBooking: (id: string) => void;
  markReviewed: (id: string) => void;
  setChat: (next: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) => void;
  resetChat: () => void;
};

const AppContext = createContext<(AppState & AppActions) | null>(null);

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

export const formatDay = (d: Date) => format(d, "dd/MM/yyyy");
export const formatDayShort = (d: Date) => format(d, "dd/MM");
export const nightsBetween = (a: Date, b: Date) =>
  Math.max(1, differenceInCalendarDays(b, a));

export const SERVICE_FEE = 80000;

export const serviceTotal = (ids: string[]) =>
  extraServices.filter((s) => ids.includes(s.id)).reduce((sum, s) => sum + s.price, 0);

const randomCode = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789";
  let out = "";
  for (let i = 0; i < 6; i += 1) out += chars[Math.floor(Math.random() * chars.length)];
  return `SS-${out}`;
};

const defaultUser: AppUser = {
  name: "Nguyễn Minh Anh",
  email: "minhanh@email.com",
  phone: "0905 123 456",
};

/* ------------------------------------------------------------------ */
/* Provider                                                            */
/* ------------------------------------------------------------------ */

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(defaultUser);
  const [search, setSearchState] = useState<StaySearch>(() => {
    const base = new Date();
    return { checkIn: addDays(base, 1), checkOut: addDays(base, 4), guests: 2, rooms: 1 };
  });
  const [bookings, setBookings] = useState<Booking[]>(seedBookings);
  const [draft, setDraft] = useState<BookingDraft | null>(null);
  const [chat, setChatState] = useState<ChatMessage[]>([]);

  const signIn = useCallback((u: AppUser) => setUser(u), []);
  const signOut = useCallback(() => {
    setUser(null);
    setDraft(null);
    setChatState([]);
  }, []);
  const updateUser = useCallback(
    (patch: Partial<AppUser>) => setUser((u) => (u ? { ...u, ...patch } : u)),
    [],
  );

  const setSearch = useCallback(
    (patch: Partial<StaySearch>) => setSearchState((s) => ({ ...s, ...patch })),
    [],
  );

  const addBooking = useCallback<AppActions["addBooking"]>(
    (input) => {
      const booking: Booking = {
        id: `bk-${Date.now()}`,
        code: randomCode(),
        roomId: input.roomId,
        checkIn: input.checkIn ?? formatDay(search.checkIn),
        checkOut: input.checkOut ?? formatDay(search.checkOut),
        nights: input.nights ?? nightsBetween(search.checkIn, search.checkOut),
        guests: input.guests ?? search.guests,
        total: input.total,
        status: input.paid ? "confirmed" : "pending",
        paid: Boolean(input.paid),
        reviewed: false,
        group: "upcoming",
      };
      setBookings((list) => [booking, ...list]);
      return booking;
    },
    [search],
  );

  const cancelBooking = useCallback((id: string) => {
    setBookings((list) =>
      list.map((b) =>
        b.id === id ? { ...b, status: "cancelled", group: "cancelled" } : b,
      ),
    );
  }, []);

  const markReviewed = useCallback((id: string) => {
    setBookings((list) => list.map((b) => (b.id === id ? { ...b, reviewed: true } : b)));
  }, []);

  const setChat = useCallback<AppActions["setChat"]>((next) => {
    setChatState((prev) => (typeof next === "function" ? next(prev) : next));
  }, []);
  const resetChat = useCallback(() => setChatState([]), []);

  const value = useMemo(
    () => ({
      user,
      isAuthed: user !== null,
      search,
      bookings,
      draft,
      chat,
      signIn,
      signOut,
      updateUser,
      setSearch,
      setDraft,
      addBooking,
      cancelBooking,
      markReviewed,
      setChat,
      resetChat,
    }),
    [
      user,
      search,
      bookings,
      draft,
      chat,
      signIn,
      signOut,
      updateUser,
      setSearch,
      addBooking,
      cancelBooking,
      markReviewed,
      setChat,
      resetChat,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppStore() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppStore phải được dùng bên trong AppStoreProvider");
  return ctx;
}

/** Lấy đơn theo id từ store (fallback về đơn đầu tiên nếu không thấy). */
export function useBookingById(id: string) {
  const { bookings } = useAppStore();
  return bookings.find((b) => b.id === id) ?? bookings[0]!;
}
