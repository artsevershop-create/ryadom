/* Первый экран: живой зал. Плоская схема управляет камерой 3D-сцены: нажали на кресло, камера садится в него.
   Сцена рисуется на canvas 2D собственной перспективной проекцией (без библиотек): стены, сцена с экраном, свет, 15 рядов кресел.
   Движение: один раз при загрузке (ряды появляются, камера садится в кресло), дальше только в ответ на действия. */
(function () {
  var cv = document.getElementById('hall'), plan = document.getElementById('plan');
  if (!cv || !cv.getContext || !plan) return;
  var ctx = cv.getContext('2d'), pctx = plan.getContext('2d');
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ROWS = 15, COLS = 22, FIRST = 2;                       // ряды 2–16, как в демо филармонии
  var CAT = [
    { n: 'Партер', c: [240, 185, 74], p: '4 000 ₽' },
    { n: 'Партер', c: [226, 84, 104], p: '3 600 ₽' },
    { n: 'Амфитеатр', c: [150, 110, 240], p: '3 000 ₽' }
  ];
  var catOf = function (i) { var r = i + FIRST; return r <= 5 ? 0 : r <= 9 ? 1 : 2; };
  var taken = function (i, j) { return ((i * 37 + j * 53 + i * j * 7) % 11) < 3; };
  /* положение кресла в зале: x вправо, y вверх, z от сцены к задней стене */
  function seatPos(i, j) {
    var x = (j - (COLS - 1) / 2) * 0.62; x += j >= COLS / 2 ? 0.55 : -0.55;
    var y = i < 8 ? 0.13 * i : 1.5 + (i - 8) * 0.42;
    var z = 2.4 + i * 1.05 + (i >= 8 ? 0.9 : 0) - x * x * 0.012;
    return [x, y, z];
  }

  /* ---------- камера ---------- */
  var OV_P = [0, 10.5, 25], OV_T = [0, 1.2, 3];
  var P = OV_P.slice(), T = OV_T.slice(), gP = OV_P.slice(), gT = OV_T.slice();
  var look = [0, 0], gLook = [0, 0], speed = 2.4;
  var R = [1, 0, 0], U = [0, 1, 0], Fw = [0, 0, -1], W = 0, H = 0, F = 1, cx = 0, cy = 0, dpr = 1;
  var sel = null, shown = reduce ? ROWS : 0, running = false, last = 0;
  function basis() {
    var f = [T[0] - P[0], T[1] - P[1], T[2] - P[2]], l = Math.hypot(f[0], f[1], f[2]) || 1;
    f = [f[0] / l, f[1] / l, f[2] / l];
    var r = [-f[2], 0, f[0]], rl = Math.hypot(r[0], r[2]) || 1; r = [r[0] / rl, 0, r[2] / rl];          // f × up
    var u = [r[1] * f[2] - r[2] * f[1], r[2] * f[0] - r[0] * f[2], r[0] * f[1] - r[1] * f[0]];
    /* «осмотреться»: поворот взгляда за указателем */
    var yaw = look[0], pit = look[1];
    f = [f[0] + r[0] * yaw + u[0] * pit, f[1] + r[1] * yaw + u[1] * pit, f[2] + r[2] * yaw + u[2] * pit];
    l = Math.hypot(f[0], f[1], f[2]); f = [f[0] / l, f[1] / l, f[2] / l];
    r = [-f[2], 0, f[0]]; rl = Math.hypot(r[0], r[2]) || 1; r = [r[0] / rl, 0, r[2] / rl];
    u = [r[1] * f[2] - r[2] * f[1], r[2] * f[0] - r[0] * f[2], r[0] * f[1] - r[1] * f[0]];
    R = r; U = u; Fw = f;
  }
  function cam(p) {
    var dx = p[0] - P[0], dy = p[1] - P[1], dz = p[2] - P[2];
    return [dx * R[0] + dy * R[1] + dz * R[2], dx * U[0] + dy * U[1] + dz * U[2], dx * Fw[0] + dy * Fw[1] + dz * Fw[2]];
  }
  var NEAR = 0.25;
  /* многоугольник в мире → экран, с отсечением по ближней плоскости; возвращает точки экрана или null */
  function poly(pts, fill) {
    var c = [], i, n = pts.length, out = [];
    for (i = 0; i < n; i++) c.push(cam(pts[i]));
    for (i = 0; i < n; i++) {
      var a = c[i], b = c[(i + 1) % n], ain = a[2] >= NEAR, bin = b[2] >= NEAR;
      if (ain) out.push(a);
      if (ain !== bin) { var t = (NEAR - a[2]) / (b[2] - a[2]); out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, NEAR]); }
    }
    if (out.length < 3) return null;
    var s = [];
    ctx.beginPath();
    for (i = 0; i < out.length; i++) {
      var x = cx + out[i][0] / out[i][2] * F, y = cy - out[i][1] / out[i][2] * F; s.push([x, y]);
      if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y);
    }
    ctx.closePath();
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    return s;
  }
  var rgb = function (c, b) { return 'rgb(' + (c[0] * b | 0) + ',' + (c[1] * b | 0) + ',' + (c[2] * b | 0) + ')'; };

  function draw() {
    basis();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = '#0E0D13'; ctx.fillRect(0, 0, W, H);
    var i, j, s;
    /* стены, пол, сцена */
    poly([[-11.5, 0, -6.5], [11.5, 0, -6.5], [11.5, 9, -6.5], [-11.5, 9, -6.5]], '#15121B');
    poly([[-11.5, 0, -6.5], [-11.5, 0, 22], [-11.5, 9, 22], [-11.5, 9, -6.5]], '#4A2817');
    poly([[11.5, 0, -6.5], [11.5, 0, 22], [11.5, 9, 22], [11.5, 9, -6.5]], '#5A301B');
    for (i = 0; i < 9; i++) {                                   // деревянные рейки на стенах
      var zz = -5 + i * 3;
      poly([[-11.45, 0, zz], [-11.45, 0, zz + 0.5], [-11.45, 9, zz + 0.5], [-11.45, 9, zz]], '#3A1F12');
      poly([[11.45, 0, zz], [11.45, 0, zz + 0.5], [11.45, 9, zz + 0.5], [11.45, 9, zz]], '#472515');
    }
    poly([[-11.5, 0, -6.5], [11.5, 0, -6.5], [11.5, 0, 22], [-11.5, 0, 22]], '#1A1720');
    /* экран с названием события */
    s = poly([[-6.6, 1.9, -6.4], [6.6, 1.9, -6.4], [6.6, 6.6, -6.4], [-6.6, 6.6, -6.4]], null);
    if (s) {
      var x0 = Math.min(s[0][0], s[3][0]), x1 = Math.max(s[1][0], s[2][0]), y0 = Math.min(s[2][1], s[3][1]), y1 = Math.max(s[0][1], s[1][1]);
      var g = ctx.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, '#2A1C3A'); g.addColorStop(0.55, '#5B2A3F'); g.addColorStop(1, '#B9742A');
      ctx.fillStyle = g; ctx.fill();
      if (s.length === 4) {
        var hh = y1 - y0, mx = (x0 + x1) / 2;
        ctx.save(); ctx.clip();
        ctx.fillStyle = 'rgba(255,240,205,.92)'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.font = '600 ' + Math.max(6, hh * 0.15) + 'px Unbounded, Onest, sans-serif';
        ctx.fillText('Эстрадный концерт', mx, y0 + hh * 0.4);
        ctx.font = '500 ' + Math.max(5, hh * 0.075) + 'px Onest, sans-serif'; ctx.fillStyle = 'rgba(255,240,205,.7)';
        ctx.fillText('12 ноября, 19:00', mx, y0 + hh * 0.6);
        ctx.restore();
      }
    }
    poly([[-9.5, 1, -6.5], [9.5, 1, -6.5], [9.5, 1, 0], [-9.5, 1, 0]], '#2B2420');
    poly([[-9.5, 0, 0], [9.5, 0, 0], [9.5, 1, 0], [-9.5, 1, 0]], '#3D2718');
    /* свет: три луча */
    ctx.globalCompositeOperation = 'lighter';
    [[-5, 'rgba(240,185,74,'], [0, 'rgba(255,214,150,'], [5, 'rgba(226,84,104,']].forEach(function (L) {
      var q = poly([[L[0] * 0.5, 8.6, -1], [L[0] - 1.7, 1.02, -3.2], [L[0] + 1.7, 1.02, -3.2]], null);
      if (q) { var gy = ctx.createLinearGradient(0, q[0][1], 0, Math.max(q[1][1], q[q.length - 1][1])); gy.addColorStop(0, L[1] + '.34)'); gy.addColorStop(1, L[1] + '.04)'); ctx.fillStyle = gy; ctx.fill(); }
    });
    ctx.globalCompositeOperation = 'source-over';
    /* ряды: от сцены к задней стене; камера всегда позади, так что дальние рисуются первыми */
    var pin = null, n = Math.min(ROWS, Math.ceil(shown));
    for (i = 0; i < n; i++) {
      var a = seatPos(i, 0), fade = Math.min(1, shown - i);
      var ry = a[1], rz = 2.4 + i * 1.05 + (i >= 8 ? 0.9 : 0);
      poly([[-8.6, ry, rz - 0.75], [8.6, ry, rz - 0.75], [8.6, ry, rz + 0.5], [-8.6, ry, rz + 0.5]], '#211D28');
      if (i === 8) poly([[-8.6, 0.95, rz - 0.78], [8.6, 0.95, rz - 0.78], [8.6, ry, rz - 0.78], [-8.6, ry, rz - 0.78]], '#2C2733');
      var order = [];
      for (j = 0; j < COLS; j++) order.push(j);
      order.sort(function (p, q) { return Math.abs(seatPos(i, q)[0] - P[0]) - Math.abs(seatPos(i, p)[0] - P[0]); });
      ctx.globalAlpha = fade;
      for (var k = 0; k < COLS; k++) {
        j = order[k];
        var p = seatPos(i, j), d = cam([p[0], p[1] + 0.6, p[2]]);
        if (d[2] < 0.55) continue;
        var isSel = sel && sel[0] === i && sel[1] === j;
        var col = isSel ? [255, 244, 214] : taken(i, j) ? [92, 88, 104] : CAT[catOf(i)].c;
        var b = Math.max(0.42, Math.min(1.05, 1.12 - d[2] * 0.022));
        var w = 0.26, x = p[0], y = p[1], z = p[2] + fade * 0 - (1 - fade) * 0;
        poly([[x - w, y + 0.45, z - 0.3], [x + w, y + 0.45, z - 0.3], [x + w, y + 0.45, z + 0.2], [x - w, y + 0.45, z + 0.2]], rgb(col, b));
        poly([[x - w, y + 0.4, z + 0.24], [x + w, y + 0.4, z + 0.24], [x + w, y + 1.02, z + 0.24], [x - w, y + 1.02, z + 0.24]], rgb(col, b * 0.78));
        if (isSel) pin = [cx + d[0] / d[2] * F, cy - d[1] / d[2] * F, d[2]];
      }
      ctx.globalAlpha = 1;
    }
    /* отметка выбранного кресла, пока камера не в нём */
    if (pin && pin[2] > 3) {
      var rr = Math.max(7, 90 / pin[2]);
      ctx.globalCompositeOperation = 'lighter';
      var gl = ctx.createRadialGradient(pin[0], pin[1], 0, pin[0], pin[1], rr * 2.6); gl.addColorStop(0, 'rgba(240,185,74,.75)'); gl.addColorStop(1, 'rgba(240,185,74,0)');
      ctx.fillStyle = gl; ctx.beginPath(); ctx.arc(pin[0], pin[1], rr * 2.6, 0, 6.3); ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
    }
  }

  function frame(now) {
    var dt = Math.min(0.05, (now - last) / 1000); last = now;
    var k = 1 - Math.exp(-dt * speed), m = 0, i;
    for (i = 0; i < 3; i++) { m += Math.abs(gP[i] - P[i]) + Math.abs(gT[i] - T[i]); P[i] += (gP[i] - P[i]) * k; T[i] += (gT[i] - T[i]) * k; }
    var kl = 1 - Math.exp(-dt * 6);
    for (i = 0; i < 2; i++) { m += Math.abs(gLook[i] - look[i]) * 4; look[i] += (gLook[i] - look[i]) * kl; }
    if (shown < ROWS) { shown = Math.min(ROWS, shown + dt * 13); m += 1; }
    draw();
    if (m > 0.004) requestAnimationFrame(frame); else running = false;
  }
  function kick() {
    if (reduce) { P = gP.slice(); T = gT.slice(); look = gLook.slice(); shown = ROWS; draw(); return; }
    if (!running) { running = true; last = performance.now(); requestAnimationFrame(frame); }
  }
  function size() {
    var r = cv.getBoundingClientRect(); if (!r.width) return;
    dpr = Math.min(2, window.devicePixelRatio || 1); W = r.width; H = r.height;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    var wide = W > 900;
    F = wide ? H * 0.82 : Math.max(H * 0.95, W * 0.8); cx = W * (wide ? 0.69 : 0.5); cy = H * (wide ? 0.4 : 0.46);
    drawPlan(); draw();
  }

  /* ---------- плоская схема-пульт ---------- */
  var pc = { cell: 10, ox: 0, oy: 18 }, hover = null;
  function planXY(i, j) {
    return [pc.ox + (j + (j >= COLS / 2 ? 1.3 : 0)) * pc.cell, pc.oy + (i + (i >= 8 ? 0.8 : 0)) * pc.cell * 1.08];
  }
  function drawPlan() {
    var r = plan.getBoundingClientRect(); if (!r.width) return;
    var d = Math.min(2, window.devicePixelRatio || 1);
    pc.cell = r.width / (COLS + 1.3); pc.oy = 20;
    var h = pc.oy + (ROWS + 0.8) * pc.cell * 1.08 + 2;
    plan.style.height = h + 'px'; plan.width = Math.round(r.width * d); plan.height = Math.round(h * d);
    pctx.setTransform(d, 0, 0, d, 0, 0); pctx.clearRect(0, 0, r.width, h);
    pctx.fillStyle = '#2C2936'; rr(pctx, r.width * 0.2, 0, r.width * 0.6, 12, 4); pctx.fill();
    pctx.fillStyle = '#A6A1AE'; pctx.font = '600 9px Onest, sans-serif'; pctx.textAlign = 'center'; pctx.textBaseline = 'middle'; pctx.fillText('сцена', r.width / 2, 6.5);
    var s = pc.cell * 0.74;
    for (var i = 0; i < ROWS; i++) for (var j = 0; j < COLS; j++) {
      var q = planXY(i, j), on = sel && sel[0] === i && sel[1] === j, hv = hover && hover[0] === i && hover[1] === j;
      pctx.fillStyle = on ? '#FFF4D6' : taken(i, j) ? '#4A4656' : rgb(CAT[catOf(i)].c, hv ? 1.08 : 0.92);
      rr(pctx, q[0] + (pc.cell - s) / 2, q[1], s, s, s * 0.3); pctx.fill();
      if (on || hv) { pctx.strokeStyle = on ? '#F0B94A' : 'rgba(255,255,255,.7)'; pctx.lineWidth = on ? 2 : 1; rr(pctx, q[0] + (pc.cell - s) / 2 - 2.5, q[1] - 2.5, s + 5, s + 5, s * 0.45); pctx.stroke(); }
    }
  }
  function rr(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
  function hit(e) {
    var r = plan.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top, best = null, bd = 1e9;
    for (var i = 0; i < ROWS; i++) for (var j = 0; j < COLS; j++) {
      var q = planXY(i, j), d = Math.pow(q[0] + pc.cell / 2 - x, 2) + Math.pow(q[1] + pc.cell / 2 - y, 2);
      if (d < bd) { bd = d; best = [i, j]; }
    }
    return bd < pc.cell * pc.cell * 6 ? best : null;
  }

  /* ---------- выбор места ---------- */
  var tk = document.getElementById('hallTk'), tkSeat = document.getElementById('hallSeat'), tkPrice = document.getElementById('hallPrice'), tkNote = document.getElementById('hallNote');
  var chips = [].slice.call(document.querySelectorAll('[data-seat]')), auto = true, timers = [];
  function ticket() {
    if (!tk) return;
    tk.classList.add('swap');
    setTimeout(function () {
      if (!sel) { tkSeat.textContent = 'Весь зал, 15 рядов'; tkNote.textContent = 'Нажмите на кресло на схеме'; tkPrice.textContent = '3D'; }
      else {
        var c = CAT[catOf(sel[0])], busy = taken(sel[0], sel[1]);
        tkSeat.textContent = c.n + ', ряд ' + (sel[0] + FIRST) + ', место ' + (sel[1] + 1);
        tkNote.textContent = busy ? 'Место занято, вид оттуда такой же' : 'Эстрадный концерт, 12 ноября, 19:00';
        tkPrice.textContent = busy ? 'занято' : c.p;
      }
      tk.classList.remove('swap');
    }, reduce ? 0 : 180);
  }
  function select(i, j, fast) {
    sel = [i, j];
    var p = seatPos(i, j);
    gP = [p[0], p[1] + 1.22, p[2] - 0.12]; gT = [p[0] * 0.3, 3.1, -6]; speed = fast ? 7 : 2.4;
    chips.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-seat') === i + ',' + j ? 'true' : 'false'); });
    ticket(); drawPlan(); kick();
  }
  function overview() {
    sel = null; gP = OV_P.slice(); gT = OV_T.slice(); speed = 2.4;
    chips.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-seat') === 'all' ? 'true' : 'false'); });
    ticket(); drawPlan(); kick();
  }
  function user() { auto = false; timers.forEach(clearTimeout); timers = []; }
  chips.forEach(function (b) {
    b.addEventListener('click', function () {
      user(); var v = b.getAttribute('data-seat');
      if (v === 'all') overview(); else { v = v.split(','); select(+v[0], +v[1]); }
    });
  });
  var down = false;
  plan.addEventListener('pointerdown', function (e) { var h = hit(e); if (!h) return; user(); down = true; try { plan.setPointerCapture(e.pointerId); } catch (x) {} select(h[0], h[1]); });
  plan.addEventListener('pointermove', function (e) {
    var h = hit(e);
    if (down && h && !(sel && sel[0] === h[0] && sel[1] === h[1])) select(h[0], h[1], true);
    else if (!down && e.pointerType === 'mouse' && (h ? !hover || hover[0] !== h[0] || hover[1] !== h[1] : hover)) { hover = h; drawPlan(); }
  });
  ['pointerup', 'pointercancel'].forEach(function (n) { plan.addEventListener(n, function () { down = false; }); });
  plan.addEventListener('pointerleave', function () { if (hover) { hover = null; drawPlan(); } });
  /* осмотреться мышью */
  var stage = cv.parentNode;
  if (!reduce && matchMedia('(hover:hover)').matches) {
    stage.addEventListener('pointermove', function (e) {
      if (down) return; var r = cv.getBoundingClientRect();
      gLook = [((e.clientX - r.left) / r.width - 0.6) * 0.34, -((e.clientY - r.top) / r.height - 0.5) * 0.16]; kick();
    });
    stage.addEventListener('pointerleave', function () { gLook = [0, 0]; kick(); });
  }

  if ('ResizeObserver' in window) new ResizeObserver(size).observe(cv); else addEventListener('resize', size);
  size();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { draw(); drawPlan(); });
  /* вступление: ряды появляются, камера садится в кресло; затем короткая экскурсия по трём местам и стоп */
  if (reduce) { select(8, 13); }
  else {
    kick();
    var tour = [[8, 13], [2, 6], [13, 18], [8, 13]];
    tour.forEach(function (s, n) { timers.push(setTimeout(function () { if (auto && !document.hidden) select(s[0], s[1]); }, 1500 + n * 5200)); });
  }
})();
