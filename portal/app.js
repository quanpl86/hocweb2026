(() => {
  'use strict';
  const courses = window.HOCWEB_CATALOG || [];
  const key = window.HOCWEB_PATH_KEY;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const complete = () => {
    try {
      const stored = JSON.parse(localStorage.getItem(key) || '[]');
      return Array.isArray(stored) ? stored.filter(id => courses.some(c => c.id === id)) : [];
    } catch (_) { return []; }
  };
  const store = ids => {
    try { localStorage.setItem(key, JSON.stringify(ids)); } catch (_) { /* Chế độ riêng tư có thể chặn lưu trữ. */ }
  };
  const icon = name => ({compass:'✧',layers:'▦',book:'▤',check:'✓',monitor:'▣',lock:'◈',code:'⌘'})[name] || '○';
  const destination = course => {
    if (course.path && (course.path.startsWith('practice.html') || course.path.startsWith('player.html'))) {
      return course.path;
    }
    return course.type === 'practice' ? 'practice.html' : (course.type === 'video-interactive' ? 'player.html' : `lesson.html?id=${encodeURIComponent(course.id)}`);
  };
  const progress = () => {
    const n = complete().length, total = courses.length;
    $$('.js-progress-count').forEach(node => node.textContent = `${n}/${total}`);
    $$('.js-progress-percent').forEach(node => node.textContent = `${Math.round(n / total * 100)}%`);
    $$('.js-progress-bar').forEach(node => node.style.width = `${n / total * 100}%`);
    const next = courses.find(course => !complete().includes(course.id)) || courses[0];
    const nextLink = $('#next-lesson');
    if (nextLink) { nextLink.href = destination(next); $('#next-title').textContent = complete().length === total ? 'Ôn lại giáo trình' : next.title; }
  };
  const card = course => {
    const node = document.createElement('article');
    node.className = 'course-card';
    node.dataset.type = course.type;
    node.dataset.search = `${course.title} ${course.description} ${course.stage} ${course.level}`.toLocaleLowerCase('vi');
    const isDone = complete().includes(course.id);
    node.innerHTML = `
      <a class="card-preview" href="${destination(course)}" aria-label="Mở ${course.title}">
        <img src="${course.thumb}" alt="Ảnh minh họa: ${course.title}" loading="lazy">
        <span class="chapter-tag">CHƯƠNG ${course.chapter}</span>
      </a>
      <div class="card-content">
        <div class="card-eyebrow"><span class="lesson-icon" aria-hidden="true">${icon(course.icon)}</span> ${course.stage}</div>
        <h3><a href="${destination(course)}">${course.title}</a></h3>
        <p>${course.description}</p>
        <div class="card-meta"><span>◷ ${course.duration}</span><span>◇ ${course.level}</span></div>
        <div class="card-footer"><a class="card-open" href="${destination(course)}">${isDone ? 'Xem lại bài' : 'Mở nội dung'} <span aria-hidden="true">↗</span></a><span class="done-indicator ${isDone ? 'is-done' : ''}">${isDone ? '✓ Đã học' : 'Chưa học'}</span></div>
      </div>`;
    return node;
  };
  const initHome = () => {
    const grid = $('#courses-grid');
    if (!grid) return;
    courses.forEach(c => grid.append(card(c)));
    const search = $('#course-search');
    const chips = $$('.filter-chip');
    let selected = 'all';
    const filter = () => {
      const query = (search.value || '').trim().toLocaleLowerCase('vi');
      let visible = 0;
      $$('.course-card', grid).forEach(node => {
        const matches = (selected === 'all' || node.dataset.type === selected) && node.dataset.search.includes(query);
        node.hidden = !matches;
        if (matches) visible++;
      });
      $('#result-count').textContent = `${visible} nội dung`;
      $('#empty-state').hidden = visible !== 0;
    };
    search.addEventListener('input', filter);
    chips.forEach(chip => chip.addEventListener('click', () => {
      chips.forEach(c => { c.classList.toggle('active', c === chip); c.setAttribute('aria-pressed', String(c === chip)); });
      selected = chip.dataset.filter;
      filter();
    }));
    progress();
    filter();
  };
  const initLesson = () => {
    const frame = $('#lesson-frame');
    if (!frame) return;
    const id = new URLSearchParams(location.search).get('id');
    const course = courses.find(c => c.id === id && c.type !== 'practice');
    if (!course) { $('#lesson-main').innerHTML = '<div class="not-found"><h1>Không tìm thấy bài học</h1><p>Hãy quay lại trang chủ để chọn nội dung có sẵn.</p><a class="btn primary" href="index.html">Về trang chủ</a></div>'; return; }
    document.title = `${course.title} | HOC-WEB2026`;
    $('#lesson-title').textContent = course.title;
    $('#lesson-type').textContent = course.stage;
    $('#lesson-description').textContent = course.description;
    $('#lesson-focus').textContent = course.focus;
    frame.title = `Nội dung bài học: ${course.title}`;
    frame.src = course.path;
    $('#open-original').href = course.path;
    $('#open-original').target = '_blank';
    $('#open-original').rel = 'noopener';
    const position = courses.findIndex(c => c.id === course.id);
    const prev = courses[position - 1], next = courses[position + 1];
    const previous = $('#prev-lesson'), following = $('#following-lesson');
    if (prev) { previous.href = destination(prev); previous.hidden = false; previous.title = prev.title; } else previous.hidden = true;
    if (next) { following.href = destination(next); following.hidden = false; following.title = next.title; } else following.hidden = true;
    const btn = $('#complete-lesson');
    const refresh = () => { const done = complete().includes(course.id); btn.textContent = done ? '✓ Đã hoàn thành · bỏ đánh dấu' : '✓ Đánh dấu đã học'; btn.setAttribute('aria-pressed', String(done)); };
    btn.addEventListener('click', () => { const ids = complete(); store(ids.includes(course.id) ? ids.filter(x => x !== course.id) : [...ids, course.id]); refresh(); });
    refresh();
    const focusBtn = $('#toggle-focus-mode');
    if (focusBtn) {
      const expandSvg = '<svg class="focus-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>';
      const collapseSvg = '<svg class="focus-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 14h6v6M20 10h-6V4M14 10l7-7M10 14l-7 7"/></svg>';
      const setFocus = (active) => {
        document.body.classList.toggle('focus-mode', active);
        focusBtn.setAttribute('aria-pressed', String(active));
        focusBtn.classList.toggle('active', active);
        focusBtn.innerHTML = active
          ? `${collapseSvg}<span class="focus-text">Thu nhỏ (Esc)</span>`
          : `${expandSvg}<span class="focus-text">Chế độ tập trung</span>`;
        focusBtn.title = active ? 'Thu nhỏ lại về giao diện chuẩn (Phím tắt: Esc)' : 'Chế độ tập trung: Mở rộng tối đa màn hình (Phím tắt: Esc)';
        try { sessionStorage.setItem('hocweb2026.focus_mode', active ? '1' : '0'); } catch (_) {}
      };
      focusBtn.addEventListener('click', () => {
        setFocus(!document.body.classList.contains('focus-mode'));
      });
      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && document.body.classList.contains('focus-mode')) {
          setFocus(false);
        }
      });
      try {
        if (sessionStorage.getItem('hocweb2026.focus_mode') === '1') setFocus(true);
      } catch (_) {}
    }
    const nav = $('#lesson-list');
    courses.forEach(c => { const a = document.createElement('a'); a.href = destination(c); a.className = `lesson-nav-item ${c.id === course.id ? 'current' : ''}`; a.textContent = `${c.chapter} · ${c.title}`; if (c.id === course.id) a.setAttribute('aria-current', 'page'); nav.append(a); });
    let loadTimer = setTimeout(() => { $('#frame-loading').textContent = 'Nội dung đang tải. Nếu không hiển thị, chọn “Mở trang gốc”.'; }, 5000);
    frame.addEventListener('load', () => { clearTimeout(loadTimer); $('#frame-loading').hidden = true; });
  };
  const initPractice = () => {
    const form = $('#practice-checklist');
    if (!form) return;
    const storageKey = 'hocweb2026.practice.v1';
    let previous = [];
    try { previous = JSON.parse(localStorage.getItem(storageKey) || '[]'); } catch (_) { /* ignore */ }
    const checks = $$('input[type="checkbox"]', form);
    checks.forEach((checkbox, index) => { checkbox.checked = previous.includes(index); checkbox.addEventListener('change', () => {
      const selected = checks.map((item, i) => item.checked ? i : null).filter(item => item !== null);
      try { localStorage.setItem(storageKey, JSON.stringify(selected)); } catch (_) { /* ignore */ }
      update();
    }); });
    const update = () => {
      const n = checks.filter(c => c.checked).length;
      $('#task-count').textContent = `${n}/${checks.length} tiêu chí`;
      $('#task-progress').style.width = `${n / checks.length * 100}%`;
      $('#task-completed').hidden = n !== checks.length;
    };
    $('#mark-practice').addEventListener('click', () => {
      const ids = complete(); const now = !ids.includes('practice');
      store(now ? [...ids, 'practice'] : ids.filter(x => x !== 'practice'));
      $('#mark-practice').textContent = now ? '✓ Đã học · bỏ đánh dấu' : '✓ Đánh dấu đã học';
    });
    $('#mark-practice').textContent = complete().includes('practice') ? '✓ Đã học · bỏ đánh dấu' : '✓ Đánh dấu đã học';
    update();
  };
  const initStarterCodeViewer = () => {
    const viewer = $('#starter-code-viewer');
    if (!viewer) return;

    const files = {
      home: {
        name: 'index.html',
        path: '03-thuc-hanh/chuong-02/bai-01-home-login/starter/index.html',
        lang: 'html',
        label: 'index.html (Home)',
        defaultCode: `<!doctype html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <title>Bài tập Home — TODO</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <!-- TODO 1: Header, logo và menu -->
  <main>
    <!-- TODO 2: Banner/Hero -->
    <!-- TODO 3: Thanh tìm kiếm (chỉ giao diện) -->
    <!-- TODO 4: Danh mục bằng CSS Grid -->
    <!-- TODO 5: Sản phẩm/dịch vụ nổi bật -->
    <!-- TODO 6: Giới thiệu -->
    <!-- TODO 7: Khuyến mãi/thông báo -->
  </main>
  <!-- TODO 8: Footer -->
</body>
</html>`
      },
      login: {
        name: 'login.html',
        path: '03-thuc-hanh/chuong-02/bai-01-home-login/starter/login.html',
        lang: 'html',
        label: 'login.html (Login)',
        defaultCode: `<!doctype html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <title>Bài tập Login — TODO</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <main>
    <!-- TODO: form có label và input username/email, password, checkbox,
         liên kết quên mật khẩu và nút Login. Chỉ thiết kế giao diện. -->
  </main>
</body>
</html>`
      },
      css: {
        name: 'style.css',
        path: '03-thuc-hanh/chuong-02/bai-01-home-login/starter/style.css',
        lang: 'css',
        label: 'style.css (CSS)',
        defaultCode: `/* Bài tập: tự viết CSS cho Home và Login.
   Gợi ý: bắt đầu từ box-sizing, font, .header dùng flex,
   danh mục/sản phẩm dùng grid, thẻ card dùng padding/border/margin. */`
      }
    };

    let activeKey = 'home';
    const codeCache = {};

    const escapeHTML = str => str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');

    const highlight = (code, lang) => {
      let escaped = escapeHTML(code);
      if (lang === 'html') {
        escaped = escaped.replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span class="tok-comment">$1</span>');
        escaped = escaped.replace(/(&lt;!doctype\s+html&gt;)/gi, '<span class="tok-doctype">$1</span>');
        escaped = escaped.replace(/(&lt;\/?[a-zA-Z0-9\-]+)(?=[\s&>])/g, '<span class="tok-tag">$1</span>');
        escaped = escaped.replace(/(\/?&gt;)/g, '<span class="tok-tag">$1</span>');
        escaped = escaped.replace(/\s([a-zA-Z\-]+)=(&quot;.*?&quot;)/g, ' <span class="tok-attr">$1</span>=<span class="tok-val">$2</span>');
      } else if (lang === 'css') {
        escaped = escaped.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="tok-comment">$1</span>');
        escaped = escaped.replace(/([a-zA-Z\-]+)\s*:/g, '<span class="tok-attr">$1</span>:');
      }
      return escaped;
    };

    const display = async (key) => {
      activeKey = key;
      const f = files[key];
      if (!f) return;

      $$('.code-tab-btn', viewer).forEach(btn => {
        const isActive = btn.dataset.file === key;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-selected', String(isActive));
      });

      const filepathEl = $('#viewer-filepath', viewer);
      if (filepathEl) filepathEl.textContent = f.path;

      const downloadBtn = $('#viewer-download-btn', viewer);
      if (downloadBtn) {
        downloadBtn.href = f.path;
        downloadBtn.setAttribute('download', f.name);
      }

      const rawLink = $('#viewer-raw-link', viewer);
      if (rawLink) {
        rawLink.href = f.path;
      }

      let code = codeCache[key];
      if (!code) {
        try {
          const res = await fetch(f.path);
          if (res.ok) {
            code = (await res.text()).trim();
            codeCache[key] = code;
          } else {
            code = f.defaultCode;
          }
        } catch (_) {
          code = f.defaultCode;
        }
      }

      const lines = code.split('\n');
      const lineNumsEl = $('#viewer-line-numbers', viewer);
      if (lineNumsEl) {
        lineNumsEl.innerHTML = Array.from({length: lines.length}, (_, i) => i + 1).join('<br>');
      }

      const codeBlock = $('#viewer-code-content', viewer);
      if (codeBlock) {
        codeBlock.innerHTML = highlight(code, f.lang);
        codeBlock.dataset.rawCode = code;
      }
    };

    const copyBtn = $('#viewer-copy-btn', viewer);
    if (copyBtn) {
      copyBtn.addEventListener('click', async () => {
        const codeBlock = $('#viewer-code-content', viewer);
        const text = codeBlock ? (codeBlock.dataset.rawCode || codeBlock.textContent) : '';
        const setCopied = () => {
          copyBtn.classList.add('copied');
          copyBtn.innerHTML = '<span>✓</span> Đã chép!';
          setTimeout(() => {
            copyBtn.classList.remove('copied');
            copyBtn.innerHTML = '<span>📋</span> Sao chép mã';
          }, 2000);
        };
        try {
          await navigator.clipboard.writeText(text);
          setCopied();
        } catch (_) {
          const ta = document.createElement('textarea');
          ta.value = text;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
          setCopied();
        }
      });
    }

    $$('.code-tab-btn', viewer).forEach(btn => {
      btn.addEventListener('click', () => {
        display(btn.dataset.file);
      });
    });

    const btnHome = $('#btn-view-home');
    if (btnHome) {
      btnHome.addEventListener('click', (e) => {
        e.preventDefault();
        display('home');
        viewer.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }

    const btnLogin = $('#btn-view-login');
    if (btnLogin) {
      btnLogin.addEventListener('click', (e) => {
        e.preventDefault();
        display('login');
        viewer.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }

    display('home');
  };

  const initWireframeStudio = () => {
    const studio = $('#wireframe-studio-section');
    if (!studio) return;

    let activePage = 'home';

    const CATALOG = {
      home: [
        {
          id: 'header',
          tag: 'header.site-header',
          css: 'display: flex; space-between; align-items: center',
          title: 'Header / Logo',
          desc: 'Logo bên trái, Menu bên phải',
          htmlSnippet: `<header class="site-header">\n  <div class="container header-content">\n    <a class="brand" href="index.html">\n      <img src="assets/logo.svg" alt="Logo EduShop"> EduShop\n    </a>\n    <nav class="main-nav">\n      <a href="index.html">Trang chủ</a>\n      <a href="#danh-muc">Danh mục</a>\n      <a href="#khoa-hoc">Khóa học</a>\n      <a href="login.html">Đăng nhập</a>\n    </nav>\n  </div>\n</header>`,
          render: () => `
            <div class="wf-inner-header">
              <div class="wf-logo-box">&lt;/&gt; EduShop</div>
              <div class="wf-menu-box">
                <span>Trang chủ</span>
                <span>Danh mục</span>
                <span>Khóa học</span>
                <span style="background:#184a3e; color:#fff;">Đăng nhập ↗</span>
              </div>
            </div>`
        },
        {
          id: 'hero',
          tag: 'section.hero',
          css: 'display: flex; container; 360px',
          title: 'Hero / Banner',
          desc: 'Tiêu đề + CTA (trái) & Ảnh banner (phải)',
          htmlSnippet: `<section class="hero">\n  <div class="container hero-content">\n    <div class="hero-text">\n      <h1>Khám phá niềm vui học lập trình</h1>\n      <p>Bắt đầu hành trình học HTML và CSS.</p>\n      <a href="#khoa-hoc" class="button">Xem khóa học</a>\n    </div>\n    <img src="assets/banner.svg" class="hero-image" alt="Minh họa học công nghệ">\n  </div>\n</section>`,
          render: () => `
            <div class="wf-inner-hero">
              <div class="wf-hero-text">
                <div class="wf-hero-h1"></div>
                <div class="wf-hero-p"></div>
                <div class="wf-hero-btn"></div>
              </div>
              <div class="wf-hero-img-box">🖼️ Banner Image (hero-image)</div>
            </div>`
        },
        {
          id: 'search',
          tag: 'section.container.search-section',
          css: 'width: 1100px; margin: 0 auto; flex',
          title: 'Thanh tìm kiếm',
          desc: 'Tiêu đề H2 + Input + Nút Tìm kiếm',
          htmlSnippet: `<section class="container search-section">\n  <h2>Tìm nội dung bạn quan tâm</h2>\n  <div class="search-box">\n    <input type="search" placeholder="Nhập từ khóa" aria-label="Từ khóa tìm kiếm">\n    <button type="button" class="button">Tìm kiếm</button>\n  </div>\n  <p class="small-note">Chức năng tìm kiếm giao diện mô phỏng.</p>\n</section>`,
          render: () => `
            <div class="wf-inner-search">
              <span style="font-weight:700; color:#175f4c; font-size:13px;">🔍 Tìm nội dung:</span>
              <div class="wf-search-input">Nhập từ khóa tìm kiếm...</div>
              <div class="wf-search-btn">Tìm kiếm</div>
            </div>`
        },
        {
          id: 'category',
          tag: 'section.container (Category)',
          css: 'display: grid; repeat(3, 1fr); gap: 22px',
          title: 'Lưới Danh mục',
          desc: 'CSS Grid 3 cột (Lập trình, Thiết kế, Dữ liệu)',
          htmlSnippet: `<section class="container content-section">\n  <h2>Danh mục nổi bật</h2>\n  <p class="section-description">Chọn lĩnh vực bạn muốn theo đuổi.</p>\n  <div class="category-grid">\n    <article class="category-card"><h3>Lập trình Web</h3></article>\n    <article class="category-card"><h3>Thiết kế UI/UX</h3></article>\n    <article class="category-card"><h3>Khoa học Dữ liệu</h3></article>\n  </div>\n</section>`,
          render: () => `
            <div class="wf-inner-grid">
              <div class="wf-grid-card"><div class="wf-card-thumb">📁 Icon 1</div><div class="wf-card-title"></div><div class="wf-card-sub"></div></div>
              <div class="wf-grid-card"><div class="wf-card-thumb">📁 Icon 2</div><div class="wf-card-title"></div><div class="wf-card-sub"></div></div>
              <div class="wf-grid-card"><div class="wf-card-thumb">📁 Icon 3</div><div class="wf-card-title"></div><div class="wf-card-sub"></div></div>
            </div>`
        },
        {
          id: 'courses',
          tag: 'section.container (Courses)',
          css: 'display: grid; repeat(3, 1fr); gap: 22px',
          title: 'Lưới Khóa học',
          desc: 'CSS Grid 3 cột article.product-card',
          htmlSnippet: `<section class="container content-section">\n  <h2>Khóa học mới nhất</h2>\n  <p class="section-description">Bắt đầu học ngay hôm nay.</p>\n  <div class="product-grid">\n    <article class="product-card">\n      <img src="assets/course-html.svg" alt="Khóa học HTML">\n      <div class="product-body"><h3>HTML cho người mới</h3><p>Tạo cấu trúc web.</p><a href="#" class="text-link">Xem chi tiết →</a></div>\n    </article>\n    <article class="product-card">\n      <img src="assets/course-css.svg" alt="Khóa học CSS">\n      <div class="product-body"><h3>CSS Layout hiện đại</h3><p>Làm chủ Flexbox & Grid.</p><a href="#" class="text-link">Xem chi tiết →</a></div>\n    </article>\n    <article class="product-card">\n      <img src="assets/course-design.svg" alt="Khóa học Design">\n      <div class="product-body"><h3>Thiết kế giao diện</h3><p>Nguyên lý phối màu & bố cục.</p><a href="#" class="text-link">Xem chi tiết →</a></div>\n    </article>\n  </div>\n</section>`,
          render: () => `
            <div class="wf-inner-grid">
              <div class="wf-grid-card"><div class="wf-card-thumb" style="height:55px;">🖼️ Ảnh Khóa học 1</div><div class="wf-card-title"></div><div class="wf-card-sub"></div></div>
              <div class="wf-grid-card"><div class="wf-card-thumb" style="height:55px;">🖼️ Ảnh Khóa học 2</div><div class="wf-card-title"></div><div class="wf-card-sub"></div></div>
              <div class="wf-grid-card"><div class="wf-card-thumb" style="height:55px;">🖼️ Ảnh Khóa học 3</div><div class="wf-card-title"></div><div class="wf-card-sub"></div></div>
            </div>`
        },
        {
          id: 'about',
          tag: 'section.about-section',
          css: 'display: flex; container; background: #e8f5ed',
          title: 'Giới thiệu EduShop',
          desc: 'Bài viết giới thiệu và hình ảnh minh họa',
          htmlSnippet: `<section class="about-section">\n  <div class="container about-content">\n    <div class="about-text">\n      <h2>Về nền tảng EduShop</h2>\n      <p>Sứ mệnh đem lại kiến thức thiết kế web chuẩn cho người bắt đầu.</p>\n    </div>\n    <div class="about-illustration">\n      <img src="assets/banner.svg" alt="Về chúng tôi">\n    </div>\n  </div>\n</section>`,
          render: () => `
            <div class="wf-inner-about">
              <div><div style="font-weight:700; color:#175f4c; font-size:13px; margin-bottom:8px;">Về EduShop</div><div class="wf-about-p"></div><div class="wf-about-p"></div></div>
              <div class="wf-about-img">🖼️ Minh họa Giới thiệu</div>
            </div>`
        },
        {
          id: 'notice',
          tag: 'section.container.notice-section',
          css: 'display: flex; space-between; align-items: center',
          title: 'Thông báo & Ưu đãi',
          desc: 'Nội dung thông báo mới và nút Xem thêm',
          htmlSnippet: `<section class="container notice-section">\n  <div class="notice-content">\n    <strong>Ưu đãi tháng này:</strong> Giảm 30% cho học viên mới đăng ký.\n  </div>\n  <a href="#" class="button">Xem thêm ↗</a>\n</section>`,
          render: () => `
            <div class="wf-inner-notice">
              <div>📢 <strong>Thông báo:</strong> Giảm 30% cho các khóa học HTML/CSS trong tháng 9.</div>
              <div class="wf-notice-btn">Xem chi tiết ↗</div>
            </div>`
        },
        {
          id: 'footer',
          tag: 'footer.site-footer',
          css: 'display: flex; space-between; background: #143730',
          title: 'Chân trang Footer',
          desc: 'Logo EduShop + Thông tin liên hệ & bản quyền',
          htmlSnippet: `<footer class="site-footer">\n  <div class="container footer-content">\n    <div class="footer-info">\n      <div class="brand">EduShop</div>\n      <p>© 2026 EduShop. Giáo trình HOC-WEB2026.</p>\n    </div>\n    <div class="footer-links">\n      <p>Hotline: 0123 456 789 · Email: contact@edushop.vn</p>\n    </div>\n  </div>\n</footer>`,
          render: () => `
            <div class="wf-inner-footer">
              <div class="wf-footer-logo">&lt;/&gt; EduShop · © 2026</div>
              <div>Liên hệ: support@edushop.vn · Hotline: 0988-xxx-xxx</div>
            </div>`
        }
      ],
      login: [
        {
          id: 'login-layout',
          tag: 'main.login-layout',
          css: 'display: flex; min-height: 100vh; align-items: center; justify-content: center',
          title: 'Khung bố cục Login',
          desc: 'Căn giữa toàn màn hình (100vh flexbox)',
          htmlSnippet: `<body class="login-page">\n  <main class="login-layout">\n    <!-- Khung đăng nhập card đặt ở đây -->\n  </main>\n</body>`,
          render: () => `
            <div style="background:#e8f0fe; border:1px dashed #7facf5; padding:16px; border-radius:6px; text-align:center; color:#184c9c; font-size:12px;">
              <strong>MAIN.login-layout</strong> (min-height: 100vh; display: flex; align-items: center; justify-content: center)
            </div>`
        },
        {
          id: 'login-card',
          tag: 'div.login-card (Hộp 440px)',
          css: 'width: 440px; padding: 42px; background: white; border-radius: 8px',
          title: 'Hộp Đăng nhập (Card)',
          desc: 'Bao gồm Logo, Tiêu đề, Form và Nút bấm',
          htmlSnippet: `<div class="login-card">\n  <a class="brand login-brand" href="index.html"><img src="assets/logo.svg" alt="EduShop"> EduShop</a>\n  <h1>Đăng nhập</h1>\n  <p class="login-subtitle">Chào mừng bạn quay lại với EduShop!</p>\n  <form class="login-form">\n    <label for="username">Tên đăng nhập hoặc email</label>\n    <input type="text" id="username" placeholder="Nhập tài khoản" required>\n    <label for="password">Mật khẩu</label>\n    <input type="password" id="password" placeholder="Nhập mật khẩu" required>\n    <div class="login-options">\n      <label class="remember-label"><input type="checkbox"> Ghi nhớ tôi</label>\n      <a href="#" class="forgot-link">Quên mật khẩu?</a>\n    </div>\n    <button type="button" class="button login-button">Đăng nhập</button>\n  </form>\n  <p class="login-note">Giao diện thực hành mô phỏng.</p>\n  <a href="index.html" class="back-home">← Trở về trang chủ</a>\n</div>`,
          render: () => `
            <div class="wf-login-wrapper">
              <div class="wf-login-card">
                <div class="wf-login-title">&lt;/&gt; EduShop<br><span style="font-size:13px; font-weight:normal; color:#5c7899;">Đăng nhập tài khoản</span></div>
                <div class="wf-login-field">Tài khoản / Email: [ user@example.com ]</div>
                <div class="wf-login-field">Mật khẩu: [ •••••••••••• ]</div>
                <div class="wf-login-opts">
                  <span>☑ Ghi nhớ tôi</span>
                  <span style="color:#2459d3;">Quên mật khẩu?</span>
                </div>
                <div class="wf-login-btn">Đăng nhập (100% width)</div>
                <div style="text-align:center; margin-top:12px; font-size:11px; color:#3b6bb3;">← Trở về trang chủ</div>
              </div>
            </div>`
        }
      ]
    };

    const REQUIRED = {
      home: [
        { id: 'header', label: '[A] Header (Flexbox)', tag: 'header' },
        { id: 'hero', label: '[B] Hero (2 cột)', tag: 'section' },
        { id: 'search', label: '[C] Tìm kiếm', tag: 'section' },
        { id: 'category', label: '[D] Danh mục (Grid 3)', tag: 'section' },
        { id: 'courses', label: '[E] Khóa học (Grid 3)', tag: 'section' },
        { id: 'about', label: '[F] Giới thiệu (Flexbox)', tag: 'section' },
        { id: 'notice', label: '[G] Thông báo', tag: 'section' },
        { id: 'footer', label: '[H] Footer (Flexbox)', tag: 'footer' }
      ],
      login: [
        { id: 'login-layout', label: '[I-J] Main căn giữa (100vh)', tag: 'main' },
        { id: 'login-card', label: '[K] Login Card (440px)', tag: 'div' },
        { id: 'login-form', label: '[L] Form đăng nhập', tag: 'form' }
      ]
    };

    const TAG_INSIGHTS = {
      header: 'Thẻ <header> đại diện cho phần đầu trang, chứa Logo thương hiệu và thanh điều hướng chính.',
      nav: 'Thẻ <nav> gom nhóm các liên kết điều hướng quan trọng của website.',
      main: 'Thẻ <main> chứa nội dung chính duy nhất của trang, không lặp lại giữa các trang.',
      section: 'Thẻ <section> biểu thị một khu vực nội dung có chủ đề độc lập, luôn nên có tiêu đề (h2-h6).',
      article: 'Thẻ <article> dùng cho một thành phần nội dung tự hoàn chỉnh, độc lập (ví dụ khóa học, thẻ bài viết).',
      div: 'Thẻ <div> là khối gom nhóm vô nghĩa thuần túy để căn chỉnh bố cục (Flex/Grid) khi không có thẻ ngữ nghĩa phù hợp. Tránh lạm dụng.',
      form: 'Thẻ <form> là biểu mẫu thu thập dữ liệu thật, hỗ trợ phím Enter, nhóm các input và hỗ trợ trình trợ năng tự động điền.',
      footer: 'Thẻ <footer> nằm ở cuối trang, chứa thông tin bản quyền, điều khoản và liên hệ.',
      aside: 'Thẻ <aside> dành cho nội dung phụ hoặc thanh bên (sidebar).'
    };

    const DEFAULT_PRESETS = {
      home: [
        { id: 'header', title: 'Site Header', tag: 'header', className: 'site-header', css: 'display: flex; justify-content: space-between;', parent: 'Trang' },
        { id: 'hero', title: 'Hero / Banner', tag: 'section', className: 'hero', css: 'display: flex; gap: 30px;', parent: 'Trang' },
        { id: 'search', title: 'Search Section', tag: 'section', className: 'container search-section', css: 'display: flex; justify-content: center;', parent: 'Trang' },
        { id: 'category', title: 'Category Grid (3 Cột)', tag: 'section', className: 'container content-section', css: 'display: grid; grid-template-columns: repeat(3, 1fr);', parent: 'Trang' },
        { id: 'courses', title: 'Course Cards (Grid 3 Cột)', tag: 'section', className: 'container content-section', css: 'display: grid; grid-template-columns: repeat(3, 1fr);', parent: 'Trang' },
        { id: 'about', title: 'About Section', tag: 'section', className: 'about-section', css: 'display: flex; align-items: center;', parent: 'Trang' },
        { id: 'notice', title: 'Notice / Promotion', tag: 'section', className: 'container notice-section', css: 'display: flex; justify-content: space-between;', parent: 'Trang' },
        { id: 'footer', title: 'Site Footer', tag: 'footer', className: 'site-footer', css: 'display: flex; justify-content: space-between;', parent: 'Trang' }
      ],
      login: [
        { id: 'login-layout', title: 'Login Layout (Full viewport)', tag: 'main', className: 'login-layout', css: 'min-height: 100vh; display: flex; align-items: center; justify-content: center;', parent: 'Trang' },
        { id: 'login-card', title: 'Login Card & Form (440px)', tag: 'div', className: 'login-card', css: 'width: 440px; display: flex; flex-direction: column;', parent: 'LoginLayout' }
      ]
    };

    const SEMI_PRESETS = {
      home: [
        { id: 'header', title: 'Site Header', tag: 'header', className: 'site-header', css: 'display: flex; justify-content: space-between;', parent: 'Trang' },
        { id: 'footer', title: 'Site Footer', tag: 'footer', className: 'site-footer', css: 'display: flex; justify-content: space-between;', parent: 'Trang' }
      ],
      login: [
        { id: 'login-layout', title: 'Login Layout (Full viewport)', tag: 'main', className: 'login-layout', css: 'min-height: 100vh; display: flex; align-items: center; justify-content: center;', parent: 'Trang' }
      ]
    };

    const normalizeBlocks = (items, page) => {
      if (!Array.isArray(items)) return [...DEFAULT_PRESETS[page]];
      return items.map(item => {
        if (typeof item === 'string') {
          const found = DEFAULT_PRESETS[page].find(p => p.id === item);
          const compFound = (CATALOG[page] || []).find(c => c.id === item);
          return found ? { ...found } : {
            id: item,
            title: compFound ? compFound.title : item,
            tag: compFound ? compFound.tag : 'div',
            className: item,
            css: compFound ? compFound.css : '',
            parent: 'Trang'
          };
        }
        return {
          ...item,
          parent: item.parent || 'Trang'
        };
      });
    };

    let userBlocks = {
      home: normalizeBlocks(DEFAULT_PRESETS.home, 'home'),
      login: normalizeBlocks(DEFAULT_PRESETS.login, 'login')
    };

    try {
      const saved = JSON.parse(localStorage.getItem('hocweb2026.wireframe.v2') || '{}');
      if (Array.isArray(saved.home) && saved.home.length) userBlocks.home = normalizeBlocks(saved.home, 'home');
      if (Array.isArray(saved.login) && saved.login.length) userBlocks.login = normalizeBlocks(saved.login, 'login');
    } catch (_) {}

    const saveState = () => {
      try {
        localStorage.setItem('hocweb2026.wireframe.v2', JSON.stringify(userBlocks));
      } catch (_) {}
    };

    const renderRequirements = () => {
      const summaryEl = $('#wf-req-summary', studio);
      const badgesEl = $('#wf-req-badges', studio);
      if (!summaryEl || !badgesEl) return;

      const reqs = REQUIRED[activePage] || [];
      const currentBlocks = userBlocks[activePage] || [];
      let okCount = 0;

      badgesEl.innerHTML = '';
      reqs.forEach(req => {
        const isOk = currentBlocks.some(b => b.id === req.id || (b.tag && b.tag.toLowerCase() === req.tag.toLowerCase()));
        if (isOk) okCount++;

        const badge = document.createElement('span');
        badge.className = `req-badge ${isOk ? 'ok' : 'missing'}`;
        badge.innerHTML = `${isOk ? '✓' : '○'} ${req.label}`;
        badgesEl.appendChild(badge);
      });

      summaryEl.textContent = `${okCount}/${reqs.length} đạt chuẩn`;
      summaryEl.style.background = okCount === reqs.length ? '#15803d' : '#249775';
    };

    const renderPalette = () => {
      const listEl = $('#wf-component-list', studio);
      const titleEl = $('#palette-page-title', studio);
      if (!listEl) return;

      titleEl.textContent = activePage === 'home' ? 'Thư viện linh kiện Trang Home' : 'Thư viện linh kiện Trang Login';
      listEl.innerHTML = '';

      const comps = CATALOG[activePage] || [];
      comps.forEach(comp => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'comp-btn';
        btn.innerHTML = `<strong>+ ${comp.title}</strong><span>${comp.tag}</span>`;
        btn.title = comp.desc;
        btn.addEventListener('click', () => {
          userBlocks[activePage].push({
            id: comp.id,
            title: comp.title,
            tag: comp.tag,
            className: comp.id,
            css: comp.css,
            parent: comp.id === 'login-card' ? 'LoginLayout' : 'Trang'
          });
          saveState();
          renderCanvas();
        });
        listEl.appendChild(btn);
      });
    };

    let editingIndex = null;
    const inspectorModal = $('#wf-inspector-modal', studio);
    const inspectorForm = $('#wf-inspector-form', studio);
    const inspTitle = $('#insp-block-title', studio);
    const inspTag = $('#insp-block-tag', studio);
    const inspClass = $('#insp-block-class', studio);
    const inspParent = $('#insp-block-parent', studio);
    const inspCss = $('#insp-block-css', studio);
    const inspInsight = $('#insp-block-insight', studio);
    const inspDuplicateBtn = $('#insp-duplicate-btn', studio);
    const inspDeleteBtn = $('#insp-delete-btn', studio);
    const inspectorClose = $('#wf-inspector-close', studio);

    const openInspector = (index) => {
      const block = (userBlocks[activePage] || [])[index];
      if (!block || !inspectorModal) return;
      editingIndex = index;

      if (inspTitle) inspTitle.value = block.title || '';
      if (inspTag) inspTag.value = (block.tag || 'div').toLowerCase();
      if (inspClass) inspClass.value = block.className || '';
      if (inspParent) inspParent.value = block.parent || 'Trang';
      if (inspCss) inspCss.value = block.css || '';
      updateInsightText();

      inspectorModal.hidden = false;
    };

    const updateInsightText = () => {
      if (!inspTag || !inspInsight) return;
      const tag = inspTag.value;
      inspInsight.textContent = TAG_INSIGHTS[tag] || `Thẻ <${tag}>: Lựa chọn thẻ này theo đúng ngữ nghĩa vai trò của phần tử trong giao diện.`;
    };

    if (inspTag) {
      inspTag.addEventListener('change', updateInsightText);
    }

    if (inspectorClose && inspectorModal) {
      inspectorClose.addEventListener('click', () => {
        inspectorModal.hidden = true;
      });
    }

    if (inspectorForm) {
      inspectorForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (editingIndex === null) return;
        const currentBlocks = userBlocks[activePage] || [];
        if (currentBlocks[editingIndex]) {
          currentBlocks[editingIndex].title = inspTitle.value;
          currentBlocks[editingIndex].tag = inspTag.value;
          currentBlocks[editingIndex].className = inspClass.value;
          if (inspParent) currentBlocks[editingIndex].parent = inspParent.value;
          currentBlocks[editingIndex].css = inspCss.value;
          saveState();
          renderCanvas();
        }
        inspectorModal.hidden = true;
      });
    }

    if (inspDuplicateBtn) {
      inspDuplicateBtn.addEventListener('click', () => {
        if (editingIndex === null) return;
        const currentBlocks = userBlocks[activePage] || [];
        const base = currentBlocks[editingIndex];
        if (base) {
          currentBlocks.splice(editingIndex + 1, 0, {
            ...base,
            title: `${base.title} (bản sao)`
          });
          saveState();
          renderCanvas();
        }
        inspectorModal.hidden = true;
      });
    }

    if (inspDeleteBtn) {
      inspDeleteBtn.addEventListener('click', () => {
        if (editingIndex === null) return;
        const currentBlocks = userBlocks[activePage] || [];
        if (confirm('Bạn có chắc muốn xóa khối này khỏi bản vẽ?')) {
          currentBlocks.splice(editingIndex, 1);
          saveState();
          renderCanvas();
          inspectorModal.hidden = true;
        }
      });
    }

    const renderCanvas = () => {
      const blocksContainer = $('#wf-layout-blocks', studio);
      const subTitleEl = $('#wf-board-subtitle', studio);
      if (!blocksContainer) return;

      subTitleEl.textContent = activePage === 'home'
        ? 'EduShop · Desktop Home Wireframe (1100px Container)'
        : 'EduShop · Desktop Login Wireframe (440px Card Modal)';

      const currentBlocks = userBlocks[activePage] || [];
      const comps = CATALOG[activePage] || [];

      if (currentBlocks.length === 0) {
        blocksContainer.innerHTML = `
          <div class="wf-empty-hint" style="padding:48px 24px; text-align:center;">
            <h4>📄 Bàn vẽ hiện đang là Trang trắng</h4>
            <p style="max-width:560px; margin:8px auto; color:#5c7e77; font-size:14px;">
              Bạn đang ở chế độ vẽ từ trang trắng. Hãy quan sát wireframe mẫu, sau đó nhấp vào các linh kiện ở cột bên trái theo thứ tự: <strong>Header → Hero → Search → Category → Courses → Footer</strong>.
            </p>
            <div style="display:flex; justify-content:center; gap:10px; margin-top:16px;">
              <button type="button" class="wf-tool-btn primary" id="empty-load-preset">🌟 Nạp mẫu chuẩn ${activePage === 'home' ? 'Home' : 'Login'}</button>
              <button type="button" class="wf-tool-btn" id="empty-view-ref">🖼️ Xem ảnh mẫu</button>
            </div>
          </div>`;
        const loadBtn = $('#empty-load-preset', blocksContainer);
        if (loadBtn) {
          loadBtn.addEventListener('click', () => {
            userBlocks[activePage] = normalizeBlocks(DEFAULT_PRESETS[activePage], activePage);
            saveState();
            renderCanvas();
          });
        }
        const refBtn = $('#empty-view-ref', blocksContainer);
        if (refBtn && viewRefBtn) {
          refBtn.addEventListener('click', () => viewRefBtn.click());
        }
        renderRequirements();
        return;
      }

      blocksContainer.innerHTML = '';

      currentBlocks.forEach((block, index) => {
        const comp = comps.find(c => c.id === block.id) || comps[0];

        const node = document.createElement('div');
        node.className = 'wf-node';
        node.dataset.index = index;

        node.innerHTML = `
          <div class="wf-node-top">
            <div class="wf-node-tag">
              <span style="color:#1d7e64; font-weight:bold;">[${index + 1}]</span> 
              <strong>${block.title || comp.title}</strong> 
              <span style="font-size:12px; color:#51756e;">(&lt;${block.tag || comp.tag}&gt;)</span>
              <span class="wf-parent-badge">Cha: ${block.parent || 'Trang'}</span>
            </div>
            <div class="wf-node-specs">
              <span class="wf-css-pill">${block.css || comp.css}</span>
              <div class="wf-node-tools">
                <button type="button" class="wf-node-tool-btn edit" title="Mở Inspector chỉnh sửa khối">✎</button>
                <button type="button" class="wf-node-tool-btn up" title="Di chuyển lên" ${index === 0 ? 'disabled' : ''}>▲</button>
                <button type="button" class="wf-node-tool-btn down" title="Di chuyển xuống" ${index === currentBlocks.length - 1 ? 'disabled' : ''}>▼</button>
                <button type="button" class="wf-node-tool-btn del" title="Xóa khối này">✕</button>
              </div>
            </div>
          </div>
          <div class="wf-node-content">
            ${comp ? comp.render() : `<div style="padding:15px; text-align:center;">${block.title}</div>`}
          </div>`;

        const editBtn = $('.wf-node-tool-btn.edit', node);
        if (editBtn) {
          editBtn.addEventListener('click', () => openInspector(index));
        }

        const upBtn = $('.wf-node-tool-btn.up', node);
        if (upBtn) {
          upBtn.addEventListener('click', () => {
            if (index > 0) {
              const temp = currentBlocks[index];
              currentBlocks[index] = currentBlocks[index - 1];
              currentBlocks[index - 1] = temp;
              saveState();
              renderCanvas();
            }
          });
        }

        const downBtn = $('.wf-node-tool-btn.down', node);
        if (downBtn) {
          downBtn.addEventListener('click', () => {
            if (index < currentBlocks.length - 1) {
              const temp = currentBlocks[index];
              currentBlocks[index] = currentBlocks[index + 1];
              currentBlocks[index + 1] = temp;
              saveState();
              renderCanvas();
            }
          });
        }

        const delBtn = $('.wf-node-tool-btn.del', node);
        if (delBtn) {
          delBtn.addEventListener('click', () => {
            currentBlocks.splice(index, 1);
            saveState();
            renderCanvas();
          });
        }

        blocksContainer.appendChild(node);
      });

      renderRequirements();
    };

    $$('.wf-tab-btn', studio).forEach(tab => {
      tab.addEventListener('click', () => {
        $$('.wf-tab-btn', studio).forEach(t => {
          const isAct = t === tab;
          t.classList.toggle('active', isAct);
          t.setAttribute('aria-selected', String(isAct));
        });
        activePage = tab.dataset.page;
        renderPalette();
        renderCanvas();
      });
    });

    // 3 Learning Modes Handlers
    const mode1Btn = $('#wf-mode-1-btn', studio);
    const mode2Btn = $('#wf-mode-2-btn', studio);
    const mode3Btn = $('#wf-mode-3-btn', studio);
    const modeDescText = $('#wf-mode-desc-text', studio);

    const setMode = (mode) => {
      [mode1Btn, mode2Btn, mode3Btn].forEach(b => {
        if (!b) return;
        const isM = b.dataset.mode === mode;
        b.classList.toggle('active', isM);
      });
      if (mode === 'guided') {
        if (modeDescText) modeDescText.textContent = 'Mức 1: Hiển thị hướng dẫn mẫu và khung bố cục đầy đủ để khám phá.';
        userBlocks[activePage] = normalizeBlocks(DEFAULT_PRESETS[activePage], activePage);
        saveState();
        renderCanvas();
      } else if (mode === 'semi') {
        if (modeDescText) modeDescText.textContent = 'Mức 2: Khung sườn cơ bản có sẵn. Bạn cần kéo thêm các khối còn thiếu từ thư viện.';
        userBlocks[activePage] = normalizeBlocks(SEMI_PRESETS[activePage], activePage);
        saveState();
        renderCanvas();
      } else if (mode === 'blank') {
        if (modeDescText) modeDescText.textContent = 'Mức 3: Bàn vẽ trắng hoàn toàn. Hãy tự phân tích đề và tự dựng các khối từ đầu.';
        userBlocks[activePage] = [];
        saveState();
        renderCanvas();
      }
    };

    if (mode1Btn) mode1Btn.addEventListener('click', () => setMode('guided'));
    if (mode2Btn) mode2Btn.addEventListener('click', () => setMode('semi'));
    if (mode3Btn) {
      mode3Btn.addEventListener('click', () => {
        if (confirm('Chuyển sang Mức 3 (Trang trắng hoàn toàn)? Bản vẽ hiện tại sẽ được làm mới để bạn tự thiết kế độc lập.')) {
          setMode('blank');
        }
      });
    }

    // Blank canvas button
    const blankBtn = $('#wf-blank-btn', studio);
    if (blankBtn) {
      blankBtn.addEventListener('click', () => {
        if (confirm(`Bạn có muốn chuyển sang trang trắng để tự tay lắp ghép trang ${activePage === 'home' ? 'Home' : 'Login'} từ đầu?`)) {
          userBlocks[activePage] = [];
          saveState();
          renderCanvas();
        }
      });
    }

    const loadPresetBtn = $('#wf-load-preset-btn', studio);
    if (loadPresetBtn) {
      loadPresetBtn.addEventListener('click', () => {
        userBlocks[activePage] = normalizeBlocks(DEFAULT_PRESETS[activePage], activePage);
        saveState();
        renderCanvas();
      });
    }

    // Reference Modal Logic
    const viewRefBtn = $('#wf-view-reference-btn', studio);
    const refModal = $('#wf-reference-modal', studio);
    const refModalClose = $('#wf-ref-modal-close', studio);
    const refImage = $('#wf-ref-image', studio);
    const refTitle = $('#wf-ref-modal-title', studio);
    const refDesc = $('#wf-ref-modal-desc', studio);

    if (viewRefBtn && refModal) {
      viewRefBtn.addEventListener('click', () => {
        if (activePage === 'home') {
          if (refTitle) refTitle.textContent = '🖼️ Bản vẽ Wireframe chuẩn EduShop Home (8 khu vực A–H)';
          if (refDesc) refDesc.textContent = 'Quan sát bố cục 8 khu vực A–H của trang Home: Header, Hero banner 2 cột, Lưới danh mục & sản phẩm 3 cột, Giới thiệu, Thông báo và Footer.';
          if (refImage) refImage.src = 'portal/wireframes/home-reference.png';
        } else {
          if (refTitle) refTitle.textContent = '🖼️ Bản vẽ Wireframe chuẩn EduShop Login (Khung căn giữa)';
          if (refDesc) refDesc.textContent = 'Quan sát cấu trúc Login Card 440px căn giữa toàn màn hình (100vh): Logo, tiêu đề, các trường nhập liệu, hàng tùy chọn và nút đăng nhập 100% width.';
          if (refImage) refImage.src = 'portal/wireframes/login-reference.png';
        }
        refModal.hidden = false;
      });

      if (refModalClose) {
        refModalClose.addEventListener('click', () => {
          refModal.hidden = true;
        });
      }
    }

    // Export & Import JSON (compatible with ilp-wireframes-v1)
    const exportJsonBtn = $('#wf-export-json-btn', studio);
    if (exportJsonBtn) {
      exportJsonBtn.addEventListener('click', () => {
        const payload = {
          format: 'ilp-wireframes-v1',
          version: '1.0.0',
          exportedAt: new Date().toISOString(),
          scenes: {
            home: userBlocks.home,
            login: userBlocks.login
          }
        };
        const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(payload, null, 2));
        const a = document.createElement('a');
        a.setAttribute('href', dataStr);
        a.setAttribute('download', `wireframes-edushop-${activePage}.json`);
        document.body.appendChild(a);
        a.click();
        a.remove();
      });
    }

    const importJsonBtn = $('#wf-import-json-btn', studio);
    const jsonFileInput = $('#wf-json-file-input', studio);

    if (importJsonBtn && jsonFileInput) {
      importJsonBtn.addEventListener('click', () => {
        jsonFileInput.click();
      });

      jsonFileInput.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target.result);
            if (data.format !== 'ilp-wireframes-v1') {
              alert('Cảnh báo: Định dạng file không phải chuẩn ilp-wireframes-v1. Đang thử nạp dữ liệu...');
            }
            if (data.scenes) {
              if (Array.isArray(data.scenes.home)) userBlocks.home = normalizeBlocks(data.scenes.home, 'home');
              if (Array.isArray(data.scenes.login)) userBlocks.login = normalizeBlocks(data.scenes.login, 'login');
            } else if (data.home || data.login) {
              if (Array.isArray(data.home)) userBlocks.home = normalizeBlocks(data.home, 'home');
              if (Array.isArray(data.login)) userBlocks.login = normalizeBlocks(data.login, 'login');
            }
            saveState();
            renderCanvas();
            alert('✓ Đã nhập dữ liệu wireframe thành công!');
          } catch (err) {
            alert('Không thể đọc file JSON: ' + err.message);
          }
          jsonFileInput.value = '';
        };
        reader.readAsText(file);
      });
    }

    // Export SVG (Scalable Vector Graphics)
    const exportSvgBtn = $('#wf-export-svg-btn', studio);
    if (exportSvgBtn) {
      exportSvgBtn.addEventListener('click', () => {
        const currentBlocks = userBlocks[activePage] || [];
        const w = 1100;
        const h = Math.max(800, 100 + currentBlocks.length * 160);

        let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">\n`;
        svg += `  <rect width="${w}" height="${h}" fill="#f4f8f5"/>\n`;
        svg += `  <text x="30" y="45" font-family="Arial, sans-serif" font-size="22" font-weight="bold" fill="#114a3c">EDUSHOP · WIREFRAME ${activePage.toUpperCase()} (HOC-WEB2026)</text>\n`;

        let curY = 70;
        currentBlocks.forEach((b, idx) => {
          const isFull = b.id === 'header' || b.id === 'hero' || b.id === 'footer' || b.id === 'about';
          const blockW = isFull ? w - 60 : 1000;
          const blockX = (w - blockW) / 2;
          const blockH = (b.id === 'hero' || b.id === 'login-card') ? 170 : (b.id === 'category' || b.id === 'courses' ? 140 : 80);

          svg += `  <g id="block-${idx}">\n`;
          svg += `    <rect x="${blockX}" y="${curY}" width="${blockW}" height="${blockH}" fill="#ffffff" stroke="#249775" stroke-width="1.5" stroke-dasharray="6,4" rx="6"/>\n`;
          svg += `    <text x="${blockX + 16}" y="${curY + 26}" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#114a3c">[${idx + 1}] ${b.title || b.id} &lt;${b.tag || 'div'}&gt; (Cha: ${b.parent || 'Trang'})</text>\n`;
          if (b.className) {
            svg += `    <text x="${blockX + 16}" y="${curY + 46}" font-family="monospace" font-size="12" fill="#527870">class: .${b.className}</text>\n`;
          }
          if (b.css) {
            svg += `    <text x="${blockX + 16}" y="${curY + 64}" font-family="monospace" font-size="11" fill="#71948d">css: ${b.css}</text>\n`;
          }
          svg += `  </g>\n`;

          curY += blockH + 16;
        });

        svg += `</svg>`;

        const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `wireframe-edushop-${activePage}.svg`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      });
    }

    const clearBtn = $('#wf-clear-btn', studio);
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (confirm(`Bạn có chắc muốn xóa toàn bộ khối trên trang ${activePage === 'home' ? 'Home' : 'Login'}?`)) {
          userBlocks[activePage] = [];
          saveState();
          renderCanvas();
        }
      });
    }

    const viewCodeBtn = $('#wf-view-code-btn', studio);
    const modal = $('#wf-html-modal', studio);
    const modalClose = $('#wf-modal-close', studio);
    const modalCodeEl = $('#wf-generated-code', studio);
    const modalCopyBtn = $('#modal-copy-code-btn', studio);

    const generateHTML = () => {
      const currentBlocks = userBlocks[activePage] || [];
      const comps = CATALOG[activePage] || [];
      let code = `<!doctype html>\n<html lang="vi">\n<head>\n  <meta charset="UTF-8">\n  <title>EduShop - ${activePage === 'home' ? 'Trang chủ' : 'Đăng nhập'}</title>\n  <link rel="stylesheet" href="css/style.css">\n  <link rel="stylesheet" href="css/${activePage}.css">\n</head>\n<body class="${activePage === 'login' ? 'login-page' : 'page-home'}">\n`;

      if (activePage === 'home') {
        const headerBlock = currentBlocks.find(b => b.id === 'header');
        const headerComp = comps.find(c => c.id === 'header');
        if (headerBlock && headerComp) {
          code += '  ' + headerComp.htmlSnippet.split('\n').join('\n  ') + '\n\n  <main>\n';
        } else {
          code += '  <main>\n';
        }
        currentBlocks.filter(b => b.id !== 'header' && b.id !== 'footer').forEach(b => {
          const c = comps.find(item => item.id === b.id);
          if (c) {
            code += '    ' + c.htmlSnippet.split('\n').join('\n    ') + '\n\n';
          }
        });
        code += '  </main>\n\n';
        const footerBlock = currentBlocks.find(b => b.id === 'footer');
        const footerComp = comps.find(c => c.id === 'footer');
        if (footerBlock && footerComp) {
          code += '  ' + footerComp.htmlSnippet.split('\n').join('\n  ') + '\n';
        }
      } else {
        const cardComp = comps.find(c => c.id === 'login-card');
        code += `  <main class="login-layout">\n    ${cardComp ? cardComp.htmlSnippet.split('\n').join('\n    ') : ''}\n  </main>\n`;
      }

      code += `</body>\n</html>`;
      return code;
    };

    if (viewCodeBtn && modal) {
      viewCodeBtn.addEventListener('click', () => {
        const fullCode = generateHTML();
        if (modalCodeEl) modalCodeEl.textContent = fullCode;
        modal.hidden = false;
      });
      if (modalClose) {
        modalClose.addEventListener('click', () => {
          modal.hidden = true;
        });
      }
      if (modalCopyBtn) {
        modalCopyBtn.addEventListener('click', async () => {
          try {
            await navigator.clipboard.writeText(modalCodeEl.textContent);
            modalCopyBtn.textContent = '✓ Đã chép mã!';
            setTimeout(() => { modalCopyBtn.textContent = '📋 Sao chép mã'; }, 2000);
          } catch (_) {
            modalCopyBtn.textContent = '✓ Đã chép!';
          }
        });
      }
    }

    const exportPngBtn = $('#wf-export-png-btn', studio);
    if (exportPngBtn) {
      exportPngBtn.addEventListener('click', () => {
        const blocksContainer = $('#wf-layout-blocks', studio);
        if (!blocksContainer) return;

        const w = 1140;
        const currentBlocks = userBlocks[activePage] || [];
        const h = Math.max(700, 120 + currentBlocks.length * 150);
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#f4f8f5';
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = '#10362e';
        ctx.font = 'bold 22px Arial, sans-serif';
        ctx.fillText(`EDUSHOP - BẢN VẼ WIREFRAME (${activePage.toUpperCase()}) · HOC-WEB2026`, 30, 45);

        ctx.strokeStyle = '#249775';
        ctx.lineWidth = 2;
        ctx.strokeRect(20, 60, w - 40, h - 80);

        let curY = 80;
        const comps = CATALOG[activePage] || [];

        currentBlocks.forEach((b, idx) => {
          const comp = comps.find(c => c.id === b.id) || comps[0];
          const blockH = (b.id === 'hero' || b.id === 'login-card') ? 160 : (b.id === 'category' || b.id === 'courses' ? 120 : 75);

          ctx.fillStyle = '#ffffff';
          ctx.fillRect(40, curY, w - 80, blockH);
          ctx.strokeStyle = '#327063';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([6, 4]);
          ctx.strokeRect(40, curY, w - 80, blockH);
          ctx.setLineDash([]);

          ctx.fillStyle = '#114a3c';
          ctx.font = 'bold 15px Arial, sans-serif';
          ctx.fillText(`[${idx + 1}] ${b.title || comp.title} (<${b.tag || comp.tag}>) - Cha: ${b.parent || 'Trang'}`, 55, curY + 28);

          ctx.fillStyle = '#658a82';
          ctx.font = 'italic 12px monospace';
          ctx.fillText(`CSS: ${b.css || comp.css}`, 55, curY + 48);

          curY += blockH + 16;
        });

        const link = document.createElement('a');
        link.download = `wireframe-edushop-${activePage}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      });
    }

    renderPalette();
    renderCanvas();
  };

  initHome(); initLesson(); initPractice(); initStarterCodeViewer(); initWireframeStudio();
})();
