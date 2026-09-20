# Triển khai cổng giáo trình HOC-WEB2026 lên Netlify

## Cấu trúc trang truy cập

| Địa chỉ | Nội dung |
| --- | --- |
| `/` hoặc `/index.html` | Trang chủ giáo trình, tìm kiếm và lọc nội dung, tiến độ |
| `/lesson.html?id=concepts` | Tài liệu DIV, Box Model, Flexbox, CSS Grid và mô phỏng |
| `/lesson.html?id=guide` | Hướng dẫn Home/Login 16 bước |
| `/practice.html` | Đề bài, mã khởi động, checklist, gợi ý và đáp án tham khảo |
| `/lesson.html?id=demo-home` | Code mẫu Home hiển thị trong khung đọc |
| `/lesson.html?id=demo-login` | Code mẫu Login hiển thị trong khung đọc |

Các đường dẫn trỏ tới học liệu đã có sẵn trong repository. Trang chủ dùng CSS/JavaScript thuần, không cần bundler, framework, API hoặc tài khoản. **Chỉ website cổng học liệu dùng JavaScript** để lọc bài và lưu tiến độ bằng `localStorage`; bài tập Chương 2 của sinh viên vẫn chỉ dùng HTML/CSS.

## Cách A — Netlify kết nối GitHub (khuyên dùng)

1. Đưa toàn bộ các file mới `index.html`, `lesson.html`, `practice.html`, `404.html`, `netlify.toml`, `portal/` và `DEPLOY_NETLIFY.md` vào **thư mục gốc** repository `quanpl86/hocweb2026`. Không xóa tám thư mục học liệu hiện có.
2. Commit và push lên nhánh `main`.
3. Trong Netlify, tạo project mới từ repository GitHub `quanpl86/hocweb2026` (Import existing project / Deploy with Git).
4. Chọn nhánh `main`. Phần **Base directory** để trống, **Build command** để trống và **Publish directory** đặt `.` (thư mục gốc). File `netlify.toml` trong repository cũng đặt cấu hình publish `.`.
5. Deploy. Truy cập URL `https://<ten-site>.netlify.app/` để mở trang chủ giáo trình.
6. Với mỗi lần push nội dung lên `main`, nếu Netlify đã bật continuous deployment, Netlify sẽ tạo bản deploy mới.

## Cách B — Deploy thủ công

Giải nén bản ZIP đầy đủ và đưa **toàn bộ nội dung bên trong thư mục repository**, bao gồm `index.html`, `portal/` và tám thư mục học liệu, vào Netlify Drop. Không chỉ tải riêng file `index.html`: các trang học cần ảnh và file HTML nằm trong các thư mục khác.

## Kiểm tra sau deploy

- Trang `/` có giao diện giáo trình, danh sách 7 nội dung.
- Tìm kiếm “Flexbox” và bộ lọc “Mô phỏng” hoạt động.
- Mở “4 khái niệm”, khung nhúng hiển thị mô phỏng; nút “Mở trang gốc” mở học liệu độc lập.
- Mở bài Home/Login 16 bước: ảnh bước 01…16 hiển thị.
- Mở bài thực hành và tick thử checklist; tải lại trang sẽ giữ trạng thái nếu trình duyệt cho phép `localStorage`.
- Mở demo Home/Login để kiểm tra CSS và SVG vẫn hiển thị.
- Kiểm tra `/khong-ton-tai` hiển thị trang 404.

## Cách bổ sung bài học mới

1. Tạo file bài học `.html` trong `02-bai-hoc/` hoặc chuyên đề `01-ly-thuyet/`. Các file `.md` trên Netlify sẽ là văn bản thô, nên hãy tạo thêm trang HTML để học viên đọc thuận tiện.
2. Thêm một object vào mảng `HOCWEB_CATALOG` ở `portal/catalog.js`: `id` không trùng, `title`, `description`, `path`, `thumb`, `type`, `chapter`, `duration`, `level`, `focus`.
3. Bảo đảm `path` và `thumb` là đường dẫn nội bộ tính từ thư mục gốc. Khi bổ sung bài, danh sách, tìm kiếm, phân loại và trình xem bài tự nhận nội dung mới.
4. Push. Netlify sẽ deploy phiên bản mới nếu đã kết nối Git.

## Giới hạn có chủ đích

- Tiến độ và checklist lưu riêng trong từng trình duyệt, không đồng bộ sang thiết bị khác hoặc chấm điểm tự động.
- Những đường dẫn GitHub mở ra bên ngoài không phải trang học liệu nội bộ; nội dung `.md` chủ yếu để đọc ở GitHub.
- Không có form đăng nhập thật, nộp bài trực tuyến hoặc database. Muốn mở rộng chức năng đó cần thiết kế riêng về tài khoản, lưu trữ, quyền truy cập và dữ liệu.
- Repository public: không đưa thông tin cá nhân học sinh hoặc đáp án cần giữ riêng tư lên đây.
