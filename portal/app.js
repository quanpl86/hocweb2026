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
  const destination = course => course.type === 'practice' ? 'practice.html' : `lesson.html?id=${encodeURIComponent(course.id)}`;
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
  initHome(); initLesson(); initPractice();
})();
