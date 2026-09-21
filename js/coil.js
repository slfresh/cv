/*
 * Fig. 1 on the first sheet: a coil with an iron core and its magnetic field, drawn as a live
 * 3D line drawing (own projection on a 2D canvas – no library, no WebGL).
 * It turns slowly, follows the pointer and spins while the room is moving (js/space.js).
 * Decoration only: aria-hidden, paused when out of sight or in a hidden tab, a single still
 * frame when the visitor prefers reduced motion.
 */
(function () {
  'use strict';

  var cv = document.getElementById('coil');
  if (!cv || !cv.getContext) return;
  var ctx = cv.getContext('2d');
  var calm = window.matchMedia('(prefers-reduced-motion: reduce)');

  var COPPER = '#FF9255';
  var LINE = '#FFFFFF';
  var YELLOW = '#FFD60A';

  var W = 0, H = 0, dpr = 1;
  var visible = true, raf = 0;
  var ptr = { x: 0, y: 0, tx: 0, ty: 0 };
  var spin = 0, spinTarget = 0;

  /* ── geometry in object space: the coil axis is the X axis ── */
  var TURNS = 11, R = 0.52, LEN = 2.3, STEPS = 44;
  var helix = [];
  (function () {
    var n = TURNS * STEPS;
    for (var i = 0; i <= n; i++) {
      var a = (i / STEPS) * Math.PI * 2;
      helix.push([-LEN / 2 + LEN * (i / n), R * Math.cos(a), R * Math.sin(a)]);
    }
  })();
  // connection leads at both ends
  var leads = [
    [[-LEN / 2, R, 0], [-LEN / 2, -1.25, 0]],
    [[LEN / 2, R * Math.cos(TURNS * Math.PI * 2), R * Math.sin(TURNS * Math.PI * 2)], [LEN / 2, -1.25, 0]]
  ];
  // iron core: two end rings and eight long edges
  var CORE_R = 0.3, CORE_L = 3.0, core = [];
  (function () {
    var k, a, a2, s;
    for (s = -1; s <= 1; s += 2) {
      for (k = 0; k < 28; k++) {
        a = (k / 28) * Math.PI * 2; a2 = ((k + 1) / 28) * Math.PI * 2;
        core.push([[s * CORE_L / 2, CORE_R * Math.cos(a), CORE_R * Math.sin(a)], [s * CORE_L / 2, CORE_R * Math.cos(a2), CORE_R * Math.sin(a2)]]);
      }
    }
    for (k = 0; k < 8; k++) {
      a = (k / 8) * Math.PI * 2;
      core.push([[-CORE_L / 2, CORE_R * Math.cos(a), CORE_R * Math.sin(a)], [CORE_L / 2, CORE_R * Math.cos(a), CORE_R * Math.sin(a)]]);
    }
  })();
  // field lines: closed loops that run through the coil and return around it
  var loops = [];
  (function () {
    var sizes = [[1.95, 0.5], [2.55, 0.95], [3.2, 1.5]];
    for (var p = 0; p < 6; p++) {
      var phi = (p / 6) * Math.PI * 2;
      for (var s = 0; s < sizes.length; s++) {
        var A = sizes[s][0], B = sizes[s][1], pts = [];
        for (var i = 0; i <= 72; i++) {
          var t = (i / 72) * Math.PI * 2;
          var rho = 0.1 + B * (1 + Math.sin(t));
          pts.push([A * Math.cos(t), rho * Math.cos(phi), rho * Math.sin(phi)]);
        }
        loops.push(pts);
      }
    }
  })();

  /* ── projection ── */
  var cy = 1, sy = 0, cp = 1, sp = 0, scale = 1, ox = 0, oy = 0, CAM = 6.2;
  function project(v) {
    var x1 = v[0] * cy + v[2] * sy;
    var z1 = -v[0] * sy + v[2] * cy;
    var y2 = v[1] * cp - z1 * sp;
    var z2 = v[1] * sp + z1 * cp;
    var f = CAM / (CAM - z2);
    return [ox + x1 * f * scale, oy - y2 * f * scale, z2];
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = cv.clientWidth; H = cv.clientHeight;
    if (!W || !H) return;
    cv.width = Math.round(W * dpr);
    cv.height = Math.round(H * dpr);
  }

  function strokeSeg(a, b, color, width, alpha) {
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = color;
    ctx.lineWidth = width * dpr;
    ctx.beginPath();
    ctx.moveTo(a[0] * dpr, a[1] * dpr);
    ctx.lineTo(b[0] * dpr, b[1] * dpr);
    ctx.stroke();
  }

  function draw(time) {
    if (!W || !H) { resize(); if (!W || !H) return; }
    var t = time / 1000;
    ptr.x += (ptr.tx - ptr.x) * 0.06;
    ptr.y += (ptr.ty - ptr.y) * 0.06;
    spin += (spinTarget - spin) * 0.1;

    var yaw = 0.62 + (calm.matches ? 0 : t * 0.22) + ptr.x * 0.7 + spin;
    var pitch = -0.36 + ptr.y * 0.4;
    cy = Math.cos(yaw); sy = Math.sin(yaw); cp = Math.cos(pitch); sp = Math.sin(pitch);
    scale = Math.min(W * 0.17, H * 0.235);
    ox = W * (W > H * 1.5 ? 0.5 : 0.56); oy = H * 0.47;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, cv.width, cv.height);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // 1. field lines: moving dashes show the direction of the field
    ctx.setLineDash([2 * dpr, 9 * dpr]);
    ctx.lineDashOffset = -(calm.matches ? 0 : t * 26) * dpr;
    ctx.strokeStyle = LINE;
    ctx.lineWidth = 1.6 * dpr;
    for (var l = 0; l < loops.length; l++) {
      var pts = loops[l];
      ctx.beginPath();
      var zsum = 0;
      for (var i = 0; i < pts.length; i++) {
        var q = project(pts[i]);
        zsum += q[2];
        if (i === 0) ctx.moveTo(q[0] * dpr, q[1] * dpr); else ctx.lineTo(q[0] * dpr, q[1] * dpr);
      }
      ctx.globalAlpha = 0.22 + 0.3 * Math.max(0, Math.min(1, (zsum / pts.length + 1) / 2));
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // 2. solid parts, drawn from back to front so nearer wire covers farther wire.
    //    Segments are grouped into a few depth layers: one stroke per layer instead of one per segment.
    var LAYERS = 7, a, b, k, d;
    var hp = helix.map(project);
    var wireL = [], coreL = [];
    for (k = 0; k < LAYERS; k++) { wireL.push([]); coreL.push([]); }
    var layerOf = function (z) { return Math.max(0, Math.min(LAYERS - 1, Math.floor(((z + 1.2) / 2.4) * LAYERS))); };
    for (k = 0; k < hp.length - 1; k++) wireL[layerOf((hp[k][2] + hp[k + 1][2]) / 2)].push(k);
    for (k = 0; k < core.length; k++) { a = project(core[k][0]); b = project(core[k][1]); coreL[layerOf((a[2] + b[2]) / 2)].push(a, b); }
    for (d = 0; d < LAYERS; d++) {
      var depth = (d + 0.5) / LAYERS;                               // 0 = far, 1 = near
      var cl = coreL[d];
      if (cl.length) {
        ctx.globalAlpha = 0.3 + 0.45 * depth; ctx.strokeStyle = LINE; ctx.lineWidth = 1.2 * dpr;
        ctx.beginPath();
        for (k = 0; k < cl.length; k += 2) { ctx.moveTo(cl[k][0] * dpr, cl[k][1] * dpr); ctx.lineTo(cl[k + 1][0] * dpr, cl[k + 1][1] * dpr); }
        ctx.stroke();
      }
      var wl = wireL[d];
      if (wl.length) {
        ctx.globalAlpha = 0.4 + 0.6 * depth; ctx.strokeStyle = COPPER; ctx.lineWidth = (1.6 + 3.4 * depth) * dpr;
        ctx.beginPath();
        for (k = 0; k < wl.length; k++) {
          var i0 = wl[k];
          if (k === 0 || wl[k - 1] !== i0 - 1) ctx.moveTo(hp[i0][0] * dpr, hp[i0][1] * dpr);
          ctx.lineTo(hp[i0 + 1][0] * dpr, hp[i0 + 1][1] * dpr);
        }
        ctx.stroke();
      }
    }
    for (k = 0; k < leads.length; k++) strokeSeg(project(leads[k][0]), project(leads[k][1]), COPPER, 3, 0.95);

    // 3. a pulse of current running along the wire
    if (!calm.matches) {
      var idx = Math.floor(((t * 0.18) % 1) * (hp.length - 1));
      var ph = hp[idx];
      ctx.globalAlpha = 1;
      ctx.fillStyle = YELLOW;
      ctx.beginPath();
      ctx.arc(ph[0] * dpr, ph[1] * dpr, (3 + 3 * Math.max(0, Math.min(1, (ph[2] + 1) / 2))) * dpr, 0, Math.PI * 2);
      ctx.fill();
    }

    // 4. poles
    ctx.globalAlpha = 0.95;
    ctx.fillStyle = LINE;
    ctx.font = '700 ' + Math.round(13 * dpr) + "px 'JetBrains Mono', ui-monospace, monospace";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    var n = project([CORE_L / 2 + 0.32, 0, 0]), so = project([-CORE_L / 2 - 0.32, 0, 0]);
    ctx.fillText('N', n[0] * dpr, n[1] * dpr);
    ctx.fillText('S', so[0] * dpr, so[1] * dpr);
    ctx.globalAlpha = 1;
  }

  function loop(time) {
    raf = 0;
    draw(time);
    if (visible && !document.hidden && !calm.matches) raf = window.requestAnimationFrame(loop);
  }
  function wake() { if (!raf) raf = window.requestAnimationFrame(loop); }

  window.COIL = {
    pointer: function (nx, ny) { ptr.tx = nx; ptr.ty = ny; },
    spin: function (v) { spinTarget = v; if (calm.matches) wake(); }
  };

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      if (visible) wake();
    }, { threshold: 0 }).observe(cv);
  }
  if ('ResizeObserver' in window) new ResizeObserver(function () { resize(); wake(); }).observe(cv);
  window.addEventListener('resize', function () { resize(); wake(); });
  document.addEventListener('visibilitychange', function () { if (!document.hidden) wake(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(wake);

  resize();
  wake();
})();
