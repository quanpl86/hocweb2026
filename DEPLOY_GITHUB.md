# Đưa trọn bộ HOC-WEB2026 lên GitHub

**Trạng thái:** Tệp trong gói ZIP được chuẩn bị cục bộ. Kết nối GitHub trong ChatGPT đọc được repository nhưng hiện trả về HTTP 403 khi tạo file; vì vậy **không có nội dung nào được đăng lên GitHub qua kết nối này**. Hướng dẫn dưới đây giúp chủ repository phát hành bằng tài khoản Git trên máy của mình.

Repository đích: https://github.com/quanpl86/hocweb2026 (public). **Không đưa dữ liệu học sinh, tài khoản, API key, đáp án cần giữ riêng lên kho công khai.** Gói hiện tại chứa hướng dẫn và mã mẫu có chủ đích công khai; thư mục `05-dap-an-giao-vien` chỉ là thông báo về bảo mật.

## Cách dễ nhất, không cần Terminal: GitHub Desktop

1. Giải nén `HOCWEB2026_GitHub_Ready.zip` trên máy tính. Bên trong có thư mục `hocweb2026/` chứa README.md và các thư mục `00-...` đến `07-...`.
2. Mở GitHub Desktop, đăng nhập đúng tài khoản `quanpl86`.
3. Chọn **File → Add local repository → Choose...** và chọn thư mục `hocweb2026` vừa giải nén. Nếu báo thư mục chưa có Git, chọn **Create a repository here** (khởi tạo tại chính thư mục đó).
4. Kiểm tra tất cả file cần đăng trong thẻ **Changes**; tạo commit: `feat: initialize organized HTML CSS teaching materials`.
5. Trước khi Publish, kiểm tra repository `quanpl86/hocweb2026` có **trống**. Trong GitHub Desktop, thêm remote `https://github.com/quanpl86/hocweb2026.git` nếu cần; sau đó Push lên `main`. Nếu app yêu cầu tạo một remote mới hoặc báo remote đã có lịch sử riêng, **dừng, không tạo repo trùng hoặc force push**; dùng cách Terminal bên dưới trên repository trống, hoặc clone repo trước nếu đã có commit.
6. Mở URL repository kiểm tra `README.md`, thư mục và ví dụ.

## Cách Terminal trên macOS / Linux (repo đích phải trống)

Điều kiện: đã cài Git, đã thiết lập đăng nhập GitHub trên máy và có quyền push. Trong Terminal, đi tới thư mục `hocweb2026` sau khi giải nén:

```bash
# Chỉ cần thiết lập 1 lần trên máy nếu chưa có tên/email tác giả Git.
git config --global user.name "Ten cua ban"
git config --global user.email "email-GitHub-noreply-cua-ban"

bash scripts/push-initial.sh
```

Script sẽ kiểm tra repository đích có nhánh chưa; nếu đã có nội dung sẽ **dừng**, không ghi đè. Nếu thiếu quyền push, commit vẫn chỉ nằm trên máy và lệnh push sẽ báo lỗi.

## Cách PowerShell trên Windows (repo đích phải trống)

Trong PowerShell, mở tại thư mục `hocweb2026` vừa giải nén:

```powershell
git config --global user.name "Ten cua ban"
git config --global user.email "email-GitHub-noreply-cua-ban"

powershell -ExecutionPolicy Bypass -File .\scripts\push-initial.ps1
```

`-ExecutionPolicy Bypass` áp dụng cho tiến trình vừa chạy, không thay đổi chính sách lâu dài. Chỉ chạy script có nguồn đáng tin cậy; bạn có thể đọc nội dung script trước khi chạy.

Nếu Git hỏi xác thực, sử dụng đăng nhập GitHub qua Git Credential Manager hoặc `gh auth login` nếu đã cài GitHub CLI. Không gõ password GitHub vào mã nguồn hay lưu token vào repository.

## Kiểm tra sau khi push

- Mở https://github.com/quanpl86/hocweb2026, nhánh `main` có README và thư mục 00–07.
- Mở `02-bai-hoc/chuong-02-layout/bai-01-home-login/README.md` rồi tải repo về, mở file hướng dẫn HTML offline để xem hình.
- Mở `04-code-mau/chuong-02/home-login/index.html` bằng trình duyệt để xem Home; mở `login.html` để xem form tĩnh.
- Học sinh bắt đầu từ `00-huong-dan-bat-dau/README.md`; bài tập ở `03-thuc-hanh/`, tham khảo cuối cùng tại `04-code-mau/`.

**Sau khi publish:** cập nhật `07-quan-ly/KE_HOACH.md` và `07-quan-ly/CHANGELOG.md` để đánh dấu đã xuất bản, kiểm tra liên kết trên GitHub. Không sửa trạng thái thành đã publish trước khi push thành công.
