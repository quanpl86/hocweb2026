# Đề bài thực hành — Chương 2: HTML/CSS/Layout Website

## Phạm vi
Dựng giao diện **Home** và **Login** phù hợp đề tài nhóm. Chỉ sử dụng HTML và CSS, bỏ qua responsive. Không cần chức năng thực, backend hoặc database.

## Yêu cầu Home
Header/logo; menu/navigation; banner/hero; thanh tìm kiếm; danh mục; sản phẩm/dịch vụ nổi bật; nội dung giới thiệu; khuyến mãi/thông báo; footer. Có thể điều chỉnh thành phần phù hợp đề tài theo hướng dẫn của giảng viên.

## Yêu cầu Login
Email/Username; Password; Remember me; Forgot password; nút Login. Tất cả là giao diện minh họa.

## Chi tiết 10 bước thực hành (P01 – P10 qua 4 Chặng)

### Chặng A · Thiết kế (Design)
| Bước | Hành động của học viên | Sản phẩm kiểm chứng |
|---|---|---|
| **P01** | Đọc đề và lập bảng yêu cầu | Checklist phạm vi Home/Login |
| **P02** | Vẽ wireframe Home | Bản vẽ Wireframe Home (SVG/JSON/PNG) |
| **P03** | Vẽ wireframe Login | Bản vẽ Wireframe Login (SVG/JSON/PNG) |
| **P04** | Gán thẻ HTML, class, parent | Cây cấu trúc ngữ nghĩa DOM |
| **P05** | Xác định Flexbox / Grid | Bảng quy tắc bố cục |

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
