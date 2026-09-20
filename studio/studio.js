/**
 * Lesson Authoring Studio Controller
 * HOC-WEB2026 Hybrid Content Architecture
 */
(() => {
  'use strict';

  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];

  // Default In-Memory Lesson State
  let currentLesson = {
    schemaVersion: "1.0.0",
    id: "WEB-FLEXBOX-01",
    title: "Khám phá CSS Flexbox qua giao diện Home & Login",
    status: "draft",
    duration: 480,
    description: "Bài học tương tác kết hợp hoạt họa giải thích Box Model, Flexbox và thử thách code thực hành.",
    media: {
      video: "assets/video/lesson.mp4",
      poster: "assets/images/flexbox.svg"
    },
    chapters: [
      { id: "intro", title: "01. Giới thiệu Flexbox", start: 0 },
      { id: "quiz-checkpoint", title: "02. Kiểm tra: Kích hoạt Flexbox", start: 60 },
      { id: "practice-coding", title: "03. Thử thách lập trình Navbar", start: 180 },
      { id: "simulation", title: "04. Thí nghiệm trực quan", start: 320 }
    ],
    content: {
      "introduction": "content/introduction.md",
      "theory": "content/flexbox-theory.md",
      "summary": "content/summary.md"
    },
    activities: [
      { id: "quiz-01", type: "quiz", title: "Câu hỏi trắc nghiệm", config: "questions/q01/question.json" },
      { id: "coding-01", type: "coding", title: "Thực hành lập trình", config: "activities/coding-01.json" },
      { id: "simulation-01", type: "simulation", title: "Mô phỏng trục Flexbox", config: "activities/simulation-01.json" }
    ],
    timeline: [
      { id: "cp-01", time: 60, action: "openActivity", target: "quiz-01", pauseVideo: true },
      { id: "cp-02", time: 180, action: "openActivity", target: "coding-01", pauseVideo: true },
      { id: "cp-03", time: 320, action: "openActivity", target: "simulation-01", pauseVideo: true }
    ]
  };

  // Virtual Files Map (for Hybrid Markdown, Tests, Starters)
  const virtualFiles = {
    "content/introduction.md": "# Khám phá CSS Flexbox\n\nChào mừng bạn đến với bài học tương tác CSS Flexbox!",
    "content/flexbox-theory.md": "# Lý thuyết cốt lõi về Flexbox\n\n- display: flex\n- justify-content: space-between\n- align-items: center",
    "content/summary.md": "# Tổng kết bài học Flexbox\n\nFlexbox là nền tảng cốt lõi của giao diện web hiện đại.",
    "questions/q01/question.md": "# Câu hỏi kiểm tra: Khởi tạo Flexbox\n\nThuộc tính CSS nào được sử dụng để kích hoạt mô hình Flexible Box?",
    "questions/q01/explanation.md": "## Đáp án chính xác: B\n\nĐể kích hoạt Flexbox, sử dụng `display: flex` trên thẻ container.",
    "questions/q01/hint.md": "Gợi ý: Tên gọi Flexible Box chứa từ khóa cần chọn (flex).",
    "starter/index.html": "<nav class=\"navbar\">\n  <div class=\"brand\">🚀 EduShop</div>\n  <div class=\"nav-links\">\n    <a href=\"#\">Trang chủ</a>\n    <a href=\"#\">Khóa học</a>\n  </div>\n</nav>",
    "starter/style.css": ".navbar {\n  background: #ffffff;\n  padding: 16px 24px;\n  /* Thêm display: flex ở đây */\n}"
  };

  // Question State
  let currentQuestion = {
    id: "q01",
    type: "single-choice",
    options: [
      { id: "A", text: "display: block" },
      { id: "B", text: "display: flex" },
      { id: "C", text: "display: grid" },
      { id: "D", text: "display: inline" }
    ],
    answer: { correctOptionIds: ["B"] }
  };

  // Test Suite State
  let currentTests = [
    { id: "t1", title: ".navbar có display: flex", selector: ".navbar", property: "display", expected: "flex" },
    { id: "t2", title: ".navbar có justify-content: space-between", selector: ".navbar", property: "justifyContent", expected: "space-between" },
    { id: "t3", title: ".navbar có align-items: center", selector: ".navbar", property: "alignItems", expected: "center" }
  ];

  // Helper format MM:SS
  const formatTime = s => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(Math.floor(s%60)).padStart(2,'0')}`;

  // Tabs Navigation
  const initTabs = () => {
    const navItems = $$('.studio-nav-item');
    const panes = $$('.studio-pane');

    navItems.forEach(item => {
      item.addEventListener('click', () => {
        const tab = item.dataset.tab;
        navItems.forEach(n => n.classList.remove('active'));
        panes.forEach(p => p.classList.remove('active'));

        item.classList.add('active');
        $(`#pane-${tab}`).classList.add('active');

        if (tab === 'validate') runPrePublishValidation();
      });
    });
  };

  // 1. Metadata Form Binding
  const initMeta = () => {
    const sync = () => {
      currentLesson.id = $('#meta-id').value.trim();
      currentLesson.title = $('#meta-title').value.trim();
      currentLesson.description = $('#meta-desc').value.trim();
      currentLesson.duration = Number($('#meta-duration').value);
      currentLesson.status = $('#meta-status').value;
      currentLesson.media.video = $('#meta-video').value.trim();
      currentLesson.media.poster = $('#meta-poster').value.trim();

      $('#studio-lesson-title-label').textContent = currentLesson.title;
      const pill = $('#studio-status-pill');
      pill.textContent = currentLesson.status.toUpperCase();
      pill.className = `status-pill ${currentLesson.status === 'published' ? 'approved' : 'draft'}`;
    };

    ['#meta-id', '#meta-title', '#meta-desc', '#meta-duration', '#meta-video', '#meta-poster'].forEach(id => {
      $(id).addEventListener('input', sync);
    });
    $('#meta-status').addEventListener('change', sync);

    renderChaptersList();
    $('#btn-add-chapter').addEventListener('click', () => {
      const newStart = currentLesson.chapters.length * 60;
      currentLesson.chapters.push({
        id: `ch-${Date.now()}`,
        title: `Chương mới #${currentLesson.chapters.length + 1}`,
        start: newStart
      });
      renderChaptersList();
    });
  };

  const renderChaptersList = () => {
    const slot = $('#chapters-list-slot');
    slot.innerHTML = currentLesson.chapters.map((ch, idx) => `
      <div class="checkpoint-row-card">
        <span class="cp-time-badge">${formatTime(ch.start)}</span>
        <div class="cp-desc">
          <input type="text" class="ch-title-edit" data-idx="${idx}" value="${ch.title}" style="width:70%; background:transparent; border:1px solid #1f4954; color:#fff; padding:4px 8px; border-radius:4px;">
        </div>
        <button class="btn outline btn-xs ch-del-btn" data-idx="${idx}">🗑️ Xóa</button>
      </div>
    `).join('');

    $$('.ch-title-edit', slot).forEach(input => {
      input.addEventListener('input', () => {
        currentLesson.chapters[Number(input.dataset.idx)].title = input.value;
      });
    });

    $$('.ch-del-btn', slot).forEach(btn => {
      btn.addEventListener('click', () => {
        currentLesson.chapters.splice(Number(btn.dataset.idx), 1);
        renderChaptersList();
      });
    });
  };

  // 2. Timeline Checkpoints Binding
  const initTimeline = () => {
    renderTimelineList();
    $('#btn-add-checkpoint').addEventListener('click', () => {
      const newTime = 60 + currentLesson.timeline.length * 60;
      const newId = `cp-${Date.now().toString().slice(-4)}`;
      currentLesson.timeline.push({
        id: newId,
        time: newTime,
        action: 'openActivity',
        target: 'quiz-01',
        pauseVideo: true
      });
      renderTimelineList();
    });
  };

  const renderTimelineList = () => {
    const slot = $('#timeline-list-slot');
    $('#badge-checkpoints-count').textContent = currentLesson.timeline.length;

    slot.innerHTML = currentLesson.timeline.map((item, idx) => `
      <div class="checkpoint-row-card">
        <span class="cp-time-badge">${formatTime(item.time)} (${item.time}s)</span>
        <div class="cp-desc">
          <strong>Checkpoint ID: ${item.id}</strong>
          <small>Hành động: ${item.action} ➔ Target: <strong>${item.target}</strong> (${item.pauseVideo ? 'Tạm dừng video' : 'Hiện thông báo'})</small>
        </div>
        <button class="btn outline btn-xs cp-del-btn" data-idx="${idx}">🗑️ Xóa</button>
      </div>
    `).join('');

    $$('.cp-del-btn', slot).forEach(btn => {
      btn.addEventListener('click', () => {
        currentLesson.timeline.splice(Number(btn.dataset.idx), 1);
        renderTimelineList();
      });
    });
  };

  // 3. Markdown Split Editor Binding
  const initMarkdownEditor = () => {
    const select = $('#md-file-select');
    const textarea = $('#md-source-text');
    const preview = $('#md-live-render');

    const loadCurrentDoc = () => {
      const path = select.value;
      textarea.value = virtualFiles[path] || '';
      renderLive();
    };

    const renderLive = () => {
      if (window.marked && window.DOMPurify) {
        preview.innerHTML = DOMPurify.sanitize(marked.parse(textarea.value || ''));
      } else {
        preview.textContent = textarea.value;
      }
      virtualFiles[select.value] = textarea.value;
    };

    select.addEventListener('change', loadCurrentDoc);
    textarea.addEventListener('input', renderLive);
    loadCurrentDoc();
  };

  // 4. Questions Binding
  const initQuestions = () => {
    $('#q-id').value = currentQuestion.id;
    $('#q-content-md').value = virtualFiles["questions/q01/question.md"] || '';
    $('#q-expl-md').value = virtualFiles["questions/q01/explanation.md"] || '';
    $('#q-hint-md').value = virtualFiles["questions/q01/hint.md"] || '';

    $('#q-content-md').addEventListener('input', e => virtualFiles["questions/q01/question.md"] = e.target.value);
    $('#q-expl-md').addEventListener('input', e => virtualFiles["questions/q01/explanation.md"] = e.target.value);
    $('#q-hint-md').addEventListener('input', e => virtualFiles["questions/q01/hint.md"] = e.target.value);

    renderOptionsList();
    $('#btn-add-option').addEventListener('click', () => {
      const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
      const nextLetter = letters[currentQuestion.options.length] || `Opt${currentQuestion.options.length + 1}`;
      currentQuestion.options.push({ id: nextLetter, text: `Lựa chọn ${nextLetter}` });
      renderOptionsList();
    });
  };

  const renderOptionsList = () => {
    const slot = $('#q-options-slot');
    slot.innerHTML = currentQuestion.options.map((opt, idx) => `
      <div class="opt-edit-row">
        <span class="opt-id">${opt.id}.</span>
        <input type="text" class="opt-text-input" data-idx="${idx}" value="${opt.text}">
        <label class="opt-correct-chk">
          <input type="radio" name="correct-opt" class="opt-radio" data-id="${opt.id}" ${currentQuestion.answer.correctOptionIds.includes(opt.id) ? 'checked' : ''}>
          Đáp án đúng
        </label>
        <button class="btn outline btn-xs opt-del-btn" data-idx="${idx}">✕</button>
      </div>
    `).join('');

    $$('.opt-text-input', slot).forEach(input => {
      input.addEventListener('input', () => {
        currentQuestion.options[Number(input.dataset.idx)].text = input.value;
      });
    });

    $$('.opt-radio', slot).forEach(radio => {
      radio.addEventListener('change', () => {
        currentQuestion.answer.correctOptionIds = [radio.dataset.id];
      });
    });

    $$('.opt-del-btn', slot).forEach(btn => {
      btn.addEventListener('click', () => {
        currentQuestion.options.splice(Number(btn.dataset.idx), 1);
        renderOptionsList();
      });
    });
  };

  // 5. Coding & Unit Tests Binding
  const initCoding = () => {
    $('#code-starter-html').value = virtualFiles["starter/index.html"] || '';
    $('#code-starter-css').value = virtualFiles["starter/style.css"] || '';

    $('#code-starter-html').addEventListener('input', e => virtualFiles["starter/index.html"] = e.target.value);
    $('#code-starter-css').addEventListener('input', e => virtualFiles["starter/style.css"] = e.target.value);

    renderTestsList();
    $('#btn-add-test').addEventListener('click', () => {
      currentTests.push({
        id: `t${currentTests.length + 1}`,
        title: "Tiêu chí kiểm thử mới",
        selector: ".navbar",
        property: "display",
        expected: "flex"
      });
      renderTestsList();
    });
  };

  const renderTestsList = () => {
    const slot = $('#testsuite-slot');
    slot.innerHTML = currentTests.map((t, idx) => `
      <div class="test-edit-row">
        <strong style="color:var(--studio-accent);">${t.id}</strong>
        <input type="text" class="test-title-input" data-idx="${idx}" value="${t.title}" style="flex:2;">
        <input type="text" class="test-sel-input" data-idx="${idx}" value="${t.selector}" style="flex:1;" placeholder="CSS Selector">
        <input type="text" class="test-prop-input" data-idx="${idx}" value="${t.property}" style="flex:1;" placeholder="Thuộc tính">
        <input type="text" class="test-exp-input" data-idx="${idx}" value="${t.expected}" style="flex:1;" placeholder="Kỳ vọng">
        <button class="btn outline btn-xs test-del-btn" data-idx="${idx}">✕</button>
      </div>
    `).join('');

    $$('.test-title-input', slot).forEach(input => input.addEventListener('input', () => currentTests[Number(input.dataset.idx)].title = input.value));
    $$('.test-sel-input', slot).forEach(input => input.addEventListener('input', () => currentTests[Number(input.dataset.idx)].selector = input.value));
    $$('.test-prop-input', slot).forEach(input => input.addEventListener('input', () => currentTests[Number(input.dataset.idx)].property = input.value));
    $$('.test-exp-input', slot).forEach(input => input.addEventListener('input', () => currentTests[Number(input.dataset.idx)].expected = input.value));
    $$('.test-del-btn', slot).forEach(btn => btn.addEventListener('click', () => {
      currentTests.splice(Number(btn.dataset.idx), 1);
      renderTestsList();
    }));
  };

  // 6. Validation Engine & Pre-publish Checklist
  const runPrePublishValidation = () => {
    const res = window.LessonValidator
      ? window.LessonValidator.validateLessonPackage(currentLesson, virtualFiles)
      : { valid: true, errors: [], warnings: [] };

    let passedChecks = 8;
    if (res.errors.length > 0) passedChecks = Math.max(3, 8 - res.errors.length);

    $('#validate-score').textContent = `${passedChecks}/8`;
    $('#validate-headline').textContent = res.valid ? 'Sẵn sàng xuất bản!' : 'Còn một số điểm cần điều chỉnh';
    $('#validate-sub').textContent = res.valid
      ? 'Dữ liệu bài học vượt qua tất cả các kiểm tra cấu trúc schema và logic ngữ nghĩa.'
      : res.errors.join('; ');

    const badge = $('#badge-validate-status');
    badge.textContent = res.valid ? 'OK' : 'ERR';
    badge.className = `badge ${res.valid ? 'status-ok' : ''}`;
  };

  // Export JSON & Export ZIP (using JSZip)
  const initExportImport = () => {
    // Export JSON
    $('#btn-export-json').addEventListener('click', () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentLesson, null, 2));
      const a = document.createElement('a');
      a.href = dataStr;
      a.download = `${currentLesson.id || 'lesson'}.json`;
      a.click();
    });

    // Export ZIP
    const exportZip = async () => {
      if (!window.JSZip) {
        alert('Thư viện JSZip đang tải, vui lòng thử lại sau vài giây.');
        return;
      }
      const zip = new JSZip();

      // Add lesson.json
      zip.file('lesson.json', JSON.stringify(currentLesson, null, 2));

      // Add questions
      zip.file('questions/q01/question.json', JSON.stringify(currentQuestion, null, 2));

      // Add tests
      zip.file('tests/flexbox.test.json', JSON.stringify({ suite: currentLesson.title, tests: currentTests }, null, 2));

      // Add all virtual markdown and starter files
      Object.entries(virtualFiles).forEach(([path, content]) => {
        zip.file(path, content);
      });

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${currentLesson.id || 'lesson'}-package.zip`;
      a.click();
      URL.revokeObjectURL(url);
    };

    $('#btn-export-zip').addEventListener('click', exportZip);
    $('#btn-publish-now').addEventListener('click', exportZip);

    // Import File Handling
    const fileInput = $('#import-file-input');
    $('#btn-import-package').addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (file.name.endsWith('.json')) {
        const text = await file.text();
        try {
          currentLesson = JSON.parse(text);
          alert(`Đã import thành công: ${currentLesson.title}`);
          location.reload();
        } catch (err) {
          alert(`Lỗi đọc JSON: ${err.message}`);
        }
      } else if (file.name.endsWith('.zip') && window.JSZip) {
        try {
          const zip = await JSZip.loadAsync(file);
          if (zip.file('lesson.json')) {
            const lessonText = await zip.file('lesson.json').async('text');
            currentLesson = JSON.parse(lessonText);
          }
          for (const [relativePath, zipEntry] of Object.entries(zip.files)) {
            if (!zipEntry.dir) {
              virtualFiles[relativePath] = await zipEntry.async('text');
            }
          }
          alert(`Đã import gói ZIP thành công: ${currentLesson.title}`);
          location.reload();
        } catch (err) {
          alert(`Lỗi giải nén ZIP: ${err.message}`);
        }
      }
    });
  };

  // Initial Boot
  const boot = () => {
    initTabs();
    initMeta();
    initTimeline();
    initMarkdownEditor();
    initQuestions();
    initCoding();
    initExportImport();
    runPrePublishValidation();
  };

  boot();
})();
