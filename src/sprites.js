  // ---------- Sprites (drawn procedurally, then textured and muted so they sit in the photo-like ground) ----------
  const mk = (w, h) => { const c = document.createElement("canvas"); c.width = w; c.height = h; return c; };
  const rgb = (r, g, b, a = 1) => `rgba(${r | 0},${g | 0},${b | 0},${a})`;
  const jitterC = (c, r, amt) => { const k = 1 + (r() - 0.5) * amt; return [c[0] * k, c[1] * k, c[2] * k]; };
  const lerpA = (c1, c2, t) => [mix(c1[0], c2[0], t), mix(c1[1], c2[1], t), mix(c1[2], c2[2], t)];
  function quadPt(p0, p1, p2, t) { const u = 1 - t; return [u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0], u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1]]; }
  // per-pixel grain plus a little desaturation toward the dusty ambient colour
  function texturize(c, r, grain = 22, desat = 0.18) {
    const g = c.getContext("2d"), im = g.getImageData(0, 0, c.width, c.height), d = im.data;
    for (let i = 0; i < d.length; i += 4) {
      if (!d[i + 3]) continue;
      const n = (r() - 0.5) * grain, l = d[i] * 0.3 + d[i + 1] * 0.59 + d[i + 2] * 0.11;
      d[i] = mix(d[i], l * 1.04, desat) + n; d[i + 1] = mix(d[i + 1], l * 0.98, desat) + n; d[i + 2] = mix(d[i + 2], l * 0.88, desat) + n * 0.8;
    }
    g.putImageData(im, 0, 0);
    return c;
  }
  // a cluster of tiny leaves, lit from the upper left
  function foliage(g, r, cx, cy, rx, ry, count, DARK, LIGHT, size = 1.2) {
    const pts = [];
    for (let k = 0; k < count; k++) {
      const a = r() * Math.PI * 2, d = Math.pow(r(), 0.6);
      pts.push({ x: cx + Math.cos(a) * d * rx, y: cy + Math.sin(a) * d * ry, u: Math.cos(a) * d, v: Math.sin(a) * d });
    }
    pts.sort((a, b) => a.v - b.v);
    for (const p of pts) {
      const k = Math.max(0, Math.min(1, 0.5 - p.u * 0.4 - p.v * 0.55 + (r() - 0.5) * 0.35));
      const c = jitterC(lerpA(DARK, LIGHT, k), r, 0.25);
      g.fillStyle = rgb(c[0], c[1], c[2], 0.85 + r() * 0.15);
      const s = size * (0.6 + r() * 0.9), ang = r() * Math.PI;
      g.save(); g.translate(p.x, p.y); g.rotate(ang); g.fillRect(-s, -s * 0.45, s * 2, s * 0.9); g.restore();
    }
  }
  function makePalm(r) {
    const w = 150, h = 190, c = mk(w, h), g = c.getContext("2d");
    const bx = 75, by = 184, lean = (r() - 0.5) * 40, top = by - (100 + r() * 40), tx = bx + lean;
    const ctl = [bx + lean * 0.15, (by + top) / 2];
    const n = 60;
    g.lineCap = "butt";
    for (let i = 0; i < n; i++) {
      const t0 = i / n, t1 = (i + 1) / n, p0 = quadPt([bx, by], ctl, [tx, top], t0), p1 = quadPt([bx, by], ctl, [tx, top], t1);
      const wd = 6.5 - 3 * t0 + (i < 4 ? 2 : 0);
      g.strokeStyle = rgb(88, 74, 58); g.lineWidth = wd; g.beginPath(); g.moveTo(p0[0], p0[1]); g.lineTo(p1[0], p1[1] - 0.5); g.stroke();
      g.strokeStyle = rgb(140, 122, 98, 0.8); g.lineWidth = wd * 0.35; g.beginPath(); g.moveTo(p0[0] - wd * 0.2, p0[1]); g.lineTo(p1[0] - wd * 0.2, p1[1] - 0.5); g.stroke();
      if (i % 3 === 0) { g.strokeStyle = rgb(66, 54, 42, 0.55); g.lineWidth = 0.8; g.beginPath(); g.moveTo(p0[0] - wd / 2, p0[1]); g.lineTo(p0[0] + wd / 2, p0[1] + 0.8); g.stroke(); }
    }
    // dry skirt of dead fronds
    for (let k = 0; k < 7; k++) {
      const a = (r() - 0.5) * 2.6, len = 18 + r() * 16, e = [tx + Math.sin(a) * len * 0.5, top + len], m = [tx + Math.sin(a) * len * 0.55, top + 4];
      for (let s = 0; s < 1; s += 0.06) {
        const p = quadPt([tx, top + 3], m, e, s);
        g.strokeStyle = rgb(122 + r() * 30, 100 + r() * 20, 72, 0.7); g.lineWidth = 0.7;
        g.beginPath(); g.moveTo(p[0], p[1]); g.lineTo(p[0] + (r() - 0.5) * 7, p[1] + 2 + r() * 3); g.stroke();
      }
    }
    for (let k = 0; k < 3; k++) { const dx = (r() - 0.5) * 12; for (let m = 0; m < 12; m++) { g.fillStyle = rgb(128 + r() * 30, 78 + r() * 20, 36, 0.9); g.fillRect(tx + dx + (r() - 0.5) * 6, top + 5 + r() * 7, 1.4, 1.4); } }
    const fronds = [], nf = 14 + Math.floor(r() * 5);
    for (let k = 0; k < nf; k++) {
      const ang = k / nf * Math.PI * 2 + r() * 0.4, dx = Math.cos(ang), dy = Math.sin(ang) * 0.5;
      fronds.push({ dx, dy, len: 34 + r() * 22, droop: 10 + r() * 22, rise: 8 + r() * 10 });
    }
    fronds.sort((a, b) => a.dy - b.dy);
    const DARK = [40, 50, 30], LIGHT = [138, 144, 92];
    for (const f of fronds) {
      const p0 = [tx, top], p2 = [tx + f.dx * f.len, top + f.dy * f.len + f.droop], p1 = [tx + f.dx * f.len * 0.55, top + f.dy * f.len * 0.55 - f.rise];
      const lightK = Math.max(0, Math.min(1, 0.45 - f.dx * 0.45 - f.dy * 0.5 + (r() - 0.5) * 0.25));
      for (let s = 0.06; s <= 1; s += 1 / 34) {
        const p = quadPt(p0, p1, p2, s), pn = quadPt(p0, p1, p2, Math.min(1, s + 0.02));
        let tgx = pn[0] - p[0], tgy = pn[1] - p[1]; const tm = Math.hypot(tgx, tgy) || 1; tgx /= tm; tgy /= tm;
        const L = 12 * (1 - s * 0.7) * (0.75 + r() * 0.5);
        for (const side of [-1, 1]) {
          if (r() < 0.12) continue; // gaps where leaflets have split
          const ex = p[0] - tgy * side * L * 0.75 - tgx * L * 0.35, ey = p[1] + tgx * side * L * 0.75 - tgy * L * 0.35 + L * 0.6;
          const c2 = jitterC(lerpA(DARK, LIGHT, Math.min(1, lightK + (side < 0 ? 0.1 : -0.05))), r, 0.3);
          g.strokeStyle = rgb(c2[0], c2[1], c2[2], 0.8); g.lineWidth = 0.75;
          g.beginPath(); g.moveTo(p[0], p[1]); g.quadraticCurveTo((p[0] + ex) / 2, (p[1] + ey) / 2 - 1.5, ex, ey); g.stroke();
        }
      }
      const rc = lerpA([70, 70, 46], [170, 164, 120], lightK);
      g.strokeStyle = rgb(rc[0], rc[1], rc[2], 0.9); g.lineWidth = 0.9;
      g.beginPath(); g.moveTo(p0[0], p0[1]); g.quadraticCurveTo(p1[0], p1[1], p2[0], p2[1]); g.stroke();
    }
    texturize(c, r);
    return { c, ax: bx, ay: by, height: (by - top) / PX, crown: 44 / TW, kind: "palm" };
  }
  function makeAcacia(r) {
    const w = 170, h = 120, c = mk(w, h), g = c.getContext("2d");
    const bx = 85, by = 114, lean = (r() - 0.5) * 16, cy = 40 + r() * 8, cx = bx + lean;
    g.lineCap = "round";
    const branch = (x0, y0, x1, y1, wd) => {
      const mx = (x0 + x1) / 2 + (r() - 0.5) * 10, my = (y0 + y1) / 2;
      g.strokeStyle = rgb(64, 54, 46); g.lineWidth = wd; g.beginPath(); g.moveTo(x0, y0); g.quadraticCurveTo(mx, my, x1, y1); g.stroke();
      g.strokeStyle = rgb(118, 104, 90, 0.6); g.lineWidth = wd * 0.35; g.beginPath(); g.moveTo(x0 - wd * 0.2, y0); g.quadraticCurveTo(mx - wd * 0.2, my, x1 - wd * 0.2, y1); g.stroke();
    };
    const fork = [bx + lean * 0.5, by - 30 - r() * 8];
    branch(bx, by, fork[0], fork[1], 4.5);
    const tips = [];
    for (let k = 0; k < 5; k++) { const tip = [cx + (k - 2) * 15 + (r() - 0.5) * 10, cy + 4 + r() * 5]; tips.push(tip); branch(fork[0], fork[1], tip[0], tip[1], 2.6 - k * 0.2); }
    for (const tp of tips) for (let m = 0; m < 3; m++) branch(tp[0], tp[1], tp[0] + (r() - 0.5) * 22, tp[1] - 2 - r() * 4, 1);
    // flat, layered, feathery canopy made of separate clumps
    const rx = 56 + r() * 14, ry = 12 + r() * 3;
    const DARK = [42, 48, 30], LIGHT = [130, 132, 88];
    const clumps = [];
    for (let k = 0; k < 14; k++) { const a = r() * Math.PI * 2, d = Math.sqrt(r()) * 0.85; clumps.push({ x: cx + Math.cos(a) * d * rx, y: cy + Math.sin(a) * d * ry - 2, v: Math.sin(a) * d }); }
    clumps.sort((a, b) => a.v - b.v);
    for (const cl of clumps) {
      foliage(g, r, cl.x, cl.y + 2.5, 16 + r() * 8, 4 + r() * 2, 260, DARK.map(x => x * 0.75), DARK, 1.1);
      foliage(g, r, cl.x - 1, cl.y, 15 + r() * 8, 3.5 + r() * 2, 260, DARK, LIGHT, 1.0);
    }
    texturize(c, r);
    return { c, ax: bx, ay: by, height: (by - cy) / PX, crown: rx / TW, kind: "acacia" };
  }
  function makeShrub(r, dry) {
    const w = 34, h = 26, c = mk(w, h), g = c.getContext("2d");
    for (let k = 0; k < 10; k++) { g.strokeStyle = rgb(96, 82, 66, 0.8); g.lineWidth = 0.6; g.beginPath(); g.moveTo(17, 22); g.lineTo(17 + (r() - 0.5) * 24, 9 + r() * 10); g.stroke(); }
    const D = dry ? [96, 84, 62] : [62, 68, 46], L = dry ? [176, 160, 122] : [146, 150, 110];
    foliage(g, r, 17, 16, 11, 6, dry ? 140 : 260, D, L, 0.9);
    texturize(c, r, 18, 0.12);
    return { c, ax: 17, ay: 22 };
  }
  function makeGrass(r, lush) {
    const w = 26, h = 20, c = mk(w, h), g = c.getContext("2d");
    const cols = lush ? [[104, 120, 64], [132, 142, 82], [84, 98, 52], [166, 164, 112]] : [[200, 184, 136], [176, 158, 112], [152, 140, 100], [214, 200, 160]];
    const n = 22 + Math.floor(r() * 14);
    for (let k = 0; k < n; k++) {
      const a = (r() - 0.5) * 2.0, len = 5 + r() * 9, x0 = 13 + (r() - 0.5) * 4, y0 = 18;
      const x1 = x0 + Math.sin(a) * len, y1 = y0 - Math.cos(a) * len * 0.85;
      const cc = jitterC(cols[Math.floor(r() * cols.length)], r, 0.2);
      g.strokeStyle = rgb(cc[0], cc[1], cc[2], 0.85); g.lineWidth = 0.6;
      g.beginPath(); g.moveTo(x0, y0); g.quadraticCurveTo(x0 + Math.sin(a) * len * 0.3, y0 - len * 0.7, x1, y1 + Math.abs(a) * 2); g.stroke();
    }
    return { c, ax: 13, ay: 18 };
  }
  function makeRock(r) {
    const w = 30, h = 22, c = mk(w, h), g = c.getContext("2d");
    const pts = [], n = 9, rx = 5 + r() * 6, ry = 3 + r() * 2.5, cx = 15, cy = 15;
    for (let k = 0; k < n; k++) { const a = k / n * Math.PI * 2; const s = 0.7 + r() * 0.4; pts.push([cx + Math.cos(a) * rx * s, cy + Math.min(0.5, Math.sin(a)) * ry * s - (Math.sin(a) < 0 ? ry * 0.5 : 0)]); }
    const base = 120 + r() * 30;
    const gr = g.createLinearGradient(cx - rx, cy - ry * 1.6, cx + rx * 0.6, cy + ry);
    gr.addColorStop(0, rgb(base + 44, base + 30, base + 14)); gr.addColorStop(0.6, rgb(base - 10, base - 22, base - 32)); gr.addColorStop(1, rgb(base - 56, base - 62, base - 66));
    g.fillStyle = gr; g.beginPath(); pts.forEach((p, i) => i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])); g.closePath(); g.fill();
    texturize(c, r, 34, 0.1);
    return { c, ax: cx, ay: cy + ry * 0.5 };
  }

