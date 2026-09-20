/**
 * Lesson Schema & Semantic Business Rules Validator
 * HOC-WEB2026 Interactive Video Learning
 */
(() => {
  'use strict';

  const validateLessonPackage = (lesson, filesMap = {}) => {
    const errors = [];
    const warnings = [];

    // 1. Structural Checks
    if (!lesson) {
      errors.push('Dữ liệu bài học (lesson.json) bị rỗng hoặc không hợp lệ.');
      return { valid: false, errors, warnings };
    }
    if (lesson.schemaVersion !== '1.0.0') {
      errors.push(`schemaVersion không hợp lệ (yêu cầu "1.0.0", nhận được "${lesson.schemaVersion}").`);
    }
    if (!lesson.id || typeof lesson.id !== 'string') {
      errors.push('Thiếu hoặc sai định dạng trường "id".');
    }
    if (!lesson.title || typeof lesson.title !== 'string') {
      errors.push('Thiếu hoặc sai định dạng trường "title".');
    }
    if (!lesson.media || !lesson.media.video) {
      errors.push('Thiếu đường dẫn video trong "media.video".');
    }
    if (!Array.isArray(lesson.activities)) {
      errors.push('Trường "activities" phải là một mảng.');
    }
    if (!Array.isArray(lesson.timeline)) {
      errors.push('Trường "timeline" phải là một mảng.');
    }

    if (errors.length > 0) {
      return { valid: false, errors, warnings };
    }

    // 2. Activity ID Uniqueness
    const activityIds = new Set();
    lesson.activities.forEach((act, idx) => {
      if (!act.id) {
        errors.push(`Hoạt động thứ #${idx + 1} thiếu trường "id".`);
      } else if (activityIds.has(act.id)) {
        errors.push(`Trùng lặp ID hoạt động: "${act.id}".`);
      } else {
        activityIds.add(act.id);
      }
      if (!act.type) {
        errors.push(`Hoạt động "${act.id || idx}" thiếu trường "type".`);
      }
      if (!act.config) {
        errors.push(`Hoạt động "${act.id || idx}" thiếu trường đường dẫn "config".`);
      }
    });

    // 3. Resource ID Uniqueness
    const resourceIds = new Set();
    if (Array.isArray(lesson.resources)) {
      lesson.resources.forEach((res, idx) => {
        if (!res.id) {
          errors.push(`Tài nguyên thứ #${idx + 1} thiếu trường "id".`);
        } else if (resourceIds.has(res.id)) {
          errors.push(`Trùng lặp ID tài nguyên: "${res.id}".`);
        } else {
          resourceIds.add(res.id);
        }
      });
    }

    // 4. Timeline Integrity Checks
    const timelineIds = new Set();
    let prevTime = -1;
    const duration = lesson.duration || 999999;

    lesson.timeline.forEach((item, idx) => {
      if (!item.id) {
        errors.push(`Mốc timeline thứ #${idx + 1} thiếu "id".`);
      } else if (timelineIds.has(item.id)) {
        errors.push(`Trùng lặp ID timeline: "${item.id}".`);
      } else {
        timelineIds.add(item.id);
      }

      if (typeof item.time !== 'number' || item.time < 0) {
        errors.push(`Mốc timeline "${item.id || idx}" có thời gian không hợp lệ.`);
      } else {
        if (lesson.duration && item.time > lesson.duration) {
          errors.push(`Mốc timeline "${item.id}" (${item.time}s) vượt quá tổng thời lượng video (${lesson.duration}s).`);
        }
        if (item.time < prevTime) {
          warnings.push(`Mốc timeline "${item.id}" (${item.time}s) xuất hiện sau mốc có thời gian lớn hơn (${prevTime}s). Khuyến nghị sắp xếp tăng dần.`);
        }
        prevTime = item.time;
      }

      // Check target exists
      if (item.action === 'openActivity') {
        if (!activityIds.has(item.target)) {
          errors.push(`Mốc timeline "${item.id}" trỏ tới activity target "${item.target}" không tồn tại trong danh sách activities.`);
        }
      } else if (item.action === 'showResource') {
        if (!resourceIds.has(item.target)) {
          errors.push(`Mốc timeline "${item.id}" trỏ tới resource target "${item.target}" không tồn tại trong danh sách resources.`);
        }
      }
    });

    // 5. File References Check (if filesMap is provided)
    if (filesMap && Object.keys(filesMap).length > 0) {
      const checkFile = (path, desc) => {
        if (!path) return;
        const normalized = path.replace(/^\.\//, '');
        if (!filesMap[normalized]) {
          warnings.push(`Không tìm thấy file ${desc}: "${path}" trong gói bài học.`);
        }
      };

      if (lesson.content) {
        Object.entries(lesson.content).forEach(([k, path]) => checkFile(path, `nội dung markdown "${k}"`));
      }
      lesson.activities.forEach(act => checkFile(act.config, `cấu hình hoạt động "${act.id}"`));
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      summary: {
        activitiesCount: lesson.activities.length,
        timelineCheckpoints: lesson.timeline.length,
        chaptersCount: (lesson.chapters || []).length,
        resourcesCount: (lesson.resources || []).length
      }
    };
  };

  window.LessonValidator = {
    validateLessonPackage
  };
})();
