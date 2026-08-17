import heroImg from "@/assets/hero-hotel.jpg";
import roomDeluxe from "@/assets/room-deluxe.jpg";
import roomSuite from "@/assets/room-suite.jpg";
import roomGarden from "@/assets/room-garden.jpg";
import roomDorm from "@/assets/room-dorm.jpg";

export const hotel = {
  name: "SmartStay Vika Hotel",
  tagline: "Homestay ven biển Đà Nẵng",
  address: "128 Võ Nguyên Giáp, Sơn Trà, Đà Nẵng",
  rating: 4.8,
  reviewCount: 236,
  hero: heroImg,
};

export type Amenity = { id: string; label: string };

export const amenities: Amenity[] = [
  { id: "wifi", label: "Wifi miễn phí" },
  { id: "ac", label: "Điều hoà" },
  { id: "breakfast", label: "Bữa sáng" },
  { id: "pool", label: "Hồ bơi" },
  { id: "parking", label: "Chỗ đậu xe" },
  { id: "seaview", label: "View biển" },
  { id: "kitchen", label: "Bếp riêng" },
  { id: "workspace", label: "Bàn làm việc" },
];

export type Room = {
  id: string;
  name: string;
  type: "Phòng đôi" | "Suite" | "Bungalow" | "Phòng tập thể";
  price: number;
  oldPrice?: number;
  size: number;
  maxGuests: number;
  beds: string;
  rating: number;
  reviewCount: number;
  images: string[];
  amenities: string[];
  description: string;
  cancelPolicy: string;
  available: number;
  tag?: string;
};

export const rooms: Room[] = [
  {
    id: "deluxe-sea",
    name: "Deluxe View Biển",
    type: "Phòng đôi",
    price: 1250000,
    oldPrice: 1600000,
    size: 32,
    maxGuests: 2,
    beds: "1 giường King",
    rating: 4.9,
    reviewCount: 87,
    images: [roomDeluxe, roomSuite, roomGarden],
    amenities: ["wifi", "ac", "breakfast", "seaview", "workspace"],
    description:
      "Phòng rộng rãi với ban công hướng biển, ánh sáng tự nhiên và nội thất gỗ ấm áp. Phù hợp cho cặp đôi hoặc chuyến công tác ngắn ngày.",
    cancelPolicy: "Miễn phí huỷ trước 48 giờ so với giờ nhận phòng.",
    available: 3,
    tag: "Bán chạy",
  },
  {
    id: "family-suite",
    name: "Suite Gia Đình",
    type: "Suite",
    price: 2150000,
    size: 52,
    maxGuests: 4,
    beds: "1 King + 2 đơn",
    rating: 4.8,
    reviewCount: 54,
    images: [roomSuite, roomDeluxe, roomGarden],
    amenities: ["wifi", "ac", "breakfast", "pool", "kitchen", "parking"],
    description:
      "Không gian hai phòng ngủ liền kề với khu bếp nhỏ, thích hợp cho gia đình có trẻ em hoặc nhóm bạn 4 người.",
    cancelPolicy: "Miễn phí huỷ trước 72 giờ. Sau đó thu 50% giá trị đơn.",
    available: 2,
    tag: "Gia đình",
  },
  {
    id: "garden-bungalow",
    name: "Bungalow Vườn",
    type: "Bungalow",
    price: 1680000,
    size: 40,
    maxGuests: 3,
    beds: "1 Queen + 1 sofa bed",
    rating: 4.7,
    reviewCount: 41,
    images: [roomGarden, roomDeluxe, roomSuite],
    amenities: ["wifi", "ac", "pool", "parking", "kitchen"],
    description:
      "Căn bungalow tách biệt giữa vườn nhiệt đới, hiên riêng và lối đi thẳng ra hồ bơi.",
    cancelPolicy: "Miễn phí huỷ trước 24 giờ so với giờ nhận phòng.",
    available: 1,
    tag: "Yên tĩnh",
  },
  {
    id: "shared-dorm",
    name: "Dorm 6 Giường",
    type: "Phòng tập thể",
    price: 320000,
    size: 28,
    maxGuests: 1,
    beds: "1 giường tầng trong phòng 6",
    rating: 4.5,
    reviewCount: 54,
    images: [roomDorm, roomGarden, roomDeluxe],
    amenities: ["wifi", "ac", "breakfast", "workspace"],
    description:
      "Lựa chọn tiết kiệm cho khách đi một mình, có tủ khoá riêng và khu sinh hoạt chung sôi động.",
    cancelPolicy: "Miễn phí huỷ trước 12 giờ so với giờ nhận phòng.",
    available: 5,
  },
];

