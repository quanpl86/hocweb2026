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
  const destination = course => course.type === 'practice' ? 'practice.html' : (course.type === 'video-interactive' ? 'player.html' : `lesson.html?id=${encodeURIComponent(course.id)}`);
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
  initHome(); initLesson(); initPractice(); initStarterCodeViewer();
})();
