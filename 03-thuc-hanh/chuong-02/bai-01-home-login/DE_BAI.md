# Đề bài thực hành — Chương 2: HTML/CSS/Layout Website

## Phạm vi
Dựng giao diện **Home** và **Login** phù hợp đề tài nhóm. Chỉ sử dụng HTML và CSS, bỏ qua responsive. Không cần chức năng thực, backend hoặc database.

## Yêu cầu Home
Header/logo; menu/navigation; banner/hero; thanh tìm kiếm; danh mục; sản phẩm/dịch vụ nổi bật; nội dung giới thiệu; khuyến mãi/thông báo; footer. Có thể điều chỉnh thành phần phù hợp đề tài theo hướng dẫn của giảng viên.

## Yêu cầu Login
Email/Username; Password; Remember me; Forgot password; nút Login. Tất cả là giao diện minh họa.

## Quy trình thực hiện (4 Giai đoạn từ số 0)

1. **Giai đoạn 1 – Thiết kế cấu trúc & Phác thảo Wireframe:**
   - Dùng công cụ **Wireframe Studio** trên trang thực hành (`practice.html`) để phác thảo bố cục trang Home và trang Login.
   - Xác định rõ vai trò ngữ nghĩa của từng vùng (`header`, `nav`, `section`, `form`, `footer`).
   - Phân tích quan hệ thẻ cha – con và đặt tên class BEM/ngữ nghĩa rõ ràng (`site-header`, `product-card`, `login-box`,...).

2. **Giai đoạn 2 – Dựng giao diện trang Home độc lập:**
   - Tạo `index.html` và viết toàn bộ CSS vào `home.css`.
   - Hoàn thiện Header, Hero banner, Grid danh mục/sản phẩm, Footer.

3. **Giai đoạn 3 – Dựng giao diện trang Login độc lập:**
   - Tạo `login.html` và viết toàn bộ CSS vào `login.css`.
   - Tái sử dụng cấu trúc Header/Footer từ Home, dựng form Login căn giữa màn hình (Flexbox).

4. **Giai đoạn 4 – Đối chiếu, phát hiện trùng lặp và Refactor CSS:**
   - Mở song song `home.css` và `login.css`, tìm các đoạn code giống nhau: reset CSS, font chữ, màu chủ đạo, header, footer, nút bấm (`.btn-primary`).
   - Tách các đoạn dùng chung sang `style.css`.
   - Hai trang sẽ nạp: `<link rel="stylesheet" href="style.css">` trước, sau đó mới nạp `home.css` hoặc `login.css` cho phần riêng biệt.

## Bài luyện vận dụng
1. Dùng `div` nhóm ba danh mục, đặt class cho phần tử cha/con.
2. Dùng Box Model tạo khoảng cách rõ ràng giữa nội dung thẻ và đường viền.
3. Dùng Flexbox bố trí logo bên trái, navigation bên phải.
4. Dùng Grid tạo danh mục ba cột và sản phẩm ba cột.
5. Dùng HTML form và CSS thiết kế trang Login.
6. Sử dụng Wireframe Studio để xuất bản vẽ mockup wireframe nộp kèm bài tập.

## Checklist đánh giá sản phẩm (10 tiêu chí)
- [ ] 1. **Bản vẽ Wireframe:** Đã hoàn thành sơ đồ wireframe cho cả Home và Login (dùng Wireframe Studio).
- [ ] 2. **Cấu trúc ngữ nghĩa HTML5:** Sử dụng đúng thẻ (`header`, `nav`, `main`, `section`, `footer`, `form`, `label`, `input`).
- [ ] 3. **Thành phần Home đầy đủ:** Header, Logo, Menu, Hero banner, Tìm kiếm, Grid danh mục & sản phẩm nổi bật, Giới thiệu, Footer.
- [ ] 4. **Thành phần Login đầy đủ:** Logo/Brand, Username/Email, Password, Remember me, Forgot password, Nút Submit.
- [ ] 5. **Bố cục Flexbox:** Áp dụng Flexbox cho Header (căn 2 đầu `justify-content: space-between`), căn giữa form Login.
- [ ] 6. **Bố cục Grid:** Áp dụng CSS Grid cho danh mục 3 cột và danh sách sản phẩm nổi bật.
- [ ] 7. **Kiến trúc CSS Refactor:** Đã tách CSS dùng chung vào `style.css` (reset, typography, header, footer, button), chỉ giữ CSS đặc thù trong `home.css` và `login.css`.
- [ ] 8. **Thứ tự nạp file CSS:** Cả 2 trang HTML đều nạp `style.css` trước, sau đó nạp file CSS riêng của trang.
- [ ] 9. **Vận hành Offline:** Tất cả file HTML, CSS mở trực tiếp trên trình duyệt ngoại tuyến không bị lỗi đường dẫn hình ảnh/style.
- [ ] 10. **Phạm vi kỹ thuật:** Tuân thủ chuẩn HTML5/CSS3 thuần desktop, không dùng JavaScript, không backend, không responsive phức tạp ngoài phạm vi Chương 2.