export const promos = [
  {
    id: "summer",
    code: "SUMMER25",
    title: "Giảm 25% kỳ nghỉ hè",
    desc: "Áp dụng cho đặt phòng từ 2 đêm trở lên",
    discount: 0.25,
  },
  {
    id: "earlybird",
    code: "SOMSOM",
    title: "Đặt sớm giảm 15%",
    desc: "Đặt trước 14 ngày để nhận ưu đãi",
    discount: 0.15,
  },
  {
    id: "longstay",
    code: "STAY7",
    title: "Ở 7 đêm chỉ trả 6",
    desc: "Tặng 1 đêm cho kỳ lưu trú dài",
    discount: 0.14,
  },
];

export const extraServices = [
  { id: "breakfast", label: "Bữa sáng buffet", desc: "2 suất/ngày", price: 180000 },
  { id: "airport", label: "Đưa đón sân bay", desc: "Xe 4 chỗ, 1 chiều", price: 250000 },
  { id: "latecheckout", label: "Trả phòng muộn", desc: "Đến 15:00", price: 150000 },
  { id: "spa", label: "Massage thư giãn", desc: "60 phút cho 1 người", price: 400000 },
];

export type BookingStatus = "confirmed" | "pending" | "completed" | "cancelled";

export type Booking = {
  id: string;
  code: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  total: number;
  status: BookingStatus;
  paid: boolean;
  reviewed: boolean;
  group: "upcoming" | "past" | "cancelled";
};

export const bookings: Booking[] = [
  {
    id: "bk1",
    code: "SS-8FK2QD",
    roomId: "deluxe-sea",
    checkIn: "22/08/2026",
    checkOut: "25/08/2026",
    nights: 3,
    guests: 2,
    total: 3930000,
    status: "confirmed",
    paid: true,
    reviewed: false,
    group: "upcoming",
  },
  {
    id: "bk2",
    code: "SS-1QW7ZA",
    roomId: "family-suite",
    checkIn: "05/09/2026",
    checkOut: "07/09/2026",
    nights: 2,
    guests: 4,
    total: 4300000,
    status: "pending",
    paid: false,
    reviewed: false,
    group: "upcoming",
  },
  {
    id: "bk3",
    code: "SS-4TR9PL",
    roomId: "garden-bungalow",
    checkIn: "12/05/2026",
    checkOut: "14/05/2026",
    nights: 2,
    guests: 2,
    total: 3360000,
    status: "completed",
    paid: true,
    reviewed: false,
    group: "past",
  },
  {
    id: "bk4",
    code: "SS-6HJ3XN",
    roomId: "shared-dorm",
    checkIn: "02/03/2026",
    checkOut: "04/03/2026",
    nights: 2,
    guests: 1,
    total: 640000,
    status: "cancelled",
    paid: false,
    reviewed: false,
    group: "cancelled",
  },
];

export const reviews = [
  {
    id: "rv1",
    name: "Nguyễn Minh Anh",
    date: "Tháng 7, 2026",
    rating: 5,
    content:
      "Phòng sạch, view biển đúng như hình. Lễ tân hỗ trợ nhiệt tình, bữa sáng ngon. Chắc chắn sẽ quay lại!",
  },
  {
    id: "rv2",
    name: "Trần Quốc Bảo",
    date: "Tháng 6, 2026",
    rating: 4,
    content:
      "Vị trí thuận tiện, đi bộ 3 phút ra biển. Buổi tối hơi ồn một chút nhưng tổng thể rất đáng tiền.",
  },
  {
    id: "rv3",
    name: "Lê Thu Hà",
    date: "Tháng 6, 2026",
    rating: 5,
    content: "Trợ lý AI trả lời nhanh, đặt phòng chỉ mất 2 phút. Trải nghiệm rất mượt.",
  },
];

export const formatVnd = (value: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 })
    .format(value)
    .replace(/\s/g, " ");

export const getRoom = (id: string): Room => rooms.find((r) => r.id === id) ?? rooms[0]!;
export const getBooking = (id: string): Booking => bookings.find((b) => b.id === id) ?? bookings[0]!;
export const amenityLabel = (id: string) =>
  amenities.find((a) => a.id === id)?.label ?? id;
