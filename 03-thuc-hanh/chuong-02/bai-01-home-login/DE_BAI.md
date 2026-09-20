# Đề bài thực hành — Chương 2: HTML/CSS/Layout Website

## Phạm vi
Dựng giao diện **Home** và **Login** phù hợp đề tài nhóm. Chỉ sử dụng HTML và CSS, bỏ qua responsive. Không cần chức năng thực, backend hoặc database.

## Yêu cầu Home
Header/logo; menu/navigation; banner/hero; thanh tìm kiếm; danh mục; sản phẩm/dịch vụ nổi bật; nội dung giới thiệu; khuyến mãi/thông báo; footer. Có thể điều chỉnh thành phần phù hợp đề tài theo hướng dẫn của giảng viên.

## Yêu cầu Login
Email/Username; Password; Remember me; Forgot password; nút Login. Tất cả là giao diện minh họa.

## Chi tiết 10 bước thực hành (P01 – P10 qua 4 Chặng)

### Chặng A · Thiết kế (Design)
> **Phương pháp cốt lõi:** `Xem mẫu → Phân tích bố cục → Vẽ từ trang trắng → Gán HTML/Class/Parent → Đối chiếu → Chỉnh sửa`.  
> Học sinh **không vẽ tự do bằng bút như Paint**, mà sử dụng thư viện component có sẵn để lắp ghép thành wireframe tương tự xây dựng bố cục bằng các khối kiến trúc.

| Bước | Hành động của học viên | Sản phẩm kiểm chứng |
|---|---|---|
| **P01** | Đọc đề và lập bảng yêu cầu | Checklist phạm vi Home/Login |
| **P02** | Vẽ wireframe Home từ trang trắng (theo thư viện component) | Bản vẽ Wireframe Home (SVG/JSON/PNG) |
| **P03** | Vẽ wireframe Login từ trang trắng (căn giữa 100vh) | Bản vẽ Wireframe Login (SVG/JSON/PNG) |
| **P04** | Gán thẻ HTML, class và thiết lập **Parent (Phần tử cha)** | Cây cấu trúc ngữ nghĩa DOM |
| **P05** | Xác định Flexbox / Grid | Bảng quy tắc bố cục |

#### Ví dụ mẫu: Học sinh thực sự vẽ phần Header như thế nào?
1. **Quan sát mẫu:** Header bao ngoài, Container ở trong, Container chứa Logo (trái) và Menu/Login (phải).
2. **Chọn component Header:** Thêm khối `Header` từ thư viện vào Canvas ở đầu trang.
3. **Thêm Container:** Đưa khối `Container` vào trong Header (giới hạn 1100px, `margin: 0 auto`).
4. **Thêm Logo và Navigation:** Logo đặt bên trái, Menu đặt bên phải (Flexbox `space-between`).
5. **Gán thẻ, class và Parent:**
   - Header: thẻ `header`, class `site-header`, Parent: `Trang`.
   - Container: thẻ `div`, class `container header-content`, Parent: `Header`.
   - Logo: thẻ `a`, class `brand`, Parent: `Container`.
   - Menu: thẻ `nav`, class `main-nav`, Parent: `Container`.
   *(Lưu ý: Đặt khối nằm trong nhau và thiết lập Parent là 2 thao tác kiểm tra riêng biệt).*

#### Thứ tự dựng Wireframe toàn bộ Home & Login
- **Trang Home (Vùng lớn trước, nhỏ sau):**
  1. `HEADER`: Logo + Menu điều hướng
  2. `HERO`: Tiêu đề, CTA + Ảnh banner 2 cột
  3. `SEARCH`: Tiêu đề + Ô tìm kiếm + Nút tìm kiếm
  4. `CATEGORY`: 3 Thẻ danh mục (CSS Grid)
  5. `COURSES`: 3 Thẻ khóa học (Dựng 1 card rồi dùng tính năng *Duplicate*)
  6. `ABOUT`: Giới thiệu website + Hình minh họa
  7. `NOTICE`: Thông báo ưu đãi + Nút xem chi tiết
  8. `FOOTER`: Thông tin bản quyền & liên hệ
