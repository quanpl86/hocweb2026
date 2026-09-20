/* Danh mục bài học HOC-WEB2026. Chuẩn hóa theo Flow mới: Đề bài → Wireframe → HTML → Class/Bố cục → Code → Refactor → Kiểm thử */
window.HOCWEB_CATALOG = [
  {
    id: 'start', chapter: '00', stage: 'LÝ THUYẾT QUY TRÌNH', title: 'Bắt đầu: Từ đề bài đến website',
    description: 'Học cách đọc đề bài EduShop, phân tích layout, đọc wireframe, phân bổ HTML Semantic và tiếp cận CSS Refactor.',
    duration: '25 phút', level: 'Nhập môn', type: 'guide', icon: 'compass',
    path: '00-huong-dan-bat-dau/QUY_TRINH_THIET_KE.html',
    focus: 'Quy trình 7 bước · Tư duy thiết kế', thumb: 'portal/wireframes/home-reference.png'
  },
  {
    id: 'semantic', chapter: '01', stage: 'KIẾN THỨC CẤU TRÚC', title: 'DIV, Section, Container & HTML Semantic',
    description: 'Phân biệt bản chất giữa thẻ ngữ nghĩa (<section>, <article>, <nav>, <form>), thẻ gom bố cục (<div>) và class utility (.container).',
    duration: '30 phút', level: 'Nền tảng', type: 'guide', icon: 'layers',
    path: '01-ly-thuyet/css/bon-khai-niem/HUONG_DAN_TUONG_TAC.html',
    focus: 'HTML5 Semantic · Box Model', thumb: '01-ly-thuyet/css/bon-khai-niem/images/01-div.png'
  },
  {
    id: 'layout-tools', chapter: '02', stage: 'KIẾN THỨC BỐ CỤC', title: 'Box Model, Flexbox và CSS Grid',
    description: 'Khám phá công cụ bố cục 1 chiều (Flexbox) cho Header/Hero và bố cục lưới 2 chiều (CSS Grid) cho danh mục và thẻ sản phẩm.',
    duration: '35 phút', level: 'Nền tảng', type: 'interactive', icon: 'monitor',
    path: 'player.html',
    focus: 'Mô phỏng · Motion Video · Thực hành Flexbox/Grid', thumb: 'lessons/web-flexbox-01/assets/images/flexbox.svg'
  },
  {
    id: 'wireframe-analysis', chapter: '03', stage: 'PHÂN TÍCH MẪU', title: 'Phân tích đề và đọc wireframe Home/Login',
    description: 'Phân tích chi tiết 8 khu vực A–H của trang Home và hộp đăng nhập I–L căn giữa của trang Login từ bản vẽ EduShop.',
    duration: '20 phút', level: 'Mẫu phân tích', type: 'guide', icon: 'book',
    path: '02-bai-hoc/chuong-02-layout/bai-01-home-login/HUONG_DAN_CHI_TIET.html',
    focus: 'Đọc bản vẽ · Mã vùng A–H, I–L', thumb: 'portal/wireframes/login-reference.png'
  },
  {
    id: 'practice-wireframe', chapter: '04', stage: 'THỰC HÀNH THIẾT KẾ', title: 'Vẽ wireframe Home và Login (Chặng A)',
    description: 'Tự tay dùng Wireframe Studio phác thảo bố cục trang Home & Login, căn chỉnh kích thước 1100px, xuất file SVG/JSON.',
    duration: '45 phút', level: 'Thực hành', type: 'practice', icon: 'check',
    path: 'practice.html#stage-a',
    focus: 'P01–P03 · Wireframe Studio', thumb: 'portal/wireframes/home-reference.png'
  },
  {
    id: 'practice-structure', chapter: '05', stage: 'THỰC HÀNH CẤU TRÚC', title: 'Phân rã HTML và đặt tên class (Chặng A)',
    description: 'Xây dựng cây DOM cha–con, gán thẻ ngữ nghĩa bằng Inspector và chọn Flexbox/Grid cho từng thành phần.',
    duration: '30 phút', level: 'Thực hành', type: 'practice', icon: 'check',
    path: 'practice.html#stage-a',
    focus: 'P04–P05 · Inspector thẻ & class', thumb: '02-bai-hoc/chuong-02-layout/bai-01-home-login/images/05-so-do-home.png'
  },
  {
    id: 'practice-home', chapter: '06', stage: 'THỰC HÀNH CODE', title: 'Lập trình Home: index.html & home.css (Chặng B)',
    description: 'Lấy mã khởi động, viết toàn bộ Header, Hero, Category Grid, Product Grid và Footer vào file home.css độc lập.',
    duration: '60 phút', level: 'Lập trình', type: 'practice', icon: 'code',
    path: 'practice.html#stage-b',
    focus: 'P06 · Code Home độc lập', thumb: '01-ly-thuyet/css/bon-khai-niem/images/07-home-thanh-pham.png'
  },
  {
    id: 'practice-login', chapter: '07', stage: 'THỰC HÀNH CODE', title: 'Lập trình Login: login.html & login.css (Chặng B)',
    description: 'Xây dựng hộp đăng nhập 440px căn giữa toàn màn hình 100vh với form, input và các tùy chọn vào file login.css riêng.',
    duration: '45 phút', level: 'Lập trình', type: 'practice', icon: 'code',
    path: 'practice.html#stage-b',
    focus: 'P07 · Code Login độc lập', thumb: '01-ly-thuyet/css/bon-khai-niem/images/08-login-thanh-pham.png'
  },
  {
    id: 'practice-refactor', chapter: '08', stage: 'CẢI TIẾN MÃ NGUỒN', title: 'Refactoring: CSS dùng chung (Chặng C)',
    description: 'Đặt song song hai file CSS, phát hiện mã trùng lặp nền tảng và tách thành style.css dùng chung theo thứ tự nạp chuẩn.',
    duration: '40 phút', level: 'Tối ưu hóa', type: 'practice', icon: 'layers',
    path: 'practice.html#stage-c',
    focus: 'P08–P09 · Tách style.css', thumb: '01-ly-thuyet/css/bon-khai-niem/images/03-flexbox.png'
  },
  {
    id: 'practice-test', chapter: '09', stage: 'ĐÁNH GIÁ', title: 'Kiểm thử và hoàn thiện (Chặng D)',
    description: 'Kiểm thử hồi quy: đối chiếu giao diện trước và sau refactor, rà soát phiếu 10 tiêu chí P01–P10 và xuất sản phẩm.',
    duration: '25 phút', level: 'Đánh giá', type: 'practice', icon: 'check',
    path: 'practice.html#stage-d',
    focus: 'P10 · Kiểm thử hồi quy & nộp bài', thumb: '02-bai-hoc/chuong-02-layout/bai-01-home-login/images/06-so-do-login.png'
  },
  {
    id: 'demo-samples', chapter: '10', stage: 'THAM KHẢO SAU THỰC HÀNH', title: 'Website mẫu Home & Login hoàn chỉnh',
    description: 'Đối chiếu giải pháp với mã nguồn chuẩn của EduShop sau khi đã tự tay hoàn thành các chặng thực hành.',
    duration: '15 phút', level: 'Tham khảo', type: 'demo', icon: 'monitor',
    path: '04-code-mau/chuong-02/home-login/index.html',
    focus: 'Mã nguồn chuẩn EduShop', thumb: '01-ly-thuyet/css/bon-khai-niem/images/07-home-thanh-pham.png'
  }
];
window.HOCWEB_PATH_KEY = 'hocweb2026.completed.v1';
