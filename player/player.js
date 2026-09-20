/**
 * Interactive Lesson Player Engine
 * HOC-WEB2026 Hybrid Content Architecture
 */
(() => {
  'use strict';

  // Fallback / Pre-loaded Lesson Data if fetch is blocked or file:// protocol is used
  const DEFAULT_LESSON_PATH = 'lessons/web-flexbox-01/lesson.json';

  // Global State
  let lesson = null;
  let currentTime = 0;
  let duration = 480;
  let isPlaying = false;
  let activeEvent = null;
  const completedCheckpoints = new Set();

  // DOM Elements
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];

  const video = $('#main-video');
  const canvas = $('#video-canvas-mock');
  const ctx = canvas ? canvas.getContext('2d') : null;
  const overlayPlayBtn = $('#overlay-play-btn');
  const ctrlPlay = $('#ctrl-play');
  const timelinePlayed = $('#timeline-played');
  const timelineContainer = $('#timeline-container');
  const checkpointsLayer = $('#checkpoints-layer');
  const timeCurrent = $('#time-current');
  const timeDuration = $('#time-duration');
  const chapterSelect = $('#chapter-select');

  const paneActivity = $('#pane-activity');
  const activityIdle = $('#activity-idle');
  const activeActivityWrap = $('#active-activity-wrap');
  const activityBodyScroll = $('#activity-body-scroll');
  const actTypeBadge = $('#act-type-badge');
  const actTimeBadge = $('#act-time-badge');
  const actSkipBtn = $('#act-skip-btn');

  // Format MM:SS
  const formatTime = sec => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Safe Markdown renderer
  const renderMarkdown = mdText => {
    if (window.marked && window.DOMPurify) {
      return DOMPurify.sanitize(marked.parse(mdText || ''));
    }
    return mdText ? mdText.replace(/</g, '&lt;').replace(/\n/g, '<br>') : '';
  };

  // Safe file loader (fetch or fallback)
  const loadFile = async (path, type = 'text') => {
    try {
      const res = await fetch(path);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return type === 'json' ? await res.json() : await res.text();
    } catch (e) {
      console.warn(`Fetch file ${path} failed, attempting memory fallback...`, e);
      return null;
    }
  };

  // Canvas Video Mockup Animation (Simulates Motion Canvas slides if MP4 not loaded)
  let canvasAnimFrame = null;
  const renderCanvasSlide = (time) => {
    if (!ctx) return;
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Dark slate background
    const bgGrad = ctx.createLinearGradient(0, 0, w, h);
    bgGrad.addColorStop(0, '#0a232b');
    bgGrad.addColorStop(1, '#133a38');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Top Header
    ctx.fillStyle = '#68d9a9';
    ctx.font = 'bold 36px "Space Grotesk", sans-serif';
    ctx.fillText('HOCWEB2026 · VIDEO TƯƠNG TÁC', 80, 80);

    // Current Chapter title
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 48px "Space Grotesk", sans-serif';
    const currentChapter = (lesson && lesson.chapters)
      ? ([...lesson.chapters].reverse().find(ch => time >= ch.start) || lesson.chapters[0]).title
      : 'Khám phá CSS Flexbox';
    ctx.fillText(currentChapter, 80, 150);

    // Visual Slide Content based on time
    if (time < 60) {
      // Intro slide
      ctx.fillStyle = '#bce9db';
      ctx.font = '28px sans-serif';
      ctx.fillText('• Mô hình Flexible Box Layout trong CSS3', 100, 240);
      ctx.fillText('• Dàn trang trực quan không cần float/clear', 100, 300);
      ctx.fillText('• Tự động thích ứng kích thước các phần tử', 100, 360);

      // Mini animation box
      const pulse = Math.sin(time * 3) * 10;
      ctx.strokeStyle = '#68d9a9';
      ctx.lineWidth = 4;
      ctx.strokeRect(100, 430, 400 + pulse, 140);
      ctx.fillStyle = '#26795f';
      ctx.fillRect(120, 450, 100, 100);
      ctx.fillRect(240, 450, 100, 100);
      ctx.fillRect(360, 450, 100, 100);
    } else if (time < 180) {
      // Quiz & Theory checkpoint slide
      ctx.fillStyle = '#ffc584';
      ctx.font = 'bold 32px monospace';
      ctx.fillText('.container { display: flex; }', 100, 250);

      ctx.fillStyle = '#ffffff';
      ctx.font = '26px sans-serif';
      ctx.fillText('Kích hoạt Flex Container: Các con trực tiếp trở thành Flex Items.', 100, 320);

      // Draw Main Axis
      ctx.strokeStyle = '#68d9a9';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(100, 420);
      ctx.lineTo(800, 420);
      ctx.stroke();
      ctx.fillStyle = '#68d9a9';
      ctx.fillText('➔ Trục chính (Main Axis: flex-direction row)', 100, 460);
    } else if (time < 320) {
      // Coding Practice slide
      ctx.fillStyle = '#8ce6be';
      ctx.font = 'bold 34px sans-serif';
      ctx.fillText('Thực hành: Dàn trang thanh Header / Navbar', 100, 260);
      ctx.fillStyle = '#ffffff';
      ctx.font = '24px monospace';
      ctx.fillText('justify-content: space-between;', 100, 330);
      ctx.fillText('align-items: center;', 100, 380);
    } else {
      // Simulation slide
      ctx.fillStyle = '#ffffff';
      ctx.font = '30px sans-serif';
      ctx.fillText('Trực quan hóa: justify-content & gap', 100, 280);
    }

    // Time ticker on canvas
    ctx.fillStyle = '#4e7472';
    ctx.font = 'bold 22px monospace';
    ctx.fillText(`${formatTime(time)} / ${formatTime(duration)}`, w - 240, h - 40);
  };

  // Video Playback Controls
  const togglePlay = () => {
    if (isPlaying) {
      pauseVideo();
    } else {
      playVideo();
    }
  };

  const playVideo = () => {
    isPlaying = true;
    overlayPlayBtn.hidden = true;
    ctrlPlay.textContent = '⏸';
    ctrlPlay.title = 'Tạm dừng (Space)';

    if (video && !video.paused) {
      video.play().catch(() => {});
    }

    lastTimestamp = performance.now();
    startTicker();
  };

  const pauseVideo = () => {
    isPlaying = false;
    overlayPlayBtn.hidden = false;
    ctrlPlay.textContent = '▶';
    ctrlPlay.title = 'Phát video (Space)';
    if (video) video.pause();
    cancelAnimationFrame(canvasAnimFrame);
  };

  let lastTimestamp = performance.now();
  const startTicker = () => {
    const loop = (now) => {
      if (!isPlaying) return;
      const delta = (now - lastTimestamp) / 1000;
      lastTimestamp = now;

      currentTime += delta;
      if (currentTime >= duration) {
        currentTime = duration;
        pauseVideo();
      }

      updateTimelineView();
      renderCanvasSlide(currentTime);
      checkTimelineEvents(currentTime);

      canvasAnimFrame = requestAnimationFrame(loop);
    };
    canvasAnimFrame = requestAnimationFrame(loop);
  };

  const updateTimelineView = () => {
    const pct = Math.min(100, (currentTime / duration) * 100);
    timelinePlayed.style.width = `${pct}%`;
    timeCurrent.textContent = formatTime(currentTime);

    // Update chapter select dropdown
    if (lesson && lesson.chapters) {
      const idx = [...lesson.chapters].reverse().findIndex(ch => currentTime >= ch.start);
      if (idx !== -1) {
        const realIdx = lesson.chapters.length - 1 - idx;
        if (chapterSelect.selectedIndex !== realIdx) {
          chapterSelect.selectedIndex = realIdx;
        }
      }
    }
  };

  const seekTo = (sec) => {
    currentTime = Math.max(0, Math.min(duration, sec));
    if (video) video.currentTime = currentTime;
    updateTimelineView();
    renderCanvasSlide(currentTime);
  };

  // Timeline Event Checkpoints Watcher
  const checkTimelineEvents = (time) => {
    if (activeEvent || !lesson || !lesson.timeline) return;

    // Find if a checkpoint triggers right now
    const event = lesson.timeline.find(item =>
      time >= item.time &&
      (time - item.time) <= 1.5 && // Trigger window
      !completedCheckpoints.has(item.id)
    );

    if (event) {
      if (event.pauseVideo) {
        pauseVideo();
      }
      triggerActivity(event);
    }
  };

  // Trigger Activity
  const triggerActivity = async (event) => {
    activeEvent = event;
    const act = lesson.activities.find(a => a.id === event.target);

    // Switch to activity tab
    $('#tab-activity').click();

    activityIdle.hidden = true;
    activeActivityWrap.hidden = false;
    actTypeBadge.textContent = act ? act.type.toUpperCase() : 'CHECKPOINT';
    actTimeBadge.textContent = formatTime(event.time);

    activityBodyScroll.innerHTML = '<p class="frame-loading">Đang tải hoạt động...</p>';

    if (!act) {
      activityBodyScroll.innerHTML = `<div class="feedback-box incorrect">Không tìm thấy cấu hình hoạt động: ${event.target}</div>`;
      return;
    }

    if (act.type === 'quiz') {
      await renderQuizActivity(act, event);
    } else if (act.type === 'coding') {
      await renderCodingActivity(act, event);
    } else if (act.type === 'simulation') {
      renderSimulationActivity(act, event);
    }
  };

  // 1. Render Quiz Activity
  const renderQuizActivity = async (act, event) => {
    const qConfig = await loadFile(act.config, 'json') || {
      id: 'q01',
      options: [
        { id: 'A', text: 'display: block' },
        { id: 'B', text: 'display: flex' },
        { id: 'C', text: 'display: grid' },
        { id: 'D', text: 'display: inline' }
      ],
      answer: { correctOptionIds: ['B'] },
      feedback: {
        explanation: 'questions/q01/explanation.md',
        hint: 'questions/q01/hint.md'
      }
    };

    const qContentMd = await loadFile('lessons/web-flexbox-01/questions/q01/question.md') ||
      '# Câu hỏi kiểm tra: Khởi tạo Flexbox\n\nThuộc tính CSS nào dưới đây được sử dụng để kích hoạt mô hình Flexible Box?';

    let selectedOptionId = null;

    activityBodyScroll.innerHTML = `
      <div class="quiz-card">
        <div class="quiz-prompt">${renderMarkdown(qContentMd)}</div>
        <div class="quiz-options" id="quiz-options-group">
          ${qConfig.options.map(opt => `
            <button class="quiz-option-btn" data-id="${opt.id}">
              <span class="option-circle">${opt.id}</span>
              <span class="option-text">${opt.text}</span>
            </button>
          `).join('')}
        </div>
        <div id="quiz-feedback-slot"></div>
        <div class="quiz-actions" style="margin-top: 18px; display: flex; gap: 10px;">
          <button class="btn primary" id="quiz-submit-btn" disabled>Kiểm tra đáp án</button>
          <button class="btn outline" id="quiz-hint-btn">💡 Xem gợi ý</button>
        </div>
      </div>
    `;

    const optButtons = $$('.quiz-option-btn', activityBodyScroll);
    const submitBtn = $('#quiz-submit-btn', activityBodyScroll);
    const hintBtn = $('#quiz-hint-btn', activityBodyScroll);
    const feedbackSlot = $('#quiz-feedback-slot', activityBodyScroll);

    optButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        optButtons.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedOptionId = btn.dataset.id;
        submitBtn.disabled = false;
      });
    });

    hintBtn.addEventListener('click', async () => {
      const hintMd = await loadFile('lessons/web-flexbox-01/questions/q01/hint.md') ||
        'Gợi ý: Tên gọi Flexible Box chứa từ khóa cần chọn!';
      feedbackSlot.innerHTML = `<div class="feedback-box" style="background:#264349; border:1px solid #3d6a74; color:#fff;">${renderMarkdown(hintMd)}</div>`;
    });

    submitBtn.addEventListener('click', async () => {
      const isCorrect = qConfig.answer.correctOptionIds.includes(selectedOptionId);
      if (isCorrect) {
        completedCheckpoints.add(event.id);
        updateProgress();

        const explMd = await loadFile('lessons/web-flexbox-01/questions/q01/explanation.md') ||
          '## Chính xác! Đáp án đúng là: B (`display: flex`)';

        feedbackSlot.innerHTML = `
          <div class="feedback-box correct">
            <strong>🎉 Rất chính xác!</strong>
            <div>${renderMarkdown(explMd)}</div>
            <button class="btn primary" id="quiz-continue-btn" style="margin-top: 14px;">Tiếp tục bài giảng ▶</button>
          </div>
        `;
        submitBtn.disabled = true;

        $('#quiz-continue-btn').addEventListener('click', () => {
          completeActiveEvent();
        });
      } else {
        feedbackSlot.innerHTML = `
          <div class="feedback-box incorrect">
            <strong>❌ Chưa chính xác!</strong> Hãy đọc lại gợi ý và thử chọn lại một phương án khác nhé.
          </div>
        `;
      }
    });
  };

  // 2. Render Coding Activity
  const renderCodingActivity = async (act, event) => {
    const starterHtml = await loadFile('lessons/web-flexbox-01/starter/index.html') ||
      '<nav class="navbar">\n  <div class="brand">🚀 EduShop</div>\n  <div class="nav-links">\n    <a href="#">Trang chủ</a>\n    <a href="#">Khóa học</a>\n  </div>\n</nav>';

    const starterCss = await loadFile('lessons/web-flexbox-01/starter/style.css') ||
      '.navbar {\n  background: #fff;\n  padding: 16px 24px;\n  /* VIẾT CODE CỦA BẠN: */\n  \n}';

    const testSuite = await loadFile('lessons/web-flexbox-01/tests/flexbox.test.json', 'json') || {
      tests: [
        { id: 't1', title: '.navbar có display: flex', selector: '.navbar', property: 'display', expected: 'flex' },
        { id: 't2', title: '.navbar có justify-content: space-between', selector: '.navbar', property: 'justifyContent', expected: 'space-between' },
        { id: 't3', title: '.navbar có align-items: center', selector: '.navbar', property: 'alignItems', expected: 'center' }
      ]
    };

    let currentTab = 'css';
    let userCss = starterCss;
    let userHtml = starterHtml;

    activityBodyScroll.innerHTML = `
      <div class="coding-exercise">
        <p style="font-size: 13px; color: #fff; margin:0 0 8px;">${act.instruction || 'Viết CSS dàn trang navbar bằng Flexbox:'}</p>
        
        <div class="code-editor-header">
          <div class="code-tab-switch">
            <button class="code-tab-btn active" id="tab-css">style.css</button>
            <button class="code-tab-btn" id="tab-html">index.html</button>
          </div>
          <button class="btn outline btn-xs" id="reset-code-btn">↺ Khôi phục ban đầu</button>
        </div>
        <textarea class="code-textarea" id="code-input" spellcheck="false">${starterCss}</textarea>
        
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:4px;">
          <strong style="font-size:11px; color:var(--player-muted); text-transform:uppercase;">Kết quả hiển thị trực tiếp:</strong>
          <button class="btn primary btn-xs" id="run-test-btn">▶ Chạy kiểm thử (Run Tests)</button>
        </div>
        <div class="live-preview-box">
          <iframe class="preview-iframe" id="code-preview-frame" sandbox="allow-scripts"></iframe>
        </div>

        <div class="tests-summary" id="tests-summary-box">
          <strong style="display:block; font-size:12px; margin-bottom:8px; color:#fff;">Tiêu chí kiểm thử:</strong>
          <div id="tests-list-slot">
            ${testSuite.tests.map(t => `
              <div class="test-row" id="test-row-${t.id}">
                <span class="test-status-icon">○</span>
                <span>${t.title}</span>
              </div>
            `).join('')}
          </div>
        </div>
        <div id="coding-success-slot"></div>
      </div>
    `;

    const codeInput = $('#code-input', activityBodyScroll);
    const previewFrame = $('#code-preview-frame', activityBodyScroll);
    const runTestBtn = $('#run-test-btn', activityBodyScroll);
    const tabCss = $('#tab-css', activityBodyScroll);
    const tabHtml = $('#tab-html', activityBodyScroll);

    const updatePreview = () => {
      const doc = `
        <!DOCTYPE html>
        <html>
        <head><style>${userCss}</style></head>
        <body>${userHtml}</body>
        </html>
      `;
      previewFrame.srcdoc = doc;
    };

    updatePreview();

    codeInput.addEventListener('input', () => {
      if (currentTab === 'css') userCss = codeInput.value;
      else userHtml = codeInput.value;
      updatePreview();
    });

    tabCss.addEventListener('click', () => {
      currentTab = 'css';
      tabCss.classList.add('active');
      tabHtml.classList.remove('active');
      codeInput.value = userCss;
    });

    tabHtml.addEventListener('click', () => {
      currentTab = 'html';
      tabHtml.classList.add('active');
      tabCss.classList.remove('active');
      codeInput.value = userHtml;
    });

    // Test Runner using getComputedStyle inside the sandboxed iframe
    runTestBtn.addEventListener('click', () => {
      const iframeDoc = previewFrame.contentDocument || previewFrame.contentWindow.document;
      let allPassed = true;

      testSuite.tests.forEach(test => {
        const row = $(`#test-row-${test.id}`, activityBodyScroll);
        const icon = row.querySelector('.test-status-icon');
        const targetElem = iframeDoc.querySelector(test.selector);

        if (!targetElem) {
          allPassed = false;
          row.className = 'test-row failed';
          icon.textContent = '✕';
          return;
        }

        const computed = iframeDoc.defaultView.getComputedStyle(targetElem);
        const actualVal = computed[test.property] || computed.getPropertyValue(test.property);

        if (actualVal === test.expected) {
          row.className = 'test-row passed';
          icon.textContent = '✓';
        } else {
          allPassed = false;
          row.className = 'test-row failed';
          icon.textContent = '✕';
        }
      });

      const successSlot = $('#coding-success-slot', activityBodyScroll);
      if (allPassed) {
        completedCheckpoints.add(event.id);
        updateProgress();
        successSlot.innerHTML = `
          <div class="feedback-box correct" style="margin-top:14px;">
            <strong>🎉 Xuất sắc! Tất cả bài test đều đã ĐẠT!</strong>
            <p style="margin:6px 0 10px;">Bạn đã ứng dụng thành công Flexbox để dàn trang Header.</p>
            <button class="btn primary" id="coding-continue-btn">Tiếp tục bài giảng ▶</button>
          </div>
        `;
        $('#coding-continue-btn').addEventListener('click', () => {
          completeActiveEvent();
        });
      } else {
        successSlot.innerHTML = `
          <div class="feedback-box incorrect" style="margin-top:10px;">
            Một số tiêu chuẩn chưa đạt. Hãy bổ sung <code>display: flex</code> và <code>justify-content: space-between</code> vào <code>.navbar</code> nhé!
          </div>
        `;
      }
    });
  };

  // 3. Render Simulation Activity
  const renderSimulationActivity = (act, event) => {
    activityBodyScroll.innerHTML = `
      <div class="simulation-exercise">
        <p style="font-size: 13px; color: #fff; margin-bottom: 12px;">Điều chỉnh trực quan các thuộc tính Flexbox và quan sát sự thay đổi:</p>
        <div class="sim-controls-grid">
          <div class="sim-row">
            <label>justify-content (Căn trên trục chính):</label>
            <select id="sim-justify">
              <option value="flex-start">flex-start (Dồn trái)</option>
              <option value="center">center (Căn giữa)</option>
              <option value="flex-end">flex-end (Dồn phải)</option>
              <option value="space-between" selected>space-between (Dồn 2 biên)</option>
              <option value="space-around">space-around (Khoảng cách đều)</option>
              <option value="space-evenly">space-evenly (Cân đối tuyệt đối)</option>
            </select>
          </div>
          <div class="sim-row">
            <label>align-items (Căn trên trục đứng):</label>
            <select id="sim-align">
              <option value="stretch">stretch</option>
              <option value="center" selected>center</option>
              <option value="flex-start">flex-start</option>
              <option value="flex-end">flex-end</option>
            </select>
          </div>
          <div class="sim-row">
            <label>gap (Khoảng cách giữa các hộp): <span id="sim-gap-val">16px</span></label>
            <input type="range" id="sim-gap" min="0" max="40" step="4" value="16">
          </div>
        </div>

        <div class="sim-preview-stage" id="sim-stage">
          <div class="sim-box">01</div>
          <div class="sim-box">02</div>
          <div class="sim-box">03</div>
        </div>

        <button class="btn primary" id="sim-complete-btn" style="margin-top: 18px; width: 100%;">✓ Đã nắm rõ cách hoạt động → Tiếp tục video</button>
      </div>
    `;

    const stage = $('#sim-stage', activityBodyScroll);
    const selJustify = $('#sim-justify', activityBodyScroll);
    const selAlign = $('#sim-align', activityBodyScroll);
    const rangeGap = $('#sim-gap', activityBodyScroll);
    const gapVal = $('#sim-gap-val', activityBodyScroll);

    const applySim = () => {
      stage.style.justifyContent = selJustify.value;
      stage.style.alignItems = selAlign.value;
      stage.style.gap = `${rangeGap.value}px`;
      gapVal.textContent = `${rangeGap.value}px`;
    };

    selJustify.addEventListener('change', applySim);
    selAlign.addEventListener('change', applySim);
    rangeGap.addEventListener('input', applySim);
    applySim();

    $('#sim-complete-btn', activityBodyScroll).addEventListener('click', () => {
      completedCheckpoints.add(event.id);
      updateProgress();
      completeActiveEvent();
    });
  };

  const completeActiveEvent = () => {
    activeEvent = null;
    activeActivityWrap.hidden = true;
    activityIdle.hidden = false;
    playVideo();
  };

  actSkipBtn.addEventListener('click', () => {
    completeActiveEvent();
  });

  // Progress Update
  const updateProgress = () => {
    const total = lesson && lesson.timeline ? lesson.timeline.length : 3;
    const count = completedCheckpoints.size;
    $('#player-progress-text').textContent = `${count}/${total} Checkpoints`;

    // Update marker styles
    lesson && lesson.timeline && lesson.timeline.forEach(item => {
      const marker = $(`#marker-${item.id}`);
      if (marker && completedCheckpoints.has(item.id)) {
        marker.classList.add('passed');
      }
    });
  };

  // Setup Timeline Markers
  const setupTimelineMarkers = () => {
    checkpointsLayer.innerHTML = '';
    if (!lesson || !lesson.timeline) return;

    lesson.timeline.forEach(item => {
      const pct = (item.time / duration) * 100;
      const marker = document.createElement('div');
      marker.className = 'checkpoint-marker';
      marker.id = `marker-${item.id}`;
      marker.style.left = `${pct}%`;
      marker.title = `Checkpoint [${formatTime(item.time)}]: ${item.target}`;
      marker.addEventListener('click', (e) => {
        e.stopPropagation();
        seekTo(item.time);
      });
      checkpointsLayer.appendChild(marker);
    });
  };

  // Populate Checkpoints Tab
  const populateCheckpointsTab = () => {
    const listSlot = $('#checkpoints-list');
    listSlot.innerHTML = '';
    if (!lesson || !lesson.timeline) return;

    lesson.timeline.forEach(item => {
      const card = document.createElement('div');
      card.className = 'checkpoint-list-item';
      card.innerHTML = `
        <span class="cp-time">${formatTime(item.time)}</span>
        <div class="cp-info">
          <strong>${item.target}</strong>
          <small>${item.action} · ${item.pauseVideo ? 'Tạm dừng video' : 'Hiện thông báo'}</small>
        </div>
      `;
      card.addEventListener('click', () => {
        seekTo(item.time);
        $('#tab-activity').click();
      });
      listSlot.appendChild(card);
    });
  };

  // Populate Markdown Docs Tab
  const populateMarkdownDocs = async () => {
    const introMd = await loadFile('lessons/web-flexbox-01/content/introduction.md') || '';
    const theoryMd = await loadFile('lessons/web-flexbox-01/content/flexbox-theory.md') || '';
    const summaryMd = await loadFile('lessons/web-flexbox-01/content/summary.md') || '';

    const container = $('#markdown-doc-container');
    container.innerHTML = `
      ${renderMarkdown(introMd)}
      <hr style="border:0; border-top:1px solid var(--player-border); margin:24px 0;">
      ${renderMarkdown(theoryMd)}
      <hr style="border:0; border-top:1px solid var(--player-border); margin:24px 0;">
      ${renderMarkdown(summaryMd)}
    `;
  };

  // Tab switching
  const setupTabs = () => {
    const tabs = [
      { btn: $('#tab-activity'), pane: $('#pane-activity') },
      { btn: $('#tab-content'), pane: $('#pane-content') },
      { btn: $('#tab-checkpoints'), pane: $('#pane-checkpoints') }
    ];

    tabs.forEach(({ btn, pane }) => {
      btn.addEventListener('click', () => {
        tabs.forEach(t => {
          t.btn.classList.remove('active');
          t.pane.classList.remove('active');
        });
        btn.classList.add('active');
        pane.classList.add('active');
      });
    });
  };

  // Event Listeners
  const bindEvents = () => {
    overlayPlayBtn.addEventListener('click', togglePlay);
    ctrlPlay.addEventListener('click', togglePlay);

    timelineContainer.addEventListener('click', (e) => {
      const rect = timelineContainer.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const pct = Math.max(0, Math.min(1, clickX / rect.width));
      seekTo(pct * duration);
    });

    $('#ctrl-restart').addEventListener('click', () => seekTo(0));

    // Fullscreen / Focus toggle
    $('#player-fullscreen-btn').addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    });

    // Spacebar hotkey
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space' && e.target.tagName !== 'TEXTAREA' && e.target.tagName !== 'INPUT') {
        e.preventDefault();
        togglePlay();
      }
    });
  };

  // Initialize Player
  const init = async () => {
    setupTabs();
    bindEvents();

    // Load Lesson JSON
    lesson = await loadFile(DEFAULT_LESSON_PATH, 'json') || {
      schemaVersion: "1.0.0",
      id: "WEB-FLEXBOX-01",
      title: "Khám phá CSS Flexbox qua giao diện Home & Login",
      duration: 480,
      chapters: [
        { id: "intro", title: "01. Giới thiệu & Tổng quan Flexbox", start: 0 },
        { id: "quiz-checkpoint", title: "02. Kiểm tra nhanh: Kích hoạt Flexbox", start: 60 },
        { id: "practice-coding", title: "03. Thử thách lập trình: Căn giữa Header Menu", start: 180 },
        { id: "simulation", title: "04. Thí nghiệm trực quan: Justify & Align", start: 320 }
      ],
      activities: [
        { id: "quiz-01", type: "quiz", config: "lessons/web-flexbox-01/questions/q01/question.json" },
        { id: "coding-01", type: "coding", config: "lessons/web-flexbox-01/activities/coding-01.json" },
        { id: "simulation-01", type: "simulation", config: "lessons/web-flexbox-01/activities/simulation-01.json" }
      ],
      timeline: [
        { id: "cp-01", time: 60, action: "openActivity", target: "quiz-01", pauseVideo: true },
        { id: "cp-03", time: 180, action: "openActivity", target: "coding-01", pauseVideo: true },
        { id: "cp-04", time: 320, action: "openActivity", target: "simulation-01", pauseVideo: true }
      ]
    };

    duration = lesson.duration || 480;
    timeDuration.textContent = formatTime(duration);
    $('#player-lesson-id').textContent = lesson.id;
    $('#player-lesson-title').textContent = lesson.title;
    document.title = `${lesson.title} | Interactive Player`;

    // Populate chapters
    if (lesson.chapters) {
      chapterSelect.innerHTML = lesson.chapters.map((ch, idx) =>
        `<option value="${ch.start}">${idx + 1}. ${ch.title}</option>`
      ).join('');
      chapterSelect.addEventListener('change', () => {
        seekTo(Number(chapterSelect.value));
      });
    }

    setupTimelineMarkers();
    populateCheckpointsTab();
    populateMarkdownDocs();
    updateProgress();
    renderCanvasSlide(0);
  };

  init();
})();