- **Trang Login (3 Bước):**
  1. `main.login-layout`: Căn giữa toàn màn hình (100vh flexbox).
  2. `div.login-card`: Hộp đăng nhập cố định 440px.
  3. `form.login-form`: Logo → Tiêu đề H1 → Input Email/User, Password → Checkbox Ghi nhớ & Quên mk → Button 100%.

#### Ba mức hỗ trợ học tập trong Practice
- **Mức 1 – Có hướng dẫn:** Lần đầu sử dụng editor; khám phá mẫu và làm theo chỉ dẫn từng bước.
- **Mức 2 – Hoàn thiện bản vẽ:** Đã hiểu thao tác cơ bản; nạp khung sườn mẫu cơ bản để tự bổ sung các khối con còn thiếu.
- **Mức 3 – Tự thiết kế (Trang trắng):** Thực hành độc lập; nhận trang trắng và đề bài đầy đủ, tự phân tích, lắp ghép, gán thẻ và class, đối chiếu với mẫu.

#### Sản phẩm nộp sau Chặng A
1. Bản vẽ wireframe Home (PNG hoặc SVG)
2. Bản vẽ wireframe Login (PNG hoặc SVG)
3. Cây cấu trúc HTML, thẻ ngữ nghĩa, class và quan hệ cha–con (Parent)
4. File `wireframes-edushop.json` xuất từ editor.

### Chặng B · Lập trình (Development)
| Bước | Hành động của học viên | Sản phẩm kiểm chứng |
|---|---|---|
| **P06** | Dựng giao diện trang Home độc lập | `index.html` và `home.css` hoàn chỉnh |
| **P07** | Dựng giao diện trang Login độc lập | `login.html` và `login.css` hoàn chỉnh |

### Chặng C · Tái cấu trúc (Refactoring)
| Bước | Hành động của học viên | Sản phẩm kiểm chứng |
|---|---|---|
| **P08** | So sánh CSS hai trang | Bảng phân loại: Chung / Riêng Home / Riêng Login |
| **P09** | Tách CSS chung | `style.css` dùng chung, liên kết trước file riêng |

### Chặng D · Đánh giá & Hoàn thành (Completion)
| Bước | Hành động của học viên | Sản phẩm kiểm chứng |
|---|---|---|
| **P10** | Kiểm thử hồi quy và đối chiếu | Website hai trang đạt chuẩn 100% đề bài |

## Checklist đánh giá sản phẩm (10 tiêu chí P01 – P10)
- [ ] P01: Đã lập bảng phân tích yêu cầu 8 vùng Home và hộp Login.
- [ ] P02: Đã hoàn thành bản vẽ wireframe Home (trên Wireframe Studio).
- [ ] P03: Đã hoàn thành bản vẽ wireframe Login (trên Wireframe Studio).
- [ ] P04: Gán đúng thẻ HTML5 ngữ nghĩa (`header`, `nav`, `section`, `article`, `form`, `footer`).
- [ ] P05: Xác định đúng vị trí cha dùng Flexbox (`space-between`, căn giữa) và CSS Grid (3 cột).
- [ ] P06: Dựng xong `index.html` và `home.css` độc lập, hiển thị đúng đề.
- [ ] P07: Dựng xong `login.html` và `login.css` độc lập, căn giữa 100vh.
- [ ] P08: Đã lập bảng so sánh CSS phát hiện các khai báo lặp lại.
- [ ] P09: Đã tách `style.css` dùng chung (reset, typography, button, container) và nạp trước file riêng.
- [ ] P10: Đã kiểm thử hồi quy, mở offline không lỗi đường dẫn và nộp bài.
