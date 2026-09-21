/*
 * Design "Space" – the room engine.
 *
 * On large screens with a mouse the sheets (.js-frame) stand side by side in a perspective room.
 * The page still scrolls natively and vertically: a tall scroll area (.space) holds a sticky
 * viewport (.stage); scrolling down moves the row of sheets (.track) sideways. Sheets near the
 * edges swing away like doors, the floor grid and a copper wire run through the room, and the
 * camera follows the pointer a little. Nothing here is required to read the CV: on phones, with
 * reduced motion, without JavaScript and in print the same markup is a normal vertical document.
 */
(function () {
  'use strict';

  var root = document.documentElement;
  var space = document.getElementById('main');
  var stage = document.getElementById('stage');
  var world = document.getElementById('world');
  var track = document.getElementById('track');
  if (!space || !stage || !world || !track) return;

  var floor = world.querySelector('.floor');
  var wire = track.querySelector('.wire');
  var nav = document.getElementById('navbar');
  var hero = document.getElementById('header');
  var navLinks = [].slice.call(document.querySelectorAll('.nav-link'));
  var cursor = document.getElementById('cursor');
  var hudX = document.getElementById('hud-x');
  var hudY = document.getElementById('hud-y');
  var hudTitle = document.getElementById('hud-title');
  var hudCount = document.getElementById('hud-count');
  var hint = document.getElementById('scroll-hint');
  var minimap = document.getElementById('minimap');
  var miniTicks = document.getElementById('minimap-ticks');
  var miniView = document.getElementById('minimap-view');
  var miniTip = document.getElementById('minimap-tip');

  var big = window.matchMedia('(min-width: 1024px) and (min-height: 600px) and (pointer: fine)');
  var calm = window.matchMedia('(prefers-reduced-motion: reduce)');

  var SWING = 58;        // degrees a sheet is turned away when it is far out at the side
  var DEPTH = 420;       // px it moves back at the same time
  var GRID = 96;         // floor grid size in px (6rem) – the floor only ever moves by one cell

  var frames = [].slice.call(track.querySelectorAll('.js-frame')).map(function (el) {
    var group = el.closest('.group');
    return {
      el: el,
      body: el.querySelector('.frame-body'),
      flow: el.classList.contains('frame--flow'),
      marker: el.getAttribute('data-kind') === 'marker',
      title: el.getAttribute('data-title') || '',
      groupId: group ? group.id : '',
      left: 0, width: 0, top: 0, near: false, p: 0
    };
  });

  var canvas = false;       // is the 3D room active?
  var printing = false;
  var vw = 0, vh = 0, trackW = 0, maxX = 0;
  var x = 0, tx = 0;        // current / target travel through the room (px)
  var cam = { x: 0, y: 0, tx: 0, ty: 0, k: 1, tk: 1 };
  var active = -1;
  var raf = 0;
  var introT0 = 0;
  var idleTimer = 0;
  var ticks = [];
  var segs = [];            // pieces of the copper wire, one per gap between two sheets

  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }
  function ease(p) { return p * p * (3 - 2 * p); }
  function easeOut(p) { return 1 - Math.pow(1 - p, 4); }
  function pad(n, len) { var s = String(Math.max(0, Math.round(n))); while (s.length < len) s = '0' + s; return s; }
  function request() { if (!raf) raf = window.requestAnimationFrame(render); }

  /* ───────────── measuring ───────────── */

  function measureCanvas() {
    vw = window.innerWidth;
    vh = window.innerHeight;

    // neutral state for measuring: no camera, no travel, sheets one column wide
    world.style.transform = 'none';
    track.style.transform = 'none';
    frames.forEach(function (f) {
      f.el.style.transform = '';
      f.el.style.transformOrigin = '';
      if (f.flow) f.el.style.width = '';
    });

    // newspaper columns: add columns until the sheet is no taller than --H; the browser balances them
    var probe = document.getElementById('probe');
    var ps = probe ? window.getComputedStyle(probe) : null;
    var colw = ps ? parseFloat(ps.width) : 360;
    var colgap = ps ? parseFloat(ps.marginLeft) : 40;
    var padX = ps ? parseFloat(ps.paddingLeft) * 2 : 56;
    var maxH = ps ? parseFloat(ps.height) : vh * 0.66;
    frames.forEach(function (f) {
      if (!f.flow || !f.body) return;
      for (var n = 1; n <= 6; n++) {
        f.body.style.columnCount = n;
        f.el.style.width = Math.ceil(n * colw + (n - 1) * colgap + padX) + 'px';
        if (f.el.scrollHeight <= maxH + 1 && f.body.scrollWidth <= f.body.clientWidth + 1) break;
      }
    });

    var origin = track.getBoundingClientRect().left;
    frames.forEach(function (f) {
      var r = f.el.getBoundingClientRect();
      f.left = r.left - origin;
      f.width = r.width;
    });
    trackW = track.offsetWidth;
    maxX = Math.max(0, trackW - vw);
    space.style.height = (maxX + vh) + 'px';
    buildMinimap();
    buildWire();
  }

  function buildWire() {
    if (!wire) return;
    wire.innerHTML = '';
    segs = [];
    for (var i = 0; i < frames.length - 1; i++) {
      var a = frames[i], b = frames[i + 1];
      var s = document.createElement('span');
      s.className = 'wire-seg';
      s.style.left = (a.left + a.width) + 'px';
      s.style.width = Math.max(0, b.left - a.left - a.width) + 'px';
      wire.appendChild(s);
      segs.push({ el: s, a: a, b: b, o: -1 });
    }
  }

  function measureDoc() {
    vh = window.innerHeight;
    frames.forEach(function (f) { f.el.style.removeProperty('--tilt'); });
    var sy = window.scrollY || window.pageYOffset || 0;
    frames.forEach(function (f) { f.top = f.el.getBoundingClientRect().top + sy; });
  }

  /* ───────────── minimap ───────────── */

  function buildMinimap() {
    if (!miniTicks) return;
    miniTicks.innerHTML = '';
    ticks = frames.map(function (f) {
      var t = document.createElement('span');
      t.className = 'minimap-tick' + (f.marker ? ' is-marker' : '');
      t.style.left = ((f.left + f.width / 2) / trackW * 100) + '%';
      miniTicks.appendChild(t);
      return t;
    });
  }

  function minimapRatio(e) {
    var r = minimap.getBoundingClientRect();
    return clamp((e.clientX - r.left) / r.width, 0, 1);
  }

  function nearestFrame(ratio) {
    var best = 0, bestD = Infinity;
    frames.forEach(function (f, i) {
      var d = Math.abs((f.left + f.width / 2) / trackW - ratio);
      if (d < bestD) { bestD = d; best = i; }
    });
    return best;
  }

  if (minimap) {
    var scrubbing = false;
    var scrubTo = function (e) { travelTo(minimapRatio(e) * trackW - vw / 2, false); };
    minimap.addEventListener('pointerdown', function (e) {
      if (!canvas) return;
      scrubbing = true;
      try { minimap.setPointerCapture(e.pointerId); } catch (err) {}
      scrubTo(e);
    });
    minimap.addEventListener('pointermove', function (e) {
      if (!canvas) return;
      if (scrubbing) scrubTo(e);
      var ratio = minimapRatio(e);
      var i = nearestFrame(ratio);
      if (miniTip) {
        miniTip.textContent = frames[i].title;
        miniTip.style.left = ((frames[i].left + frames[i].width / 2) / trackW * 100) + '%';
      }
    });
    var stop = function () { scrubbing = false; };
    minimap.addEventListener('pointerup', stop);
    minimap.addEventListener('pointercancel', stop);
  }

  /* ───────────── travelling ───────────── */

  function spaceTop() { return space.getBoundingClientRect().top + (window.scrollY || window.pageYOffset || 0); }

  function travelTo(px, smooth) {
    var top = spaceTop() + clamp(px, 0, maxX);
    try { window.scrollTo({ top: top, behavior: smooth ? 'smooth' : 'auto' }); } catch (e) { window.scrollTo(0, top); }
  }

  function frameOf(target) {
    if (!target) return -1;
    var el = target.classList && target.classList.contains('js-frame') ? target
      : ((target.closest && target.closest('.js-frame')) || (target.querySelector && target.querySelector('.js-frame')));
    for (var i = 0; i < frames.length; i++) if (frames[i].el === el) return i;
    return -1;
  }

  // where the room has to be so that sheet i is in a good reading position
  function restFor(i) {
    var f = frames[i];
    if (i <= 0) return 0;
    if (f.marker) return f.left - vw * 0.1;            // chapter number at the left, its sheets after it
    if (f.width > vw * 0.9) return f.left - vw * 0.05;  // very wide sheet: start at its left edge
    return f.left + f.width / 2 - vw / 2;
  }

  function goTo(target, smooth) {
    if (canvas) {
      var i = frameOf(target);
      if (i >= 0) travelTo(restFor(i), smooth);
      return;
    }
    if (target && target.scrollIntoView) {
      target.scrollIntoView({ behavior: smooth && !calm.matches ? 'smooth' : 'auto', block: 'start' });
    }
  }

  function setHash(id) {
    try {
      window.history.replaceState(null, '', '#' + id);
      window.dispatchEvent(new Event('hashchange'));
    } catch (e) {}
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a[href^="#"]') : null;
    if (!a) return;
    var id = a.getAttribute('href').slice(1);
    var target = id ? document.getElementById(id) : null;
    if (!target) return;
    e.preventDefault();
    goTo(target, true);
    setHash(id);
  });

  document.addEventListener('keydown', function (e) {
    if (!canvas || e.altKey || e.ctrlKey || e.metaKey) return;
    var tag = (e.target && e.target.tagName) || '';
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (e.target && e.target.isContentEditable)) return;
    var lb = document.getElementById('lightbox');
    if (lb && lb.classList.contains('active')) return;
    var next = -1;
    if (e.key === 'ArrowRight') next = Math.min(frames.length - 1, active + 1);
    else if (e.key === 'ArrowLeft') next = Math.max(0, active - 1);
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = frames.length - 1;
    if (next < 0) return;
    e.preventDefault();
    travelTo(restFor(next), true);
  });

  // keyboard focus must never land on a sheet that is out of sight
  document.addEventListener('focusin', function (e) {
    if (!canvas) return;
    var i = frameOf(e.target);
    if (i < 0) return;
    var f = frames[i];
    var l = f.left - tx;
    if (l < 0 || l + f.width > vw) travelTo(restFor(i), false);
  });

  // the sticky viewport itself must never scroll (focus and find-in-page try to)
  stage.addEventListener('scroll', function () {
    if (!canvas) return;
    var dx = stage.scrollLeft;
    stage.scrollLeft = 0;
    stage.scrollTop = 0;
    if (dx) window.scrollBy(0, dx);
  });

  /* ───────────── pointer: crosshair, read-out, camera ───────────── */

  function onPointer(e) {
    if (!canvas) return;
    var px = e.clientX, py = e.clientY;
    if (cursor) {
      var interactive = e.target.closest && e.target.closest('a, button, input, textarea, select, label, [role="button"], .minimap');
      cursor.style.transform = 'translate3d(' + px + 'px,' + py + 'px,0)';
      cursor.classList.toggle('is-on', !interactive);
    }
    if (hudX) hudX.textContent = 'X ' + pad(px + x, 5);
    if (hudY) hudY.textContent = 'Y ' + pad(py, 4);
    cam.tx = (px / vw) * 2 - 1;
    cam.ty = (py / vh) * 2 - 1;
    // calmer while the pointer rests on a sheet, so text is easy to read
    cam.tk = (e.target.closest && e.target.closest('.frame')) ? 0.35 : 1;
    if (window.COIL) window.COIL.pointer(cam.tx, cam.ty);
    window.clearTimeout(idleTimer);
    idleTimer = window.setTimeout(function () { cam.tx = 0; cam.ty = 0; request(); }, 1600);
    request();
  }
  window.addEventListener('pointermove', onPointer, { passive: true });
  document.addEventListener('mouseleave', function () {
    if (cursor) cursor.classList.remove('is-on');
    cam.tx = 0; cam.ty = 0;
    request();
  });

  /* ───────────── the frame loop ───────────── */

  function render(now) {
    raf = 0;
    if (!canvas) return;
    var again = false;

    // travel: ease towards the scroll position
    var dx = tx - x;
    if (Math.abs(dx) > 0.35) { x += dx * 0.13; again = true; } else { x = tx; dx = 0; }

    // camera
    cam.x += (cam.tx - cam.x) * 0.06;
    cam.y += (cam.ty - cam.y) * 0.06;
    cam.k += (cam.tk - cam.k) * 0.06;
    if (Math.abs(cam.tx - cam.x) > 0.002 || Math.abs(cam.ty - cam.y) > 0.002 || Math.abs(cam.tk - cam.k) > 0.01) again = true;
    else { cam.x = cam.tx; cam.y = cam.ty; }
    var lean = clamp(dx * 0.011, -7, 7);
    var ry = cam.x * 3.2 * cam.k + lean;
    var rx = -cam.y * 2.2 * cam.k;
    world.style.transform = (Math.abs(ry) < 0.01 && Math.abs(rx) < 0.01)
      ? 'none'
      : 'rotateX(' + rx.toFixed(3) + 'deg) rotateY(' + ry.toFixed(3) + 'deg)';

    var xr = again ? x : Math.round(x);
    track.style.transform = 'translate3d(' + (-xr) + 'px,0,0)';
    if (floor) floor.style.transform = 'translate3d(' + (-(xr % GRID)) + 'px,0,0) rotateX(90deg)';
    if (wire) wire.style.setProperty('--wire-x', Math.round(xr * 0.6) + 'px');
    if (window.COIL) window.COIL.spin(xr * 0.0022);

    // entrance: the sheets fly in from the depth of the room
    var intro = 1;
    if (introT0) {
      intro = clamp((now - introT0) / 1500, 0, 1);
      if (intro < 1) again = true; else introT0 = 0;
    }

    var startR = vw * 0.6, startL = vw * 0.4, span = vw * 0.6;
    var best = -1, bestD = Infinity, order = 0;
    for (var i = 0; i < frames.length; i++) {
      var f = frames[i];
      var l = f.left - xr, r = l + f.width;
      var d = Math.abs(l + f.width / 2 - vw / 2);
      if (!f.marker && d < bestD) { bestD = d; best = i; }

      if (r < -vw * 0.8 || l > vw * 1.8) {
        if (f.near) { f.near = false; f.el.style.transform = ''; f.el.style.willChange = 'auto'; }
        continue;
      }
      if (!f.near) { f.near = true; f.el.style.willChange = 'transform'; }

      var ang = 0, z = 0, originX = '50%';
      f.p = 0;
      if (l > startR) { var p = ease(Math.min(1, (l - startR) / span)); ang = -SWING * p; z = -DEPTH * p; originX = '0%'; f.p = p; }
      else if (r < startL) { var q = ease(Math.min(1, (startL - r) / span)); ang = SWING * q; z = -DEPTH * q; originX = '100%'; f.p = q; }
      if (intro < 1) f.p = 1;

      if (intro < 1) {
        var k = 1 - easeOut(clamp(intro * 1.9 - order * 0.12, 0, 1));
        z -= 2200 * k;
        ang -= 50 * k;
        order++;
      }

      f.el.style.transformOrigin = originX + ' 50%';
      f.el.style.transform = (ang || z)
        ? 'translate3d(0,0,' + z.toFixed(1) + 'px) rotateY(' + ang.toFixed(2) + 'deg)'
        : 'translateZ(0)';
    }

    // a piece of wire is only shown between two sheets that stand straight
    for (var s = 0; s < segs.length; s++) {
      var sg = segs[s];
      var o = (sg.a.near || sg.b.near) ? Math.max(0, 1 - 6 * Math.max(sg.a.p, sg.b.p)) : 0;
      if (o !== sg.o) { sg.o = o; sg.el.style.opacity = o.toFixed(2); }
    }

    if (best !== active) setActive(best);
    if (miniView && trackW) {
      miniView.style.left = (xr / trackW * 100) + '%';
      miniView.style.width = (vw / trackW * 100) + '%';
    }
    if (again) request();
  }

  function setActive(i) {
    if (active >= 0 && frames[active]) frames[active].el.classList.remove('is-active');
    if (active >= 0 && ticks[active]) ticks[active].classList.remove('is-active');
    active = i;
    if (i < 0) return;
    var f = frames[i];
    f.el.classList.add('is-active');
    if (ticks[i]) ticks[i].classList.add('is-active');
    if (hudTitle) hudTitle.textContent = f.title;
    if (hudCount) hudCount.textContent = pad(i + 1, 2) + ' / ' + pad(frames.length, 2);
    markNav(f.groupId);
  }

  function markNav(groupId) {
    navLinks.forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === '#' + groupId); });
  }

  /* ───────────── document mode: nav, active chapter, tilt ───────────── */

  var docTick = 0;
  function renderDoc() {
    docTick = 0;
    if (canvas) return;
    var sy = window.scrollY || window.pageYOffset || 0;
    var tilt = root.classList.contains('tilt-on');
    var current = '';
    for (var i = 0; i < frames.length; i++) {
      var f = frames[i];
      var top = f.top - sy;
      if (top < vh * 0.45) current = f.groupId;
      if (!tilt) continue;
      if (top > vh * 1.3 || top < -vh) { if (f.near) { f.near = false; f.el.style.removeProperty('--tilt'); } continue; }
      f.near = true;
      f.el.style.setProperty('--tilt', clamp((top - vh * 0.66) / (vh * 0.34), 0, 1).toFixed(3));
    }
    markNav(current);
  }

  if (nav && hero && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { nav.classList.toggle('is-shown', !en.isIntersecting); });
    }, { threshold: 0 }).observe(hero);
  } else if (nav) {
    nav.classList.add('is-shown');
  }

  /* ───────────── scrolling ───────────── */

  var hinted = false;
  window.addEventListener('scroll', function () {
    if (canvas) {
      tx = clamp((window.scrollY || window.pageYOffset || 0) - spaceTop(), 0, maxX);
      if (!hinted && tx > 60 && hint) { hinted = true; hint.classList.add('is-hidden'); }
      request();
    } else if (!docTick) {
      docTick = window.requestAnimationFrame(renderDoc);
    }
  }, { passive: true });

  /* ───────────── switching between room and document ───────────── */

  function enable() {
    canvas = true;
    root.classList.add('canvas-on');
    root.classList.remove('tilt-on');
    frames.forEach(function (f) { f.el.style.removeProperty('--tilt'); f.near = false; });
    measureCanvas();
    tx = clamp((window.scrollY || 0) - spaceTop(), 0, maxX);
    x = tx;
    active = -1;
    request();
  }

  function disable() {
    canvas = false;
    root.classList.remove('canvas-on');
    space.style.height = '';
    world.style.transform = '';
    track.style.transform = '';
    if (floor) floor.style.transform = '';
    frames.forEach(function (f) {
      f.el.style.transform = '';
      f.el.style.transformOrigin = '';
      f.el.style.width = '';
      f.el.style.willChange = '';
      if (f.body) f.body.style.columnCount = '';
      f.el.classList.remove('is-active');
      f.near = false;
    });
    active = -1;
    if (!calm.matches && !printing) root.classList.add('tilt-on'); else root.classList.remove('tilt-on');
    measureDoc();
    renderDoc();
  }

  function apply(keepPlace) {
    var want = big.matches && !calm.matches && !printing;
    var here = keepPlace && active >= 0 ? frames[active].el : null;
    if (want) enable(); else disable();
    if (here) goTo(here, false);
  }

  var resizeTimer = 0;
  window.addEventListener('resize', function () {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(function () { apply(true); }, 140);
  });
  if (big.addEventListener) {
    big.addEventListener('change', function () { apply(true); });
    calm.addEventListener('change', function () { apply(true); });
  }

  window.addEventListener('beforeprint', function () { printing = true; apply(false); });
  window.addEventListener('afterprint', function () { printing = false; apply(false); });

  window.SPACE = {
    print: function () { window.print(); },
    goTo: goTo,
    remeasure: function () { apply(true); }
  };

  /* ───────────── start ───────────── */

  function start() {
    apply(false);
    if (canvas && !window.location.hash) introT0 = window.performance.now();
    if (window.location.hash) {
      var target = document.getElementById(window.location.hash.slice(1));
      if (target) { goTo(target, false); if (canvas) { x = tx = clamp((window.scrollY || 0) - spaceTop(), 0, maxX); } }
    }
    request();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
  // fonts and photos change how much room the text needs
  window.addEventListener('load', function () { apply(true); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { apply(true); });
})();
