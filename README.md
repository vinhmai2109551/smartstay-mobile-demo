# SmartStay AI Chat

VikaHotelTôi đang làm đồ án tốt nghiệp: SmartStay – nền tảng đặt phòng khách sạn/homestay tích hợp trợ lý AI (Chat-to-Book). Tôi cần bạn thiết kế giao diện MOBILE cho ứng dụng dành cho KHÁCH HÀNG (chưa cần backend thật, chỉ cần UI/UX prototype có thể click qua lại và dễ chỉnh sửa từng màn hình).

BƯỚC 1 - QUAN TRỌNG: Trước khi code, hãy đưa ra một PLAN gồm:

- Sơ đồ điều hướng (sitemap) toàn bộ app

- Danh sách màn hình và mục đích từng màn hình

- Cấu trúc navigation chính (bottom tab bar hay khác)

Trình bày plan này trước, để tôi xác nhận/chỉnh trước khi bạn dựng giao diện.

BỐI CẢNH SẢN PHẨM

SmartStay phục vụ 1 khách sạn/homestay đơn lẻ. Điểm nhấn là trợ lý AI cho phép khách chat tự nhiên để tìm phòng, hỏi chính sách và đặt phòng ngay trong hội thoại.

CÁC MÀN HÌNH CẦN CÓ (theo đúng nghiệp vụ Khách hàng)

1. Onboarding/Splash — giới thiệu ngắn gọn thương hiệu khách sạn

2. Đăng ký / Đăng nhập / Quên mật khẩu (có thể có nút "Đăng nhập với Google")

3. Trang chủ — banner tìm phòng theo ngày check-in/check-out + số khách, danh sách phòng nổi bật, khuyến mãi đang có

4. Tìm kiếm & danh sách phòng trống — bộ lọc (loại phòng, giá, tiện nghi), kết quả dạng card

5. Chi tiết phòng — ảnh gallery, tiện nghi, giá, chính sách hủy, đánh giá khách trước, nút "Đặt phòng" và nút "Hỏi AI về phòng này"

6. Đặt phòng — chọn dịch vụ đi kèm, nhập mã khuyến mãi, tóm tắt tổng tiền

7. Thanh toán — tích hợp PayOS/VietQR, trạng thái chờ thanh toán, xác nhận thành công/thất bại

8. Chat với AI (Chat-to-Book) — giao diện chat toàn màn hình, có thể đề xuất phòng dạng card ngay trong khung chat, hỗ trợ hoàn tất đặt phòng trong hội thoại

9. Lịch sử đặt phòng — danh sách đơn (sắp tới/đã qua/đã hủy), trạng thái thanh toán

10. Chi tiết đơn đặt phòng — mã đặt phòng, QR check-in, nút hủy phòng (nếu còn trong hạn), nút đánh giá sau khi trả phòng

11. Đánh giá khách sạn — form rating + nhận xét sau khi lưu trú

12. Hồ sơ cá nhân — thông tin tài khoản, đăng xuất

YÊU CẦU THIẾT KẾ

- Mobile-first, bottom tab bar (Trang chủ / Tìm phòng / Chat AI / Đơn của tôi / Hồ sơ)

- Phong cách: hiện đại, ấm áp, tin cậy (tông màu phù hợp ngành hospitality — có thể đề xuất palette cụ thể), tránh trông như template mặc định

- Nút "Chat AI" nên nổi bật vì đây là điểm khác biệt cốt lõi của sản phẩm

- Dùng component tái sử dụng (RoomCard, BookingStatusBadge, PriceSummary...) để tôi dễ chỉnh sửa từng phần sau này mà không phá layout tổng thể

- Toàn bộ text tiếng Việt

- Không cần kết nối API thật, dùng dữ liệu mẫu (mock data) là đủ ở giai đoạn này

Sau khi tôi duyệt plan, hãy dựng UI từng nhóm màn hình một (không dựng hết cùng lúc) để tôi review dễ hơn.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/2842091b-9970-4c9d-bc0f-23cd37cc2912).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
