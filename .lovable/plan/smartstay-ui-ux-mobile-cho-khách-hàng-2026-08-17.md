# SmartStay — UI/UX Mobile cho Khách hàng

Prototype mobile-first, dữ liệu mẫu (mock), click qua lại được, chưa cần backend.

## 1. Sitemap

```text
SmartStay (mobile)
│
├── Splash / Onboarding            /            (3 slide giới thiệu → CTA)
├── Auth (không có tab bar)
│   ├── Đăng nhập                  /dang-nhap
│   ├── Đăng ký                    /dang-ky
│   └── Quên mật khẩu              /quen-mat-khau
│
└── App shell (bottom tab bar)
    ├── Trang chủ                  /trang-chu
    ├── Tìm phòng                  /tim-phong
    │   └── Chi tiết phòng         /phong/$id
    │       ├── Đặt phòng          /dat-phong/$id
    │       └── Thanh toán         /thanh-toan/$id
    │           └── Kết quả TT     /thanh-toan/$id/ket-qua
    ├── Chat AI  (nút giữa nổi)    /chat
    ├── Đơn của tôi                /don-cua-toi
    │   └── Chi tiết đơn           /don/$id
    │       └── Đánh giá           /danh-gia/$id
    └── Hồ sơ                      /ho-so
```

## 2. Danh sách màn hình & mục đích

| # | Màn hình | Mục đích chính |
|---|---|---|
| 1 | Splash/Onboarding | Giới thiệu thương hiệu, 3 slide (Phòng đẹp / AI đặt phòng / Thanh toán nhanh), CTA vào app |
| 2 | Đăng nhập | Email + mật khẩu, nút Google, link quên MK / đăng ký |
| 3 | Đăng ký | Họ tên, email, SĐT, mật khẩu |
| 4 | Quên mật khẩu | Nhập email → màn hình xác nhận đã gửi |
| 5 | Trang chủ | Banner hero + ô tìm phòng (check-in/out, số khách), phòng nổi bật, khuyến mãi, banner mời chat AI |
| 6 | Tìm phòng | Thanh tìm kiếm, bộ lọc (loại phòng, khoảng giá, tiện nghi), danh sách RoomCard |
| 7 | Chi tiết phòng | Gallery ảnh, giá, tiện nghi, chính sách hủy, đánh giá; sticky bar "Đặt phòng" + "Hỏi AI về phòng này" |
| 8 | Đặt phòng | Xác nhận ngày/khách, chọn dịch vụ đi kèm, mã khuyến mãi, PriceSummary |
| 9 | Thanh toán | Chọn PayOS/VietQR, hiển thị QR + đếm ngược, trạng thái chờ |
| 10 | Kết quả thanh toán | Thành công / Thất bại + hành động tiếp theo |
| 11 | Chat AI | Chat toàn màn hình, bong bóng hội thoại, RoomCard gợi ý trong chat, quick replies, nút đặt ngay trong chat |
| 12 | Đơn của tôi | Tab Sắp tới / Đã qua / Đã hủy, card đơn + BookingStatusBadge |
| 13 | Chi tiết đơn | Mã đặt phòng, QR check-in, thông tin phòng/tiền, nút Hủy phòng (nếu còn hạn), nút Đánh giá |
| 14 | Đánh giá | Chọn sao theo tiêu chí, nhận xét, gửi |
| 15 | Hồ sơ | Avatar, thông tin tài khoản, cài đặt, đăng xuất |

## 3. Navigation

- **Bottom tab bar 5 mục**: Trang chủ · Tìm phòng · **Chat AI** (nút tròn nổi giữa, màu nhấn + hiệu ứng glow) · Đơn của tôi · Hồ sơ.
- Tab bar ẩn ở: Splash/Onboarding, Auth, Đặt phòng, Thanh toán, Chat (chat full-screen), Đánh giá.
- Các màn hình con dùng header có nút back; luồng đặt phòng có stepper 3 bước (Chọn phòng → Đặt → Thanh toán).
- Khung máy: bố cục giới hạn chiều rộng ~430px, canh giữa, để xem tốt cả trên desktop.

## 4. Hệ thống thiết kế (đề xuất palette)

Hospitality ấm áp, hiện đại, tin cậy:

- Nền kem `#FBF7F1`, chữ than `#1F2421`
- Chính (xanh rừng sâu) `#14563F` — tin cậy, sang
- Nhấn (terracotta/hổ phách) `#D98149` — CTA, khuyến mãi
- AI accent (gradient xanh ngọc → hổ phách) cho nút Chat AI
- Trạng thái: xanh lá (đã xác nhận), hổ phách (chờ thanh toán), đỏ đất (đã hủy)
- Font: heading `Fraunces` (serif ấm), body `Plus Jakarta Sans`. Bo góc 16–20px, bóng mềm.

## 5. Component tái sử dụng

`AppShell` (khung mobile + tab bar), `ScreenHeader`, `RoomCard`, `BookingStatusBadge`, `PriceSummary`, `SearchBar`, `DateGuestPicker`, `FilterSheet`, `AmenityChip`, `RatingStars`, `PromoCard`, `ChatBubble`, `ChatRoomSuggestion`, `EmptyState`, `StepIndicator`, `QrTicket`.

Mock data tập trung trong `src/data/mock.ts` (phòng, tiện nghi, khuyến mãi, đơn, đánh giá, hội thoại mẫu) để dễ chỉnh.

## 6. Thứ tự dựng (từng nhóm để review)

1. **Nhóm A** — Design system + AppShell + tab bar + Splash/Onboarding + Auth (3 màn)
2. **Nhóm B** — Trang chủ + Tìm phòng + Chi tiết phòng
3. **Nhóm C** — Đặt phòng + Thanh toán + Kết quả
4. **Nhóm D** — Chat AI (Chat-to-Book)
5. **Nhóm E** — Đơn của tôi + Chi tiết đơn + Đánh giá + Hồ sơ

Sau mỗi nhóm sẽ dừng để bạn review trước khi làm nhóm tiếp theo.
