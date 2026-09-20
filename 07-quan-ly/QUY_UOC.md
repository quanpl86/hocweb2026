# Quy ước quản lý HOC-WEB2026

## Nguyên tắc
- `main`: tài liệu đã duyệt cho người học; bài mới/sửa lớn làm ở nhánh `content/chuong-02-bai-xx`, tạo Pull Request trước khi merge.
- Đặt tên không dấu, chữ thường, gạch ngang; giữ mã bài ổn định (`bai-01`, `bai-02`).
- Mỗi bài học có `README.md` làm mục lục, mục tiêu, kiến thức mới (định nghĩa + ví dụ + bối cảnh), hướng dẫn từng bước, ảnh minh họa, thử thách, checklist.
- `03-thuc-hanh` là đề và mã khởi động; `04-code-mau` là tham khảo hoàn chỉnh. Không trộn đáp án vào starter.
- Mỗi dự án code mẫu là thư mục độc lập: đường dẫn tương đối chạy offline, không tham chiếu sang thư mục khác.
- Dự án Chương 2 chỉ HTML/CSS và layout desktop; mô phỏng bằng input/radio/CSS được dùng nhưng không dùng JavaScript.
- Kiểm tra tên file, liên kết, cú pháp HTML/CSS, ảnh, form demo, sự trùng lặp, quyền sử dụng ảnh trước khi phát hành.
- Với repo public, không đẩy `.env`, API keys, email hoặc dữ liệu cá nhân của học sinh lên GitHub.

## Chu trình duyệt
1. Viết một bài → 2. Tạo starter → 3. Tạo code mẫu → 4. Chụp minh họa → 5. Kiểm tra → 6. Tạo PR → 7. Duyệt và merge → 8. Cập nhật CHANGELOG.

## Commit convention
- `docs: ...` tài liệu; `feat: ...` bổ sung bài/code; `fix: ...` sửa lỗi; `assets: ...` ảnh; `chore: ...` cấu trúc.
