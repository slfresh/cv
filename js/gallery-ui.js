/**
 * Job galleries: max 6 thumbnails, full set in lightbox with prev/next, keyboard, swipe.
 * Expects window.JOB_GALLERIES and window.GALLERY_UI (from gallery-data-*.js).
 */
(function () {
  var MAX_THUMB = 6;
  var _lbItems = null;
  var _lbIndex = 0;
  var _lightboxTrigger = null;
  var _touchStartX = null;

  function getLb() {
    return document.getElementById('lightbox');
  }

  function getCloseBtn() {
    var lb = getLb();
    if (!lb) return null;
    return lb.querySelector('[data-lightbox-close]') || lb.querySelector('button[aria-label="Schließen"], button[aria-label="Close"]');
  }

  function getUI() {
    return window.GALLERY_UI || {};
  }

  function escapeAttr(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function setNavVisible(show) {
    var p = document.getElementById('lightbox-prev');
    var n = document.getElementById('lightbox-next');
    if (p) {
      p.style.display = show ? 'flex' : 'none';
      p.setAttribute('aria-hidden', show ? 'false' : 'true');
      p.tabIndex = show ? 0 : -1;
    }
    if (n) {
      n.style.display = show ? 'flex' : 'none';
      n.setAttribute('aria-hidden', show ? 'false' : 'true');
      n.tabIndex = show ? 0 : -1;
    }
  }

  function updateNavLabels() {
    var ui = getUI();
    var p = document.getElementById('lightbox-prev');
    var n = document.getElementById('lightbox-next');
    if (p && ui.prevLabel) p.setAttribute('aria-label', ui.prevLabel);
    if (n && ui.nextLabel) n.setAttribute('aria-label', ui.nextLabel);
  }

  function preloadAdjacent() {
    if (!_lbItems || _lbItems.length < 2) return;
    var next = _lbItems[_lbIndex + 1];
    var prev = _lbItems[_lbIndex - 1];
    if (next) {
      var i = new Image();
      i.src = next.src;
    }
    if (prev) {
      var j = new Image();
      j.src = prev.src;
    }
  }

  function showGallerySlide() {
    if (!_lbItems || !_lbItems.length) return;
    var item = _lbItems[_lbIndex];
    var img = document.getElementById('lightbox-img');
    var cap = document.getElementById('lightbox-caption');
    var ctr = document.getElementById('lightbox-counter');
    img.src = item.src;
    img.alt = item.alt || item.caption;
    cap.textContent = item.caption;
    var ui = getUI();
    ctr.textContent = ui.counter ? ui.counter(_lbIndex + 1, _lbItems.length) : _lbIndex + 1 + ' / ' + _lbItems.length;
    ctr.classList.remove('hidden', 'invisible', 'opacity-0');
    ctr.setAttribute('aria-live', 'polite');
    preloadAdjacent();
  }

  window.galleryPrev = function () {
    if (!_lbItems || _lbItems.length < 2) return;
    _lbIndex = (_lbIndex - 1 + _lbItems.length) % _lbItems.length;
    showGallerySlide();
  };

  window.galleryNext = function () {
    if (!_lbItems || _lbItems.length < 2) return;
    _lbIndex = (_lbIndex + 1) % _lbItems.length;
    showGallerySlide();
  };

  window.openLightbox = function (src, caption) {
    _lightboxTrigger = document.activeElement;
    _lbItems = null;
    _lbIndex = 0;
    var lb = getLb();
    if (!lb) return;
    lb.removeEventListener('keydown', _trapFocus);
    var img = document.getElementById('lightbox-img');
    var ctr = document.getElementById('lightbox-counter');
    img.src = src;
    img.alt = caption;
    document.getElementById('lightbox-caption').textContent = caption;
    if (ctr) {
      ctr.textContent = '';
      ctr.classList.add('hidden');
    }
    setNavVisible(false);
    lb.classList.add('active');
    document.body.style.overflow = 'hidden';
    updateNavLabels();
    var closeBtn = getCloseBtn();
    if (closeBtn) closeBtn.focus();
    lb.addEventListener('keydown', _trapFocus);
  };

  window.openJobGallery = function (jobKey, startIndex) {
    var list = window.JOB_GALLERIES && window.JOB_GALLERIES[jobKey];
    if (!list || !list.length) return;
    _lightboxTrigger = document.activeElement;
    _lbItems = list;
    _lbIndex = Math.max(0, Math.min(Number(startIndex) || 0, list.length - 1));
    var lb = getLb();
    if (!lb) return;
    lb.removeEventListener('keydown', _trapFocus);
    showGallerySlide();
    setNavVisible(list.length > 1);
    lb.classList.add('active');
    document.body.style.overflow = 'hidden';
    updateNavLabels();
    var closeBtn = getCloseBtn();
    if (closeBtn) closeBtn.focus();
    lb.addEventListener('keydown', _trapFocus);
  };

  window.closeLightbox = function () {
    var lb = getLb();
    if (!lb) return;
    lb.removeEventListener('keydown', _trapFocus);
    lb.classList.remove('active');
    document.body.style.overflow = '';
    _lbItems = null;
    if (_lightboxTrigger && typeof _lightboxTrigger.focus === 'function') {
      try {
        _lightboxTrigger.focus();
      } catch (e) {}
    }
    _lightboxTrigger = null;
  };

  function isLbControlVisible(el) {
    if (!el) return false;
    return window.getComputedStyle(el).display !== 'none';
  }

  function _trapFocus(e) {
    if (e.key !== 'Tab') return;
    var list = [];
    var closeBtn = getCloseBtn();
    if (closeBtn && isLbControlVisible(closeBtn)) list.push(closeBtn);
    var prev = document.getElementById('lightbox-prev');
    var next = document.getElementById('lightbox-next');
    if (prev && isLbControlVisible(prev)) list.push(prev);
    if (next && isLbControlVisible(next)) list.push(next);
    if (!list.length) return;
    var first = list[0];
    var last = list[list.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  function onDocKeydown(e) {
    var lb = getLb();
    if (!lb || !lb.classList.contains('active')) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      window.closeLightbox();
      return;
    }
    if (_lbItems && _lbItems.length > 1) {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        window.galleryPrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        window.galleryNext();
      }
    }
  }

  function onTouchStart(e) {
    if (!_lbItems || _lbItems.length < 2) return;
    if (e.touches.length === 1) _touchStartX = e.touches[0].clientX;
  }

  function onTouchEnd(e) {
    if (_touchStartX == null || !_lbItems || _lbItems.length < 2) return;
    if (!e.changedTouches.length) return;
    var dx = e.changedTouches[0].clientX - _touchStartX;
    _touchStartX = null;
    if (Math.abs(dx) < 48) return;
    if (dx > 0) window.galleryPrev();
    else window.galleryNext();
  }

  function initJobGalleries() {
    document.querySelectorAll('[data-job-gallery]').forEach(function (root) {
      var key = root.getAttribute('data-job-gallery');
      var data = window.JOB_GALLERIES[key];
      if (!data || !data.length) return;
      var gridClass =
        root.getAttribute('data-grid-class') || 'grid grid-cols-2 sm:grid-cols-3 gap-2 md:gap-3';
      var grid = document.createElement('div');
      grid.className = gridClass;
      var vis = Math.min(MAX_THUMB, data.length);
      for (var i = 0; i < vis; i++) {
        (function (idx) {
          var it = data[idx];
          var btn = document.createElement('button');
          btn.type = 'button';
          btn.className =
            'job-ph gallery-item relative rounded-xl overflow-hidden border-0 p-0 text-left cursor-pointer';
          btn.addEventListener('click', function () {
            window.openJobGallery(key, idx);
          });
          var img = document.createElement('img');
          img.src = it.src;
          img.alt = it.alt || it.caption;
          img.className = 'w-full h-28 sm:h-32 object-cover';
          img.loading = 'lazy';
          var ov = document.createElement('span');
          ov.className = 'gallery-overlay';
          var lab = document.createElement('span');
          lab.className =
            'absolute bottom-1.5 left-2 right-2 text-white text-[10px] sm:text-xs font-semibold leading-tight z-10 drop-shadow';
          lab.textContent = it.label || '';
          btn.appendChild(img);
          btn.appendChild(ov);
          btn.appendChild(lab);
          grid.appendChild(btn);
        })(i);
      }
      root.appendChild(grid);
      var note = document.createElement('p');
      note.className = 'text-xs text-slate-500 mt-4 job-gallery-note';
      var ui = getUI();
      note.textContent = ui.note ? ui.note(data.length, vis) : '';
      root.appendChild(note);
    });

    var stage = document.getElementById('lightbox-stage');
    if (stage) {
      stage.addEventListener('touchstart', onTouchStart, { passive: true });
      stage.addEventListener('touchend', onTouchEnd, { passive: true });
    }

    document.addEventListener('keydown', onDocKeydown);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initJobGalleries);
  } else {
    initJobGalleries();
  }
})();
